---
name: traveler-project-pipeline
description: Traveler PRD/SRS에서 Task를 생성·상세화·감사하고 5개 Screen과 Wave 개발을 지원하는 프로젝트 Skill
---

# Traveler Project Pipeline

이 Skill은 루트 `CLAUDE.md`의 전역 규칙을 전제로 한다. 이 문서의 어떤 내용도 `CLAUDE.md`의 Harness Marker(`HARNESS_SCHEMA=traveler-screen-route-v1`, `AUTO_MERGE=false`, `AWS_ENABLED=false`, `PLAYWRIGHT_SCOPE=chromium-smoke` 등)나 필수 규칙 1~23을 재정의하지 않는다. 둘이 어긋나면 `CLAUDE.md`가 우선한다.

---

## 1. 입력 문서 목록

Task를 생성·상세화·감사할 때 아래 문서만 정본으로 읽는다. 이 목록 밖의 문서에서 새 규칙을 끌어오지 않는다.

| 문서 | 역할 |
|---|---|
| `docs/06_SRS_UIUX_REVISED.md` | SRS 정본 — Requirement 원문, Route 통합 근거, Release Acceptance Criteria |
| `docs/PROJECT_SCOPE.md` | Scope 분류 정본 — REQ별 IMPLEMENT/EXCLUDED, 처리 방법, 확인 방법 |
| `docs/UIUX_TRACEABILITY.md` | REQ × Screen × Route × Page Entry × Test 전체 매트릭스 |
| `design-reference/D-001/DESIGN.md` | 디자인 정본(LOCKED) — 토큰, 컴포넌트 규칙, Do/Do Not, Empty State 규칙 |
| `design-reference/UI_CONTRACT.md` | Screen별 영역 순서·컴포넌트·상태·이동·금지 기능(프로즈) |
| `design-reference/SCREEN_ROUTE_CONTRACT.json` | Screen·Route·Page Entry·Section 순서·최소 콘텐츠 수 계약(JSON 정본) |
| `TASKS/00_TASK_LIST.md` | Task List, NON_IMPLEMENTATION 표, Requirement Coverage 표 |
| `TASKS/TASK-*.md` | Task별 상세 파일 |
| `TASKS/TASK_MANIFEST.csv`, `TASKS/TASK_AUDIT_REPORT.md` | `scripts/audit_tasks.py` 산출물(감사 결과) |
| `scripts/validate_inputs.py`, `scripts/audit_tasks.py` | 입력 검증·출력 감사 스크립트 |

---

## 2. 5개 Screen과 Page Entry

Screen 목록은 정확히 5개이며 `design-reference/SCREEN_ROUTE_CONTRACT.json`이 유일한 소스다.

| Screen | 구분 | Route | Page Entry |
|---|---|---|---|
| SCR-001 | 핵심 | `/` | `src/app/page.tsx` |
| SCR-002 | 보조 | `/about` | `src/app/about/page.tsx` |
| SCR-003 | 핵심 | `/travel-tools` | `src/app/travel-tools/page.tsx` |
| SCR-004 | 핵심 | `/mates` | `src/app/mates/page.tsx` |
| SCR-005 | 핵심 | `/account` | `src/app/account/page.tsx` |

5개를 넘는 공개 Route(여행지 상세, 안전정보, 동행 상세 등의 개별 페이지)를 새로 만들지 않는다. 그런 콘텐츠는 SCR-001의 Drawer/Modal 또는 SCR-004의 상세 패널로 흡수한다.

---

## 3. IMPLEMENT·EXCLUDED 상태 처리 규칙

- 모든 Requirement(`REQ-FUNC-001~080`, `REQ-NF-001~034`, 총 114개)는 `docs/PROJECT_SCOPE.md`에서 부여받은 상태(`IMPLEMENT`, `IMPLEMENT(축소)`, `IMPLEMENT(최선노력)`, `IMPLEMENT(목표)`, `EXCLUDED`)를 그대로 승계한다.
- `IMPLEMENT` 계열: `TASKS/00_TASK_LIST.md` §4 Requirement Coverage에서 실제 존재하는 Task ID를 가리켜야 한다.
- `EXCLUDED`: `TASKS/00_TASK_LIST.md` §3 NON_IMPLEMENTATION 표에 근거·후속 방향과 함께 남기고, §4 Requirement Coverage에서는 Task 열에 `§3 NON_IMPLEMENTATION 참조`(또는 동등 표기)만 남긴다. **삭제하지 않는다.**
- 어떤 상태도 이 Skill 실행 중에 임의로 바꾸지 않는다. 상태를 바꿔야 한다고 판단되면 먼저 `docs/PROJECT_SCOPE.md`를 갱신하도록 사람에게 확인을 구한다(§11 참조).

---

## 4. Task List·상세 Task 형식

**`TASKS/00_TASK_LIST.md`** — 16열 표 하나로 구성한다: `Seq, Task ID, 제목, Category, Implementation Status, Requirement Ref, Screen, Route, Page Entry, Depends On, Expected Files, Functional AC, Visual AC, Security/Privacy AC, Verify, Priority`. Category는 `PAGE_OWNER / COMPONENT / DATA / DB / API / CI_OPS / MANUAL / RELEASE / TEST_UNIT / TEST_RLS / TEST_E2E` 중 하나다. 이 표 다음에 §3 NON_IMPLEMENTATION 표와 §4 Requirement Coverage 표를 둔다.

**`TASKS/TASK-<Task ID>.md`** — Task List의 각 행과 정확히 1:1로 대응하며, 아래 14개 절을 이 순서로 포함한다:

```
Context, Project Scope, Requirement Ref, Screen / Route / Page Entry,
Design Ref, Depends On, Expected Files, Functional AC, Visual AC,
Security/Privacy AC, Test Cases, Verify, Definition of Done, Forbidden
```

Task List에 없는 ID로 상세 파일을 만들지 않고(고아 파일 금지), Task List에 있는데 상세 파일이 없는 행을 남기지 않는다. `scripts/audit_tasks.py`의 검사 1이 이 1:1 관계를 강제한다.

---

## 5. Page Owner·Component 분리 규칙

- **Page Owner**(`Category: PAGE_OWNER`): Screen당 정확히 1개. 자신의 `Page Entry`(`page.tsx`)에서 이미 만들어진 Component/Data/API Task의 결과물을 **조립만** 한다. Page Owner Task 안에서 새 Component를 직접 만들지 않는다(`CLAUDE.md` 규칙 9와 동일).
- **Component**(`Category: COMPONENT`): 하나의 Section·패널·폼 등 단일 책임 단위를 구현한다. 자신이 속한 Screen을 `Screen` 열에 명시한다. 여러 Screen에 공통으로 쓰이는 것은 `CMP-GLOBAL-*`로 분리한다.
- 의존 방향은 항상 **Component → Page Owner**다. Component가 Page Owner에 의존하지 않는다.
- Page Owner의 `Depends On`에는 반드시 같은 Screen의 Component Task가 최소 1개 포함되어야 한다(Component-only Screen이 되지 않도록, 그리고 Page Owner가 의존 없이 혼자 완성되지 않도록).

---

## 6. DB 6개 Table과 정적 Data 경계

- Supabase 동적 테이블은 정확히 6개로 제한한다: `user_profiles`, `mate_posts`, `mate_applications`, `user_blocks`, `reports`, `app_settings`. 이 allowlist를 넘는 테이블(`audit_log`, `media_asset` 등)을 추가하지 않는다.
- 여행지·국가 안전정보·`free_traveler` 대표 프로필은 DB 테이블이 아니라 `src/data/**/*.ts` 정적 데이터로 관리한다(`Category: DATA` Task).
- 정적 데이터와 DB의 경계를 섞지 않는다 — 정적 데이터를 DB로 옮기거나, DB에 넣어야 할 사용자 생성 콘텐츠(동행글 등)를 정적 데이터로 처리하지 않는다.

---

## 7. 외부 입력 비저장 불변조건

SCR-003 항공·숙소 탭의 입력값(국가·지역·날짜)은 다음 불변조건을 지킨다:

- Client Component의 컴포넌트 상태로만 존재한다.
- 서버 API·Server Action, DB, 외부 이동 URL의 query string, 서버 로그, 분석 이벤트 어디에도 전달하지 않는다.
- 이 조건은 모든 관련 Task의 `Security/Privacy AC`와 `Forbidden`에 명시되어야 하며, `scripts/audit_tasks.py`가 이를 정적으로 검사한다.

---

## 8. 기본 Auth·성인·RLS 규칙

- Auth(로그인/가입/비밀번호 재설정)는 Supabase Auth로만 처리한다.
- 동행 쓰기 기능은 성인 확인(`is_adult`, `adult_verified_at`)을 통과한 사용자만 이용한다. 정확한 생년월일은 저장하지 않는다.
- 6개 테이블 전부에 RLS를 활성화하며, 원칙은 **본인 데이터는 본인만 쓰고, 관련자는 관련 데이터만 읽고, Moderator/Admin은 운영에 필요한 범위만 넘본다**로 단순하게 유지한다. 복잡한 다단계 정책·커스텀 함수 체계를 만들지 않는다.
- `service_role` 키는 서버 전용 스크립트에서만 쓰며 어떤 Client 코드에도 노출하지 않는다(`CLAUDE.md` 규칙 15와 동일).

---

## 9. Playwright Chromium Smoke 범위

- Playwright는 `Category: TEST_E2E` Task로만 존재하며 Chromium 단일 브라우저 Smoke Test로 한정한다.
- 핵심 흐름을 2~3개 Task로 묶는다(예: `E2E-PUBLIC-SMOKE`, `E2E-TRAVEL-TOOLS`, `E2E-MATE-AUTH`).
- Firefox/WebKit 등 다중 브라우저 프로젝트나 전체 회귀 스위트를 추가하지 않는다.

---

## 10. Wave 내부 순차 실행

- 실제 구현은 Task 단위가 아니라 **Wave** 단위(`/run-wave WXX`, `CLAUDE.md` 규칙 6)로 진행한다.
- Wave 내부 Task는 `Depends On` 순서를 따르며 한 번에 하나의 Task만 구현한다(`CLAUDE.md` 규칙 7). 이 Skill은 여러 Task를 동시에 병렬로 진행하도록 지시하지 않는다.
- 각 Task는 자신의 `Expected Files` 밖을 수정하지 않는다(`CLAUDE.md` 규칙 8). Page Owner Wave가 끝나면 사람의 Preview 확인을 기다린 뒤 다음 화면 Wave로 진행한다(`CLAUDE.md` 규칙 22).

---

## 11. EXCLUDED 보호

- `docs/PROJECT_SCOPE.md`에서 `EXCLUDED`로 분류된 Requirement는 이 Skill의 어떤 단계에서도 상세 구현 Task를 만들지 않는다.
- EXCLUDED Requirement ID를 파일명으로 삼는 `TASKS/TASK-<REQ-ID>.md` 같은 파일이 생성되어서는 안 된다(`scripts/audit_tasks.py` 검사 18).
- EXCLUDED 항목을 "구현하면 더 좋을 것 같다"는 판단만으로 되살리지 않는다. 되살려야 한다면 먼저 `docs/PROJECT_SCOPE.md`를 갱신하고, `TASKS/00_TASK_LIST.md` §3/§4를 함께 고친 뒤에만 새 Task를 만든다(`CLAUDE.md` 규칙 19와 동일).

---

## 12. AWS·EC2·자동 Merge 금지

- 인프라는 Vercel과 Supabase만 사용한다. AWS, EC2, Lambda, S3 등을 구현하는 Task를 만들지 않는다(`CLAUDE.md`의 `AWS_ENABLED=false`).
- Prisma 등 ORM을 추가하지 않는다 — Supabase 클라이언트를 직접 사용한다.
- PR 자동 생성·자동 Merge·Merge Queue 자동화를 실행하는 Task를 만들지 않는다(`CLAUDE.md`의 `AUTO_MERGE=false`). Merge는 항상 사람이 수동으로 한다.
- `scripts/audit_tasks.py` 검사 16이 Task 제목·상세 파일에서 이 항목들이 "금지" 문맥 없이(즉, 실제로 쓰겠다는 의미로) 등장하는지 스캔한다.
