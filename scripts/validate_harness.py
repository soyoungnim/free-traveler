#!/usr/bin/env python3
"""
validate_harness.py — Traveler agent-harness validator.

Checks that the *tooling* Claude/agents rely on (CLAUDE.md, the
traveler-project-pipeline Skill, and the 7 pipeline Commands) actually
exists on disk and states the rules it's supposed to state. This is
distinct from scripts/validate_inputs.py (checks project source-of-truth
docs) and scripts/audit_tasks.py (checks generated Task output).

Stdlib-only (Python 3.9+). Read-only — writes nothing.

On success: prints "VALIDATE_HARNESS_PASS" and the number of checks that
ran, exit 0.

On failure: prints the missing file(s)/rule(s) per failed check, exit 1.
"""

import re
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent

HARNESS_SCHEMA = "traveler-screen-route-v1"
TOTAL_CHECKS = 13

CLAUDE_MD = REPO_ROOT / "CLAUDE.md"
SKILL_MD = REPO_ROOT / ".claude/skills/traveler-project-pipeline/SKILL.md"
COMMANDS_DIR = REPO_ROOT / ".claude/commands"

EXPECTED_COMMANDS = [
    "gen-tasklist.md",
    "gen-task-details.md",
    "audit-tasks.md",
    "prepare-task.md",
    "implement-task.md",
    "run-wave.md",
    "release-check.md",
]

EXPECTED_DESIGN_PATH = "design-reference/D-001/DESIGN.md"
EXPECTED_SCREEN_CONTRACT = "design-reference/SCREEN_ROUTE_CONTRACT.json"


class Result:
    def __init__(self):
        self.failures = []  # (check_no, message)
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


def combined_rule_text():
    """CLAUDE.md and the Skill file together — a rule may live in either."""
    parts = []
    if CLAUDE_MD.exists():
        parts.append(read(CLAUDE_MD.relative_to(REPO_ROOT)))
    if SKILL_MD.exists():
        parts.append(read(SKILL_MD.relative_to(REPO_ROOT)))
    return "\n".join(parts)


def parse_harness_markers(text):
    """Parse KEY=VALUE lines out of the Harness Marker block in CLAUDE.md."""
    markers = {}
    for line in text.splitlines():
        m = re.match(r"^([A-Z_]+)=(\S+)$", line.strip())
        if m:
            markers[m.group(1)] = m.group(2)
    return markers


# --- checks -----------------------------------------------------------------

def check_1_claude_md(r: Result):
    n = r.check(1)
    if not CLAUDE_MD.exists():
        r.fail(n, "missing file: CLAUDE.md")


def check_2_skill_file(r: Result):
    n = r.check(2)
    if not SKILL_MD.exists():
        r.fail(n, f"missing file: {SKILL_MD.relative_to(REPO_ROOT)}")


def check_3_seven_commands(r: Result):
    n = r.check(3)
    if not COMMANDS_DIR.exists():
        r.fail(n, f"missing directory: {COMMANDS_DIR.relative_to(REPO_ROOT)}")
        return
    for name in EXPECTED_COMMANDS:
        if not (COMMANDS_DIR / name).exists():
            r.fail(n, f"missing command file: .claude/commands/{name}")
    found = sorted(p.name for p in COMMANDS_DIR.glob("*.md"))
    if len(found) != len(EXPECTED_COMMANDS):
        r.fail(
            n,
            f"expected exactly {len(EXPECTED_COMMANDS)} command files, found {len(found)}: {found}",
        )


def check_4_harness_schema_marker(r: Result):
    n = r.check(4)
    if not CLAUDE_MD.exists():
        r.fail(n, "CLAUDE.md missing — cannot check HARNESS_SCHEMA marker")
        return
    text = read("CLAUDE.md")
    markers = parse_harness_markers(text)
    if markers.get("HARNESS_SCHEMA") != HARNESS_SCHEMA:
        r.fail(
            n,
            f"CLAUDE.md HARNESS_SCHEMA marker is '{markers.get('HARNESS_SCHEMA')}', expected '{HARNESS_SCHEMA}'",
        )


def check_5_design_path(r: Result):
    n = r.check(5)
    if not CLAUDE_MD.exists():
        r.fail(n, "CLAUDE.md missing — cannot check DESIGN_PATH marker")
        return
    markers = parse_harness_markers(read("CLAUDE.md"))
    design_path = markers.get("DESIGN_PATH")
    if design_path != EXPECTED_DESIGN_PATH:
        r.fail(n, f"CLAUDE.md DESIGN_PATH marker is '{design_path}', expected '{EXPECTED_DESIGN_PATH}'")
    elif not exists(design_path):
        r.fail(n, f"DESIGN_PATH marker points to '{design_path}' but that file does not exist")


def check_6_screen_contract_path(r: Result):
    n = r.check(6)
    if not CLAUDE_MD.exists():
        r.fail(n, "CLAUDE.md missing — cannot check SCREEN_CONTRACT marker")
        return
    markers = parse_harness_markers(read("CLAUDE.md"))
    contract_path = markers.get("SCREEN_CONTRACT")
    if contract_path != EXPECTED_SCREEN_CONTRACT:
        r.fail(n, f"CLAUDE.md SCREEN_CONTRACT marker is '{contract_path}', expected '{EXPECTED_SCREEN_CONTRACT}'")
    elif not exists(contract_path):
        r.fail(n, f"SCREEN_CONTRACT marker points to '{contract_path}' but that file does not exist")


def check_7_page_owner_five_rule(r: Result):
    n = r.check(7)
    text = combined_rule_text()
    has_five_screens = re.search(r"5개\s*Screen|Screen\s*(당|마다).{0,10}(정확히\s*)?1개|SCR-001.{0,20}SCR-005", text)
    has_page_owner = re.search(r"Page\s*Owner", text, re.IGNORECASE)
    if not (has_five_screens and has_page_owner):
        r.fail(n, "no rule found stating exactly 5 Page Owner tasks (one per Screen) in CLAUDE.md or the Skill file")


def check_8_db_six_tables_rule(r: Result):
    n = r.check(8)
    text = combined_rule_text()
    if not re.search(r"6개\s*(테이블|Table)", text, re.IGNORECASE):
        r.fail(n, "no rule found stating the 6-table DB scope in CLAUDE.md or the Skill file")


def check_9_outbound_no_storage_rule(r: Result):
    n = r.check(9)
    text = combined_rule_text()
    has_flight_hotel = re.search(r"항공.{0,5}숙소|숙소.{0,5}항공", text)
    has_no_storage = re.search(r"서버.{0,20}(보내지|전달하지|저장하지)\s*않는다|API.{0,10}DB.{0,10}URL.{0,10}로그", text)
    if not (has_flight_hotel and has_no_storage):
        r.fail(n, "no rule found stating flight/hotel input must not be sent to server/DB/URL/log in CLAUDE.md or the Skill file")


def check_10_playwright_chromium_smoke_rule(r: Result):
    n = r.check(10)
    text = combined_rule_text()
    has_marker = "PLAYWRIGHT_SCOPE=chromium-smoke" in text or "PLAYWRIGHT_ENABLED=true" in text
    has_rule_text = re.search(r"Chromium.{0,20}Smoke|Smoke.{0,20}Chromium", text, re.IGNORECASE)
    if not (has_marker and has_rule_text):
        r.fail(n, "no Chromium-Smoke-only Playwright rule/marker found in CLAUDE.md or the Skill file")


def check_11_auto_merge_false(r: Result):
    n = r.check(11)
    if not CLAUDE_MD.exists():
        r.fail(n, "CLAUDE.md missing — cannot check AUTO_MERGE marker")
        return
    markers = parse_harness_markers(read("CLAUDE.md"))
    if markers.get("AUTO_MERGE") != "false":
        r.fail(n, f"CLAUDE.md AUTO_MERGE marker is '{markers.get('AUTO_MERGE')}', expected 'false'")


def check_12_aws_enabled_false(r: Result):
    n = r.check(12)
    if not CLAUDE_MD.exists():
        r.fail(n, "CLAUDE.md missing — cannot check AWS_ENABLED marker")
        return
    markers = parse_harness_markers(read("CLAUDE.md"))
    if markers.get("AWS_ENABLED") != "false":
        r.fail(n, f"CLAUDE.md AWS_ENABLED marker is '{markers.get('AWS_ENABLED')}', expected 'false'")


def check_13_excluded_protection_rule(r: Result):
    n = r.check(13)
    text = combined_rule_text()
    if not re.search(r"EXCLUDED.{0,40}(임의로.{0,10}구현하지 않는다|되살리지 않는다|복원하지 않는다|상세 구현.{0,10}(만들지|Task를 만들지) 않는다)", text):
        r.fail(n, "no rule found protecting EXCLUDED requirements from being silently (re-)implemented, in CLAUDE.md or the Skill file")


def main():
    r = Result()

    check_1_claude_md(r)
    check_2_skill_file(r)
    check_3_seven_commands(r)
    check_4_harness_schema_marker(r)
    check_5_design_path(r)
    check_6_screen_contract_path(r)
    check_7_page_owner_five_rule(r)
    check_8_db_six_tables_rule(r)
    check_9_outbound_no_storage_rule(r)
    check_10_playwright_chromium_smoke_rule(r)
    check_11_auto_merge_false(r)
    check_12_aws_enabled_false(r)
    check_13_excluded_protection_rule(r)

    print(f"=== Traveler Agent Harness Validation ({HARNESS_SCHEMA}) ===\n")

    if r.ok():
        print(f"VALIDATE_HARNESS_PASS ({r.checks_run}/{TOTAL_CHECKS} checks passed)")
        return 0

    by_check = {}
    for check_no, msg in r.failures:
        by_check.setdefault(check_no, []).append(msg)

    print(f"VALIDATE_HARNESS_FAIL ({len(by_check)}/{TOTAL_CHECKS} checks failed, {len(r.failures)} finding(s))\n")
    for check_no in sorted(by_check):
        print(f"[check {check_no}]")
        for msg in by_check[check_no]:
            print(f"  - {msg}")
    return 1


if __name__ == "__main__":
    sys.exit(main())
