#!/usr/bin/env python3
"""
check_screen_contract.py — Traveler Screen/Route contract checker.

Verifies the 5 fixed Screens (SCR-001~005) stay a fixed set — at the
planning level (Task Manifest + SCREEN_ROUTE_CONTRACT.json) and, in
--mode=ci/--mode=release, against what actually exists under src/app.

Inputs:
  - design-reference/SCREEN_ROUTE_CONTRACT.json
  - TASKS/TASK_MANIFEST.csv
  - src/app/ (only read in --mode=ci / --mode=release)
  - docs/preview-checks/SCR-*.md (only read in --mode=release)

Modes (mutually exclusive, default plan):
  --mode=plan     Page Owner Task + 계획된 Route/Page Entry 정합성만 검사.
                  실제 src/app 파일 존재 여부는 검사하지 않는다.
  --mode=ci       plan의 모든 검사 + 실제 구현된 Page 파일과 공개 경로 검사.
  --mode=release  ci의 모든 검사 + docs/preview-checks/SCR-001.md~SCR-005.md
                  Preview Checkpoint 파일 존재 여부를 더한다.

Stdlib-only (Python 3.9+). Read-only — writes nothing.

On success: prints "SCREEN_CONTRACT_PASS (mode=<mode>)" and the number of
checks that ran, exit 0.
On failure: prints each finding as [파일] [화면 ID] 문제 — 수정 힌트, then
"SCREEN_CONTRACT_FAIL (mode=<mode>)", exit 1.
"""

import csv
import json
import re
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent

CONTRACT_PATH = REPO_ROOT / "design-reference/SCREEN_ROUTE_CONTRACT.json"
MANIFEST_PATH = REPO_ROOT / "TASKS/TASK_MANIFEST.csv"
APP_DIR = REPO_ROOT / "src/app"
PREVIEW_CHECKS_DIR = REPO_ROOT / "docs/preview-checks"

MODES = ("plan", "ci", "release")

REQUIRED_SCREENS = {
    "SCR-001": "/",
    "SCR-002": "/about",
    "SCR-003": "/travel-tools",
    "SCR-004": "/mates",
    "SCR-005": "/account",
}

# 사용자 화면으로 세지 않는 허용 기술 경로(패턴 매칭용).
ALLOWED_TECHNICAL_ROUTE_PREFIXES = ("/auth/callback", "/api/")
ALLOWED_TECHNICAL_ROUTE_EXACT = {"not-found"}

REQUIRED_PAGE_OWNERS = {
    "SCR-001": "PAGE-SCR001",
    "SCR-002": "PAGE-SCR002",
    "SCR-003": "PAGE-SCR003",
    "SCR-004": "PAGE-SCR004",
    "SCR-005": "PAGE-SCR005",
}

SCR003_TRIP_INPUT_TASKS = {"CMP-SCR003-FLIGHT-TAB", "CMP-SCR003-HOTEL-TAB"}
SCR003_MATE_WRITE_TASK = "CMP-SCR003-MATE-TAB"


class Result:
    def __init__(self, mode):
        self.mode = mode
        self.checks_run = 0
        self.findings = []  # (file, screen_id, message, hint)

    def check(self):
        self.checks_run += 1

    def fail(self, file, screen_id, message, hint):
        self.findings.append((file, screen_id, message, hint))

    def ok(self):
        return not self.findings


def parse_args(argv):
    mode = "plan"
    for a in argv:
        m = re.match(r"^--mode=(\w+)$", a)
        if m:
            mode = m.group(1)
    if mode not in MODES:
        print(f"SCREEN_CONTRACT_FAIL: 알 수 없는 --mode 값 '{mode}' (허용: {', '.join(MODES)})")
        sys.exit(1)
    return mode


def load_contract():
    if not CONTRACT_PATH.exists():
        print(f"SCREEN_CONTRACT_FAIL: {CONTRACT_PATH.relative_to(REPO_ROOT)} 없음")
        sys.exit(1)
    try:
        return json.loads(CONTRACT_PATH.read_text(encoding="utf-8"))
    except json.JSONDecodeError as e:
        print(f"SCREEN_CONTRACT_FAIL: {CONTRACT_PATH.relative_to(REPO_ROOT)} JSON 파싱 오류: {e}")
        sys.exit(1)


def load_manifest():
    if not MANIFEST_PATH.exists():
        print(f"SCREEN_CONTRACT_FAIL: {MANIFEST_PATH.relative_to(REPO_ROOT)} 없음(scripts/audit_tasks.py를 먼저 실행)")
        sys.exit(1)
    with MANIFEST_PATH.open(encoding="utf-8", newline="") as f:
        return list(csv.DictReader(f))


def strip_backticks(cell):
    return (cell or "").strip().strip("`")


def split_ids(cell):
    if not cell or cell.strip() in ("-", ""):
        return []
    return [c.strip().strip("`") for c in cell.split(",") if c.strip()]


# ---------------------------------------------------------------------------
# Check 1 — 고정 화면 5개가 정확히 존재한다.

def check_1_fixed_screens_exist(r, contract, mode):
    r.check()
    contract_screens = {s["screen_id"]: s for s in contract.get("screens", [])}

    for scr_id, expected_route in REQUIRED_SCREENS.items():
        s = contract_screens.get(scr_id)
        if s is None:
            r.fail(
                str(CONTRACT_PATH.relative_to(REPO_ROOT)), scr_id,
                "SCREEN_ROUTE_CONTRACT.json에 이 Screen이 없음",
                f"screens 배열에 screen_id='{scr_id}', route='{expected_route}' 항목을 추가한다",
            )
            continue
        if s.get("route") != expected_route:
            r.fail(
                str(CONTRACT_PATH.relative_to(REPO_ROOT)), scr_id,
                f"route가 '{s.get('route')}'로 되어 있음(기대값 '{expected_route}')",
                f"{scr_id}의 route를 '{expected_route}'로 고정한다",
            )

    extra = set(contract_screens) - set(REQUIRED_SCREENS)
    for scr_id in sorted(extra):
        r.fail(
            str(CONTRACT_PATH.relative_to(REPO_ROOT)), scr_id,
            "고정된 5개 화면 목록 밖의 Screen이 정의됨",
            "5개 고정 화면 목록(SCR-001~005) 밖의 Screen을 SCREEN_ROUTE_CONTRACT.json에서 제거하거나, 정말 새 화면이 필요하면 먼저 사람에게 확인한다",
        )

    if len(contract_screens) != 5:
        r.fail(
            str(CONTRACT_PATH.relative_to(REPO_ROOT)), "-",
            f"screen_count가 5가 아니라 {len(contract_screens)}개",
            "screens 배열과 screen_count를 정확히 5로 맞춘다",
        )

    if mode in ("ci", "release"):
        for scr_id, expected_route in REQUIRED_SCREENS.items():
            s = contract_screens.get(scr_id)
            if s is None:
                continue  # already reported above
            page_entry = s.get("page_entry", "")
            page_path = REPO_ROOT / page_entry
            if not page_path.exists():
                r.fail(
                    page_entry or "(page_entry 미정의)", scr_id,
                    "Page Entry 파일이 아직 구현되지 않음",
                    f"{page_entry}를 생성해 PAGE-{scr_id.replace('-', '')} Task를 구현한다",
                )


# ---------------------------------------------------------------------------
# Check 2 — 각 화면 Page Owner Task가 정확히 하나다.

def check_2_page_owner_exactly_one(r, manifest, contract):
    r.check()
    contract_screens = {s["screen_id"]: s for s in contract.get("screens", [])}
    owners_by_screen = {}
    for row in manifest:
        if row.get("Category") != "PAGE_OWNER":
            continue
        screen = strip_backticks(row.get("Screen", ""))
        owners_by_screen.setdefault(screen, []).append(row)

    for scr_id, expected_task_id in REQUIRED_PAGE_OWNERS.items():
        rows = owners_by_screen.get(scr_id, [])
        if len(rows) == 0:
            r.fail(
                str(MANIFEST_PATH.relative_to(REPO_ROOT)), scr_id,
                "이 Screen에 PAGE_OWNER Task가 없음",
                f"TASKS/00_TASK_LIST.md에 Category=PAGE_OWNER, Task ID={expected_task_id} 행을 추가한다",
            )
            continue
        if len(rows) > 1:
            ids = [row.get("Task ID") for row in rows]
            r.fail(
                str(MANIFEST_PATH.relative_to(REPO_ROOT)), scr_id,
                f"PAGE_OWNER Task가 {len(rows)}개 존재함({ids})",
                "화면당 Page Owner Task를 정확히 1개로 합친다",
            )
            continue

        row = rows[0]
        task_id = row.get("Task ID")
        if task_id != expected_task_id:
            r.fail(
                str(MANIFEST_PATH.relative_to(REPO_ROOT)), scr_id,
                f"Page Owner Task ID가 '{task_id}'(기대값 '{expected_task_id}')",
                f"Task ID를 '{expected_task_id}'로 맞춘다",
            )

        contract_screen = contract_screens.get(scr_id, {})
        expected_route = contract_screen.get("route")
        expected_entry = contract_screen.get("page_entry")
        manifest_route = strip_backticks(row.get("Route", ""))
        manifest_entry = strip_backticks(row.get("Page Entry", "")).split("(")[0].strip()
        if expected_route and manifest_route != expected_route:
            r.fail(
                str(MANIFEST_PATH.relative_to(REPO_ROOT)), scr_id,
                f"Task Manifest Route '{manifest_route}'가 계약 route '{expected_route}'와 다름",
                "Task Manifest/00_TASK_LIST.md의 Route 열을 SCREEN_ROUTE_CONTRACT.json과 일치시킨다",
            )
        if expected_entry and manifest_entry != expected_entry:
            r.fail(
                str(MANIFEST_PATH.relative_to(REPO_ROOT)), scr_id,
                f"Task Manifest Page Entry '{manifest_entry}'가 계약 page_entry '{expected_entry}'와 다름",
                "Task Manifest/00_TASK_LIST.md의 Expected Files/Page Entry를 SCREEN_ROUTE_CONTRACT.json과 일치시킨다",
            )


# ---------------------------------------------------------------------------
# Check 3 — 기술 경로를 사용자 화면으로 세지 않는다.

def is_allowed_technical_route(route):
    if route in ALLOWED_TECHNICAL_ROUTE_EXACT:
        return True
    return any(route.startswith(p) for p in ALLOWED_TECHNICAL_ROUTE_PREFIXES)


def check_3_technical_routes_not_counted(r, contract, mode):
    r.check()
    screen_routes = {s["route"] for s in contract.get("screens", [])}
    for route in screen_routes:
        if is_allowed_technical_route(route):
            r.fail(
                str(CONTRACT_PATH.relative_to(REPO_ROOT)), "-",
                f"기술 경로 '{route}'가 screens 배열(사용자 화면)에 포함됨",
                "이 경로를 screens에서 제거하고 technical_routes로 옮긴다",
            )

    for tr in contract.get("technical_routes", []):
        if tr.get("counted_as_screen") is True:
            r.fail(
                str(CONTRACT_PATH.relative_to(REPO_ROOT)), "-",
                f"technical_routes 항목 '{tr.get('route')}'의 counted_as_screen이 true",
                "기술 경로는 counted_as_screen: false로 유지한다",
            )

    if mode in ("ci", "release") and APP_DIR.exists():
        auth_cb_page = APP_DIR / "auth/callback/page.tsx"
        if auth_cb_page.exists():
            r.fail(
                str(auth_cb_page.relative_to(REPO_ROOT)), "-",
                "/auth/callback이 page.tsx(사용자 화면)로 구현됨",
                "auth/callback은 route.ts(Route Handler)로만 구현하고 page.tsx를 두지 않는다",
            )
        for api_page in APP_DIR.glob("api/**/page.tsx"):
            r.fail(
                str(api_page.relative_to(REPO_ROOT)), "-",
                "/api/** 경로 아래에 page.tsx(사용자 화면)가 존재함",
                "API 경로는 route.ts로만 구현하고 page.tsx를 두지 않는다",
            )


# ---------------------------------------------------------------------------
# Check 4 — 여행지 상세·안전정보(및 그 외 계약에 없는 Page)를 새로 만들지 않았는지.

APP_ROUTE_SEGMENT_RE = re.compile(r"^\((.+)\)$")  # Next.js route groups: (group)


def file_to_route(page_file: Path):
    rel = page_file.relative_to(APP_DIR)
    parts = list(rel.parts[:-1])  # drop page.tsx itself
    segments = [p for p in parts if not APP_ROUTE_SEGMENT_RE.match(p)]
    if not segments:
        return "/"
    return "/" + "/".join(segments)


def check_4_no_undeclared_pages(r, contract, mode):
    r.check()
    if mode not in ("ci", "release"):
        return  # 실제 파일 검사는 ci/release에서만 수행(계획 단계는 파일이 없어도 정상)
    if not APP_DIR.exists():
        return

    declared_routes = set(REQUIRED_SCREENS.values())
    watch_hints = {
        "/destinations": "여행지 상세는 SCR-001의 Drawer로만 제공한다(06_SRS_UIUX_REVISED.md §2-1 참조) — 별도 page.tsx를 만들지 않는다",
        "/safety": "국가별 안전정보는 SCR-001의 안전정보 Modal/Drawer로만 제공한다 — 별도 page.tsx를 만들지 않는다",
        "/mates": "동행글 상세는 SCR-004의 상세 패널로만 제공한다 — /mates/[id] 같은 하위 page.tsx를 만들지 않는다",
    }

    for page_file in sorted(APP_DIR.glob("**/page.tsx")):
        route = file_to_route(page_file)
        if route in declared_routes:
            continue
        if is_allowed_technical_route(route):
            continue
        hint = "이 Route는 SCREEN_ROUTE_CONTRACT.json의 5개 고정 화면에 없다 — 파일을 제거하거나, 정말 필요하면 먼저 계약을 갱신하고 사람 확인을 받는다"
        for prefix, specific_hint in watch_hints.items():
            if route == prefix or route.startswith(prefix + "/"):
                hint = specific_hint
                break
        screen_hint = "-"
        for scr_id, scr_route in REQUIRED_SCREENS.items():
            if route.startswith(scr_route) and scr_route != "/":
                screen_hint = scr_id
        r.fail(
            str(page_file.relative_to(REPO_ROOT)), screen_hint,
            f"계약에 없는 Route '{route}'에 Page가 구현됨",
            hint,
        )


# ---------------------------------------------------------------------------
# Check 5 — SCR-003 Task가 여행 입력과 동행 작성 양쪽 요구를 포함한다.

def check_5_scr003_dual_requirement(r, manifest):
    r.check()
    by_id = {row.get("Task ID"): row for row in manifest}

    trip_input_present = [tid for tid in SCR003_TRIP_INPUT_TASKS if tid in by_id and strip_backticks(by_id[tid].get("Screen", "")) == "SCR-003"]
    mate_write_present = SCR003_MATE_WRITE_TASK in by_id and strip_backticks(by_id[SCR003_MATE_WRITE_TASK].get("Screen", "")) == "SCR-003"

    if not trip_input_present:
        r.fail(
            str(MANIFEST_PATH.relative_to(REPO_ROOT)), "SCR-003",
            "여행 입력(항공/숙소) Task가 SCR-003에 없음",
            f"Screen=SCR-003으로 {sorted(SCR003_TRIP_INPUT_TASKS)} 중 최소 1개 Task를 등록한다",
        )
    if not mate_write_present:
        r.fail(
            str(MANIFEST_PATH.relative_to(REPO_ROOT)), "SCR-003",
            "동행 작성 Task(CMP-SCR003-MATE-TAB)가 SCR-003에 없음",
            "Screen=SCR-003으로 CMP-SCR003-MATE-TAB Task를 등록한다",
        )

    page_owner = by_id.get("PAGE-SCR003")
    if page_owner is not None and trip_input_present and mate_write_present:
        deps = set(split_ids(page_owner.get("Depends On", "")))
        missing_deps = [tid for tid in (trip_input_present + [SCR003_MATE_WRITE_TASK]) if tid not in deps]
        if missing_deps:
            r.fail(
                str(MANIFEST_PATH.relative_to(REPO_ROOT)), "SCR-003",
                f"PAGE-SCR003의 Depends On에 {missing_deps}가 빠짐",
                "PAGE-SCR003이 여행 입력·동행 작성 Component를 모두 Depends On에 포함해 조립하도록 한다",
            )


# ---------------------------------------------------------------------------
# Check 6 — release 모드: Preview Checkpoint 파일 존재 확인.

def check_6_preview_checkpoints(r, mode):
    if mode != "release":
        return
    r.check()
    for scr_id in REQUIRED_SCREENS:
        p = PREVIEW_CHECKS_DIR / f"{scr_id}.md"
        if not p.exists():
            r.fail(
                str(p.relative_to(REPO_ROOT)), scr_id,
                "Preview Checkpoint 확인 문서가 없음",
                f"사람이 {scr_id} Preview를 확인한 뒤 docs/preview-checks/{scr_id}.md를 작성한다",
            )
        elif p.stat().st_size == 0:
            r.fail(
                str(p.relative_to(REPO_ROOT)), scr_id,
                "Preview Checkpoint 문서가 비어 있음",
                f"docs/preview-checks/{scr_id}.md에 실제 확인 내용을 기록한다",
            )


# ---------------------------------------------------------------------------

def main():
    mode = parse_args(sys.argv[1:])
    contract = load_contract()
    manifest = load_manifest()

    r = Result(mode)
    check_1_fixed_screens_exist(r, contract, mode)
    check_2_page_owner_exactly_one(r, manifest, contract)
    check_3_technical_routes_not_counted(r, contract, mode)
    check_4_no_undeclared_pages(r, contract, mode)
    check_5_scr003_dual_requirement(r, manifest)
    check_6_preview_checkpoints(r, mode)

    print(f"=== Traveler Screen Contract Check (mode={mode}) ===\n")

    if r.ok():
        print(f"SCREEN_CONTRACT_PASS (mode={mode}, {r.checks_run}개 검사 통과)")
        return 0

    for file, screen_id, message, hint in r.findings:
        print(f"[{file}] [{screen_id}] {message}")
        print(f"  -> 수정 힌트: {hint}")

    print(f"\nSCREEN_CONTRACT_FAIL (mode={mode}, {len(r.findings)}건 발견)")
    return 1


if __name__ == "__main__":
    sys.exit(main())
