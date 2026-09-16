# SRS Revision — UI/UX Screen Consolidation (Free Traveler)

- **Document ID:** SRS-TRAVEL-001-R1
- **Amends:** `02_SRS_BASELINE.md` (SRS-TRAVEL-001 v1.0) §3.5 Page and Route Inventory, §3.6 Use Cases
- **Does not amend:** §1~§2, §4 Specific Requirements(REQ-FUNC/REQ-NF 원문), §5 Traceability Matrix 원본, §6 Appendix Data Model
- **기반 문서:** `PROJECT_SCOPE.md`, `03_UI_COVERAGE_ANALYSIS.md`, `design-reference/UI_CONTRACT.md`, `design-reference/SCREEN_ROUTE_CONTRACT.json`
- **상세 매트릭스:** `UIUX_TRACEABILITY.md` (REQ별 Screen·Route·Task·Test·Status 전체)

---

## 1. 개정 목적

`02_SRS_BASELINE.md` §3.5는 여행지·항공·호텔·동행·안전정보·대표소개·인증·마이페이지·관리자를 15개 이상의 개별 공개 Route로 정의했다. 이후 UI/UX 설계(`04_UIUX_PLAN.md`)와 Stitch 승인(`STITCH_VALIDATION_REPORT.md`)을 거쳐 **공개 Route를 5개 디자인 Screen(SCR-001~005)으로 통합**하기로 확정했다. 본 개정은 이 통합을 SRS에 반영한다.

**REQ-FUNC-001~080, REQ-NF-001~034는 한 건도 삭제하지 않는다.** 요구사항 원문과 우선순위는 `02_SRS_BASELINE.md` §4를 그대로 유지하며, 본 문서는 그 요구사항들이 "어느 Route/Screen에서 충족되는가"만 갱신한다.

---

## 2. 개정 §3.5 — Page and Route Inventory (UI Route Contract)

### 2-1. 승인된 디자인 Screen (5개)

| Screen ID | Route | Page Entry | 구분 | 통합된 기존 Route |
|---|---|---|---|---|
| SCR-001 | `/` | `src/app/page.tsx` | 핵심 | `/`, `/destinations`, `/destinations/domestic`, `/destinations/overseas`, `/destinations/[slug]`(→Drawer), `/safety`, `/safety/[countryCode]`(→Modal) |
| SCR-002 | `/about` | `src/app/about/page.tsx` | 보조 | `/about` |
| SCR-003 | `/travel-tools` | `src/app/travel-tools/page.tsx` | 핵심 | `/flights`, `/hotels`, `/mates/new`(작성 탭으로 통합) |
| SCR-004 | `/mates` | `src/app/mates/page.tsx` | 핵심 | `/mates`, `/mates/[id]`(→상세 패널) |
| SCR-005 | `/account` | `src/app/account/page.tsx` | 핵심 | `/auth/*`, `/my/*`, `/admin/*` |

- `/travel-tools`는 **항공·숙소·동행 작성** 3개 탭을 포함하며, 탭별 입력·검증·완료 상태는 서로 완전히 분리된다.
- `/account`는 **인증(로그인/가입)·프로필·내 활동·간단 관리자** 4개 역할별 영역을 포함하며, 역할에 없는 영역은 렌더링하지 않는다.
- `/destinations/[slug]`, `/safety/[countryCode]`의 개별 페이지는 폐기되고 SCR-001의 Drawer/Modal로 대체된다. `/mates/[id]`의 개별 페이지는 폐기되고 SCR-004의 상세 패널로 대체된다.

### 2-2. 기술 Route (디자인 Screen 수에 미포함)

| 유형 | Route | Page Entry |
|---|---|---|
| 인증 콜백 | `/auth/callback` | `src/app/auth/callback/route.ts` |
| API Route | `/api/mates`, `/api/mates/[id]/applications`, `/api/admin/reports`, `/api/admin/settings/outbound` | `src/app/api/**/route.ts` |
| Not Found | 전역 | `src/app/not-found.tsx` |
| 오류 처리 | 전역 | `src/app/error.tsx`, `src/app/global-error.tsx` |

정본은 `design-reference/SCREEN_ROUTE_CONTRACT.json`이며, 위 표와 값이 어긋나면 JSON을 우선한다.

### 2-3. Mobile 변형 승인 범위

`design-reference/DESIGN_MANIFEST.md` 기준으로 **SCR-001, SCR-003만** 390px Mobile 전용 승인 변형을 갖는다. SCR-002, SCR-004, SCR-005는 반응형 규칙(`design-reference/D-001/DESIGN.md`)을 따르되 별도 Mobile 승인 산출물이 요구되지 않는다.

---

## 3. 개정 §3.6 — Use Cases (Screen 매핑)

| Use Case | 원본 Requirement | 통합 전 Route | 개정 후 Screen |
|---|---|---|---|
| UC-01 여행지 검색·필터·상세 열람 | REQ-FUNC-001~010 | `/destinations*` | SCR-001 |
| UC-02 항공 조건 입력·요약·외부 이동 | REQ-FUNC-011~018 | `/flights` | SCR-003(항공 탭) |
| UC-03 호텔 조건 입력·요약·외부 이동 | REQ-FUNC-019~026 | `/hotels` | SCR-003(숙소 탭) |
| UC-04 동행 모집글 작성·마감 | REQ-FUNC-027~033, 037~038 | `/mates/new`, `/mates/[id]` | SCR-003(동행 작성 탭) / SCR-005(내 활동) |
| UC-05 동행 참가 요청·승인·거절 | REQ-FUNC-034~036, 043 | `/mates/[id]` | SCR-004 / SCR-005 |
| UC-06 신고·차단·운영 처리 | REQ-FUNC-039~045 | `/my/*`, `/admin/*` | SCR-004 / SCR-005 |
| UC-07 국가별 안전정보 확인 | REQ-FUNC-046~056 | `/safety*` | SCR-001(안전정보 Modal) |
| UC-08 대표 소개 확인 | REQ-FUNC-057~063 | `/about` | SCR-002 |
| UC-09 콘텐츠·외부 URL 관리 | REQ-FUNC-072~077 | `/admin/*` | SCR-005(관리자 탭)만 해당(072·073·075·076은 EXCLUDED — §4 참조) |

---

## 4. Requirement Disposition Statement (삭제 없음 확인)

아래는 REQ-FUNC-001~080, REQ-NF-001~034 **114개 전원**의 개정 후 배치 요약이다. 열은 ID / Implementation Status / Screen만 담으며, Route·Page Entry·Task·Test·Status의 전체 상세는 `UIUX_TRACEABILITY.md`를 정본으로 한다.

### REQ-FUNC (80)

| 범위 | Implementation Status | Screen |
|---|---|---|
| REQ-FUNC-001~007, 009, 010 | IMPLEMENT(007은 축소) | SCR-001 |
| REQ-FUNC-008 | IMPLEMENT | 배포 게이트(Screen 없음) |
| REQ-FUNC-011~016, 018 | IMPLEMENT(018은 축소) | SCR-003(항공 탭) |
| REQ-FUNC-017 | IMPLEMENT | 클라이언트 상태 정책(Screen 없음) |
| REQ-FUNC-019~024, 026 | IMPLEMENT(026은 축소) | SCR-003(숙소 탭) |
| REQ-FUNC-025 | IMPLEMENT | 클라이언트 상태 정책(Screen 없음) |
| REQ-FUNC-027 | IMPLEMENT | SCR-003(동행 작성 탭) |
| REQ-FUNC-028, 029 | IMPLEMENT | SCR-005(프로필 탭) |
| REQ-FUNC-030 | IMPLEMENT | SCR-004 |
| REQ-FUNC-031, 032 | IMPLEMENT | SCR-003(동행 작성 탭) |
| REQ-FUNC-033~035, 037, 039, 040 | IMPLEMENT | SCR-004 |
| REQ-FUNC-036, 038, 041, 042, 045 | IMPLEMENT(041·042·045는 축소) | SCR-005(내 활동/관리자 탭) |
| REQ-FUNC-043 | IMPLEMENT | SCR-004(+SCR-005) |
| REQ-FUNC-044 | IMPLEMENT | RLS 정책(Screen 없음) |
| REQ-FUNC-046 | IMPLEMENT | 콘텐츠 게이트(Screen 없음) |
| REQ-FUNC-047~054 | IMPLEMENT | SCR-001(안전정보 Modal) |
| **REQ-FUNC-055, 056** | **EXCLUDED** | 해당 없음 |
| REQ-FUNC-057~063 | IMPLEMENT(061은 축소) | SCR-002 |
| REQ-FUNC-064, 065, 079 | IMPLEMENT | 전역(공통 레이아웃/컴포넌트) |
| REQ-FUNC-066, 077 | IMPLEMENT | SCR-005 |
| REQ-FUNC-067~069 | IMPLEMENT | SCR-001(+069는 SCR-004) |
| REQ-FUNC-070 | IMPLEMENT | 메타데이터(Screen 없음) |
| **REQ-FUNC-071, 072, 073** | **EXCLUDED** | 해당 없음 |
| REQ-FUNC-074 | IMPLEMENT(축소) | 데이터 검증 스크립트(Screen 없음) |
| **REQ-FUNC-075, 076** | **EXCLUDED** | 해당 없음 |
| REQ-FUNC-078 | IMPLEMENT | 기술 Route(not-found/error) |
| REQ-FUNC-080 | IMPLEMENT | SCR-003(동행 작성 탭) |

### REQ-NF (34)

| 범위 | Implementation Status | Screen |
|---|---|---|
| REQ-NF-001~003, 005 | IMPLEMENT(최선노력) | Screen 없음(성능 목표) |
| REQ-NF-004 | IMPLEMENT | SCR-001(+SCR-004) |
| REQ-NF-006 | IMPLEMENT | SCR-001/SCR-002 이미지 적용 |
| **REQ-NF-007** | **EXCLUDED** | 해당 없음 |
| **REQ-NF-008~011** | **EXCLUDED** | 해당 없음 |
| REQ-NF-012~017 | IMPLEMENT | Screen 없음(서버·보안 정책) |
| REQ-NF-018 | IMPLEMENT(축소) | SCR-005(내 활동 탭) |
| REQ-NF-019 | IMPLEMENT | SCR-004 신고 폼 적용 |
| **REQ-NF-020~022** | **EXCLUDED** | 해당 없음 |
| REQ-NF-023 | IMPLEMENT(목표) | 전역(공통 컴포넌트) |
| REQ-NF-024, 025 | IMPLEMENT(축소) | QA 프로세스(Screen 없음) |
| REQ-NF-026~028 | IMPLEMENT(028은 축소) | 데이터 게이트/SCR-001 경고 UI |
| **REQ-NF-029** | **EXCLUDED** | 해당 없음 |
| REQ-NF-030 | IMPLEMENT | 전 Screen 메타데이터 |
| REQ-NF-031 | IMPLEMENT(축소) | 빌드 게이트(Screen 없음) |
| **REQ-NF-032, 033** | **EXCLUDED** | 해당 없음 |
| REQ-NF-034 | IMPLEMENT | Screen 없음(비용 목표) |

> **합계 검증:** REQ-FUNC 80 + REQ-NF 34 = 114. EXCLUDED 18건(REQ-FUNC 7건: 055·056·071·072·073·075·076 / REQ-NF 11건: 007·008·009·010·011·020·021·022·029·032·033). 나머지 96건은 IMPLEMENT 계열(전체 구현 또는 축소·최선노력·목표 조건부 구현)이다. 정확한 개별 목록과 사유는 `PROJECT_SCOPE.md` §3, §4와 `UIUX_TRACEABILITY.md`를 정본으로 한다. EXCLUDED로 표시된 요구사항은 **삭제된 것이 아니라 원문이 보존된 채 구현 범위에서 제외**된 것이며, PROJECT_SCOPE.md의 제외 사유를 그대로 승계한다.

---

## 5. Release Acceptance Criteria

본 개정판 기준으로 릴리스 가능 상태로 간주하려면 다음을 모두 충족해야 한다. 어느 하나라도 미충족이면 해당 범위는 `PENDING_IMPLEMENTATION`으로 유지하고 완료로 기록하지 않는다.

| # | 기준 |
|---|---|
| AC-1 | `UIUX_TRACEABILITY.md`의 Implementation Status가 EXCLUDED가 아닌 모든 행이 지정된 Test(Playwright/데이터 검증 스크립트/코드 리뷰 등)를 통과하고, 통과 근거가 있을 때만 Status를 `PENDING_IMPLEMENTATION`에서 상향한다. |
| AC-2 | `design-reference/SCREEN_ROUTE_CONTRACT.json` 기준 Route·Page Entry 중복이 없고, Screen 수가 정확히 5개다. |
| AC-3 | SCR-001, SCR-003의 Mobile(390px) 변형이 실제로 존재하고 Desktop과 동일한 Section 계약(`04_UIUX_PLAN.md`)을 충족한다. |
| AC-4 | `design-reference/D-001/DESIGN.md`의 Do Not 항목(Airbnb 상표, 구매·예약·결제 UI, Proprietary Font, 미등록 색상, 별점/신뢰도 배지, 미승인 신원 인증 표현)이 어떤 Screen에도 존재하지 않는다 — `STITCH_VALIDATION_REPORT.md`에 기록된 발견 사항이 모두 해소되어야 한다. |
| AC-5 | EXCLUDED로 표시된 15개 요구사항이 구현 범위로 임의 복원되지 않았다. 복원이 필요하면 `PROJECT_SCOPE.md`와 본 문서를 함께 갱신한 뒤에만 진행한다. |
| AC-6 | `/travel-tools`의 항공·숙소·동행 세 탭이 입력·검증·완료 상태를 독립적으로 유지함을 Playwright로 확인한다(탭 전환 시 값 혼입 없음). |
| AC-7 | `/account`가 Guest/Adult Member/Moderator·Admin 역할에 따라 해당 없는 영역을 렌더링하지 않음을 Playwright로 확인한다. |
| AC-8 | Stitch 프로젝트의 실제 화면 상태가 `design-reference/DESIGN_MANIFEST.md`의 `Approved Screens`/`Mobile Variants`와 1:1로 동기화되어 있다(중복 인스턴스 없음, 누락 Screen 없음). |
| AC-9 | 어떤 Task 문서·커밋 메시지·본 문서 갱신도 실제 코드가 존재하지 않는 요구사항을 `IMPLEMENTED`로 기록하지 않는다. |

---

## 6. 변경 이력

| 버전 | 내용 |
|---|---|
| SRS-TRAVEL-001 v1.0 | Baseline(`02_SRS_BASELINE.md`) — Route 15개 이상, Requirement 114개 정의 |
| SRS-TRAVEL-001-R1(본 문서) | Route를 5개 승인 Screen + 기술 Route로 통합. Requirement 원문·개수(114) 불변. Implementation Status는 `PROJECT_SCOPE.md` 승계. Release Acceptance Criteria 신설 |
