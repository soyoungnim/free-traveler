# PAGE-SCR003 — SCR-003 통합 여행 준비 페이지 조립

- **Category:** PAGE_OWNER
- **Implementation Status:** IMPLEMENT
- **Priority:** P0
- **소스:** `TASKS/00_TASK_LIST.md` Seq 3

## Context

**PAGE-SCR003 — SCR-003 통합 여행 준비 페이지 조립** (Page Owner — Route Page 조립). Screen `SCR-003`(Route `/travel-tools`)의 일부로 동작한다. 우선순위 P0, Depends On: CMP-SCR003-TAB-SHELL, CMP-SCR003-FLIGHT-TAB, CMP-SCR003-HOTEL-TAB, CMP-SCR003-MATE-TAB, CMP-GLOBAL-HEADER-FOOTER, API-MATES-WRITE.

## Project Scope

**Implementation Status:** IMPLEMENT

PROJECT_SCOPE.md의 화면 구성 원칙(핵심/보조 Screen 구분)과 해당 Screen의 구현 방식 표를 따른다. 관리자 CRUD·CMS·감사 로그 등 PROJECT_SCOPE.md "제외 기능"에 해당하는 요소는 이 페이지에 추가하지 않는다.

## Requirement Ref

REQ-FUNC-011~032,080; REQ-NF-004,017

## Screen / Route / Page Entry

- Screen: SCR-003
- Route: `/travel-tools`
- Page Entry: `src/app/travel-tools/page.tsx`

## Design Ref

- `design-reference/D-001/DESIGN.md` § Page Section 최대 폭과 상하 여백
- `design-reference/D-001/DESIGN.md` § Hero 높이와 다음 Section 노출 규칙
- `design-reference/D-001/DESIGN.md` § 화면별 Section 순서와 최소 콘텐츠 수
- `design-reference/D-001/DESIGN.md` § 완성형 Empty State와 Placeholder 문구 금지 규칙
- `design-reference/D-001/DESIGN.md` § Loading · Empty · Error 상태
- `design-reference/D-001/DESIGN.md` § Do / Do Not
- `design-reference/UI_CONTRACT.md` SCR-003 절
- `design-reference/SCREEN_ROUTE_CONTRACT.json` 해당 screen_id 항목(section_order, min_content_counts)

## Depends On

CMP-SCR003-TAB-SHELL, CMP-SCR003-FLIGHT-TAB, CMP-SCR003-HOTEL-TAB, CMP-SCR003-MATE-TAB, CMP-GLOBAL-HEADER-FOOTER, API-MATES-WRITE

## Expected Files

`src/app/travel-tools/page.tsx`(create)

> 이 Task는 위에 나열된 파일 외 어떤 파일도 생성·수정하지 않는다.

## Functional AC

Section 순서 Intro→탭(항공/숙소/동행)→여행정보 Form→입력 요약·외부 이동→찾기 Tip 3개→동행 작성 또는 로그인 안내·안전 안내를 이 순서로 조립; 세 탭은 각각 `CMP-SCR003-FLIGHT-TAB`/`CMP-SCR003-HOTEL-TAB`/`CMP-SCR003-MATE-TAB`가 소유하며 입력·검증·완료 상태를 서로 완전히 분리; 데이터 출처 = 항공·숙소는 클라이언트 상태만, 동행 작성은 `API-MATES-WRITE`; Tip 3개 실 콘텐츠 필수; Lorem ipsum·"준비 중"·"정보 확인 필요" 금지; 미인증 상태의 동행 탭은 빈 Form이 아닌 로그인/성인확인 안내 완성형 화면(Unauthorized 상태, `/account`로 이동하는 CTA 포함)으로 대체; 외부 이동 URL 오류·동행글 제출 실패는 해당 탭 내부에만 짧은 원인 문장+재시도 액션으로 표시하고 다른 탭·Section에는 영향 없음; 클라이언트 상태만 다루므로 초기 페이지 진입 시 별도 네트워크 Loading 상태는 없음(동행 작성 제출 중에는 버튼 자체가 로딩 상태로 전환)

## Visual AC

코랄 CTA는 탭별 1개("보러 가기"/"작성하기"), 비전달 고지 문구 상시 노출

## Security/Privacy AC

항공·호텔 입력값(국가·지역·날짜)은 서버 DB·로그·URL 쿼리에 전달하지 않고 브라우저 상태로만 유지(`CON-01`,`CON-02`)

## Test Cases

- TC1: `/travel-tools` 접속 시 계약된 Section 순서대로 전체가 렌더링된다.
- TC2: 각 Section의 최소 콘텐츠 수(카드/Timeline/Gallery 등)가 실제 데이터로 충족된다.
- TC3: 목록형 Section이 0건일 때 완성형 Empty State(이유+이용 방법+CTA)가 표시되고 빈 Card가 없다.
- TC4: Lorem ipsum·"준비 중"·"정보 확인 필요" 문자열이 렌더링 결과에 존재하지 않는다.
- TC5: Desktop 1440px 기준 Hero 다음 Section 제목이 스크롤 없이 보인다(Hero 높이 상한 준수).
- TC6: 항공 탭에 값을 입력한 뒤 숙소·동행 탭으로 전환해도 항공 탭 값이 유지되고 다른 탭 값과 섞이지 않는다.
- TC7: 미인증 상태로 동행 탭에 진입하면 빈 Form 대신 로그인/성인확인 안내와 `/account` 이동 CTA가 표시되고, 외부 이동·제출 오류는 해당 탭 내부에만 국한되어 표시된다.

## Verify

E2E-TRAVEL-TOOLS, UNIT-TRAVEL-DATES, UNIT-CONTACT-DETECTION

## Definition of Done

- [ ] Depends On의 모든 Component/Data/API Task가 이미 완료되어 있고, 이 Task는 그 결과물을 조립만 함(신규 하위 Component 생성 없음)
- [ ] Functional AC 전항목 충족
- [ ] Visual AC 전항목 충족(해당 없음이 아닌 경우)
- [ ] Security/Privacy AC 전항목 충족(해당 없음이 아닌 경우)
- [ ] Test Cases 전항목 통과
- [ ] Verify에 명시된 Task(E2E-TRAVEL-TOOLS, UNIT-TRAVEL-DATES, UNIT-CONTACT-DETECTION)와 연동 확인
- [ ] Expected Files 목록 외 파일 변경 없음

## Forbidden

- `Expected Files`에 나열되지 않은 파일 생성·수정 금지
- 구현 코드 커밋, Git Branch 생성, Issue 생성 금지(이 Task 자체는 문서 산출물)
- Airbnb 상표 요소(로고·워드마크·컬러값) 사용 금지
- 구매·예약·결제 UI 추가 금지
- Lorem ipsum, "준비 중", "정보 확인 필요", 내용 없는 빈 Card 금지
- 이 Task 범위 안에서 신규 Component/Data/API Task를 만들거나 그 구현 파일을 직접 작성하지 않음 — Depends On Task에 위임
- `design-reference/SCREEN_ROUTE_CONTRACT.json`에 정의된 section_order를 임의로 재배열하지 않음
