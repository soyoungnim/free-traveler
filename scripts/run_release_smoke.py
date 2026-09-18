#!/usr/bin/env python3
"""
run_release_smoke.py — dispatches `npm run test:e2e` vs `npm run test:e2e:public`
for `npm run release:check`.

Why this exists as a script instead of shell logic inside package.json:
conditional branching on environment variables is bash-specific syntax
(`if [ -z "$VAR" ]`), which is not portable across the shells npm scripts
may run under. This stdlib-only Python script keeps that branching out of
package.json, consistent with the other scripts/*.py checks in this repo.

Rule: CI에 실제 Supabase Secret이 없을 때는 공개 Smoke만 실행한다.
Checked vars (from docs/ARCHITECTURE.md §"필요 환경변수"):
  - NEXT_PUBLIC_SUPABASE_URL
  - NEXT_PUBLIC_SUPABASE_ANON_KEY

Stdlib-only (Python 3.9+).
"""

import os
import subprocess
import sys

REQUIRED_SUPABASE_VARS = ["NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_ANON_KEY"]


def has_real_supabase_secrets():
    return all(os.environ.get(v, "").strip() for v in REQUIRED_SUPABASE_VARS)


def main():
    if has_real_supabase_secrets():
        print("run_release_smoke: Supabase Secret 확인됨 — npm run test:e2e(전체 Smoke) 실행")
        script = "test:e2e"
    else:
        missing = [v for v in REQUIRED_SUPABASE_VARS if not os.environ.get(v, "").strip()]
        print(f"run_release_smoke: Supabase Secret 없음({', '.join(missing)}) — npm run test:e2e:public(공개 Smoke)만 실행")
        script = "test:e2e:public"

    result = subprocess.run(["npm", "run", "--silent", script])
    sys.exit(result.returncode)


if __name__ == "__main__":
    main()
