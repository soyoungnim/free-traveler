---
description: Wave 하나를 실행한다(/run-wave <WAVE_ID> [--status|--dry-run|--resume]). Task를 하나씩 prepare→implement하며, Page Owner Wave는 사람의 Browser Checkpoint 확인 전까지 완료 처리하지 않는다. Branch·Commit·Push·PR·Merge는 만들지 않는다.
---

# /run-wave

먼저 `traveler-project-pipeline` Skill과 루트 `CLAUDE.md`를 불러와 그 규칙을 그대로 따른다. 이 명령은 그 규칙을 재정의하지 않으며, `CLAUDE.md` 규칙 6·7·22(표준 개발 명령, Wave 내부 순차 실행, Preview 대기)를 실행하는 구체적 절차다.

## 입력

- **WAVE_ID**(필수) — 예: `W04`. `TASKS/WAVE_PLAN.md`/`TASKS/WAVE_STATE.json`에 실제로 존재하는 값이어야 한다.
- **옵션**(0개 또는 1개, 서로 배타적):
  - `--status` — 현재 Wave와 그 안의 Task 상태만 보여준다. 아무 파일도 바꾸지 않는다.
  - `--dry-run` — 이번에 실행됐을 Task·건드릴 Expected Files·돌릴 최소 검증·Checkpoint 필요 여부만 보여준다. 아무 파일도 바꾸지 않는다.
  - `--resume` — 이 Wave에서 `pending` 또는 `blocked`인 첫 Task부터 다시 시작한다.
  - 옵션 없음(기본) — 이 Wave의 `pending` Task를 실행 순서대로 하나씩 prepare(준비 검사)하고 implement(구현)한다.

`/run-wave`만 입력하거나 WAVE_ID가 실제로 존재하지 않으면 멈추고, 사람에게 유효한 WAVE_ID를 알려달라고 요청한다(임의로 "가장 앞선 미완료 Wave"를 추측해 시작하지 않는다).

## 상태 파일(정본)

다음 두 파일이 Wave 실행의 유일한 상태 저장소다. 다른 곳에 별도로 진행 상태를 만들지 않는다. 둘 다 `scripts/build_waves.py`가 생성하며, 이 명령은 그 생성 로직을 재구현하지 않는다 — 파일이 없거나 WAVE_ID가 없으면 먼저 `npm run wave:contract`(`python3 scripts/build_waves.py`)를 실행하도록 안내하고 멈춘다.

- **`TASKS/WAVE_PLAN.md`** — Wave ID(`W01`, `W02`, …) 목록과 각 Wave 안의 Task 실행 순서(위상 정렬 + Task ID 오름차순 tie-break), Preview Checkpoint 필요 여부(표의 "Preview Checkpoint" 열).
- **`TASKS/WAVE_STATE.json`**(`schema_version: "traveler-wave-state-v1"`) — 각 Wave의 `wave_id`, `title`, `task_ids`, `status`(`pending`/`in_progress`/`blocked`/`completed`), `checkpoint_required`, `checkpoint_result`.
  - **Task 단위 상태 확장**: 이 JSON은 Wave 단위 상태만 담고 있다. `/run-wave`가 어떤 Wave를 처음 실행할 때, 그 Wave 객체에 `tasks` 배열이 없으면 `task_ids` 순서대로 `[{"task_id": "...", "status": "pending"}, ...]`을 추가해 초기화한다. 이후 모든 진행 상태는 이 `tasks` 배열의 `status`(`pending`/`in_progress`/`blocked`/`completed`)로 기록한다. 이미 `completed`로 표시된 Wave의 Task는 개별 `tasks` 항목이 없어도 전부 `completed`로 간주한다(Wave 단위 completed는 그 안의 모든 Task가 completed임을 보증한다는 전제).

두 파일 모두 실제로 열어서 읽는다. 이전에 읽었던 내용을 기억으로 재사용하지 않는다 — 사람이나 다른 실행이 그 사이에 고쳤을 수 있다.

## 공통 규칙(모든 동작에 적용)

1. **이전 Wave 완료 확인.** `TASKS/WAVE_PLAN.md` 목록 순서상 지정한 WAVE_ID보다 앞에 있는 모든 Wave가 `WAVE_STATE.json`에서 `status: completed`가 아니면 시작하지 않는다. 가장 앞선 미완료 Wave ID를 보여주고 멈춘다.
2. **Blocked Task 발견 시 즉시 정지.** 이 Wave의 Task 중 하나라도 `status: blocked`이면(과거 실행에서 남았거나 이번에 새로 발견했거나) Wave 자체의 `status`를 `blocked`로 기록하고 그 자리에서 멈춘다. 다른 `pending` Task로 건너뛰어 진행하지 않는다.
3. **Task마다 지정된 최소 검증을 실행한다.** `TASKS/TASK_MANIFEST.csv`의 `Verify` 열과 `/implement-task` 규칙 6·7을 따른다 — 관련 Unit Test는 항상 실행하고, Playwright Chromium Smoke는 Category가 `PAGE_OWNER` 또는 `TEST_E2E`인 Task에서만 실행한다. 검증이 하나라도 실패하면 그 Task를 `completed`로 표시하지 않는다.
4. **Page Owner가 있는 Wave는 Browser Checkpoint를 요구한다.** `checkpoint_required: true`인 Wave는, 안의 모든 Task가 `completed`가 되어도 사람이 실제 브라우저로 화면을 확인했다는 응답을 받아 `checkpoint_result`에 기록하기 전까지 Wave `status`를 `completed`로 바꾸지 않는다(아래 "Browser Checkpoint 처리" 참조).
5. **사람의 확인 전에는 다음 Wave를 자동 실행하지 않는다.** 이 명령은 한 번의 호출에서 정확히 하나의 WAVE_ID만 다룬다. 이번 Wave가 끝나거나 Checkpoint 대기로 멈추면, 사람이 다음 WAVE_ID로 별도 호출하기 전까지 스스로 다음 Wave를 시작하지 않는다.
6. **자동 Branch·Commit·Push·PR·Merge를 만들지 않는다.** Task 구현 자체는 `/implement-task`의 절차와 Commit 정책(사용자가 명시적으로 요청한 경우에만 Task 1개 = Commit 1개, Push/PR은 별도 명시적 요청 시에만)을 그대로 따른다 — 이 명령이 그 정책을 완화하거나 대신 Commit하지 않는다.

## Browser Checkpoint 처리

Wave의 마지막 Task까지 `completed`가 되고 `checkpoint_required: true`인 경우:

1. `checkpoint_result`가 이미 값이 있으면(이전에 확인 완료) Wave `status`를 `completed`로 갱신하고 정상 종료 보고를 낸다.
2. `checkpoint_result`가 아직 `null`이면, 어떤 화면(Screen ID·Route)을 Preview로 확인해야 하는지 명시하고 사람에게 "실제 브라우저로 확인했습니까?"를 묻는다(AskUserQuestion 사용).
   - **확인됨** 응답을 받으면 `checkpoint_result`에 확인 시각과 확인자 응답을 기록하고 Wave `status`를 `completed`로 갱신한다.
   - **확인 안 됨/불명확** 응답이면 Wave `status`는 `in_progress`로 남기고, `checkpoint_result`는 `null`로 유지한 채 멈춘다. 다음 호출에서도 같은 질문부터 다시 시작한다(사람 확인 없이 임의로 `completed`로 넘어가지 않는다).

## 동작별 절차

### `/run-wave <WAVE_ID> --status`

읽기 전용. `TASKS/WAVE_PLAN.md`, `TASKS/WAVE_STATE.json`을 읽어 다음을 표로 보여준다: Wave 상태, Preview Checkpoint 필요 여부·결과, 이 Wave의 Task 목록과 각 Task의 상태(`pending`/`in_progress`/`blocked`/`completed`). 아무 파일도 바꾸지 않는다.

### `/run-wave <WAVE_ID> --dry-run`

1~2단계(계획 읽기, 공통 규칙 1 검사)까지만 실제로 수행한다. **3단계 이후(prepare/implement)는 실행하지 않는다.**

- 이번에 선택됐을 Task ID, 그 Task의 `Depends On`이 실제로 전부 `completed`인지, `Expected Files` 목록, 실행될 최소 검증(공통 규칙 3), 이 Wave에 Browser Checkpoint가 필요한지를 보여준다.
- `TASKS/WAVE_STATE.json`을 바꾸지 않는다(읽기 전용). Blocked Task가 있다면 그 사실도 그대로 보여준다.
- 코드·문서·상태 파일 어느 것도 실제로 쓰지 않는다.

### `/run-wave <WAVE_ID>`(기본)

1. `TASKS/WAVE_PLAN.md`와 `TASKS/WAVE_STATE.json`을 읽는다. 지정한 WAVE_ID가 둘 중 하나에라도 없으면 멈추고 알린다.
2. 공통 규칙 1(이전 Wave 완료)을 검사한다. 충족하지 않으면 멈춘다.
3. 이 Wave의 `tasks` 상태를 초기화한다(없으면 전부 `pending`으로 생성).
4. 공통 규칙 2(Blocked Task)를 검사한다. `blocked` Task가 있으면 Wave를 `blocked`로 기록하고 멈춘다.
5. `TASKS/WAVE_PLAN.md`에 기록된 이 Wave의 실행 순서를 따라, `status: pending`이고 `Depends On`이 전부 `completed`(이 Wave 안이든 이전 Wave든)인 첫 Task를 하나 고른다. 여러 Task를 동시에 고르지 않는다.
   - 그런 Task가 없고 아직 `pending`인 Task가 남아 있다면(의존성이 아직 안 끝남) 원인을 보여주고 멈춘다 — 이 경우는 정상적으로는 발생하지 않아야 한다(Wave 배치가 의존성을 이미 만족하도록 만들어졌기 때문).
6. 선택한 Task를 **prepare**한다: `Depends On`이 실제로 `completed`인지, `TASKS/TASK-<ID>.md`의 `Expected Files`가 다른 진행 중 작업과 충돌하지 않는지 확인한다. 통과하면 이 Task를 `in_progress`로 표시한다. 통과하지 못하면 `blocked`로 표시하고 공통 규칙 2에 따라 멈춘다.
7. 선택한 Task를 **implement**한다: `/implement-task <Task ID>`와 동일한 절차(Expected Files 범위, Functional/Visual/Security AC, Page Owner는 조립만, 금지 항목 준수)를 그대로 수행한다. 이 문서는 그 절차를 다시 설명하지 않는다.
   - `/implement-task` 1단계는 별도의 `/prepare-task` 명령이 `READY_TO_IMPLEMENT`로 표시했는지 확인하라고 되어 있으나, 이 프로젝트에는 `/prepare-task` 명령 파일이 따로 없다(6단계의 prepare 검사가 그 역할을 대신한다). `/run-wave`가 호출하는 경우, 6단계에서 이 Task를 `in_progress`로 표시한 것 자체가 `READY_TO_IMPLEMENT` 조건을 충족한 것으로 간주한다.
8. 공통 규칙 3에 따라 최소 검증을 실행한다. 전부 PASS하면 Task를 `completed`로 갱신한다. 하나라도 FAIL이면 Task를 `in_progress`로 남기고, 원인과 함께 멈춘다 — 다음 Task로 넘어가 실패를 덮지 않는다.
9. 방금 완료한 Task 덕분에 새로 선택 가능해진 `pending` Task가 있으면 5단계로 돌아간다.
10. 이 Wave의 모든 Task가 `completed`이면: `checkpoint_required`가 `false`면 Wave `status`를 즉시 `completed`로 기록하고 종료 보고를 낸다. `true`면 "Browser Checkpoint 처리" 절차를 수행한다.

### `/run-wave <WAVE_ID> --resume`

1~4단계는 기본 동작과 동일하게 수행한다(계획/상태 읽기, 이전 Wave 완료 확인, `tasks` 초기화, blocked 검사).
5. 이 Wave의 Task 중 `status: in_progress`로 남아 있는 것이 있는지 확인한다 — 이전 실행이 중간에 끊겼다는 뜻이다. 있다면 그 Task ID와 함께 "이전 실행이 중단된 것으로 보인다. 실제로 완료됐는지 확인 전 다시 시도한다"를 알리고, `git status`로 그 Task의 `Expected Files`에 걸쳐 있는 미커밋 변경이 있는지 먼저 확인한 뒤 6단계로 진행한다(기존 변경을 함부로 덮어쓰지 않는다).
6. 이후로는 기본 동작의 5~10단계와 동일하게 이어서 진행한다.

## 종료 보고

모든 호출(`--status`/`--dry-run` 포함)은 다음 5가지를 보고한다. 실행하지 않은 항목은 "해당 없음"으로 명시한다.

1. **완료 Task** — 이번 호출에서 실제로 `completed`로 바뀐 Task ID 목록(`--status`/`--dry-run`은 항상 "해당 없음")
2. **변경 파일** — 실제로 생성·수정한 파일 경로(`--status`/`--dry-run`은 "해당 없음")
3. **통과한 검사** — 실행하고 PASS한 Unit Test/Playwright 목록(`--status`/`--dry-run`은 "해당 없음", 대신 `--dry-run`은 "실행됐을 검사" 목록으로 대체)
4. **남은 수동 Browser 확인** — 아직 `checkpoint_result`가 없는 Wave/Screen 목록(이번 Wave 포함, 전체 현황)
5. **다음에 입력할 명령** — 예: `/run-wave W05`(다음 Wave 시작), `/run-wave W04 --resume`(이 Wave 이어서), 또는 사람의 Preview 확인 응답 대기 중이면 그 사실
