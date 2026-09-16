# Free Traveler — UI Contract (Next.js App Router)

- **기반 문서:** `docs/03_UI_COVERAGE_ANALYSIS.md`, `docs/04_UIUX_PLAN.md`, `docs/STITCH_VALIDATION_REPORT.md`, `design-reference/D-001/DESIGN.md`
- **대상:** SCR-001~SCR-005 (정확히 5개, 신규 Screen 추가 없음)
- **짝 파일:** `design-reference/SCREEN_ROUTE_CONTRACT.json` (기계 판독용 동일 계약)

## 핵심 4개 · 보조 1개 구분

| 구분 | Screen |
|---|---|
| **핵심 (4)** | SCR-001, SCR-003, SCR-004, SCR-005 |
| **보조 (1)** | SCR-002 |

SCR-002(`/about`)는 열람 전용 콘텐츠 화면으로 다른 화면의 기능 수행에 필수적이지 않아 보조로 분류한다. SCR-001(탐색·안전정보), SCR-003(여행 준비), SCR-004(동행), SCR-005(계정·인증·관리)는 서비스의 핵심 사용자 플로우(탐색→준비→연결→계정)를 구성하므로 핵심으로 분류한다.

---

## SCR-001 `/` 메인

| 항목 | 내용 |
|---|---|
| **Screen ID** | SCR-001 |
| **Route** | `/` |
| **Page Entry** | `src/app/page.tsx` |
| **영역 순서** | ① 검색 Hero → ② 국내 인기 여행지 Card Grid(6) → ③ 해외 인기 여행지 Card Grid(6, 가로 스크롤) → ④ 여행 스타일 Chip(6) → ⑤ 국가별 안전정보 Card(6)+Drawer 연결 → ⑥ 최근 동행 소식 List(3)/Empty → ⑦ free_traveler 소개 좌우 분할 |
| **주요 Component** | `header-bar`, `search-bar-pill`, `destination-card`(×2 그리드/가로스크롤 variant), `chip`/`chip-selected`, `safety-badge-*`, `drawer-modal`(여행지 상세·안전정보), `mate-post-card`(미니), `button-primary`, `footer-light` |
| **상태** | Loading(② ③ ⑤ 카드 스켈레톤) · Success(기본 7 Section) · Empty(⑥ 동행 소식 0건 시 완성형 Empty State) · Error(② ③ ⑤ 로드 실패 시 해당 Section만 오류+재시도) |
| **사용자 행동** | 통합 검색, 국내/해외 여행지 카드 클릭→상세 Drawer 열기, 즐겨찾기 토글, 테마 Chip 선택→필터, 안전정보 카드 클릭→안전정보 Drawer 열기, 동행글 미리보기 클릭 |
| **다른 화면으로의 이동** | Hero/상세 Drawer CTA → SCR-003 · 동행 소식 CTA → SCR-004 · free_traveler 소개 CTA → SCR-002 |
| **Desktop·Mobile 규칙** | Desktop 1440px 기준 승인 완료, **Mobile 390px 변형 승인 완료**(`DESIGN_MANIFEST.md` Mobile Variants 포함). Hero는 520–560px로 높이를 제한해 Desktop에서 다음 Section 제목이 보이도록 한다. Mobile은 Card 1열, Section 상하 여백 40–64px. |
| **금지 기능** | Airbnb 상표 요소, 구매·예약·결제 UI, 별점/신뢰도(%) 배지, 광고, 실시간 항공권·호텔 가격, "정보 확인 필요"·"준비 중" 문구, `src/app/page.tsx`의 create-next-app 스타터 콘텐츠 잔존(starter_template_forbidden) |

## SCR-002 `/about` 대표 소개

| 항목 | 내용 |
|---|---|
| **Screen ID** | SCR-002 |
| **Route** | `/about` |
| **Page Entry** | `src/app/about/page.tsx` |
| **영역 순서** | ① Profile Hero → ② 여행 지표(50+/30+ Stat Card) → ③ 소개·철학 좌우 분할 → ④ 여행 Timeline(6+) → ⑤ 방문 국가 Chip(30개, 권역별) → ⑥ 여행 사진 Gallery(8+) → ⑦ 기억에 남는 여행지 Card(4)+CTA Banner |
| **주요 Component** | `header-bar`, Stat Card, Timeline 리스트, `chip`(권역 그룹), Gallery Grid, `destination-card`(추천 4), `button-primary`, `footer-light` |
| **상태** | Loading(④ ⑥ 스켈레톤) · Success(정적 데이터 기반 기본 상태) · Error(드묾, 전체 로드 실패 시 재시도 안내) |
| **사용자 행동** | Timeline 스크롤 열람, 권역별 국가 Chip 열람, Gallery 이미지 열람, 추천 여행지 카드 클릭 |
| **다른 화면으로의 이동** | 추천 여행지 카드 → SCR-001 상세 Drawer · 마지막 CTA Banner → SCR-003, SCR-004 |
| **Desktop·Mobile 규칙** | Desktop 1440px 기준만 승인 완료. **Mobile 전용 승인 변형 없음** — 반응형 규칙(D-001)은 따르되 별도 Mobile 승인 대상이 아니다. |
| **금지 기능** | Airbnb 상표 요소, 구매·예약·결제 UI, 신원 인증/신분증 보증 표현(OS-06 제외), 대시보드형 통계, 라이선스 승인 워크플로 UI(이미지는 alt+출처 텍스트만) |

## SCR-003 `/travel-tools` 통합 여행 준비

| 항목 | 내용 |
|---|---|
| **Screen ID** | SCR-003 |
| **Route** | `/travel-tools` |
| **Page Entry** | `src/app/travel-tools/page.tsx` |
| **영역 순서** | ① Intro → ② 탭(항공편/숙소/동행 구하기) → ③ 조건 입력 Form → ④ 요약 & 외부 이동 Action Card → ⑤ 비전달 고지 & 이용 Tip 3개 → ⑥ 동행 구하기(로그인 안내 또는 작성 Form+안전 안내) |
| **주요 Component** | `header-bar`, `tab`/`tab-active`(3탭, 상태 완전 분리), `text-input`, `button-primary`, `button-secondary`, 인라인 오류(`color.error`), 고지 배너(`color.safety-info`), 동행 작성 Form, `footer-light` |
| **상태** | Loading(탭 전환 초기값) · Success(요약 확인 후 외부 이동 성공) · Error(필드 인라인 오류, 외부 URL 이동 실패 시 재시도) · Unauthorized(동행 탭 미인증/미성년 시 Form 대체) |
| **사용자 행동** | 탭 전환, 국가·지역·날짜 입력, 검증 오류 확인, 요약 확인, 외부 사이트 이동(새 탭), 동행 모집글 작성+안전수칙 동의 |
| **다른 화면으로의 이동** | 항공·숙소 CTA → 외부 사이트(새 탭, 화면 전환 아님) · 동행 작성 완료 → SCR-004 · 동행 탭 미인증 시 로그인 CTA → SCR-005 |
| **Desktop·Mobile 규칙** | Desktop 1440px 기준 승인 완료, **Mobile 390px 변형 승인 완료**. 세 탭은 입력·검증·완료 상태를 서로 완전히 분리해 보관한다(탭 전환이 다른 탭 값에 영향 없음). |
| **금지 기능** | 구매·예약·결제 UI(항공/숙소는 조건 정리 후 "이동"만 제공), 입력값의 서버 저장·URL 쿼리 전달, 실시간 가격/재고 표시, Airbnb 상표 요소 |

## SCR-004 `/mates` 동행 조회

| 항목 | 내용 |
|---|---|
| **Screen ID** | SCR-004 |
| **Route** | `/mates` |
| **Page Entry** | `src/app/mates/page.tsx` |
| **영역 순서** | ① Intro(작성 CTA) → ② 검색 Filter+결과 요약 → ③ 동행글 목록 Card Grid(최대 8) → ④ 목록+상세 분할(Desktop)/Drawer(Mobile) → ⑤ 신청 방법 3단계 안내 → ⑥ 안전·신고·차단 안내+CTA |
| **주요 Component** | `header-bar`, `chip`(필터), `mate-post-card`, 좌우 분할 패널/`drawer-modal`(Mobile 상세), 3단계 안내 리스트, `button-primary`, `footer-light` |
| **상태** | Loading(목록·상세 스켈레톤) · Success(기본 목록/상세) · Empty(검색 결과 0건 시 완성형 Empty State: 필터 초기화+이용 방법+작성 CTA) · Error(로드 실패+재시도) · Unauthorized(참가 요청·신고·차단·글쓰기 미인증 시 로그인 안내) |
| **사용자 행동** | 국가·지역·기간·모집 상태 필터, 목록 카드 선택→상세 열람, 참가 요청 제출, 신고·차단 제출 |
| **다른 화면으로의 이동** | 글쓰기 CTA → SCR-003(동행 작성 탭) · 안전 안내 CTA → SCR-003 · 미인증 액션 시도 → SCR-005 |
| **Desktop·Mobile 규칙** | Desktop 1440px 기준만 승인 완료. **Mobile 전용 승인 변형 없음** — 목록→상세는 반응형 규칙상 Mobile Drawer로 전환되나 별도 Mobile 승인 대상은 아니다. |
| **금지 기능** | 공개 연락처 노출, 실시간 채팅/영상통화/위치 공유, 신원 인증 보증 표현, 별점/리뷰, Airbnb 상표 요소, 구매·결제 UI |

## SCR-005 `/account` 계정·관리

| 항목 | 내용 |
|---|---|
| **Screen ID** | SCR-005 |
| **Route** | `/account` |
| **Page Entry** | `src/app/account/page.tsx` |
| **영역 순서** | 역할별 탭만 렌더링(Section 수 고정 아님) — **Guest:** Intro→로그인/가입 Card→로그인 후 기능 Chip→보안 안내 / **Adult Member:** 프로필(요약+Form)→내 활동(내 글/참가 요청/차단 목록/작성 CTA) / **Moderator·Admin:** 관리 Intro→신고 상태 처리→외부 URL 설정 |
| **주요 Component** | `header-bar`, `text-input`, `button-primary`, 상태 배지(성인확인·요청·신고), 목록형 Empty State, `footer-light` |
| **상태** | Loading(세션 확인) · Success(역할별 기본) · Empty(내 글/참가 요청/신고 0건) · Error(로그인·저장 실패) · Unauthorized(성인확인 미완료 상태에서 동행 액션 시도) |
| **사용자 행동** | 로그인/가입/비밀번호 재설정, 프로필 수정, 성인 확인, 참가 요청 승인·거절, 차단 해제, 신고 상태 변경(관리자), 외부 URL 설정(관리자), 새 동행글 작성 CTA |
| **다른 화면으로의 이동** | 새 동행글 작성 CTA → SCR-003 · 참가 요청 Empty State CTA → SCR-004 |
| **Desktop·Mobile 규칙** | Desktop 1440px 기준만 승인 완료. **Mobile 전용 승인 변형 없음**. 역할에 없는 탭은 렌더링하지 않는다(Guest/Member/Admin 상호 배타). |
| **금지 기능** | 복잡한 통계 Dashboard, 범용 감사 로그 UI, 콘텐츠 CRUD(CMS) UI, 미디어 업로드·라이선스 승인 UI, Airbnb 상표 요소, 구매·결제 UI |

---

## 기술 Route (참고, Screen 수에 미포함)

| 유형 | Route 예시 | 파일 예시 |
|---|---|---|
| 인증 콜백 | `/auth/callback` | `src/app/auth/callback/route.ts` |
| API Route | `/api/mates`, `/api/mates/[id]/applications`, `/api/admin/reports`, `/api/admin/settings/outbound` | `src/app/api/**/route.ts` |
| Not Found | (전역) | `src/app/not-found.tsx` |
| 오류 처리 | (전역/세그먼트) | `src/app/error.tsx`, `src/app/global-error.tsx` |

상세는 `design-reference/SCREEN_ROUTE_CONTRACT.json`의 `technical_routes`를 정본으로 한다.
