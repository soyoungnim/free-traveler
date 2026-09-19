---
name: "source-command-gen-tasklist"
description: "docs/06_SRS_UIUX_REVISED.md, docs/PROJECT_SCOPE.md, design-reference/D-001/DESIGN.md, design-reference/SCREEN_ROUTE_CONTRACT.json과 실제 src/app 트리를 읽어 TASKS/00_TASK_LIST.md를 생성하거나 갱신한다."
---

# source-command-gen-tasklist

Use this skill when the user asks to run the migrated source command `gen-tasklist`.

## Command Template

# /gen-tasklist

먼저 `traveler-project-pipeline` Skill을 불러와 그 규칙을 그대로 따른다. 이 명령은 Skill의 규칙을 재정의하지 않고 실행 순서만 정한다.

## 전제

- 이 명령은 **문서만 생성한다.** `src/app`, `src/lib`, `src/data`, `supabase/` 등 실제 구현 코드는 한 줄도 작성하지 않는다.
- Task List에 없는 파일을 만들거나, 아직 만들어지지 않은 Component/Page Owner의 실제 구현을 대신 작성하지 않는다.

## 단계

1. **입력 검증**. 실행한다:
   ```
   python3 scripts/validate_inputs.py
   ```
   `VALIDATE_INPUTS_FAIL`이면 여기서 멈추고 실패 항목을 그대로 보고한다. 입력이 깨진 상태에서 Task List를 만들지 않는다.

2. **실제 파일을 읽는다** — 추측하거나 이전 실행 결과를 재사용하지 않는다:
   - `package.json`, `design-reference/SCREEN_ROUTE_CONTRACT.json`(Screen 5개, Route, Page Entry, section_order, min_content_counts의 유일한 정본)
   - `docs/06_SRS_UIUX_REVISED.md`, `docs/PROJECT_SCOPE.md`(REQ-FUNC-001~080·REQ-NF-001~034 전체와 IMPLEMENT/EXCLUDED 상태)
   - `docs/UIUX_TRACEABILITY.md`, `design-reference/UI_CONTRACT.md`, `design-reference/D-001/DESIGN.md`
   - 현재 `src/app` 파일 트리(`find src/app -type f` 또는 동등한 방법으로 실제 존재 파일 확인 — 이미 있는 파일은 Expected Files에 `(modify)`로, 없는 파일은 `(create)`로 구분)

3. **Task 도출**. `traveler-project-pipeline` Skill §4~§9 규칙을 그대로 따른다: Screen당 Page Owner 1개, Component는 Screen당 단일 책임 단위로 분리, SCR-003은 항공·숙소·동행 세 탭을 분리된 Component로, DB는 6개 테이블(`user_profiles`,`mate_posts`,`mate_applications`,`user_blocks`,`reports`,`app_settings`) 이내, 정적 데이터(destinations/safety/representative)는 DB가 아닌 DATA Task로, Playwright는 Chromium Smoke 2~3개로.

4. **Requirement 배정**. `docs/UIUX_TRACEABILITY.md`의 114개 Requirement를 전부 확인해, IMPLEMENT 계열은 구현 Task에, EXCLUDED는 NON_IMPLEMENTATION 표에 배정한다. 하나라도 빠뜨리지 않는다.

5. **`TASKS/00_TASK_LIST.md` 작성**. 다음 순서로 구성한다:
   - 요약(총 Task 수, Category별 수)
   - §2 Task List — 16열 표(`Seq, Task ID, 제목, Category, Implementation Status, Requirement Ref, Screen, Route, Page Entry, Depends On, Expected Files, Functional AC, Visual AC, Security/Privacy AC, Verify, Priority`)
   - §3 NON_IMPLEMENTATION — EXCLUDED 18건(또는 갱신된 개수)을 근거·후속 방향과 함께
   - §4 Requirement Coverage — 114개 전량이 정확히 1회씩 등장

   기존 `TASKS/00_TASK_LIST.md`가 있다면 덮어쓰기 전에 무엇이 왜 바뀌는지 먼저 설명한다. 근거 없이 기존 Task ID·Screen 배정을 바꾸지 않는다.

6. **자체 확인**. Requirement Coverage에 114개가 정확히 1회씩 있는지, Task ID 중복이 없는지, Depends On이 전부 존재하는 Task를 가리키는지 직접 세어 확인한다. 이 확인 없이 "완료"라고 보고하지 않는다.

7. **보고**. 총 Task 수와 Category별 분포, 그리고 다음 단계(`/gen-task-details`)가 남아 있음을 함께 보고한다. 개수 자체(45~65개 등)를 완료 조건처럼 말하지 않는다.
