---
name: "source-command-implement-task"
description: "prepare-task가 READY_TO_IMPLEMENT로 표시한 Task 하나를 실제로 구현한다. 기본적으로 Commit·Push·PR은 수행하지 않는다."
---

# source-command-implement-task

Use this skill when the user asks to run the migrated source command `implement-task`.

## Command Template

# /implement-task <Task ID>

먼저 `traveler-project-pipeline` Skill과 루트 `AGENTS.md`를 불러와 그 규칙을 그대로 따른다. 이 명령은 그 규칙을 재정의하지 않는다.

## 전제

- 이 명령은 **정확히 하나의 Task**만 구현한다. 인자로 받은 Task ID 하나 외에 다른 Task를 임의로 함께 진행하지 않는다.
- Task ID가 주어지지 않으면 멈추고 어떤 Task를 구현할지 사람에게 확인한다. 임의로 "다음 Task"를 추측해 고르지 않는다.

## 단계

### 1. READY_TO_IMPLEMENT 확인 (prepare-task 결과만 신뢰)

- `TASKS/TASK-<ID>.md`를 실제로 읽어 `/prepare-task`가 이 Task를 `READY_TO_IMPLEMENT`로 표시했는지 확인한다.
- 표시가 없거나, 상태가 `READY_TO_IMPLEMENT`가 아니거나, `prepare-task`가 아직 한 번도 실행되지 않은 것으로 보이면 **여기서 멈춘다.** 스스로 "아마 준비됐을 것"이라고 판단해 진행하지 않는다. 이 경우 먼저 `/prepare-task <Task ID>`(또는 해당 절차)를 실행하도록 안내하고 종료한다.
- `Depends On`에 나열된 Task가 실제로 완료되어 있는지도 함께 확인한다. 완료되지 않은 선행 Task가 있으면 같은 방식으로 멈춘다.

### 2. Task 전체를 읽는다

`Context, Project Scope, Requirement Ref, Screen / Route / Page Entry, Design Ref, Depends On, Expected Files, Functional AC, Visual AC, Security/Privacy AC, Test Cases, Verify, Definition of Done, Forbidden`을 전부 읽는다. `Forbidden`을 가장 먼저 마음에 새긴다.

### 3. `Expected Files` 안에서만 작업한다

- 이 Task의 `Expected Files`에 나열된 파일만 만들거나 수정한다. 목록 밖의 파일(다른 Task의 Component, 다른 Screen의 `page.tsx`, 공용 설정 등)을 건드리지 않는다.
- 목록 밖의 변경이 정말 필요하다고 판단되면, 그 자리에서 임의로 확장하지 않고 사람에게 먼저 알린다.

### 4. Functional·Visual·Security AC를 따른다

- `Functional AC`에 적힌 동작을 전부 구현한다.
- `Visual AC`는 `design-reference/D-001/DESIGN.md`의 토큰(컬러/타이포/spacing/radius/shadow)만 사용해 구현한다. 토큰에 없는 임의 색상·서체를 추가하지 않는다.
- `Security/Privacy AC`(예: 항공·숙소 입력값 미전달, RLS 범위, 연락처 비노출)를 구현 세부사항으로 빠뜨리지 않는다.

### 5. Page Owner Task는 실제 Page Entry를 조립한다

`Category: PAGE_OWNER`인 Task라면, 이미 존재하는 Component/Data/API Task의 결과물을 `Page Entry`(예: `src/app/page.tsx`)에서 실제로 import·배치해 화면을 완성한다. 이 단계에서 새 Component를 새로 설계·구현하지 않는다 — 필요한 Component가 아직 없다면 멈추고 그 사실을 보고한다(임의로 대신 만들지 않는다).

### 6. 관련 Unit Test 실행

이 Task와 관련된 Unit Test(날짜 검증/연락처 탐지/상태 전이 등, `TASKS/00_TASK_LIST.md`의 `Verify` 열 참고)를 실제로 실행하고 결과를 확인한다. 테스트가 아직 없다면 이 Task의 `Test Cases`에 대응하는 최소 테스트를 함께 작성한다.

### 7. Playwright는 Page Owner·E2E Task일 때만

- `Category`가 `PAGE_OWNER` 또는 `TEST_E2E`인 경우에만 관련 Playwright Chromium Smoke(`E2E-PUBLIC-SMOKE`/`E2E-TRAVEL-TOOLS`/`E2E-MATE-AUTH` 중 해당하는 것)를 실행한다.
- 그 외 Category(`COMPONENT`, `DATA`, `DB`, `API`, `CI_OPS` 등)에서는 Playwright를 실행하지 않는다 — Unit Test로 충분하다.

### 8. 금지 항목

다음을 이 Task에서 추가하지 않는다: AWS·EC2 등 클라우드 인프라, Prisma 등 ORM, 자동 Merge/자동 PR 승인 기능. `Task`의 `Forbidden` 절에 적힌 항목도 동일하게 지킨다.

### 9. Commit·Push·PR — 기본적으로 수행하지 않는다

- 이 명령은 **기본적으로 Commit, Push, PR을 생성하지 않는다.** 구현이 끝나면 변경 사항을 워킹 트리에 그대로 남겨두고 다음 단계로 보고를 마친다.
- 사용자가 명시적으로 요청한 경우에만 **이 Task 하나에 대응하는 Commit**까지 수행할 수 있다. 이때도:
  - 여러 Task를 하나의 Commit으로 묶지 않는다(Task 1개 = Commit 1개).
  - Push나 PR 생성은 사용자가 별도로 명시적으로 요청하지 않는 한 하지 않는다.
  - Commit 전 `git status`로 이 Task의 `Expected Files` 외 변경이 섞여 있지 않은지 확인한다.

### 10. 완료 보고

작업을 마치면 다음 세 가지를 보고한다(`AGENTS.md` 규칙 23과 동일):

1. **변경 파일 목록** — 실제로 생성/수정한 파일 경로(모두 `Expected Files` 안에 있어야 함)
2. **검증 결과** — 실행한 Unit Test/Playwright(해당 시)/lint·타입체크 결과
3. **남은 제약** — 이 Task에서 처리하지 못했거나 다음 Task로 넘긴 것, `Definition of Done` 중 미충족 항목이 있다면 그것도 명시
