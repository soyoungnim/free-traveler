# Free Traveler — Decision Log

- **Document ID:** DECLOG-TRAVEL-001
- **목적:** 이 프로젝트 진행 중 확정된 결정을 시간순으로 기록한다. 결정을 뒤집으려면 새 DEC 항목을 추가해 이전 항목을 대체하고, 기존 항목을 삭제하지 않는다.

각 항목은 **결정 / Why / 근거 문서 / Status**로 기록한다. Status는 `CONFIRMED`(현재 유효) 또는 `SUPERSEDED`(다른 DEC로 대체됨, 대체한 DEC ID 표기)만 사용한다.

---

## DEC-001 — 실제 개발 루트는 `traveler/app`

- **결정:** 이 리포지토리의 실제 Next.js 개발 루트는 `traveler/app`이다. 문서·Task·스크립트의 모든 상대 경로(`src/app/...`, `docs/...`, `design-reference/...`, `TASKS/...`, `scripts/...`)는 이 루트 기준이다.
- **Why:** 프로젝트 상위 폴더(`traveler/`)에 앱이 아닌 다른 자료가 함께 있을 수 있어, 경로 혼동을 막기 위해 개발 루트를 명시적으로 고정할 필요가 있었다.
- **근거 문서:** 현재 작업 디렉터리 구조(`package.json`, `src/app` 위치)
- **Status:** CONFIRMED

## DEC-002 — 디자인 Screen은 핵심 4개·보조 1개

- **결정:** 디자인 Screen은 정확히 5개(SCR-001~005)로 고정하며, 그중 SCR-001·SCR-003·SCR-004·SCR-005를 핵심, SCR-002(`/about`)를 보조로 분류한다.
- **Why:** 원래 SRS 기준 15개 이상의 개별 Route를 그대로 화면화하면 유지보수·디자인 일관성 비용이 커진다. 열람 전용인 대표 소개(SCR-002)만 다른 화면의 기능 수행에 필수적이지 않아 보조로 분류하고, 나머지는 서비스의 핵심 플로우(탐색→준비→연결→계정)를 구성하므로 핵심으로 분류했다.
- **근거 문서:** `docs/04_UIUX_PLAN.md`, `docs/05_UIUX_APPROVED.md`, `design-reference/UI_CONTRACT.md` §핵심 4개·보조 1개 구분
- **Status:** CONFIRMED

## DEC-003 — `/travel-tools`에 항공·숙소·동행 작성을 통합

- **결정:** 항공(`/flights`), 숙소(`/hotels`), 동행 작성(`/mates/new`)을 별도 Route로 두지 않고 `/travel-tools`(SCR-003) 하나의 화면에 세 탭으로 통합한다. 각 탭은 입력·검증·완료 상태를 서로 완전히 분리해 보관한다.
- **Why:** 세 기능 모두 "여행을 준비하는 조건을 정리한다"는 동일한 사용자 목표를 공유하며, 화면 수를 5개로 제한하는 결정(DEC-002)과 맞물려 통합이 필요했다.
- **근거 문서:** `docs/06_SRS_UIUX_REVISED.md` §2 UI Route Contract, `design-reference/SCREEN_ROUTE_CONTRACT.json`(SCR-003 `tab_state_isolation_required`), `docs/ARCHITECTURE.md` §4
- **Status:** CONFIRMED

## DEC-004 — 여행지·안전·대표는 정적 TypeScript Data

- **결정:** 여행지, 국가 안전정보, `free_traveler` 대표 프로필 콘텐츠는 Supabase 테이블이 아니라 `src/data/**/*.ts` 정적 데이터로 관리한다. 관리자 CRUD·CMS 화면을 만들지 않는다.
- **Why:** 콘텐츠 게시 빈도가 낮고 편집자가 소수(개발자 본인)라, 별도 CMS·게시 워크플로를 구축하는 비용이 가치보다 크다고 판단했다.
- **근거 문서:** `docs/PROJECT_SCOPE.md` §2·§3, `docs/ARCHITECTURE.md` §6, `TASKS/TASK-DATA-DESTINATIONS.md` 외 DATA 계열 Task
- **Status:** CONFIRMED

## DEC-005 — Supabase는 Auth와 동행 기능 중심

- **결정:** Supabase는 이메일 인증·로그인(Auth)과 동행(모집글·참가 요청·차단·신고·관리자 설정) 기능에만 사용한다. 여행지·안전·대표 조회(DEC-004)와 항공·숙소 폼(DEC-007)은 Supabase를 거치지 않는다.
- **Why:** 서비스의 동적 상태(사용자 계정, 동행 상호작용)만 실제 DB가 필요하고, 나머지는 정적 콘텐츠거나 서버에 저장하지 않는 입력이기 때문이다.
- **근거 문서:** `docs/ARCHITECTURE.md` §7
- **Status:** CONFIRMED

## DEC-006 — DB는 6개 Table로 제한

- **결정:** Supabase에는 정확히 6개 테이블(`user_profiles`, `mate_posts`, `mate_applications`, `user_blocks`, `reports`, `app_settings`)만 만든다. `audit_log`, `media_asset` 등 범용 감사 로그·미디어 관리 테이블은 추가하지 않는다.
- **Why:** DEC-005의 범위(Auth+동행)를 넘는 데이터를 담을 테이블이 필요 없고, 범용 감사 로그·미디어 승인 워크플로는 `docs/PROJECT_SCOPE.md`에서 이미 EXCLUDED로 확정됐다(DEC-014).
- **근거 문서:** `docs/PROJECT_SCOPE.md`, `docs/ARCHITECTURE.md` §8, `TASKS/TASK-DB-SCHEMA-BASE.md`, `scripts/audit_tasks.py`(check 12 DB Table 범위)
- **Status:** CONFIRMED

## DEC-007 — 항공·숙소 입력은 Browser Memory에만 유지

- **결정:** SCR-003 항공·숙소 탭의 입력값(국가·지역·날짜)은 Client Component의 컴포넌트 상태로만 유지한다. 서버 API/Server Action, DB, 외부 이동 URL의 query string, 서버 로그·분석 이벤트 어디에도 보내지 않는다.
- **Why:** 사용자가 조건을 정리하는 행위 자체에 가치가 있을 뿐, 이 서비스는 실시간 검색·예약을 제공하지 않으므로 입력값을 영속화할 이유가 없다. 개인정보 최소 수집 원칙과도 일치한다.
- **근거 문서:** `docs/06_SRS_UIUX_REVISED.md`(REQ-FUNC-017·025, CON-01·CON-02 승계), `docs/ARCHITECTURE.md` §4·§5, `TASKS/TASK-CMP-SCR003-FLIGHT-TAB.md`·`TASKS/TASK-CMP-SCR003-HOTEL-TAB.md`
- **Status:** CONFIRMED

## DEC-008 — Airbnb `DESIGN.md`는 vendor 참고본, D-001이 실제 정본

- **결정:** `design-reference/vendor/airbnb/DESIGN-airbnb.md`는 구조·톤 참고 전용이며, 실제 디자인 정본은 `design-reference/D-001/DESIGN.md`(Status: LOCKED)다. Airbnb의 로고·워드마크·컬러 값(`#ff385c` 등) 등 상표 요소는 그대로 가져오지 않는다.
- **Why:** Airbnb 참고본의 "여백·카드·pill 검색바" 같은 구조적 톤은 벤치마킹할 가치가 있지만, 상표·컬러를 그대로 쓰면 상표권 문제와 "Airbnb 복제" 인상을 준다. Free Traveler 고유 토큰(코랄 `#FF6B4A` 등)으로 재정의해 정본을 별도로 둔다.
- **근거 문서:** `design-reference/DESIGN_MANIFEST.md`, `design-reference/D-001/DESIGN.md`
- **Status:** CONFIRMED

## DEC-009 — Playwright는 Chromium Smoke만 필수

- **결정:** Playwright E2E 테스트는 Chromium 단일 브라우저 기준의 핵심 흐름 Smoke Test 2~3개(`E2E-PUBLIC-SMOKE`, `E2E-TRAVEL-TOOLS`, `E2E-MATE-AUTH`)로 한정한다. Firefox/WebKit 등 다중 브라우저 매트릭스나 전체 회귀 스위트는 만들지 않는다.
- **Why:** MVP 단계에서 브라우저 호환성 전수 검증보다 핵심 사용자 플로우가 깨지지 않는지 빠르게 확인하는 것이 우선이며, 다중 브라우저 매트릭스는 유지비용 대비 가치가 낮다고 판단했다.
- **근거 문서:** `docs/PROJECT_SCOPE.md`, `docs/ARCHITECTURE.md` §12, `scripts/audit_tasks.py`(check 15 Playwright Chromium Smoke Task 존재)
- **Status:** CONFIRMED

## DEC-010 — 사용자의 개발 실행 단위는 Wave

- **결정:** 실제 구현은 `TASKS/00_TASK_LIST.md`의 개별 Task를 하나씩 실행하지 않고, 서로 의존관계가 해소된 Task들을 묶은 **Wave** 단위로 실행한다(예: DB 기반 Wave → Data/공통 컴포넌트 Wave → Page Owner Wave → Test Wave).
- **Why:** 63개 Task를 순서 없이 나열하면 의존성 순서를 매번 사람이 다시 계산해야 한다. Task의 `Depends On` 그래프를 layer로 묶어 Wave화하면 각 Wave 착수 시점에 선행 Task가 모두 끝났는지만 확인하면 된다.
- **근거 문서:** `TASKS/00_TASK_LIST.md`(Depends On 열), `TASKS/TASK_MANIFEST.csv`, `scripts/audit_tasks.py`(check 4 Dependency Cycle 0)
- **Status:** CONFIRMED

## DEC-011 — Single Agent가 Wave 내부 Task를 순차 수행

- **결정:** 하나의 Wave 내부 Task들은 여러 Agent가 동시에 병렬로 처리하지 않고, **단일 Agent가 순차적으로** 수행한다.
- **Why:** Task 간 파일 경합(같은 컴포넌트 디렉터리, 같은 `page.tsx`)과 컨텍스트 유실 위험을 줄이기 위해서다. 각 Task의 `Expected Files`가 좁게 정의되어 있어(선행 작업에서 확정) 순차 수행으로도 병목이 크지 않다고 판단했다.
- **근거 문서:** `TASKS/TASK-*.md`의 `Expected Files`/`Forbidden`(Expected Files 밖 수정 금지 원칙)
- **Status:** CONFIRMED

## DEC-012 — PR·Merge는 사용자가 수동 수행

- **결정:** Pull Request 생성과 Merge는 Agent가 자동으로 수행하지 않고 사용자가 직접 검토 후 수동으로 수행한다.
- **Why:** 자동 Merge는 되돌리기 어려운 변경을 사람의 검토 없이 반영할 위험이 있다. DEC-015(자동 Merge 미사용)와 같은 원칙선상에서, 실행 주체(Agent)와 병합 승인 주체(사용자)를 분리했다.
- **근거 문서:** `docs/ARCHITECTURE.md` §15(자동 Merge 미사용)
- **Status:** CONFIRMED

## DEC-013 — EC2·AWS는 사용하지 않음

- **결정:** 컴퓨트·인프라는 Vercel(애플리케이션)과 Supabase(DB·Auth)만 사용한다. EC2, Lambda, S3 등 AWS 서비스나 다른 클라우드 VM은 이 프로젝트에 추가하지 않는다.
- **Why:** 두 플랫폼의 관리형 서비스만으로 MVP 요구사항을 전부 충족할 수 있고, 별도 클라우드 인프라를 구성·운영할 인력·비용이 없다.
- **근거 문서:** `docs/PROJECT_SCOPE.md` §3(EC2·AWS 인프라 제외 항목), `docs/ARCHITECTURE.md` §14, `scripts/audit_tasks.py`(check 16 AWS·EC2·자동 Merge 구현 Task 0)
- **Status:** CONFIRMED

## DEC-014 — 제외 기능은 EXCLUDED로 관리

- **결정:** SRS의 REQ-FUNC-001~080·REQ-NF-001~034 중 구현하지 않기로 한 항목은 삭제하지 않고 `EXCLUDED` 상태로 표시해 추적표에 남긴다(현재 18건: REQ-FUNC 7건, REQ-NF 11건). 각 EXCLUDED 항목에는 근거와 후속 방향을 함께 기록한다.
- **Why:** 요구사항을 삭제하면 "왜 없는지"에 대한 기록이 사라져 나중에 같은 논의를 반복하게 된다. 상태만 EXCLUDED로 바꾸고 근거를 남기면, 범위가 왜 이렇게 정해졌는지 추적 가능하고 필요 시 재검토 대상도 명확하다.
- **근거 문서:** `docs/PROJECT_SCOPE.md` §4, `docs/UIUX_TRACEABILITY.md`, `TASKS/00_TASK_LIST.md` §3 NON_IMPLEMENTATION, `scripts/audit_tasks.py`(check 17·18)
- **Status:** CONFIRMED
