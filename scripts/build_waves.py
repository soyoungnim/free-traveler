#!/usr/bin/env python3
"""
build_waves.py — Traveler Task Pipeline wave scheduler.

Reads the audited Task Manifest and turns its Depends-On graph into a
dynamic Wave plan for /run-wave. This script never edits Task content —
it only reads existing Task metadata and writes scheduling artifacts.

Inputs:
  - TASKS/TASK_MANIFEST.csv          (written by scripts/audit_tasks.py)
  - TASKS/TASK-*.md                  (detail files; used only to confirm each
                                       Task ID in the manifest has a detail
                                       file — the manifest itself already
                                       carries every field this script needs)
  - design-reference/SCREEN_ROUTE_CONTRACT.json (Screen id cross-check)

Outputs:
  - TASKS/TASK_DAG.md                (dependency graph + cycle report)
  - TASKS/WAVE_PLAN.md               (Wave ID -> ordered Task IDs, human-readable)
  - TASKS/WAVE_STATE.json            (Wave ID -> execution state, machine-readable)
  - TASKS/TASK_MANIFEST.csv          (rewritten with an added `wave_id` column)

IMPORTANT ordering note: `scripts/audit_tasks.py` regenerates TASK_MANIFEST.csv
from scratch (without a wave_id column) every time it runs. Always run
build_waves.py AFTER audit_tasks.py, as the final step. If audit_tasks.py is
re-run afterwards, wave_id will be dropped and build_waves.py must be re-run.

Stdlib-only (Python 3.9+).

On success: prints cycle count (0), per-Wave Task counts, and each Page
Owner's Wave/position, then exits 0.
On failure (cycle found, a Task's dependency lands in a later Wave, an
unresolved same-Wave file conflict, or a Task ID missing from the group
map): prints the problem and exits 1 without writing WAVE_PLAN.md /
WAVE_STATE.json / the updated TASK_MANIFEST.csv. TASK_DAG.md is still
written in the cycle-found case so the cycle itself can be inspected.
"""

import csv
import json
import re
import sys
from datetime import datetime, timezone
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
TASKS_DIR = REPO_ROOT / "TASKS"
MANIFEST_PATH = TASKS_DIR / "TASK_MANIFEST.csv"
CONTRACT_PATH = REPO_ROOT / "design-reference/SCREEN_ROUTE_CONTRACT.json"

DAG_PATH = TASKS_DIR / "TASK_DAG.md"
WAVE_PLAN_PATH = TASKS_DIR / "WAVE_PLAN.md"
WAVE_STATE_PATH = TASKS_DIR / "WAVE_STATE.json"

MIN_WAVE_SIZE = 4
MAX_WAVE_SIZE = 7

EXPECTED_SCREEN_IDS = {"SCR-001", "SCR-002", "SCR-003", "SCR-004", "SCR-005"}

# ---------------------------------------------------------------------------
# Group map — one entry per Task ID in TASK_MANIFEST.csv. The group number is
# a *thematic hint* used only to break ties among simultaneously-ready Tasks
# during topological scheduling; real Depends-On edges always win, so a Task
# can end up scheduled later than its group number suggests if a dependency
# forces it (e.g. an Auth callback Task tagged group 2 that depends on the DB
# schema Task in group 3).

GROUPS = {
    1: "Scaffold, 문서, Harness 확인",
    2: "Airbnb 스타일 공통 UI, 정적 데이터, Layout",
    3: "Supabase Auth, 6개 Table, 기본 RLS(+API 데이터 접근 계층)",
    4: "SCR-001 메인 Component와 Page Owner",
    5: "SCR-002 대표 소개 Component와 Page Owner",
    6: "SCR-003 여행 입력·외부 이동·동행글 입력 Component와 Page Owner",
    7: "SCR-004 동행 목록·상세·신청 Component와 Page Owner",
    8: "SCR-005 계정·내 활동·간단 관리자 Component와 Page Owner",
    9: "Unit·Playwright·접근성·CI",
    10: "Vercel Preview와 Release 확인",
}

TASK_GROUP = {
    # 1. Scaffold
    "CMP-GLOBAL-DESIGN-TOKENS": 1,
    # 2. Airbnb 스타일 공통 UI, 정적 데이터, Layout
    "CMP-GLOBAL-HEADER-FOOTER": 2,
    "CMP-GLOBAL-A11Y": 2,
    "CMP-GLOBAL-NOT-FOUND": 2,
    "CMP-GLOBAL-ERROR-BOUNDARY": 2,
    "CMP-GLOBAL-ROOT-ERROR-BOUNDARY": 2,
    "CMP-GLOBAL-AUTH-CALLBACK": 2,
    "DATA-DESTINATIONS": 2,
    "DATA-SAFETY": 2,
    "DATA-REPRESENTATIVE": 2,
    # 3. Supabase Auth, 6 Table, RLS + API layer
    "DB-SCHEMA-BASE": 3,
    "DB-RLS-BASE": 3,
    "DB-ACCESS": 3,
    "DB-SEED-BASE": 3,
    "API-MATES-READ": 3,
    "API-MATES-WRITE": 3,
    "API-MATES-APPLICATIONS": 3,
    "API-MODERATION": 3,
    "API-ACCOUNT": 3,
    "API-ADMIN-SETTINGS": 3,
    # 4. SCR-001
    "CMP-SCR001-SEARCH-FILTER": 4,
    "CMP-SCR001-DESTINATION-CARD": 4,
    "CMP-SCR001-DEST-DRAWER": 4,
    "CMP-SCR001-SAFETY-DRAWER": 4,
    "CMP-SCR001-RECENT-MATES": 4,
    "CMP-SCR001-ABOUT-TEASER": 4,
    "PAGE-SCR001": 4,
    # 5. SCR-002
    "CMP-SCR002-HERO-STATS": 5,
    "CMP-SCR002-BIO": 5,
    "CMP-SCR002-TIMELINE": 5,
    "CMP-SCR002-COUNTRY-CHIPS": 5,
    "CMP-SCR002-GALLERY": 5,
    "CMP-SCR002-RECOMMENDED-DEST-CTA": 5,
    "PAGE-SCR002": 5,
    # 6. SCR-003
    "CMP-SCR003-TAB-SHELL": 6,
    "CMP-SCR003-FLIGHT-TAB": 6,
    "CMP-SCR003-HOTEL-TAB": 6,
    "CMP-SCR003-MATE-TAB": 6,
    "PAGE-SCR003": 6,
    # 7. SCR-004
    "CMP-SCR004-FILTER-LIST": 7,
    "CMP-SCR004-DETAIL-PANEL": 7,
    "CMP-SCR004-APPLICATION": 7,
    "CMP-SCR004-REPORT-BLOCK": 7,
    "PAGE-SCR004": 7,
    # 8. SCR-005
    "CMP-SCR005-AUTH": 8,
    "CMP-SCR005-PROFILE": 8,
    "CMP-SCR005-MY-ACTIVITY": 8,
    "CMP-SCR005-ADMIN": 8,
    "PAGE-SCR005": 8,
    # 9. Unit/Playwright/A11y/CI (+ SEO meta: touches Page Entry files, must
    #    follow every Page Owner, so it is scheduled with this group)
    "CMP-GLOBAL-SEO-META": 9,
    "UNIT-TRAVEL-DATES": 9,
    "UNIT-CONTACT-DETECTION": 9,
    "UNIT-MATE-STATE": 9,
    "TEST-RLS-BASIC": 9,
    "E2E-PUBLIC-SMOKE": 9,
    "E2E-TRAVEL-TOOLS": 9,
    "E2E-MATE-AUTH": 9,
    "MANUAL-A11Y-CHECK": 9,
    "MANUAL-PERF-CHECK": 9,
    "CI-BUILD-LINT-GATE": 9,
    "CI-CONTENT-VALIDATION": 9,
    "CI-SECURITY-BASELINE": 9,
    # 10. Release
    "RELEASE-CHECK-VERCEL-SUPABASE": 10,
}

FILE_PATH_RE = re.compile(r"`([^`]+)`")


def fail(msg):
    print(f"BUILD_WAVES_FAIL: {msg}")
    sys.exit(1)


def load_manifest():
    if not MANIFEST_PATH.exists():
        fail(f"{MANIFEST_PATH.relative_to(REPO_ROOT)} not found — run scripts/audit_tasks.py first")
    with MANIFEST_PATH.open(encoding="utf-8", newline="") as f:
        reader = csv.DictReader(f)
        fieldnames = reader.fieldnames
        rows = list(reader)
    if not rows:
        fail("TASK_MANIFEST.csv has no data rows")
    return rows, fieldnames


def load_contract():
    if not CONTRACT_PATH.exists():
        fail(f"{CONTRACT_PATH.relative_to(REPO_ROOT)} not found")
    try:
        return json.loads(CONTRACT_PATH.read_text(encoding="utf-8"))
    except json.JSONDecodeError as e:
        fail(f"{CONTRACT_PATH.relative_to(REPO_ROOT)} is not valid JSON: {e}")


def split_ids(cell):
    if not cell or cell.strip() in ("-", ""):
        return []
    return [c.strip().strip("`") for c in cell.split(",") if c.strip()]


def extract_files(cell):
    return FILE_PATH_RE.findall(cell or "")


def detect_cycles(graph):
    """DFS white/gray/black cycle detection. Returns list of cycles (as lists of Task IDs)."""
    WHITE, GRAY, BLACK = 0, 1, 2
    color = {tid: WHITE for tid in graph}
    cycles = []

    def dfs(node, path):
        color[node] = GRAY
        path.append(node)
        for dep in graph.get(node, []):
            if dep not in color:
                continue
            if color[dep] == GRAY:
                start = path.index(dep)
                cycles.append(path[start:] + [dep])
            elif color[dep] == WHITE:
                dfs(dep, path)
        path.pop()
        color[node] = BLACK

    for tid in list(graph):
        if color[tid] == WHITE:
            dfs(tid, [])
    return cycles


def topo_order_with_tiebreak(task_ids, deps_of, tiebreak_key):
    """Kahn's algorithm. tiebreak_key(task_id) -> sortable key used whenever
    more than one Task is simultaneously ready."""
    dependents = {tid: [] for tid in task_ids}
    indegree = {tid: 0 for tid in task_ids}
    for tid in task_ids:
        for dep in deps_of[tid]:
            dependents[dep].append(tid)
            indegree[tid] += 1

    ready = sorted([tid for tid in task_ids if indegree[tid] == 0], key=tiebreak_key)
    order = []
    while ready:
        ready.sort(key=tiebreak_key)
        cur = ready.pop(0)
        order.append(cur)
        for nxt in dependents[cur]:
            indegree[nxt] -= 1
            if indegree[nxt] == 0:
                ready.append(nxt)
    return order


def chunk_into_waves(global_order, group_of):
    """Contiguous chunking of a dependency-respecting order into Waves.
    Since chunks are contiguous ranges over an order where every dependency
    precedes its dependent, every Wave boundary automatically satisfies
    Rule 2 (a prerequisite Wave index is always <= its dependent's)."""
    waves = []
    current = []
    current_groups = set()

    for tid in global_order:
        g = group_of[tid]
        if not current:
            current.append(tid)
            current_groups.add(g)
            continue
        if len(current) >= MAX_WAVE_SIZE:
            waves.append(current)
            current = [tid]
            current_groups = {g}
            continue
        if g in current_groups or len(current) < MIN_WAVE_SIZE:
            current.append(tid)
            current_groups.add(g)
        else:
            waves.append(current)
            current = [tid]
            current_groups = {g}
    if current:
        waves.append(current)
    return waves


def intra_wave_order(wave_tasks, deps_of):
    """Documentation-only ordering used for WAVE_PLAN.md / Rule 6: a proper
    topological sort restricted to this Wave's own Tasks, ties broken by
    Task ID ascending — matches how /run-wave actually walks READY Tasks."""
    wave_set = set(wave_tasks)
    local_deps = {tid: [d for d in deps_of[tid] if d in wave_set] for tid in wave_tasks}
    return topo_order_with_tiebreak(wave_tasks, local_deps, tiebreak_key=lambda t: t)


def main():
    rows, fieldnames = load_manifest()
    contract = load_contract()
    contract_screens = {s["screen_id"] for s in contract.get("screens", [])}
    if contract_screens != EXPECTED_SCREEN_IDS:
        fail(f"SCREEN_ROUTE_CONTRACT.json screens {sorted(contract_screens)} != expected {sorted(EXPECTED_SCREEN_IDS)}")

    by_id = {r["Task ID"].strip(): r for r in rows}
    task_ids = list(by_id.keys())

    missing_group = [tid for tid in task_ids if tid not in TASK_GROUP]
    if missing_group:
        fail(
            "다음 Task ID가 build_waves.py의 GROUP MAP에 없음(스크립트의 TASK_GROUP 딕셔너리를 갱신해야 함): "
            + ", ".join(sorted(missing_group))
        )

    deps_of = {tid: split_ids(by_id[tid]["Depends On"]) for tid in task_ids}

    dangling = [
        (tid, dep) for tid in task_ids for dep in deps_of[tid] if dep not in by_id
    ]
    if dangling:
        fail(
            "Depends On이 TASK_MANIFEST.csv에 없는 Task ID를 참조함: "
            + ", ".join(f"{tid}->{dep}" for tid, dep in dangling)
        )

    graph = {tid: deps_of[tid] for tid in task_ids}
    cycles = detect_cycles(graph)

    if cycles:
        write_dag(task_ids, deps_of, cycles)
        print(f"순환 의존성 수: {len(cycles)}")
        for cyc in cycles:
            print("  - " + " → ".join(cyc))
        fail("순환 의존성이 존재해 Wave를 생성하지 않음(TASKS/TASK_DAG.md에 상세 기록)")

    global_order = topo_order_with_tiebreak(
        task_ids, deps_of, tiebreak_key=lambda t: (TASK_GROUP[t], t)
    )
    if len(global_order) != len(task_ids):
        fail("위상 정렬 결과 개수가 Task 총량과 다름(그래프에 도달 불가능한 순환이 남아있을 수 있음)")

    group_of = {tid: TASK_GROUP[tid] for tid in task_ids}
    waves = chunk_into_waves(global_order, group_of)

    wave_index_of = {}
    for i, wave in enumerate(waves):
        for tid in wave:
            wave_index_of[tid] = i

    # Rule 2 explicit re-verification: a dependency must never land in a
    # strictly later Wave than its dependent.
    order_violations = []
    for tid in task_ids:
        for dep in deps_of[tid]:
            if wave_index_of[dep] > wave_index_of[tid]:
                order_violations.append((dep, tid, wave_index_of[dep], wave_index_of[tid]))
    if order_violations:
        fail(
            "선행 Task가 뒤 Wave에 배치됨: "
            + "; ".join(f"{dep}(W{wi+1})→{tid}(W{wj+1})" for dep, tid, wi, wj in order_violations)
        )

    # Rule 5: same-file conflicts must not share a Wave unless one is an
    # ancestor of the other (in which case the dependency edge already
    # orders them safely within run-wave's actual READY-based execution).
    file_owners = {}
    for tid in task_ids:
        for f in extract_files(by_id[tid]["Expected Files"]):
            file_owners.setdefault(f, []).append(tid)

    def is_ancestor(a, b, memo={}):
        if a == b:
            return True
        key = (a, b)
        if key in memo:
            return memo[key]
        result = any(is_ancestor(a, d) for d in deps_of[b])
        memo[key] = result
        return result

    file_conflicts = []
    for f, owners in file_owners.items():
        if len(owners) < 2:
            continue
        for i in range(len(owners)):
            for j in range(i + 1, len(owners)):
                a, b = owners[i], owners[j]
                if wave_index_of[a] == wave_index_of[b] and not is_ancestor(a, b) and not is_ancestor(b, a):
                    file_conflicts.append((f, a, b, wave_index_of[a]))
    if file_conflicts:
        fail(
            "같은 파일을 수정하는 Task가 동일 Wave에 배치됨(수동으로 그룹 배정을 분리해야 함): "
            + "; ".join(f"'{f}': {a} vs {b} (W{wi+1})" for f, a, b, wi in file_conflicts)
        )

    # Rule 4 explicit re-verification: each Page Owner must be the last Task
    # (by intra-Wave topological order) of its own Wave among its own deps.
    page_owner_positions = []
    for tid in task_ids:
        if by_id[tid]["Category"] != "PAGE_OWNER":
            continue
        wave_idx = wave_index_of[tid]
        wave_tasks = waves[wave_idx]
        order = intra_wave_order(wave_tasks, deps_of)
        pos = order.index(tid)
        is_last_among_own_deps = all(
            order.index(d) < pos for d in deps_of[tid] if d in wave_tasks
        )
        page_owner_positions.append((tid, wave_idx, pos, len(order), is_last_among_own_deps))
        if not is_last_among_own_deps:
            fail(f"{tid}가 Wave W{wave_idx+1} 안에서 자신의 의존 Task보다 먼저 배치됨")

    generated_at = datetime.now(timezone.utc).isoformat(timespec="seconds")
    wave_ids = [f"W{idx+1:02d}" for idx in range(len(waves))]

    write_dag(task_ids, deps_of, cycles=[])
    write_wave_plan(wave_ids, waves, deps_of, group_of, by_id)
    write_wave_state(wave_ids, waves, by_id, generated_at)
    write_manifest_with_wave_id(rows, fieldnames, wave_ids, waves)

    print(f"순환 의존성 수: 0")
    print(f"Wave 수: {len(waves)}")
    for wid, wave in zip(wave_ids, waves):
        titles = sorted({GROUPS[group_of[t]] for t in wave})
        print(f"  {wid}: {len(wave)}개 Task — {' / '.join(titles)}")
    print("Page Owner 위치(Wave, 해당 Wave 내 순서):")
    for tid, wave_idx, pos, total, ok in page_owner_positions:
        print(f"  {tid}: {wave_ids[wave_idx]}의 {pos+1}/{total}번째(마지막 통합 위치 확인: {'OK' if ok else 'FAIL'})")
    print("BUILD_WAVES_PASS")


def write_dag(task_ids, deps_of, cycles):
    lines = [
        "# Traveler Task Pipeline — Dependency DAG",
        "",
        f"- **총 Task 수:** {len(task_ids)}",
        f"- **순환 의존성 수:** {len(cycles)}",
        "",
    ]
    if cycles:
        lines.append("## 발견된 순환 의존성")
        lines.append("")
        for cyc in cycles:
            lines.append("- " + " → ".join(cyc))
        lines.append("")
    lines.append("## Depends On 인접 목록")
    lines.append("")
    lines.append("| Task ID | Depends On |")
    lines.append("|---|---|")
    for tid in sorted(task_ids):
        deps = ", ".join(deps_of[tid]) if deps_of[tid] else "-"
        lines.append(f"| {tid} | {deps} |")
    DAG_PATH.write_text("\n".join(lines) + "\n", encoding="utf-8")


def write_wave_plan(wave_ids, waves, deps_of, group_of, by_id):
    lines = [
        "# Traveler Task Pipeline — Wave Plan",
        "",
        "- **생성:** `scripts/build_waves.py`(자동 생성 — 이 파일을 직접 손으로 편집하지 않는다. 재계산이 필요하면 스크립트를 다시 실행한다)",
        f"- **Wave 수:** {len(waves)}",
        "- **정본:** 이 파일과 `TASKS/WAVE_STATE.json`의 Wave ID가 이후 `/run-wave` 등 모든 단계의 정본이다.",
        "",
        "| Wave ID | Task 수 | 그룹 | Preview Checkpoint |",
        "|---|---|---|---|",
    ]
    for wid, wave in zip(wave_ids, waves):
        titles = " / ".join(sorted({GROUPS[group_of[t]] for t in wave}))
        checkpoint = "필요" if any(by_id[t]["Category"] == "PAGE_OWNER" for t in wave) else "-"
        lines.append(f"| {wid} | {len(wave)} | {titles} | {checkpoint} |")

    lines.append("")
    lines.append("## Wave 상세(Task ID 실행 순서)")
    lines.append("")
    lines.append(
        "각 Wave 안의 실행 순서는 그 Wave에 속한 Task만으로 계산한 위상 정렬 결과이며, "
        "동시에 준비된(선행 Task가 모두 끝난) Task가 여럿이면 Task ID 오름차순으로 정한다."
    )
    lines.append("")
    for wid, wave in zip(wave_ids, waves):
        order = intra_wave_order(wave, deps_of)
        titles = " / ".join(sorted({GROUPS[group_of[t]] for t in wave}))
        lines.append(f"### {wid} — {titles}")
        lines.append("")
        for i, tid in enumerate(order, start=1):
            deps = ", ".join(deps_of[tid]) if deps_of[tid] else "-"
            marker = " (Page Owner — 이 Wave의 마지막 통합 Task)" if by_id[tid]["Category"] == "PAGE_OWNER" else ""
            lines.append(f"{i}. `{tid}`{marker} — Depends On: {deps}")
        lines.append("")
    WAVE_PLAN_PATH.write_text("\n".join(lines) + "\n", encoding="utf-8")


def write_wave_state(wave_ids, waves, by_id, generated_at):
    state = {
        "schema_version": "traveler-wave-state-v1",
        "generated_at": generated_at,
        "waves": [],
    }
    for wid, wave in zip(wave_ids, waves):
        checkpoint_required = any(by_id[t]["Category"] == "PAGE_OWNER" for t in wave)
        state["waves"].append(
            {
                "wave_id": wid,
                "title": " / ".join(sorted({GROUPS[TASK_GROUP[t]] for t in wave})),
                "task_ids": wave,
                "status": "pending",
                "checkpoint_required": checkpoint_required,
                "checkpoint_result": None,
            }
        )
    WAVE_STATE_PATH.write_text(json.dumps(state, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def write_manifest_with_wave_id(rows, fieldnames, wave_ids, waves):
    wave_id_of = {}
    for wid, wave in zip(wave_ids, waves):
        for tid in wave:
            wave_id_of[tid] = wid

    out_fieldnames = list(fieldnames) + (["wave_id"] if "wave_id" not in fieldnames else [])
    with MANIFEST_PATH.open("w", encoding="utf-8", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=out_fieldnames)
        writer.writeheader()
        for r in rows:
            r = dict(r)
            r["wave_id"] = wave_id_of[r["Task ID"].strip()]
            writer.writerow(r)


if __name__ == "__main__":
    main()
