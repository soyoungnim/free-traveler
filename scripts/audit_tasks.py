#!/usr/bin/env python3
"""
audit_tasks.py — Traveler Task Pipeline final audit.

Runs the 18 numbered checks below against the on-disk Task pipeline
output and writes two report files:

  - TASKS/TASK_MANIFEST.csv   — one row per Task List entry (machine-readable)
  - TASKS/TASK_AUDIT_REPORT.md — one section per check, PASS/FAIL + findings

This script never edits TASKS/00_TASK_LIST.md or TASKS/TASK-*.md — it only
reads them and writes the two report files above.

Inputs:
  - TASKS/00_TASK_LIST.md
  - TASKS/TASK-*.md
  - docs/PROJECT_SCOPE.md
  - design-reference/SCREEN_ROUTE_CONTRACT.json

Stdlib-only (Python 3.9+).

On success: prints "AUDIT_PASS" and the number of checks that ran, exit 0.
On failure: prints the failing check numbers and findings, exit 1.
(TASK_MANIFEST.csv and TASK_AUDIT_REPORT.md are written either way.)
"""

import csv
import json
import re
import sys
from pathlib import Path

HARNESS_SCHEMA = "traveler-screen-route-v1"
REPO_ROOT = Path(__file__).resolve().parent.parent

TASKS_DIR = REPO_ROOT / "TASKS"
TASK_LIST_PATH = TASKS_DIR / "00_TASK_LIST.md"
PROJECT_SCOPE_PATH = REPO_ROOT / "docs/PROJECT_SCOPE.md"
CONTRACT_PATH = REPO_ROOT / "design-reference/SCREEN_ROUTE_CONTRACT.json"

MANIFEST_PATH = TASKS_DIR / "TASK_MANIFEST.csv"
REPORT_PATH = TASKS_DIR / "TASK_AUDIT_REPORT.md"

TOTAL_CHECKS = 18

EXPECTED_SCREEN_IDS = ["SCR-001", "SCR-002", "SCR-003", "SCR-004", "SCR-005"]

DB_TABLE_ALLOWLIST = {
    "user_profiles", "mate_posts", "mate_applications",
    "user_blocks", "reports", "app_settings",
}
MAX_DB_TABLES = 6

PROHIBITION_CONTEXT_RE = re.compile(r"금지|제외|EXCLUDED|추가하지 않는다|하지 않는다|사용하지 않는다", re.IGNORECASE)
PLACEHOLDER_RE = re.compile(r"lorem ipsum|준비\s*중|정보\s*확인\s*필요", re.IGNORECASE)

FORBIDDEN_KEYWORDS = [
    "auto-merge", "automerge", "auto merge runner", "자동 병합", "자동 머지",
    "merge runner", "unattended merge",
    "ec2", "aws", "amazon web services", "elastic compute cloud",
]

TASK_LIST_COLUMNS = [
    "Seq", "Task ID", "제목", "Category", "Implementation Status",
    "Requirement Ref", "Screen", "Route", "Page Entry", "Depends On",
    "Expected Files", "Functional AC", "Visual AC", "Security/Privacy AC",
    "Verify", "Priority",
]

REQUIRED_PAGE_OWNERS = {
    "SCR-001": "PAGE-SCR001", "SCR-002": "PAGE-SCR002", "SCR-003": "PAGE-SCR003",
    "SCR-004": "PAGE-SCR004", "SCR-005": "PAGE-SCR005",
}

REQUIRED_DB_TASKS = {
    "DB-SCHEMA-BASE": "schema",
    "DB-RLS-BASE": "rls",
    "DB-ACCESS": "access",
    "DB-SEED-BASE": "seed",
}


def canonical_requirement_ids():
    ids = [f"REQ-FUNC-{i:03d}" for i in range(1, 81)]
    ids += [f"REQ-NF-{i:03d}" for i in range(1, 35)]
    return set(ids)


def _has_actual_violation(text, pattern):
    for line in text.splitlines():
        if pattern.search(line) and not PROHIBITION_CONTEXT_RE.search(line):
            return True
    return False


def read(path: Path):
    return path.read_text(encoding="utf-8")


def detail_path(task_id):
    return TASKS_DIR / f"TASK-{task_id}.md"


def read_detail(task_id):
    p = detail_path(task_id)
    return read(p) if p.exists() else ""


class Check:
    def __init__(self, no, title):
        self.no = no
        self.title = title
        self.passed = True
        self.findings = []
        self.notes = []

    def fail(self, msg):
        self.passed = False
        self.findings.append(msg)

    def note(self, msg):
        self.notes.append(msg)


# ---------------------------------------------------------------------------
# Loading

def load_task_list():
    """Returns (rows, raw_text, load_errors)."""
    errors = []
    if not TASK_LIST_PATH.exists():
        return [], "", [f"{TASK_LIST_PATH.relative_to(REPO_ROOT)} not found"]

    text = read(TASK_LIST_PATH)
    if "## 2. Task List" not in text or "## 3." not in text:
        return [], text, ["TASKS/00_TASK_LIST.md is missing '## 2. Task List' / '## 3.' section markers"]

    sec2 = text.split("## 2. Task List", 1)[1].split("## 3.", 1)[0]
    data_lines = [l for l in sec2.splitlines() if re.match(r"^\|\s*\d+\s*\|", l.strip())]

    rows = []
    for line in data_lines:
        cells = [c.strip() for c in line.strip().strip("|").split("|")]
        if len(cells) != len(TASK_LIST_COLUMNS):
            errors.append(f"malformed row (expected {len(TASK_LIST_COLUMNS)} cols, got {len(cells)}): {line[:80]}...")
            continue
        rows.append(dict(zip(TASK_LIST_COLUMNS, cells)))
    return rows, text, errors


def load_contract():
    if not CONTRACT_PATH.exists():
        return None
    try:
        return json.loads(read(CONTRACT_PATH))
    except json.JSONDecodeError:
        return None


# ---------------------------------------------------------------------------
# Checks

def check_1_one_to_one(rows):
    c = Check(1, "Task List 구현 ID와 상세 Task 파일 1:1")
    listed_ids = {r["Task ID"] for r in rows}
    detail_files = {p.stem[len("TASK-"):] for p in TASKS_DIR.glob("TASK-*.md")}
    missing = listed_ids - detail_files
    orphan = detail_files - listed_ids
    for tid in sorted(missing):
        c.fail(f"'{tid}'에 해당하는 TASKS/TASK-{tid}.md 없음")
    for fid in sorted(orphan):
        c.fail(f"고아 파일 TASKS/TASK-{fid}.md — 00_TASK_LIST.md에 대응 행 없음")
    if c.passed:
        c.note(f"{len(listed_ids)}개 Task ↔ {len(detail_files)}개 상세 파일 1:1 확인")
    return c, detail_files


def check_2_no_duplicate_ids(rows):
    c = Check(2, "중복 Task ID 0")
    ids = [r["Task ID"] for r in rows]
    dupes = sorted({i for i in ids if ids.count(i) > 1})
    for d in dupes:
        c.fail(f"중복 Task ID: {d} ({ids.count(d)}회 등장)")
    if c.passed:
        c.note(f"{len(ids)}개 Task ID 전부 고유")
    return c


def check_3_depends_on_missing(rows):
    c = Check(3, "Depends On 누락(참조 대상 부재) 0")
    id_set = {r["Task ID"] for r in rows}
    for r in rows:
        dep = r["Depends On"]
        if dep in ("-", ""):
            continue
        for d in dep.split(","):
            d = d.strip().strip("`")
            if d and d not in id_set:
                c.fail(f"{r['Task ID']}: 존재하지 않는 Task ID '{d}'를 Depends On으로 참조")
    if c.passed:
        c.note("모든 Depends On 참조가 실제 Task List에 존재")
    return c


def check_4_no_dependency_cycle(rows):
    c = Check(4, "Dependency Cycle 0")
    graph = {}
    for r in rows:
        deps = [d.strip().strip("`") for d in r["Depends On"].split(",") if d.strip() and d.strip() != "-"]
        graph[r["Task ID"]] = deps

    WHITE, GRAY, BLACK = 0, 1, 2
    color = {tid: WHITE for tid in graph}
    cycles_found = []

    def dfs(node, path):
        color[node] = GRAY
        path.append(node)
        for dep in graph.get(node, []):
            if dep not in color:
                continue
            if color[dep] == GRAY:
                cyc_start = path.index(dep)
                cycles_found.append(path[cyc_start:] + [dep])
            elif color[dep] == WHITE:
                dfs(dep, path)
        path.pop()
        color[node] = BLACK

    for tid in list(graph):
        if color[tid] == WHITE:
            dfs(tid, [])

    for cyc in cycles_found:
        c.fail("의존성 순환: " + " → ".join(cyc))
    if c.passed:
        c.note(f"{len(graph)}개 Task의 의존성 그래프에서 순환 없음")
    return c


def check_5_page_owner_per_screen(rows):
    c = Check(5, "Screen 5개 모두 Page Owner 정확히 1개")
    owners = {}
    for r in rows:
        if r["Category"] != "PAGE_OWNER":
            continue
        screen = r["Screen"]
        owners.setdefault(screen, []).append(r["Task ID"])

    for screen, expected_id in REQUIRED_PAGE_OWNERS.items():
        tids = owners.get(screen, [])
        if len(tids) == 0:
            c.fail(f"{screen}: PAGE_OWNER Task 없음(기대: {expected_id})")
        elif len(tids) > 1:
            c.fail(f"{screen}: PAGE_OWNER Task가 {len(tids)}개 존재({tids}) — 정확히 1개여야 함")
        elif tids[0] != expected_id:
            c.fail(f"{screen}: PAGE_OWNER Task ID가 '{tids[0]}', 기대값 '{expected_id}'")

    extra_screens = set(owners) - set(REQUIRED_PAGE_OWNERS)
    for s in extra_screens:
        c.fail(f"정의되지 않은 Screen '{s}'에 PAGE_OWNER Task 존재: {owners[s]}")

    if c.passed:
        c.note("SCR-001~005 각각 정확히 1개의 Page Owner 확인")
    return c, owners


def check_6_route_page_entry_expected_files_match(rows, contract):
    c = Check(6, "Route·Page Entry·Expected Files 일치")
    if contract is None:
        c.fail(f"{CONTRACT_PATH.relative_to(REPO_ROOT)} 를 읽거나 파싱할 수 없음")
        return c

    contract_by_screen = {s["screen_id"]: s for s in contract.get("screens", [])}

    for r in rows:
        if r["Category"] != "PAGE_OWNER":
            continue
        screen = r["Screen"]
        ref = contract_by_screen.get(screen)
        if ref is None:
            c.fail(f"{r['Task ID']}: SCREEN_ROUTE_CONTRACT.json에 {screen} 정의 없음")
            continue

        row_route = r["Route"].strip("`")
        if row_route != ref["route"]:
            c.fail(f"{r['Task ID']}: Route '{row_route}' != 계약 '{ref['route']}'")

        row_entry = r["Page Entry"].strip("`")
        if row_entry != ref["page_entry"]:
            c.fail(f"{r['Task ID']}: Page Entry '{row_entry}' != 계약 '{ref['page_entry']}'")

        if ref["page_entry"] not in r["Expected Files"]:
            c.fail(f"{r['Task ID']}: Expected Files에 자신의 Page Entry '{ref['page_entry']}'가 포함되어 있지 않음")

    if c.passed:
        c.note("모든 Page Owner의 Route/Page Entry가 SCREEN_ROUTE_CONTRACT.json과 일치, Expected Files에 Page Entry 포함")
    return c


def check_7_no_component_only_screen(rows, owners):
    c = Check(7, "Component-only Screen 0(Page Owner 없이 Component만 있는 Screen 없음)")
    component_screens = {r["Screen"] for r in rows if r["Category"] == "COMPONENT" and r["Screen"] != "-"}
    for screen in sorted(component_screens):
        if screen not in owners or not owners[screen]:
            c.fail(f"Screen '{screen}'에 COMPONENT Task는 있지만 PAGE_OWNER Task가 없음")
    if c.passed:
        c.note(f"COMPONENT Task가 있는 {len(component_screens)}개 Screen 모두 Page Owner 보유")
    return c


def check_8_scr001_starter_removal(rows):
    c = Check(8, "SCR-001 Starter 제거 AC 존재")
    owner = next((r for r in rows if r["Task ID"] == "PAGE-SCR001"), None)
    if owner is None:
        c.fail("PAGE-SCR001 Task 없음")
        return c
    detail = read_detail("PAGE-SCR001")
    if not detail:
        c.fail("TASKS/TASK-PAGE-SCR001.md 없음")
    elif not re.search(r"starter", detail, re.IGNORECASE):
        c.fail("PAGE-SCR001 상세 파일에 starter 템플릿 제거 AC가 없음")
    else:
        c.note("PAGE-SCR001에 starter 템플릿 제거 AC 존재")
    return c


def check_9_scr003_three_tabs(rows):
    c = Check(9, "SCR-003 세 탭 조립 AC 존재")
    detail = read_detail("PAGE-SCR003")
    if not detail:
        c.fail("TASKS/TASK-PAGE-SCR003.md 없음")
        return c
    has_flight = re.search(r"항공|flight", detail, re.IGNORECASE)
    has_hotel = re.search(r"숙소|hotel", detail, re.IGNORECASE)
    has_mate = re.search(r"동행|mate", detail, re.IGNORECASE)
    if not (has_flight and has_hotel and has_mate):
        c.fail(f"PAGE-SCR003에 세 탭 전부 언급 없음 (flight={bool(has_flight)}, hotel={bool(has_hotel)}, mate={bool(has_mate)})")
    else:
        tab_ids = {"CMP-SCR003-FLIGHT-TAB", "CMP-SCR003-HOTEL-TAB", "CMP-SCR003-MATE-TAB"}
        depends = {d.strip().strip("`") for r in rows if r["Task ID"] == "PAGE-SCR003" for d in r["Depends On"].split(",")}
        missing_tab_tasks = tab_ids - depends
        if missing_tab_tasks:
            c.fail(f"PAGE-SCR003이 개별 탭 Task에 의존하지 않음: {sorted(missing_tab_tasks)}")
        else:
            c.note("PAGE-SCR003이 항공·숙소·동행 세 탭 Task에 모두 의존하며 AC에 명시됨")
    return c


def check_10_scr005_role_states(rows):
    c = Check(10, "SCR-005 역할별 상태 조립 AC 존재")
    detail = read_detail("PAGE-SCR005")
    if not detail:
        c.fail("TASKS/TASK-PAGE-SCR005.md 없음")
        return c
    has_guest = re.search(r"guest|게스트|비회원", detail, re.IGNORECASE)
    has_member = re.search(r"member|회원|프로필|profile", detail, re.IGNORECASE)
    has_admin = re.search(r"admin|관리자", detail, re.IGNORECASE)
    if not (has_guest and has_member and has_admin):
        c.fail(f"PAGE-SCR005에 Guest/Member/Admin 전부 언급 없음 (guest={bool(has_guest)}, member={bool(has_member)}, admin={bool(has_admin)})")
    else:
        c.note("PAGE-SCR005에 Guest·Member·Admin 역할별 조립 AC 존재")
    return c


def check_11_db_tasks_exist(rows):
    c = Check(11, "DB Schema·RLS·Access·Seed Task 존재")
    ids = {r["Task ID"] for r in rows}
    for tid, label in REQUIRED_DB_TASKS.items():
        if tid not in ids:
            c.fail(f"필수 DB Task 없음: {tid}({label})")
    if c.passed:
        c.note(f"{list(REQUIRED_DB_TASKS)} 전부 존재")
    return c


def check_12_db_table_scope(rows):
    c = Check(12, "DB Table 범위가 6개 기본 테이블을 넘지 않음")
    db_rows = [r for r in rows if r["Category"] == "DB"]
    if not db_rows:
        c.fail("DB Category Task가 하나도 없음")
        return c

    tables = set()
    for r in db_rows:
        detail = read_detail(r["Task ID"])
        for token in re.findall(r"`([a-z][a-z0-9_]*)`", detail):
            if token in DB_TABLE_ALLOWLIST:
                tables.add(token)
        for line in detail.splitlines():
            for m in re.findall(r"`([a-z][a-z0-9_]*)`", line):
                if m not in DB_TABLE_ALLOWLIST and m not in ("localstorage",) and not PROHIBITION_CONTEXT_RE.search(line):
                    # candidate table-like token outside the allowlist, actively used
                    if re.search(r"table|테이블", line, re.IGNORECASE):
                        c.fail(f"{r['Task ID']}: 허용 목록 밖 테이블 '{m}'이 금지 문맥 없이 사용됨: {line.strip()[:100]}")

    if len(tables) > MAX_DB_TABLES:
        c.fail(f"허용 테이블 {MAX_DB_TABLES}개를 초과: {len(tables)}개 참조됨 {sorted(tables)}")
    else:
        c.note(f"DB 테이블 {len(tables)}/{MAX_DB_TABLES}개 참조 — {sorted(tables)}")
    return c


def check_13_outbound_no_storage(rows):
    c = Check(13, "외부 입력(항공·숙소) 비저장 AC 존재")
    candidates = [
        r for r in rows
        if r["Screen"] == "SCR-003"
        and re.search(r"항공|숙소|flight|hotel", r["제목"], re.IGNORECASE)
        and "SHELL" not in r["Task ID"]
    ]
    if not candidates:
        c.fail("SCR-003 항공/숙소 Task를 찾을 수 없음")
        return c
    for r in candidates:
        detail = read_detail(r["Task ID"])
        if not re.search(r"서버.{0,20}(저장|전송|미저장)|server", detail, re.IGNORECASE):
            c.fail(f"{r['Task ID']}: 서버/DB/URL 비저장 AC 문구 없음")
    if c.passed:
        c.note(f"{[r['Task ID'] for r in candidates]} 전부 비저장 AC 명시")
    return c


def check_14_auth_adult_rls(rows):
    c = Check(14, "Auth·성인확인·기본 RLS AC 존재")
    ids = {r["Task ID"] for r in rows}

    auth_detail = read_detail("CMP-SCR005-AUTH")
    if "CMP-SCR005-AUTH" not in ids or not re.search(r"로그인|auth|가입", auth_detail, re.IGNORECASE):
        c.fail("CMP-SCR005-AUTH Task 또는 인증 관련 AC 없음")

    profile_detail = read_detail("CMP-SCR005-PROFILE")
    if "CMP-SCR005-PROFILE" not in ids or not re.search(r"성인", profile_detail):
        c.fail("CMP-SCR005-PROFILE Task 또는 성인 확인 AC 없음")

    rls_detail = read_detail("DB-RLS-BASE")
    if "DB-RLS-BASE" not in ids or not re.search(r"RLS|Row Level Security", rls_detail, re.IGNORECASE):
        c.fail("DB-RLS-BASE Task 또는 RLS AC 없음")

    if c.passed:
        c.note("Auth(CMP-SCR005-AUTH), 성인확인(CMP-SCR005-PROFILE), RLS(DB-RLS-BASE) AC 모두 확인")
    return c


def check_15_playwright_chromium_smoke(rows):
    c = Check(15, "Playwright Chromium Smoke Task 존재")
    e2e_rows = [r for r in rows if r["Category"] == "TEST_E2E"]
    if not e2e_rows:
        c.fail("TEST_E2E Category Task 없음")
        return c
    for r in e2e_rows:
        detail = read_detail(r["Task ID"])
        if not re.search(r"chromium", detail, re.IGNORECASE):
            c.fail(f"{r['Task ID']}: Chromium 명시 없음")
        if not re.search(r"smoke", detail, re.IGNORECASE):
            c.fail(f"{r['Task ID']}: Smoke 범위 명시 없음")
    if c.passed:
        c.note(f"{[r['Task ID'] for r in e2e_rows]} 전부 Chromium Smoke로 명시")
    return c


def check_16_no_aws_ec2_automerge(rows):
    c = Check(16, "AWS·EC2·자동 Merge 구현 Task 0")
    haystacks = [(r["Task ID"], "제목", r["제목"]) for r in rows]
    for r in rows:
        haystacks.append((r["Task ID"], "상세 파일", read_detail(r["Task ID"])))

    for tid, source, text in haystacks:
        for line in text.splitlines():
            if PROHIBITION_CONTEXT_RE.search(line):
                continue
            low = line.lower()
            for kw in FORBIDDEN_KEYWORDS:
                if kw in low:
                    c.fail(f"{tid} ({source}): 금지 문맥 없이 '{kw}' 등장 — {line.strip()[:100]}")
    if c.passed:
        c.note("AWS/EC2/자동 Merge를 실제로 구현하는 Task 없음(금지 문구 서술은 제외)")
    return c


def check_17_all_requirements_present(rows, full_text):
    c = Check(17, "REQ-FUNC 80개와 REQ-NF 34개가 Task 또는 EXCLUDED 표에 존재")
    if "## 4. Requirement Coverage" not in full_text:
        c.fail("00_TASK_LIST.md에 '## 4. Requirement Coverage' 섹션 없음")
        return c, {}

    coverage = full_text.split("## 4. Requirement Coverage", 1)[1]
    if "## 5." in coverage:
        coverage = coverage.split("## 5.", 1)[0]

    row_re = re.compile(
        r"^\|\s*(REQ-(?:FUNC|NF)-\d{3})\s*\|\s*([^|]+?)\s*\|\s*([^|]+?)\s*\|\s*([^|]+?)\s*\|\s*$",
        re.MULTILINE,
    )
    found = {}
    for m in row_re.finditer(coverage):
        req, status, task, verify = m.groups()
        found[req] = (status.strip(), task.strip(), verify.strip())

    canonical = canonical_requirement_ids()
    missing = canonical - found.keys()
    extra = found.keys() - canonical
    if missing:
        c.fail(f"Requirement Coverage에서 누락된 ID {len(missing)}개: {sorted(missing)}")
    if extra:
        c.fail(f"정의되지 않은 Requirement ID: {sorted(extra)}")

    task_ids = {r["Task ID"] for r in rows}
    for req, (status, task, verify) in found.items():
        if status.startswith("IMPLEMENT"):
            refs = [t.strip().strip("`") for t in task.split(",")]
            unknown = [t for t in refs if t and t not in task_ids]
            if unknown:
                c.fail(f"{req}: 존재하지 않는 Task ID 참조 {unknown}")
        elif status != "EXCLUDED":
            c.fail(f"{req}: 알 수 없는 Status '{status}'(IMPLEMENT* 또는 EXCLUDED만 허용)")

    if c.passed:
        n_excluded = sum(1 for s, _, _ in found.values() if s == "EXCLUDED")
        c.note(f"REQ-FUNC 80개 + REQ-NF 34개 = 114개 전부 존재 ({n_excluded} EXCLUDED, {len(found)-n_excluded} IMPLEMENT*)")
    return c, found


def check_18_excluded_no_detail_file(coverage, detail_files):
    c = Check(18, "EXCLUDED 상세 구현 파일이 생성되지 않음")
    excluded_reqs = [req for req, (status, _, _) in coverage.items() if status == "EXCLUDED"]
    for req in excluded_reqs:
        if req in detail_files:
            c.fail(f"EXCLUDED 요구사항 {req}에 대한 상세 구현 파일 TASKS/TASK-{req}.md가 존재함")
    # also guard against any detail file literally named after an excluded requirement
    for f in detail_files:
        if re.fullmatch(r"REQ-(FUNC|NF)-\d{3}", f) and f in excluded_reqs:
            c.fail(f"TASKS/TASK-{f}.md 는 EXCLUDED 요구사항의 상세 구현 파일이므로 존재해서는 안 됨")
    if c.passed:
        c.note(f"EXCLUDED {len(excluded_reqs)}건 모두 상세 구현 파일 없음 확인")
    return c


# ---------------------------------------------------------------------------
# Output writers

def write_manifest(rows):
    MANIFEST_PATH.parent.mkdir(parents=True, exist_ok=True)
    fieldnames = TASK_LIST_COLUMNS + ["Detail File", "Detail File Exists"]
    with open(MANIFEST_PATH, "w", encoding="utf-8", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        for r in rows:
            tid = r["Task ID"]
            out = dict(r)
            out["Detail File"] = f"TASKS/TASK-{tid}.md"
            out["Detail File Exists"] = str(detail_path(tid).exists())
            writer.writerow(out)


def write_report(checks, rows):
    lines = []
    lines.append("# Traveler Task Pipeline — Audit Report")
    lines.append("")
    lines.append(f"- **HARNESS_SCHEMA:** {HARNESS_SCHEMA}")
    lines.append(f"- **총 Task 수:** {len(rows)}")
    lines.append(f"- **검사 수:** {TOTAL_CHECKS}")
    overall_pass = all(c.passed for c in checks)
    lines.append(f"- **결과:** {'AUDIT_PASS' if overall_pass else 'AUDIT_FAIL'} ({sum(c.passed for c in checks)}/{len(checks)} 통과)")
    lines.append("")
    lines.append("| # | 검사 | 결과 |")
    lines.append("|---|---|---|")
    for c in checks:
        lines.append(f"| {c.no} | {c.title} | {'PASS' if c.passed else 'FAIL'} |")
    lines.append("")
    lines.append("---")
    for c in checks:
        lines.append("")
        lines.append(f"## {c.no}. {c.title} — {'PASS' if c.passed else 'FAIL'}")
        if c.notes:
            for n in c.notes:
                lines.append(f"- (참고) {n}")
        if c.findings:
            for finding in c.findings:
                lines.append(f"- ❌ {finding}")
        if not c.notes and not c.findings:
            lines.append("- (세부 기록 없음)")
    lines.append("")
    REPORT_PATH.write_text("\n".join(lines), encoding="utf-8")


# ---------------------------------------------------------------------------

def main():
    rows, full_text, load_errors = load_task_list()
    contract = load_contract()

    checks = []

    if load_errors:
        c0 = Check(0, "00_TASK_LIST.md 로드")
        for e in load_errors:
            c0.fail(e)
        checks.append(c0)
        write_manifest(rows)
        write_report(checks, rows)
        print(f"=== Traveler Task Pipeline — Final Audit ({HARNESS_SCHEMA}) ===\n")
        for e in load_errors:
            print(f"[FAIL] {e}")
        print("\nAUDIT_FAIL (0/{} checks could run)".format(TOTAL_CHECKS))
        return 1

    c1, detail_files = check_1_one_to_one(rows)
    c2 = check_2_no_duplicate_ids(rows)
    c3 = check_3_depends_on_missing(rows)
    c4 = check_4_no_dependency_cycle(rows)
    c5, owners = check_5_page_owner_per_screen(rows)
    c6 = check_6_route_page_entry_expected_files_match(rows, contract)
    c7 = check_7_no_component_only_screen(rows, owners)
    c8 = check_8_scr001_starter_removal(rows)
    c9 = check_9_scr003_three_tabs(rows)
    c10 = check_10_scr005_role_states(rows)
    c11 = check_11_db_tasks_exist(rows)
    c12 = check_12_db_table_scope(rows)
    c13 = check_13_outbound_no_storage(rows)
    c14 = check_14_auth_adult_rls(rows)
    c15 = check_15_playwright_chromium_smoke(rows)
    c16 = check_16_no_aws_ec2_automerge(rows)
    c17, coverage = check_17_all_requirements_present(rows, full_text)
    c18 = check_18_excluded_no_detail_file(coverage, detail_files)

    checks = [c1, c2, c3, c4, c5, c6, c7, c8, c9, c10, c11, c12, c13, c14, c15, c16, c17, c18]
    assert len(checks) == TOTAL_CHECKS, len(checks)

    write_manifest(rows)
    write_report(checks, rows)

    print(f"=== Traveler Task Pipeline — Final Audit ({HARNESS_SCHEMA}) ===\n")
    for c in checks:
        status = "PASS" if c.passed else "FAIL"
        print(f"[{status}] {c.no}. {c.title}")
        for n in c.notes:
            print(f"       - {n}")
        for f in c.findings:
            print(f"       ! {f}")

    passed_count = sum(c.passed for c in checks)
    print(f"\nWrote {MANIFEST_PATH.relative_to(REPO_ROOT)}")
    print(f"Wrote {REPORT_PATH.relative_to(REPO_ROOT)}")

    if passed_count == TOTAL_CHECKS:
        print(f"\nAUDIT_PASS ({passed_count}/{TOTAL_CHECKS} checks passed)")
        return 0
    else:
        print(f"\nAUDIT_FAIL ({passed_count}/{TOTAL_CHECKS} checks passed, {TOTAL_CHECKS - passed_count} failed)")
        return 1


if __name__ == "__main__":
    sys.exit(main())
