---
name: "source-command-audit-tasks"
description: "scripts/audit_tasks.py를 실행해 TASKS/ 산출물을 감사하고 TASKS/TASK_MANIFEST.csv, TASKS/TASK_AUDIT_REPORT.md 결과를 그대로 보고한다."
---

# source-command-audit-tasks

Use this skill when the user asks to run the migrated source command `audit-tasks`.

## Command Template

# /audit-tasks

먼저 `traveler-project-pipeline` Skill을 불러와 그 규칙을 그대로 따른다.

## 전제

- 이 명령은 **오직 감사만 한다.** `TASKS/00_TASK_LIST.md`, `TASKS/TASK-*.md`, 그리고 어떤 구현 코드도 이 명령 안에서 고치지 않는다.
- 실패를 발견했다고 해서 이 명령 안에서 직접 수정하지 않는다 — 수정은 `/gen-task-details`나 사람이 한다.

## 단계

1. 실제로 실행한다:
   ```
   python3 scripts/audit_tasks.py
   ```
   출력을 그대로(요약하거나 생략하지 않고) 보여준다: 18개 검사 각각의 PASS/FAIL, findings, 그리고 마지막 `AUDIT_PASS`/`AUDIT_FAIL` 줄.

2. **`TASKS/TASK_MANIFEST.csv`와 `TASKS/TASK_AUDIT_REPORT.md`가 실제로 갱신됐는지 파일을 열어 확인한다.** 스크립트 실행 로그만 보고 파일이 갱신됐다고 가정하지 않는다.

3. **실패를 무시하지 않는다.**
   - `AUDIT_FAIL`이면 실패한 검사 번호·제목·findings를 전부 보고한다. "대체로 통과했다", "나머지는 사소하다" 같은 식으로 결과를 희석하지 않는다.
   - `AUDIT_PASS`라도 findings 없이 넘어가지 않는다 — PASS 각 항목의 근거(참고 note)도 함께 확인해, 실제로 검사가 의미 있게 수행됐는지 본다(예: 어떤 검사가 대상 Task 자체가 없어서 "찾을 대상 없음"으로 통과한 것인지 구분).
   - `TASKS/00_TASK_LIST.md`나 `design-reference/SCREEN_ROUTE_CONTRACT.json`이 이 감사 이후 바뀐 적이 있다면, 그 사실을 명시하고 재실행을 권한다.

4. **다음 행동 제안.** `AUDIT_FAIL`이면 어떤 Task ID들을 `/gen-task-details`로 보완해야 하는지 findings에서 그대로 뽑아 제시한다. 이 명령 자체는 수정하지 않는다.
