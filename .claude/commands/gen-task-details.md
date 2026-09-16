---
description: TASKS/00_TASK_LIST.md의 각 행에 대해 누락된 TASKS/TASK-<ID>.md를 생성한 뒤 scripts/audit_tasks.py로 감사한다.
---

# /gen-task-details

먼저 `traveler-project-pipeline` Skill을 불러와 그 규칙을 그대로 따른다.

## 전제

- 이 명령은 **문서만 생성한다.** Task 상세 파일에 코드 스니펫 예시 이상의 실제 구현 코드(실행 가능한 컴포넌트/함수 전체 구현)를 작성하지 않는다.
- 상세 파일은 "무엇을 만들어야 하는가"를 기록하는 것이지, 그것을 대신 만드는 것이 아니다.

## 단계

1. **전제 확인**. `TASKS/00_TASK_LIST.md`가 없으면 멈추고 `/gen-tasklist`를 먼저 실행하도록 안내한다.

2. **실제 파일 대조**. `TASKS/00_TASK_LIST.md` §2 Task List의 모든 Task ID와, 실제로 존재하는 `TASKS/TASK-*.md` 파일 목록을 각각 실제로 읽어 비교한다(추측하지 않는다). 상세 파일이 이미 있는 Task는 건드리지 않는다 — 사람이 손으로 고쳤을 수 있으므로 명시적으로 "전체 재생성" 요청이 없는 한 기존 파일을 덮어쓰지 않는다.

3. **누락된 상세 파일만 생성**. 각 누락된 Task ID에 대해 `TASKS/TASK-<ID>.md`를 아래 14개 절로, 이 순서로 작성한다:
   ```
   Context, Project Scope, Requirement Ref, Screen / Route / Page Entry,
   Design Ref, Depends On, Expected Files, Functional AC, Visual AC,
   Security/Privacy AC, Test Cases, Verify, Definition of Done, Forbidden
   ```
   - `Requirement Ref`, `Depends On`, `Expected Files`, `Functional/Visual/Security AC`는 `TASKS/00_TASK_LIST.md`의 해당 행 값을 그대로 가져온다(새로 지어내지 않는다).
   - `Design Ref`는 `design-reference/D-001/DESIGN.md`와 `design-reference/UI_CONTRACT.md`의 실제 절 이름을 인용한다.
   - `Expected Files`는 현재 `src/app` 등 실제 파일 트리를 다시 확인해 `(create)`/`(modify)`를 정확히 표기한다.
   - Category가 `PAGE_OWNER`인 Task는 `traveler-project-pipeline` Skill §5에 따라 "조립만" 범위로 쓰고, 새 Component를 만드는 내용을 넣지 않는다.
   - EXCLUDED Requirement에 대응하는 상세 파일(예: `TASKS/TASK-REQ-FUNC-055.md` 같은 파일)은 만들지 않는다.

4. **1:1 재확인**. 생성 후 `TASKS/00_TASK_LIST.md`의 Task ID 목록과 `TASKS/TASK-*.md` 파일명을 다시 실제로 대조해, 누락·고아 파일이 없는지 확인한다.

5. **Task Audit 실행**. 반드시 실행한다:
   ```
   python3 scripts/audit_tasks.py
   ```
   출력되는 `TASKS/TASK_MANIFEST.csv`, `TASKS/TASK_AUDIT_REPORT.md`를 실제로 열어 확인한다.

6. **실패를 무시하지 않는다.** `AUDIT_FAIL`이면:
   - 실패한 검사 번호와 findings를 그대로 보고한다.
   - findings가 가리키는 구체적인 `TASKS/TASK-<ID>.md`(또는 `00_TASK_LIST.md`)를 수정한다.
   - 다시 `python3 scripts/audit_tasks.py`를 실행한다.
   - `AUDIT_PASS`가 나오기 전까지 "완료"라고 보고하지 않는다. finding이 스크립트의 오탐이라고 판단되면 근거를 대며 사람에게 설명하고, 스크립트를 임의로 고쳐 통과시키지 않는다.

7. **보고**. 새로 생성한 Task ID 목록, 최종 `AUDIT_PASS`/`AUDIT_FAIL` 결과, 남아 있는 finding(있다면)을 보고한다.
