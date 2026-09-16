# Free Traveler — Project State

- **Document ID:** STATE-TRAVEL-001
- **최종 갱신 근거:** 실제 `package.json`, `TASKS/`, `.github/`, `.env*`, `git log` 확인 결과(구현 착수 전 초기 상태)
- **갱신 방법:** 이 문서는 `/run-wave`, `/implement-task`, `/release-check` 실행 후 그 결과를 반영해 사람 또는 해당 명령이 갱신한다. 실제로 확인하지 않은 값을 추측해 채우지 않는다.

| 필드 | 값 |
|---|---|
| **Harness Schema** | `traveler-screen-route-v1` |
| **Design Version** | `D-001`(Status: LOCKED, `design-reference/DESIGN_MANIFEST.md`) |
| **Scope Mode** | CONFIRMED — `docs/PROJECT_SCOPE.md` 기준 114개 Requirement 중 96 IMPLEMENT* / 18 EXCLUDED로 확정, 이후 임의 변경 없음 |
| **Current Wave** | NOT_STARTED — `TASKS/WAVE_PLAN.md`, `TASKS/WAVE_STATE.md` 아직 생성되지 않음(`/run-wave` 최초 실행 시 생성 대상) |
| **Current Task** | NONE — 아직 어떤 Task도 `READY_TO_IMPLEMENT`/`IN_PROGRESS`로 전이되지 않음 |
| **Completed Tasks** | 0 / 63 — `TASKS/00_TASK_LIST.md`의 Task 63개 중 실제 코드로 구현된 것 없음(`src/app`에는 App Router 기본 골격(`page.tsx`, `layout.tsx`, `globals.css`, `favicon.ico`)만 존재) |
| **Blocked Tasks** | 형식상 BLOCKED로 표시된 Task는 없음(Wave 미착수). 다만 `docs/ARCHITECTURE.md` §17에 기록된 선행 조건(`@supabase/supabase-js`·`@supabase/ssr`·`vitest`·`@playwright/test` 미설치, `.env` 계열 파일 없음, `supabase/`·`.github/workflows/` 디렉터리 없음, git remote 미설정)이 해소되기 전에는 `DB-SCHEMA-BASE`, `CMP-SCR005-AUTH` 등 다수 Task가 착수 시 곧바로 막힐 것으로 예상됨 |
| **Latest CI** | N/A — `.github/workflows/` 디렉터리 자체가 없어 실행된 CI 없음 |
| **Supabase State** | NOT_PROVISIONED — `supabase/` 디렉터리 없음, Supabase 프로젝트 연결·환경변수(`NEXT_PUBLIC_SUPABASE_URL` 등) 없음, 6개 테이블 중 생성된 것 없음 |
| **Vercel Preview URL** | NONE — git remote 미설정, Vercel 프로젝트 연결 없음 |
| **Screen Checkpoints** | SCR-001 `/`: PENDING · SCR-002 `/about`: PENDING · SCR-003 `/travel-tools`: PENDING · SCR-004 `/mates`: PENDING · SCR-005 `/account`: PENDING · FINAL: PENDING |
| **Playwright State** | NOT_INSTALLED — `@playwright/test` 미설치, `E2E-PUBLIC-SMOKE`/`E2E-TRAVEL-TOOLS`/`E2E-MATE-AUTH` 실행 기록 없음 |
| **Deferred Items** | EXCLUDED 18건(`docs/PROJECT_SCOPE.md` §3, `TASKS/00_TASK_LIST.md` §3 NON_IMPLEMENTATION 참조) — CMS, 미디어 업로드 승인, 범용 감사 로그, 자동 백업·장애 알림, 신고 SLA 자동 측정, rate limit, 구조화 로그, Lighthouse CI 게이트 등. 구현 범위로 복원하려면 `docs/PROJECT_SCOPE.md`를 먼저 갱신해야 한다(임의 복원 금지) |
| **Next Action** | 1) `docs/ARCHITECTURE.md` §17의 착수 차단 항목(의존성 설치, `.env.local` 구성, `supabase/` 초기화, `.github/workflows/` 워크플로 작성, git remote 연결) 해소 → 2) `/run-wave`로 `TASKS/WAVE_PLAN.md`/`TASKS/WAVE_STATE.md` 생성 및 검토 → 3) `/run-wave W01` 착수 |

## Screen Checkpoint 세부 규칙

- 각 Screen Checkpoint는 해당 Screen의 Page Owner Wave가 `DONE`이 되고 사람이 실제 Preview를 확인해야 `PENDING` → `CONFIRMED`로 전이한다(`CLAUDE.md` 규칙 22, `run-wave` §8 `WAITING_FOR_PREVIEW`).
- `FINAL` Checkpoint는 5개 Screen Checkpoint가 모두 `CONFIRMED`이고 `/release-check`가 `RELEASE_READY`를 반환해야 `PENDING` → `CONFIRMED`로 전이한다.
- 이 문서에서 Checkpoint 값을 직접 손으로 `CONFIRMED`로 바꾸지 않는다 — 위 조건이 실제로 충족된 뒤 `/run-wave` 또는 `/release-check` 실행 결과를 반영해서만 바꾼다.
