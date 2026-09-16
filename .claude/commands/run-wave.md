---
description: Wave 단위로 Task를 순차 실행한다(/run-wave WXX, /run-wave status, /run-wave resume, /run-wave dry-run WXX). Branch·PR·Merge는 만들지 않는다.
---

# /run-wave

먼저 `traveler-project-pipeline` Skill과 루트 `CLAUDE.md`를 불러와 그 규칙을 그대로 따른다. 이 명령은 그 규칙을 재정의하지 않으며, `CLAUDE.md` 규칙 6·7·22(표준 개발 명령, Wave 내부 순차 실행, Preview 대기)를 실행하는 구체적 절차다.

이 명령은 **Branch를 만들지 않고, Commit을 자동으로 하지 않고, PR을 만들지 않고, Merge를 하지 않는다.** Task 단위 Commit이 필요하면 `/implement-task`의 규칙(사용자가 명시적으로 요청한 경우에만 Task 1개 = Commit 1개)을 그대로 따른다 — `/run-wave`가 별도로 커밋 정책을 완화하지 않는다.

## Wave 관련 파일

이 두 파일이 Wave 실행의 유일한 상태 저장소다. 다른 곳에 별도로 진행 상태를 만들지 않는다.

- **`TASKS/WAVE_PLAN.md`** — Task를 Wave로 묶은 계획. Wave ID(`W01`, `W02`, …), 각 Wave에 속한 Task ID 목록(해당 Wave 내부의 `Depends On` 순서 포함), 그리고 그 Wave가 화면(Screen) 완성 Wave라 사람 Preview Checkpoint가 필요한지 여부를 담는다.
  - **파일이 없으면**: `TASKS/00_TASK_LIST.md`의 `Depends On` 그래프를 실제로 읽어, 모든 선행 Task가 이전 레이어에 있도록 레이어(=Wave)로 나눈다(선행 Task가 없는 Task가 `W01`). `Category: PAGE_OWNER`를 포함하는 Wave는 Preview Checkpoint가 필요한 것으로 표시한다. 생성한 뒤에는 그대로 진행하지 않고, 사람에게 "이 Wave 분할로 진행해도 되는지" 먼저 확인한다.
- **`TASKS/WAVE_STATE.md`** — 각 Task ID의 현재 상태(`PENDING`/`READY`/`IN_PROGRESS`/`DONE`/`BLOCKED`)와 각 Wave의 상태(`NOT_STARTED`/`IN_PROGRESS`/`DONE`/`WAITING_FOR_PREVIEW`)를 담는다.
  - **파일이 없으면**: `TASKS/WAVE_PLAN.md`를 기준으로 새로 만든다. 선행 Task가 없는 Task는 `READY`, 나머지는 `PENDING`으로 시작한다.

두 파일 모두 실제로 열어서 읽는다. 이전에 읽었던 내용을 기억으로 재사용하지 않는다 — 사람이 그 사이에 손으로 고쳤을 수 있다.

---

## `/run-wave W03` (Wave ID를 실제 인자로 받는 경우 전부 동일하게 동작)

1. **`TASKS/WAVE_PLAN.md`와 `TASKS/WAVE_STATE.md`를 읽는다.** 지정한 Wave(예: `W03`)가 계획에 없으면 멈추고 알린다.

2. **현재 Wave의 READY Task를 `Depends On` 순서로 하나 선택한다.** 여러 Task를 동시에 고르지 않는다. `READY`인 Task가 없으면(전부 `PENDING`, `IN_PROGRESS`, 또는 `DONE`) 3~7단계를 건너뛰고 바로 7·8단계 판정으로 간다.

3. **`prepare-task` 규칙으로 검사한다.** 선택한 Task에 대해:
   - `Depends On`에 나열된 Task가 `WAVE_STATE`에서 실제로 `DONE`인지 확인한다.
   - `TASKS/TASK-<ID>.md`의 `Expected Files`가 실제로 아직 충돌 없이 비어있거나(신규) 이전 Task 결과와 정합적인지 확인한다.
   - 검사를 통과하면 `WAVE_STATE`에서 이 Task를 `READY_TO_IMPLEMENT`로 표시한다(= `/implement-task`가 요구하는 전제 조건). 검사를 통과하지 못하면 이 Task를 `BLOCKED`로 표시하고, 같은 Wave의 다른 `READY` Task가 있는지 2단계로 돌아가 확인한다. 없으면 8단계로 간다.

4. **`implement-task` 규칙으로 Task 하나를 구현한다.** `/implement-task <Task ID>`와 동일한 절차(Expected Files 범위, Functional/Visual/Security AC, Page Owner는 조립만, 금지 항목 준수)를 그대로 수행한다. 이 문서는 그 절차를 다시 설명하지 않는다.

5. **관련 검증이 PASS하면 Task 상태를 `DONE`으로 갱신한다.** Unit Test(그리고 해당 시 Playwright Chromium Smoke)가 전부 PASS해야 `DONE`으로 바꾼다. 하나라도 FAIL이면 `IN_PROGRESS`로 남기고, 원인과 함께 멈춘다 — 다음 Task로 넘어가 실패를 덮지 않는다.

6. **같은 Wave의 다음 READY Task를 계속 처리한다.** 방금 완료한 Task 덕분에 새로 `READY`가 된 Task가 있으면 `WAVE_STATE`에 반영한 뒤 2단계로 돌아간다.

7. **이 Wave의 모든 Task가 `DONE`이면 종료한다.** Wave 상태를 `DONE`으로 표시하고, 이 Wave에 사람 Preview Checkpoint가 없으면(=화면 완성 Wave가 아니면) 결과를 보고하고 명령을 끝낸다.

8. **사람 Preview Checkpoint가 있는 Wave라면 `WAITING_FOR_PREVIEW`로 종료한다.** Wave 상태를 `WAITING_FOR_PREVIEW`로 표시하고, 어떤 화면을 Preview로 확인해야 하는지 명시한 뒤 멈춘다. 사람의 확인 없이 다음 Wave로 자동 진행하지 않는다(`CLAUDE.md` 규칙 22).

---

## `/run-wave status`

실행 없이 상태만 보고한다. `TASKS/WAVE_PLAN.md`, `TASKS/WAVE_STATE.md`를 실제로 읽어: 전체 Wave 목록과 각 Wave의 상태, 현재 진행 중인 Wave, 그 안에서 `READY`/`IN_PROGRESS`/`BLOCKED`/`DONE`인 Task 수를 표로 보여준다. 아무 파일도 바꾸지 않는다.

## `/run-wave resume`

1. `TASKS/WAVE_STATE.md`를 읽어 `IN_PROGRESS` 또는 `WAITING_FOR_PREVIEW`인 Wave를 찾는다.
2. `WAITING_FOR_PREVIEW`라면: 사람이 이미 Preview를 확인했는지 먼저 물은다. 확인됐다고 답변받은 경우에만 다음 Wave로 넘어가 `/run-wave W<다음 번호>`와 동일하게 동작한다. 확인 여부가 불명확하면 진행하지 않고 다시 묻는다.
3. `IN_PROGRESS`라면: 해당 Wave ID로 `/run-wave WXX`의 1~8단계를 그대로 이어서 수행한다(어느 Task까지 끝났는지는 `WAVE_STATE`의 값을 그대로 신뢰한다).
4. 진행 중이거나 대기 중인 Wave가 하나도 없으면 그 사실을 보고하고 종료한다(다음으로 시작할 Wave ID를 제안할 수 있으나, 사람이 명시적으로 지정하지 않으면 임의로 시작하지 않는다).

## `/run-wave dry-run W03`

1~3단계(계획/상태 읽기, READY Task 선택, `prepare-task` 검사)까지만 실제로 수행한다. **4단계(구현)는 실행하지 않는다.**

- 이번에 선택됐을 Task ID, 그 Task의 `Depends On`이 실제로 전부 `DONE`인지, `Expected Files` 목록, 이 Wave에 Preview Checkpoint가 있는지를 보고한다.
- `TASKS/WAVE_STATE.md`를 바꾸지 않는다(읽기 전용). `prepare-task` 검사 결과가 `BLOCKED`로 나올 만한 사유가 있다면 그것도 함께 보여준다.
- 코드·문서·상태 파일 어느 것도 실제로 쓰지 않는다 — dry-run은 "무엇이 실행될지 미리 보여주는 것"만 한다.
