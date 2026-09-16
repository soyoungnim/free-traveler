# PAGE-SCR001 — SCR-001 메인 페이지 조립

- **Category:** PAGE_OWNER
- **Implementation Status:** IMPLEMENT
- **Priority:** P0
- **소스:** `TASKS/00_TASK_LIST.md` Seq 1

## Context

**PAGE-SCR001 — SCR-001 메인 페이지 조립** (Page Owner — Route Page 조립). Screen `SCR-001`(Route `/`)의 일부로 동작한다. 우선순위 P0, Depends On: CMP-SCR001-SEARCH-FILTER, CMP-SCR001-DESTINATION-CARD, CMP-SCR001-DEST-DRAWER, CMP-SCR001-SAFETY-DRAWER, CMP-SCR001-RECENT-MATES, CMP-SCR001-ABOUT-TEASER, CMP-GLOBAL-HEADER-FOOTER, DATA-DESTINATIONS, DATA-SAFETY, DATA-REPRESENTATIVE.

## Project Scope

**Implementation Status:** IMPLEMENT

PROJECT_SCOPE.md의 화면 구성 원칙(핵심/보조 Screen 구분)과 해당 Screen의 구현 방식 표를 따른다. 관리자 CRUD·CMS·감사 로그 등 PROJECT_SCOPE.md "제외 기능"에 해당하는 요소는 이 페이지에 추가하지 않는다.

## Requirement Ref

REQ-FUNC-001~010,047~054,064,065,067~069,079; REQ-NF-004,006,023

## Screen / Route / Page Entry

- Screen: SCR-001
- Route: `/`
- Page Entry: `src/app/page.tsx`

## Design Ref

- `design-reference/D-001/DESIGN.md` § Page Section 최대 폭과 상하 여백
- `design-reference/D-001/DESIGN.md` § Hero 높이와 다음 Section 노출 규칙
- `design-reference/D-001/DESIGN.md` § 화면별 Section 순서와 최소 콘텐츠 수
- `design-reference/D-001/DESIGN.md` § 완성형 Empty State와 Placeholder 문구 금지 규칙
- `design-reference/D-001/DESIGN.md` § Loading · Empty · Error 상태
- `design-reference/D-001/DESIGN.md` § Do / Do Not
- `design-reference/UI_CONTRACT.md` SCR-001 절
- `design-reference/SCREEN_ROUTE_CONTRACT.json` 해당 screen_id 항목(section_order, min_content_counts)

## Depends On

CMP-SCR001-SEARCH-FILTER, CMP-SCR001-DESTINATION-CARD, CMP-SCR001-DEST-DRAWER, CMP-SCR001-SAFETY-DRAWER, CMP-SCR001-RECENT-MATES, CMP-SCR001-ABOUT-TEASER, CMP-GLOBAL-HEADER-FOOTER, DATA-DESTINATIONS, DATA-SAFETY, DATA-REPRESENTATIVE

## Expected Files

`src/app/page.tsx`(modify, Next.js starter 콘텐츠 전량 제거)

> 이 Task는 위에 나열된 파일 외 어떤 파일도 생성·수정하지 않는다.

## Functional AC

Section 순서 Hero→국내 6→해외 6→여행 동기 6→국가별 주의사항 6→최근 동행글 3(또는 Empty State)→free_traveler 소개를 정확히 이 순서로 조립; Section별 데이터 출처 = Hero/필터: 클라이언트 상태, 국내·해외 카드: `DATA-DESTINATIONS`, 주의사항 카드: `DATA-SAFETY`, 동행글: `API-MATES-READ`, 소개: `DATA-REPRESENTATIVE`; 최소 콘텐츠 수 국내 6·해외 6·테마 6·안전 6·동행 3 충족; Desktop 3~4열/Mobile 1열 반응형 카드 밀도; Lorem ipsum·"준비 중"·"정보 확인 필요"·내용 없는 Card 금지; 최근 동행글 0건 시 이유+이용 방법+"동행 글 작성하기" CTA를 갖춘 완성형 Empty State 필수; `API-MATES-READ` 응답 대기 중 최근 동행글 Section은 카드 모양과 일치하는 Skeleton을 표시(스피너 전체화면 금지); 해당 Section 데이터 로드가 실패하면 실패 Section만 짧은 원인 문장+재시도 액션으로 대체하고 나머지 Section은 정상 렌더링 유지(전체 페이지 오류로 확대하지 않음)

## Visual AC

D-001 코랄 CTA 1개/Section 이하, 12px 카드 radius, Hero 520~560px로 다음 Section 상단 노출, Airbnb 상표 요소·구매/예약/결제 UI 없음

## Security/Privacy AC

즐겨찾기는 `localStorage`만 사용, 서버 미저장

## Test Cases

- TC1: `/` 접속 시 계약된 Section 순서대로 전체가 렌더링된다.
- TC2: 각 Section의 최소 콘텐츠 수(카드/Timeline/Gallery 등)가 실제 데이터로 충족된다.
- TC3: 목록형 Section이 0건일 때 완성형 Empty State(이유+이용 방법+CTA)가 표시되고 빈 Card가 없다.
- TC4: Lorem ipsum·"준비 중"·"정보 확인 필요" 문자열이 렌더링 결과에 존재하지 않는다.
- TC5: Desktop 1440px 기준 Hero 다음 Section 제목이 스크롤 없이 보인다(Hero 높이 상한 준수).
- TC6: `src/app/page.tsx`에 create-next-app 기본 마크업(로고/문서 링크 등)이 남아있지 않다.
- TC7: 최근 동행글 데이터 로드 중에는 카드 모양의 Skeleton이, 로드 실패 시에는 해당 Section에만 재시도 가능한 오류 문구가 표시되고 나머지 Section은 정상 동작한다.

## Verify

E2E-PUBLIC-SMOKE, MANUAL-A11Y-CHECK, MANUAL-PERF-CHECK

## Definition of Done

- [ ] Depends On의 모든 Component/Data/API Task가 이미 완료되어 있고, 이 Task는 그 결과물을 조립만 함(신규 하위 Component 생성 없음)
- [ ] Functional AC 전항목 충족
- [ ] Visual AC 전항목 충족(해당 없음이 아닌 경우)
- [ ] Security/Privacy AC 전항목 충족(해당 없음이 아닌 경우)
- [ ] Test Cases 전항목 통과
- [ ] Verify에 명시된 Task(E2E-PUBLIC-SMOKE, MANUAL-A11Y-CHECK, MANUAL-PERF-CHECK)와 연동 확인
- [ ] Expected Files 목록 외 파일 변경 없음

## Forbidden

- `Expected Files`에 나열되지 않은 파일 생성·수정 금지
- 구현 코드 커밋, Git Branch 생성, Issue 생성 금지(이 Task 자체는 문서 산출물)
- Airbnb 상표 요소(로고·워드마크·컬러값) 사용 금지
- 구매·예약·결제 UI 추가 금지
- Lorem ipsum, "준비 중", "정보 확인 필요", 내용 없는 빈 Card 금지
- 이 Task 범위 안에서 신규 Component/Data/API Task를 만들거나 그 구현 파일을 직접 작성하지 않음 — Depends On Task에 위임
- `design-reference/SCREEN_ROUTE_CONTRACT.json`에 정의된 section_order를 임의로 재배열하지 않음
