#!/usr/bin/env python3
"""
validate_inputs.py — Traveler Task Pipeline input validator.

Run BEFORE /gen-tasklist. Runs the 11 checks below, in order. Stdlib-only
(Python 3.9+), read-only — no files are written.

  1.  package.json declares a Next.js dependency.
  2.  src/app/page.tsx and src/app/layout.tsx exist.
  3.  PRD, SRS, Project Scope, and UI docs exist.
  4.  design-reference/D-001/DESIGN.md exists and the design manifest is LOCKED.
  5.  design-reference/SCREEN_ROUTE_CONTRACT.json parses as JSON.
  6.  Screen count is exactly 5.
  7.  SCR-001~005 are all present.
  8.  Routes are exactly `/`, `/about`, `/travel-tools`, `/mates`, `/account`.
  9.  Every Page Entry is a real Next.js App Router path (src/app/.../page.tsx).
  10. docs/PROJECT_SCOPE.md mentions all REQ-FUNC-001..080 and REQ-NF-001..034.
  11. AWS/EC2 is not defined as an active technology anywhere it's mentioned.

On success: prints "VALIDATE_INPUTS_PASS" and the number of checks that ran,
exit code 0.

On failure: prints the missing files / Screens / Requirement IDs for every
failed check, exit code 1.
"""

import json
import re
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent

HARNESS_SCHEMA = "traveler-screen-route-v1"
TOTAL_CHECKS = 11

EXPECTED_SCREEN_IDS = ["SCR-001", "SCR-002", "SCR-003", "SCR-004", "SCR-005"]
EXPECTED_ROUTES = {"/", "/about", "/travel-tools", "/mates", "/account"}

PAGE_ENTRY_RE = re.compile(r"^src/app(?:/[\w\-\[\]]+)*/page\.tsx$")

# check 3 — PRD / SRS / Project Scope / UI docs
PRD_DOCS = ["docs/01_PRD.md"]
SRS_DOCS = ["docs/02_SRS_BASELINE.md"]
SCOPE_DOCS = ["docs/PROJECT_SCOPE.md"]
UI_DOCS = [
    "docs/03_UI_COVERAGE_ANALYSIS.md",
    "docs/04_UIUX_PLAN.md",
    "docs/05_UIUX_APPROVED.md",
    "docs/06_SRS_UIUX_REVISED.md",
    "docs/UIUX_TRACEABILITY.md",
    "design-reference/UI_CONTRACT.md",
]

# check 4
DESIGN_FILE = "design-reference/D-001/DESIGN.md"
DESIGN_MANIFEST_FILE = "design-reference/DESIGN_MANIFEST.md"

# check 5/6/7/8/9
CONTRACT_FILE = "design-reference/SCREEN_ROUTE_CONTRACT.json"

# check 10
PROJECT_SCOPE_FILE = "docs/PROJECT_SCOPE.md"

AWS_EC2_WORD_RE = re.compile(r"\b(AWS|EC2)\b", re.IGNORECASE)
AWS_PACKAGE_HINT_RE = re.compile(r"aws", re.IGNORECASE)
EXCLUSION_CONTEXT_RE = re.compile(r"제외|excluded|vercel", re.IGNORECASE)


def canonical_requirement_ids():
    ids = [f"REQ-FUNC-{i:03d}" for i in range(1, 81)]
    ids += [f"REQ-NF-{i:03d}" for i in range(1, 35)]
    return ids


class Result:
    def __init__(self):
        self.failures = []  # list of (check_no, message) tuples
        self.checks_run = 0

    def check(self, n):
        self.checks_run += 1
        return n

    def fail(self, n, msg):
        self.failures.append((n, msg))

    def ok(self):
        return not self.failures


def exists(rel_path):
    return (REPO_ROOT / rel_path).exists()


def read(rel_path):
    return (REPO_ROOT / rel_path).read_text(encoding="utf-8")


# --- checks -----------------------------------------------------------------

def check_1_nextjs_dependency(r: Result):
    n = r.check(1)
    path = "package.json"
    if not exists(path):
        r.fail(n, f"missing file: {path}")
        return
    try:
        data = json.loads(read(path))
    except json.JSONDecodeError as exc:
        r.fail(n, f"{path} is not valid JSON: {exc}")
        return
    deps = {**data.get("dependencies", {}), **data.get("devDependencies", {})}
    if "next" not in deps:
        r.fail(n, f"{path} does not declare a 'next' dependency")


def check_2_app_router_entrypoints(r: Result):
    n = r.check(2)
    for path in ["src/app/page.tsx", "src/app/layout.tsx"]:
        if not exists(path):
            r.fail(n, f"missing file: {path}")


def check_3_core_docs(r: Result):
    n = r.check(3)
    groups = {
        "PRD": PRD_DOCS,
        "SRS": SRS_DOCS,
        "Project Scope": SCOPE_DOCS,
        "UI docs": UI_DOCS,
    }
    for label, paths in groups.items():
        for path in paths:
            if not exists(path):
                r.fail(n, f"missing {label} file: {path}")


def check_4_design_locked(r: Result):
    n = r.check(4)
    if not exists(DESIGN_FILE):
        r.fail(n, f"missing file: {DESIGN_FILE}")
    if not exists(DESIGN_MANIFEST_FILE):
        r.fail(n, f"missing file: {DESIGN_MANIFEST_FILE}")
        return
    manifest = read(DESIGN_MANIFEST_FILE)
    if not re.search(r"Status.{0,10}LOCKED", manifest, re.IGNORECASE | re.DOTALL):
        r.fail(n, f"{DESIGN_MANIFEST_FILE} does not declare Status: LOCKED")


def load_contract(r: Result, n):
    if not exists(CONTRACT_FILE):
        r.fail(n, f"missing file: {CONTRACT_FILE}")
        return None
    try:
        return json.loads(read(CONTRACT_FILE))
    except json.JSONDecodeError as exc:
        r.fail(n, f"{CONTRACT_FILE} is not valid JSON: {exc}")
        return None


def check_5_contract_parses(r: Result):
    n = r.check(5)
    data = load_contract(r, n)
    return data


def check_6_screen_count(r: Result, data):
    n = r.check(6)
    if data is None:
        r.fail(n, f"cannot check screen count — {CONTRACT_FILE} did not parse")
        return
    screens = data.get("screens", [])
    if len(screens) != 5:
        r.fail(n, f"expected exactly 5 screens, found {len(screens)}")


def check_7_all_screens_present(r: Result, data):
    n = r.check(7)
    if data is None:
        r.fail(n, f"cannot check Screen IDs — {CONTRACT_FILE} did not parse")
        return
    screens = data.get("screens", [])
    found_ids = {s.get("screen_id") for s in screens}
    missing = [sid for sid in EXPECTED_SCREEN_IDS if sid not in found_ids]
    for sid in missing:
        r.fail(n, f"missing Screen: {sid}")


def check_8_routes(r: Result, data):
    n = r.check(8)
    if data is None:
        r.fail(n, f"cannot check Routes — {CONTRACT_FILE} did not parse")
        return
    screens = data.get("screens", [])
    routes = {s.get("route") for s in screens}
    missing = EXPECTED_ROUTES - routes
    extra = routes - EXPECTED_ROUTES
    for route in sorted(missing):
        r.fail(n, f"missing expected Route: {route}")
    for route in sorted(r for r in extra if r is not None):
        r.fail(n, f"unexpected Route not in {{/, /about, /travel-tools, /mates, /account}}: {route}")


def check_9_page_entry_format(r: Result, data):
    n = r.check(9)
    if data is None:
        r.fail(n, f"cannot check Page Entry format — {CONTRACT_FILE} did not parse")
        return
    for screen in data.get("screens", []):
        sid = screen.get("screen_id")
        entry = screen.get("page_entry", "")
        if not PAGE_ENTRY_RE.match(entry or ""):
            r.fail(n, f"{sid}: Page Entry '{entry}' is not a valid Next.js App Router path (expected src/app/.../page.tsx)")


def check_10_requirements_in_project_scope(r: Result):
    n = r.check(10)
    if not exists(PROJECT_SCOPE_FILE):
        r.fail(n, f"missing file: {PROJECT_SCOPE_FILE}")
        return
    text = read(PROJECT_SCOPE_FILE)
    present = set(re.findall(r"REQ-(?:FUNC|NF)-\d{3}", text))
    missing = [rid for rid in canonical_requirement_ids() if rid not in present]
    for rid in missing:
        r.fail(n, f"missing Requirement ID in {PROJECT_SCOPE_FILE}: {rid}")


def check_11_no_active_aws_ec2(r: Result):
    n = r.check(11)

    # package.json must not depend on AWS tooling.
    if exists("package.json"):
        try:
            data = json.loads(read("package.json"))
            deps = {**data.get("dependencies", {}), **data.get("devDependencies", {})}
            aws_deps = [name for name in deps if AWS_PACKAGE_HINT_RE.search(name)]
            for name in aws_deps:
                r.fail(n, f"package.json declares an AWS-related dependency as active: {name}")
        except json.JSONDecodeError:
            pass  # already reported by check 1

    # Any AWS/EC2 mention in the core docs must sit in an explicit exclusion
    # context (e.g. PROJECT_SCOPE.md's "제외 기능과 사유" table), never
    # presented as an active/in-scope technology.
    docs_to_scan = list(dict.fromkeys(
        PRD_DOCS + SRS_DOCS + SCOPE_DOCS + UI_DOCS + [DESIGN_FILE, DESIGN_MANIFEST_FILE]
    ))
    for path in docs_to_scan:
        if not exists(path):
            continue
        for lineno, line in enumerate(read(path).splitlines(), start=1):
            if AWS_EC2_WORD_RE.search(line) and not EXCLUSION_CONTEXT_RE.search(line):
                r.fail(
                    n,
                    f"{path}:{lineno}: AWS/EC2 mentioned without exclusion context "
                    f"(expected '제외'/'Vercel' on the same line) — looks like active tech: {line.strip()}",
                )


# --- main ---------------------------------------------------------------

def main():
    r = Result()

    check_1_nextjs_dependency(r)
    check_2_app_router_entrypoints(r)
    check_3_core_docs(r)
    check_4_design_locked(r)
    contract = check_5_contract_parses(r)
    check_6_screen_count(r, contract)
    check_7_all_screens_present(r, contract)
    check_8_routes(r, contract)
    check_9_page_entry_format(r, contract)
    check_10_requirements_in_project_scope(r)
    check_11_no_active_aws_ec2(r)

    print(f"=== Traveler Task Pipeline — Input Validation ({HARNESS_SCHEMA}) ===\n")

    if r.ok():
        print(f"VALIDATE_INPUTS_PASS ({r.checks_run}/{TOTAL_CHECKS} checks passed)")
        return 0

    by_check = {}
    for check_no, msg in r.failures:
        by_check.setdefault(check_no, []).append(msg)

    print(f"VALIDATE_INPUTS_FAIL ({len(by_check)}/{TOTAL_CHECKS} checks failed, {len(r.failures)} finding(s))\n")
    for check_no in sorted(by_check):
        print(f"[check {check_no}]")
        for msg in by_check[check_no]:
            print(f"  - {msg}")
    return 1


if __name__ == "__main__":
    sys.exit(main())
