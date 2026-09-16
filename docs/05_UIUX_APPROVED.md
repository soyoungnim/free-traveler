# Free Traveler — UI/UX Approved Screens

- **Document ID:** UIUX-APPROVED-001
- **기반 문서:** `04_UIUX_PLAN.md`, `STITCH_VALIDATION_REPORT.md`, `design-reference/D-001/DESIGN.md`, `design-reference/DESIGN_MANIFEST.md`, `design-reference/UI_CONTRACT.md`, `design-reference/SCREEN_ROUTE_CONTRACT.json`
- **연결 문서:** `06_SRS_UIUX_REVISED.md`(요구사항 재배치), `UIUX_TRACEABILITY.md`(REQ별 전체 추적)

---

## 1. 승인 범위

디자인 정본 `design-reference/DESIGN_MANIFEST.md` 기준으로 다음이 승인 범위다.

| 항목 | 값 |
|---|---|
| Active Design Version | D-001 |
| Status | LOCKED |
| Approved Screens | SCR-001, SCR-002, SCR-003, SCR-004, SCR-005 (5개, 초과 생성 없음) |
| Mobile Variants | SCR-001, SCR-003 (390px) |

> Stitch 프로젝트(`https://stitch.withgoogle.com/projects/2159623832949402727`)의 실제 산출물은 이 승인 범위와 아직 1:1로 동기화되지 않았다(`STITCH_VALIDATION_REPORT.md` — SCR-001 5개 중복, SCR-002~005 미생성). 본 문서의 "승인"은 **디자인 정본·요구사항 배치 기준의 승인**이며, Stitch 산출물의 완결을 보증하지 않는다.

---

## 2. 기존 공개 Route → 5개 Screen 통합 매핑

| 기존 Route(`02_SRS_BASELINE.md` §3.5) | 통합 후 위치 |
|---|---|
| `/` | SCR-001 |
| `/destinations`, `/destinations/domestic`, `/destinations/overseas` | SCR-001(목록 Section) |
| `/destinations/[slug]` | SCR-001 여행지 상세 **Drawer/Modal** |
| `/safety`, `/safety/[countryCode]` | SCR-001 국가 안전정보 **Drawer/Modal** |
| `/flights` | SCR-003 **항공 탭** |
| `/hotels` | SCR-003 **숙소 탭** |
| `/mates` | SCR-004 |
| `/mates/[id]` | SCR-004 동행 상세 **패널**(Desktop 좌우 분할 / Mobile Drawer) |
| `/mates/new` | SCR-003 **동행 작성 탭** |
| `/about` | SCR-002 |
| `/auth/*` | SCR-005 **로그인/가입 탭** |
| `/my/*` | SCR-005 **내 활동 탭** |
| `/admin/*` | SCR-005 **간단 관리자 탭**(신고 상태·외부 URL만) |

---

## 3. UI Route Contract

정본은 `design-reference/SCREEN_ROUTE_CONTRACT.json`(`schema_version: traveler-screen-route-v1`)이다. 요약:

| Screen ID | Route | Page Entry | 구분 | Mobile 승인 |
|---|---|---|---|---|
| SCR-001 | `/` | `src/app/page.tsx` | 핵심 | O |
| SCR-002 | `/about` | `src/app/about/page.tsx` | 보조 | X |
| SCR-003 | `/travel-tools` | `src/app/travel-tools/page.tsx` | 핵심 | O |
| SCR-004 | `/mates` | `src/app/mates/page.tsx` | 핵심 | X |
| SCR-005 | `/account` | `src/app/account/page.tsx` | 핵심 | X |

**계약 조건**
- Route 중복 없음, Page Entry 중복 없음(SCREEN_ROUTE_CONTRACT.json `completion_conditions`로 검증됨).
- 모든 Screen: `page_owner_task_required: true`, `preview_required: true`.
- SCR-001만 `starter_template_forbidden: true` — `src/app/page.tsx`의 create-next-app 기본 콘텐츠를 남겨두면 승인 위반이다.
- 기술 Route(인증 콜백, API Route, not-found, error boundary)는 `technical_routes`에 별도 기록되며 5개 Screen 수에 포함되지 않는다.
- `required_navigation` 12건은 `04_UIUX_PLAN.md` §9 "화면 간 이동 요약"과 동일하며, Screen 간 이동은 이 목록을 벗어나지 않는다.

---

## 4. Release Acceptance Criteria

> 상세 근거와 개별 조건은 `06_SRS_UIUX_REVISED.md` §5에 있다. 여기서는 승인 문서 기준의 릴리스 게이트만 요약한다.

| # | 기준 | 근거 |
|---|---|---|
| RA-1 | Route/Page Entry 중복 0건, Screen 수 정확히 5개 | `SCREEN_ROUTE_CONTRACT.json` |
| RA-2 | SCR-001·SCR-003의 Mobile(390px) 변형이 Desktop과 동일한 Section 계약을 충족 | `04_UIUX_PLAN.md`, `DESIGN_MANIFEST.md` |
| RA-3 | `design-reference/D-001/DESIGN.md` Do Not 위반(Airbnb 상표, 구매·예약·결제 UI, Proprietary Font, 미등록 색상, 별점/신뢰도 배지, 미승인 신원 인증 표현) 0건 | `D-001/DESIGN.md`, `STITCH_VALIDATION_REPORT.md` |
| RA-4 | REQ-FUNC-001~080·REQ-NF-001~034 114건 전원이 `UIUX_TRACEABILITY.md`에 존재하며 삭제된 항목 없음 | `UIUX_TRACEABILITY.md` |
| RA-5 | EXCLUDED 18건이 구현 범위로 임의 복원되지 않음 | `PROJECT_SCOPE.md`, `06_SRS_UIUX_REVISED.md` |
| RA-6 | `/travel-tools` 세 탭(항공·숙소·동행)이 입력·검증·완료 상태를 독립적으로 유지 | `UI_CONTRACT.md` SCR-003 |
| RA-7 | `/account`가 Guest/Adult Member/Moderator·Admin 역할별로 해당 없는 영역을 렌더링하지 않음 | `UI_CONTRACT.md` SCR-005 |
| RA-8 | 어떤 문서·커밋도 미구현 요구사항을 `IMPLEMENTED`로 기록하지 않음(현재 전원 `PENDING_IMPLEMENTATION`) | `UIUX_TRACEABILITY.md` §집계 |
| RA-9 | Stitch 프로젝트 실제 화면이 `Approved Screens`/`Mobile Variants`와 1:1 동기화(중복 인스턴스 정리, 누락 Screen 생성 완료) | `STITCH_VALIDATION_REPORT.md` |

모든 RA 항목이 충족되기 전까지 본 승인 범위는 **디자인·요구사항 배치 승인**일 뿐이며, 기능 릴리스 승인이 아니다.

---

## 5. 현재 상태 요약

| 영역 | 상태 |
|---|---|
| 디자인 정본(D-001) | LOCKED |
| Route/Screen 계약 | 확정(`SCREEN_ROUTE_CONTRACT.json`) |
| Requirement 배치(114건) | 확정(`UIUX_TRACEABILITY.md`) — 구현 착수 전 |
| Stitch 산출물 동기화 | 미완료(RA-9 미충족, 사람 조치 필요) |
| 실제 코드 구현 | 미착수 — `src/app`에 기본 페이지 외 없음 |
