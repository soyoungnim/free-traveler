# PAGE-SCR002 — SCR-002 대표 소개 페이지 조립

- **Category:** PAGE_OWNER
- **Implementation Status:** IMPLEMENT
- **Priority:** P0
- **소스:** `TASKS/00_TASK_LIST.md` Seq 2

## Context

**PAGE-SCR002 — SCR-002 대표 소개 페이지 조립** (Page Owner — Route Page 조립). Screen `SCR-002`(Route `/about`)의 일부로 동작한다. 우선순위 P0, Depends On: CMP-SCR002-HERO-STATS, CMP-SCR002-BIO, CMP-SCR002-TIMELINE, CMP-SCR002-COUNTRY-CHIPS, CMP-SCR002-GALLERY, CMP-SCR002-RECOMMENDED-DEST-CTA, CMP-GLOBAL-HEADER-FOOTER, DATA-REPRESENTATIVE, DATA-DESTINATIONS.

## Project Scope

**Implementation Status:** IMPLEMENT

PROJECT_SCOPE.md의 화면 구성 원칙(핵심/보조 Screen 구분)과 해당 Screen의 구현 방식 표를 따른다. 관리자 CRUD·CMS·감사 로그 등 PROJECT_SCOPE.md "제외 기능"에 해당하는 요소는 이 페이지에 추가하지 않는다.

## Requirement Ref

REQ-FUNC-057~063; REQ-NF-006

## Screen / Route / Page Entry

- Screen: SCR-002
- Route: `/about`
- Page Entry: `src/app/about/page.tsx`

## Design Ref

- `design-reference/D-001/DESIGN.md` § Page Section 최대 폭과 상하 여백
- `design-reference/D-001/DESIGN.md` § Hero 높이와 다음 Section 노출 규칙
- `design-reference/D-001/DESIGN.md` § 화면별 Section 순서와 최소 콘텐츠 수
- `design-reference/D-001/DESIGN.md` § 완성형 Empty State와 Placeholder 문구 금지 규칙
- `design-reference/D-001/DESIGN.md` § Loading · Empty · Error 상태
- `design-reference/D-001/DESIGN.md` § Do / Do Not
- `design-reference/UI_CONTRACT.md` SCR-002 절
- `design-reference/SCREEN_ROUTE_CONTRACT.json` 해당 screen_id 항목(section_order, min_content_counts)

## Depends On

CMP-SCR002-HERO-STATS, CMP-SCR002-BIO, CMP-SCR002-TIMELINE, CMP-SCR002-COUNTRY-CHIPS, CMP-SCR002-GALLERY, CMP-SCR002-RECOMMENDED-DEST-CTA, CMP-GLOBAL-HEADER-FOOTER, DATA-REPRESENTATIVE, DATA-DESTINATIONS

## Expected Files

`src/app/about/page.tsx`(create)

> 이 Task는 위에 나열된 파일 외 어떤 파일도 생성·수정하지 않는다.

## Functional AC

Section 순서 Profile Hero→여행 지표→소개·철학→Timeline→방문 국가→Gallery→기억에 남는 여행지+CTA를 정확히 이 순서로 조립; 전 Section 데이터 출처 = `DATA-REPRESENTATIVE`(추천 여행지 카드만 `DATA-DESTINATIONS` 교차 참조); 최소 콘텐츠 수 Timeline 6개·방문국가 30개·Gallery 사진 8개·추천 여행지 4개 충족; Desktop 3~4열/Mobile 1열; Lorem ipsum·"준비 중" 금지, 빈 링크(문의/SNS)는 렌더링 생략(빈 Card 아님); 전 Section은 `DATA-REPRESENTATIVE`/`DATA-DESTINATIONS` 정적 데이터만 사용해 네트워크 Loading 상태가 없으나, Gallery 이미지는 `next/image` lazy load 중 카드 크기의 이미지 Placeholder를 표시; 추천 여행지 카드가 참조하는 `DATA-DESTINATIONS` 항목이 없으면 해당 카드만 목록에서 제외(전체 Section 오류로 확대하지 않음)

## Visual AC

50+ Trips/30+ Countries 단일 데이터 소스로 홈(SCR-001)과 수치 일치, 사진마다 실제 장소 alt 텍스트

## Security/Privacy AC

대표 이미지 alt·출처 텍스트만 기록(라이선스 승인 워크플로 없음)

## Test Cases

- TC1: `/about` 접속 시 계약된 Section 순서대로 전체가 렌더링된다.
- TC2: 각 Section의 최소 콘텐츠 수(카드/Timeline/Gallery 등)가 실제 데이터로 충족된다.
- TC3: 목록형 Section이 0건일 때 완성형 Empty State(이유+이용 방법+CTA)가 표시되고 빈 Card가 없다.
- TC4: Lorem ipsum·"준비 중"·"정보 확인 필요" 문자열이 렌더링 결과에 존재하지 않는다.
- TC5: Desktop 1440px 기준 Hero 다음 Section 제목이 스크롤 없이 보인다(Hero 높이 상한 준수).
- TC6: Gallery 이미지 로드 중 카드 크기의 Placeholder가 표시되고, 참조 여행지가 없는 추천 카드는 목록에서 제외될 뿐 페이지 전체 오류로 이어지지 않는다.

## Verify

E2E-PUBLIC-SMOKE, MANUAL-A11Y-CHECK

## Definition of Done

- [ ] Depends On의 모든 Component/Data/API Task가 이미 완료되어 있고, 이 Task는 그 결과물을 조립만 함(신규 하위 Component 생성 없음)
- [ ] Functional AC 전항목 충족
- [ ] Visual AC 전항목 충족(해당 없음이 아닌 경우)
- [ ] Security/Privacy AC 전항목 충족(해당 없음이 아닌 경우)
- [ ] Test Cases 전항목 통과
- [ ] Verify에 명시된 Task(E2E-PUBLIC-SMOKE, MANUAL-A11Y-CHECK)와 연동 확인
- [ ] Expected Files 목록 외 파일 변경 없음

## Forbidden

- `Expected Files`에 나열되지 않은 파일 생성·수정 금지
- 구현 코드 커밋, Git Branch 생성, Issue 생성 금지(이 Task 자체는 문서 산출물)
- Airbnb 상표 요소(로고·워드마크·컬러값) 사용 금지
- 구매·예약·결제 UI 추가 금지
- Lorem ipsum, "준비 중", "정보 확인 필요", 내용 없는 빈 Card 금지
- 이 Task 범위 안에서 신규 Component/Data/API Task를 만들거나 그 구현 파일을 직접 작성하지 않음 — Depends On Task에 위임
- `design-reference/SCREEN_ROUTE_CONTRACT.json`에 정의된 section_order를 임의로 재배열하지 않음
