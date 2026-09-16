# PAGE-SCR004 — SCR-004 동행 조회 페이지 조립

- **Category:** PAGE_OWNER
- **Implementation Status:** IMPLEMENT
- **Priority:** P0
- **소스:** `TASKS/00_TASK_LIST.md` Seq 4

## Context

**PAGE-SCR004 — SCR-004 동행 조회 페이지 조립** (Page Owner — Route Page 조립). Screen `SCR-004`(Route `/mates`)의 일부로 동작한다. 우선순위 P0, Depends On: CMP-SCR004-FILTER-LIST, CMP-SCR004-DETAIL-PANEL, CMP-SCR004-APPLICATION, CMP-SCR004-REPORT-BLOCK, CMP-GLOBAL-HEADER-FOOTER, API-MATES-READ, API-MATES-APPLICATIONS, API-MODERATION.

## Project Scope

**Implementation Status:** IMPLEMENT

PROJECT_SCOPE.md의 화면 구성 원칙(핵심/보조 Screen 구분)과 해당 Screen의 구현 방식 표를 따른다. 관리자 CRUD·CMS·감사 로그 등 PROJECT_SCOPE.md "제외 기능"에 해당하는 요소는 이 페이지에 추가하지 않는다.

## Requirement Ref

REQ-FUNC-030,033~037,039,040,043; REQ-NF-004,019

## Screen / Route / Page Entry

- Screen: SCR-004
- Route: `/mates`
- Page Entry: `src/app/mates/page.tsx`

## Design Ref

- `design-reference/D-001/DESIGN.md` § Page Section 최대 폭과 상하 여백
- `design-reference/D-001/DESIGN.md` § Hero 높이와 다음 Section 노출 규칙
- `design-reference/D-001/DESIGN.md` § 화면별 Section 순서와 최소 콘텐츠 수
- `design-reference/D-001/DESIGN.md` § 완성형 Empty State와 Placeholder 문구 금지 규칙
- `design-reference/D-001/DESIGN.md` § Loading · Empty · Error 상태
- `design-reference/D-001/DESIGN.md` § Do / Do Not
- `design-reference/UI_CONTRACT.md` SCR-004 절
- `design-reference/SCREEN_ROUTE_CONTRACT.json` 해당 screen_id 항목(section_order, min_content_counts)

## Depends On

CMP-SCR004-FILTER-LIST, CMP-SCR004-DETAIL-PANEL, CMP-SCR004-APPLICATION, CMP-SCR004-REPORT-BLOCK, CMP-GLOBAL-HEADER-FOOTER, API-MATES-READ, API-MATES-APPLICATIONS, API-MODERATION

## Expected Files

`src/app/mates/page.tsx`(create)

> 이 Task는 위에 나열된 파일 외 어떤 파일도 생성·수정하지 않는다.

## Functional AC

Section 순서 Intro(작성 CTA)→Filter·결과 요약→동행글 목록(최대 8개 우선 노출)→상세(Desktop 좌우 분할/Mobile Drawer)→신청 방법 3단계→안전·신고·차단 안내+CTA를 이 순서로 조립; 데이터 출처 = `API-MATES-READ`(목록/상세), `API-MATES-APPLICATIONS`(참가), `API-MODERATION`(신고/차단); Desktop 좌우 분할/Mobile Drawer 반응형 전환; Lorem ipsum·"준비 중" 금지; 검색 결과 0건 시 필터 초기화+이용 방법+"동행 글 작성하기" CTA를 갖춘 완성형 Empty State 필수; 목록/상세에 연락처(전화번호·이메일·메신저 ID) 노출 금지; `API-MATES-READ` 응답 대기 중 목록·상세 Section은 카드/패널 모양의 Skeleton을 표시(전체화면 스피너 금지); 목록 또는 상세 로드가 실패하면 실패한 Section에만 짧은 원인 문장+재시도 액션을 표시하고 나머지 Section은 정상 동작 유지; 미인증 상태로 참가 신청·신고·차단을 시도하면 해당 액션 영역이 로그인/성인확인 안내 CTA(`/account`로 이동)로 대체되고 조용히 비활성화된 버튼만 두지 않음

## Visual AC

모집중/마감 배지는 색상 단독이 아닌 텍스트 라벨 병기

## Security/Privacy AC

차단 관계 상호 비노출, RLS로 비공개 요청 데이터 접근 제한

## Test Cases

- TC1: `/mates` 접속 시 계약된 Section 순서대로 전체가 렌더링된다.
- TC2: 각 Section의 최소 콘텐츠 수(카드/Timeline/Gallery 등)가 실제 데이터로 충족된다.
- TC3: 목록형 Section이 0건일 때 완성형 Empty State(이유+이용 방법+CTA)가 표시되고 빈 Card가 없다.
- TC4: Lorem ipsum·"준비 중"·"정보 확인 필요" 문자열이 렌더링 결과에 존재하지 않는다.
- TC5: Desktop 1440px 기준 Hero 다음 Section 제목이 스크롤 없이 보인다(Hero 높이 상한 준수).
- TC6: 목록·상세 데이터 로드 중 Skeleton이 표시되고, 로드 실패 시 해당 Section에만 재시도 가능한 오류 문구가 표시된다.
- TC7: 미인증 상태에서 참가 신청·신고·차단을 시도하면 로그인/성인확인 안내 CTA로 대체되고, 설명 없는 비활성 버튼으로 남지 않는다.

## Verify

E2E-MATE-AUTH, UNIT-MATE-STATE

## Definition of Done

- [ ] Depends On의 모든 Component/Data/API Task가 이미 완료되어 있고, 이 Task는 그 결과물을 조립만 함(신규 하위 Component 생성 없음)
- [ ] Functional AC 전항목 충족
- [ ] Visual AC 전항목 충족(해당 없음이 아닌 경우)
- [ ] Security/Privacy AC 전항목 충족(해당 없음이 아닌 경우)
- [ ] Test Cases 전항목 통과
- [ ] Verify에 명시된 Task(E2E-MATE-AUTH, UNIT-MATE-STATE)와 연동 확인
- [ ] Expected Files 목록 외 파일 변경 없음

## Forbidden

- `Expected Files`에 나열되지 않은 파일 생성·수정 금지
- 구현 코드 커밋, Git Branch 생성, Issue 생성 금지(이 Task 자체는 문서 산출물)
- Airbnb 상표 요소(로고·워드마크·컬러값) 사용 금지
- 구매·예약·결제 UI 추가 금지
- Lorem ipsum, "준비 중", "정보 확인 필요", 내용 없는 빈 Card 금지
- 이 Task 범위 안에서 신규 Component/Data/API Task를 만들거나 그 구현 파일을 직접 작성하지 않음 — Depends On Task에 위임
- `design-reference/SCREEN_ROUTE_CONTRACT.json`에 정의된 section_order를 임의로 재배열하지 않음
