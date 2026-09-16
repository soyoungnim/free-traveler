---
description: 릴리스 전 7개 항목(Task/Wave 상태, Page Owner 5개, CI, Playwright Smoke, Supabase 6테이블·RLS, Vercel Preview, EXCLUDED 목록)을 실제 근거로 검사해 RELEASE_READY 또는 RELEASE_BLOCKED를 판정한다.
---

# /release-check

먼저 `traveler-project-pipeline` Skill과 루트 `CLAUDE.md`를 불러와 그 규칙을 그대로 따른다.

## 원칙

- 이 명령은 **판정만 한다.** 실패를 발견해도 코드·Task·상태 파일을 고치지 않는다. 부족한 항목은 `/run-wave`, `/implement-task`, 또는 사람이 처리하도록 넘긴다.
- 판정은 **실제로 확인한 근거**에만 기반한다. 근거 파일·명령 출력이 없는 항목은 "아마 됐을 것"으로 통과시키지 않고 그 항목을 `RELEASE_BLOCKED` 사유로 기록한다.
- 아무것도 자동으로 배포·병합·태그하지 않는다.

## 검사 7개

### 1. Task·Wave 상태

`TASKS/WAVE_STATE.md`(없으면 `TASKS/00_TASK_LIST.md`)를 실제로 읽는다. 모든 Wave가 `DONE`이고, `BLOCKED`이거나 `IN_PROGRESS`로 멈춰 있는 Task가 없어야 한다. 하나라도 `BLOCKED`/`IN_PROGRESS`/`PENDING`이면 그 Task ID와 Wave를 기록한다.

### 2. 5개 Page Owner DONE

`TASKS/00_TASK_LIST.md`에서 `Category: PAGE_OWNER`인 5개 Task ID(`PAGE-SCR001`~`PAGE-SCR005`)를 확인하고, `TASKS/WAVE_STATE.md`에서 5개 전부 `DONE`인지 확인한다. 5개 중 하나라도 `DONE`이 아니면 이 검사는 실패다.

### 3. CI PASS

`.github/workflows/`에 워크플로가 있는지, 그리고 `main`(또는 검사 대상 브랜치) 최신 커밋에 대한 실행 결과가 성공인지 실제로 확인한다(`gh run list --branch main --limit 1` 또는 동등한 방법). 워크플로 파일 자체가 없거나, 실행 기록을 찾을 수 없거나, 최신 결과가 실패/미실행이면 이 검사는 실패다. "로컬에서 lint가 통과했다"는 CI PASS의 근거로 인정하지 않는다.

### 4. Playwright Smoke PASS

`TASKS/00_TASK_LIST.md`의 `TEST_E2E` Task 3개(`E2E-PUBLIC-SMOKE`, `E2E-TRAVEL-TOOLS`, `E2E-MATE-AUTH`)가 `TASKS/WAVE_STATE.md`에서 `DONE`인지 확인하고, 실제 실행 기록(Playwright HTML 리포트, CI 로그, 또는 `npx playwright test` 실행 결과)이 있는지 확인한다. 세 Task 중 하나라도 실행 근거 없이 `DONE`으로만 표시돼 있으면 이 검사는 실패로 기록하고 그 사실을 명시한다(상태 표시만으로는 신뢰하지 않는다).

### 5. Supabase 6개 Table·기본 RLS 확인 기록

`DB-SCHEMA-BASE`, `DB-RLS-BASE`, `TEST-RLS-BASIC` Task가 `DONE`인지 확인하고, 실제로 Supabase 프로젝트에 정확히 6개 테이블(`user_profiles`, `mate_posts`, `mate_applications`, `user_blocks`, `reports`, `app_settings`)이 존재하고 RLS가 켜져 있는지에 대한 **확인 기록**(마이그레이션 적용 로그, `supabase db diff` 결과, 또는 사람이 남긴 확인 노트)을 찾는다. 기록이 없으면 "Task가 DONE으로 표시돼 있다"만으로 통과시키지 않고 이 검사를 실패로 기록한다.

### 6. Vercel Preview Checkpoint

`TASKS/WAVE_STATE.md`에서 `WAITING_FOR_PREVIEW`로 남아 있는 Wave가 없는지 확인한다. 화면(Screen) 완성 Wave마다 사람이 실제로 Preview를 확인했다는 기록(예: Wave 상태가 `WAITING_FOR_PREVIEW` → `DONE`으로 전이된 로그, 또는 사람의 확인 응답)이 있어야 한다. 확인 기록 없이 임의로 다음 단계로 넘어간 Wave가 있으면 실패로 기록한다.

### 7. EXCLUDED 목록

`TASKS/00_TASK_LIST.md` §3 NON_IMPLEMENTATION과 `docs/PROJECT_SCOPE.md`의 EXCLUDED 목록을 실제로 대조한다.

- 두 목록이 일치하는지(같은 REQ ID 집합) 확인한다.
- EXCLUDED였던 항목이 임의로 구현 Task로 복원되지 않았는지 확인한다(`docs/UIUX_TRACEABILITY.md` 또는 `TASKS/00_TASK_LIST.md` §4 Requirement Coverage와 교차 확인).
- 이 검사는 release를 막는 항목이 아니라 **EXCLUDED 현황을 그대로 보고**하는 항목이다 — 목록이 정확히 일치하면 통과, 불일치(무단 복원 또는 목록 누락)가 있으면 실패로 기록한다.

## 실행

1. 위 7개 검사를 순서대로 실제로 수행한다(추측하지 않는다). 가능하면 `python3 scripts/audit_tasks.py`를 함께 실행해 그 결과(특히 REQ 114개 커버리지, Page Owner 5개, DB 6테이블 검사)를 검사 2·5·7의 보조 근거로 인용한다.
2. 각 검사에 대해 `PASS` / `FAIL`과 그 근거(읽은 파일, 실행한 명령, 확인한 값)를 표로 정리한다.

## 판정

- **`RELEASE_READY`**: 7개 검사 전부 `PASS`. 이 경우에도 배포·태그·병합을 자동으로 수행하지 않는다 — 판정만 보고한다.
- **`RELEASE_BLOCKED`**: 7개 중 하나라도 `FAIL`. 실패한 검사 번호·제목·구체적 사유(어떤 파일/기록이 없거나 어떤 값이 기대와 다른지)를 전부 나열한다. "대체로 준비됐다" 같은 완화된 표현을 쓰지 않는다.

최종 보고는 반드시 `RELEASE_READY` 또는 `RELEASE_BLOCKED` 중 하나의 문자열로 끝맺는다.
