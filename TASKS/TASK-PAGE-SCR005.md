# PAGE-SCR005 — SCR-005 계정·관리 페이지 조립

- **Category:** PAGE_OWNER
- **Implementation Status:** IMPLEMENT
- **Priority:** P0
- **소스:** `TASKS/00_TASK_LIST.md` Seq 5

## Context

**PAGE-SCR005 — SCR-005 계정·관리 페이지 조립** (Page Owner — Route Page 조립). Screen `SCR-005`(Route `/account`)의 일부로 동작한다. 우선순위 P0, Depends On: CMP-SCR005-AUTH, CMP-SCR005-PROFILE, CMP-SCR005-MY-ACTIVITY, CMP-SCR005-ADMIN, CMP-GLOBAL-HEADER-FOOTER, API-ACCOUNT, API-ADMIN-SETTINGS, CMP-SCR003-MATE-TAB.

## Project Scope

**Implementation Status:** IMPLEMENT

PROJECT_SCOPE.md의 화면 구성 원칙(핵심/보조 Screen 구분)과 해당 Screen의 구현 방식 표를 따른다. 관리자 CRUD·CMS·감사 로그 등 PROJECT_SCOPE.md "제외 기능"에 해당하는 요소는 이 페이지에 추가하지 않는다.

## Requirement Ref

REQ-FUNC-028,029,036,038,041,042,045,066,077; REQ-NF-018

## Screen / Route / Page Entry

- Screen: SCR-005
- Route: `/account`
- Page Entry: `src/app/account/page.tsx`

## Design Ref

- `design-reference/D-001/DESIGN.md` § Page Section 최대 폭과 상하 여백
- `design-reference/D-001/DESIGN.md` § Hero 높이와 다음 Section 노출 규칙
- `design-reference/D-001/DESIGN.md` § 화면별 Section 순서와 최소 콘텐츠 수
- `design-reference/D-001/DESIGN.md` § 완성형 Empty State와 Placeholder 문구 금지 규칙
- `design-reference/D-001/DESIGN.md` § Loading · Empty · Error 상태
- `design-reference/D-001/DESIGN.md` § Do / Do Not
- `design-reference/UI_CONTRACT.md` SCR-005 절
- `design-reference/SCREEN_ROUTE_CONTRACT.json` 해당 screen_id 항목(section_order, min_content_counts)

## Depends On

CMP-SCR005-AUTH, CMP-SCR005-PROFILE, CMP-SCR005-MY-ACTIVITY, CMP-SCR005-ADMIN, CMP-GLOBAL-HEADER-FOOTER, API-ACCOUNT, API-ADMIN-SETTINGS, CMP-SCR003-MATE-TAB

## Expected Files

`src/app/account/page.tsx`(create)

> 이 Task는 위에 나열된 파일 외 어떤 파일도 생성·수정하지 않는다.

## Functional AC

Guest/Adult Member/Moderator·Admin 중 현재 역할의 Intro→핵심 작업→도움말 또는 다음 행동만 렌더링(역할에 없는 관리 영역 렌더링 금지); Guest=`CMP-SCR005-AUTH`, Member=`CMP-SCR005-PROFILE`+`CMP-SCR005-MY-ACTIVITY`, Admin=`CMP-SCR005-ADMIN`; 데이터 출처 = `API-ACCOUNT`/`API-ADMIN-SETTINGS`; 내 글 수정 Form은 `CMP-SCR003-MATE-TAB` 재사용; Lorem ipsum·"준비 중" 금지; 내 글/참가 요청/차단 목록 0건 시 각각 완성형 Empty State(이유+이용 방법+CTA); 최초 진입 시 로그인 세션 확인 동안에만 전체화면 Loading을 허용(D-001 예외 조항)하고, 이후 내 글·참가 요청·차단·신고 목록 로드는 각 영역별 Skeleton으로 표시; 각 영역의 데이터 로드가 실패하면 그 영역에만 짧은 원인 문장+재시도 액션을 표시하고 다른 역할별 영역은 정상 동작 유지

## Visual AC

역할 전환 시 레이아웃 급격한 재배치 없이 탭/영역만 교체

## Security/Privacy AC

정확한 생년월일 미저장(`is_adult`+`adult_verified_at`만), 탈퇴 시 즉시 비식별화

## Test Cases

- TC1: `/account` 접속 시 계약된 Section 순서대로 전체가 렌더링된다.
- TC2: 각 Section의 최소 콘텐츠 수(카드/Timeline/Gallery 등)가 실제 데이터로 충족된다.
- TC3: 목록형 Section이 0건일 때 완성형 Empty State(이유+이용 방법+CTA)가 표시되고 빈 Card가 없다.
- TC4: Lorem ipsum·"준비 중"·"정보 확인 필요" 문자열이 렌더링 결과에 존재하지 않는다.
- TC5: Desktop 1440px 기준 Hero 다음 Section 제목이 스크롤 없이 보인다(Hero 높이 상한 준수).
- TC6: Guest/Adult Member/Moderator·Admin 각 역할로 접속 시 해당 역할에 없는 탭/영역이 DOM에 렌더링되지 않는다(display:none이 아니라 미렌더링).
- TC7: 세션 확인 중에는 전체화면 Loading이, 이후 내 글/참가 요청/차단 목록 로드 중에는 영역별 Skeleton이 표시되며, 특정 영역 로드 실패는 그 영역에만 국한된 재시도 오류로 표시된다.

## Verify

E2E-MATE-AUTH, TEST-RLS-BASIC

## Definition of Done

- [ ] Depends On의 모든 Component/Data/API Task가 이미 완료되어 있고, 이 Task는 그 결과물을 조립만 함(신규 하위 Component 생성 없음)
- [ ] Functional AC 전항목 충족
- [ ] Visual AC 전항목 충족(해당 없음이 아닌 경우)
- [ ] Security/Privacy AC 전항목 충족(해당 없음이 아닌 경우)
- [ ] Test Cases 전항목 통과
- [ ] Verify에 명시된 Task(E2E-MATE-AUTH, TEST-RLS-BASIC)와 연동 확인
- [ ] Expected Files 목록 외 파일 변경 없음

## Forbidden

- `Expected Files`에 나열되지 않은 파일 생성·수정 금지
- 구현 코드 커밋, Git Branch 생성, Issue 생성 금지(이 Task 자체는 문서 산출물)
- Airbnb 상표 요소(로고·워드마크·컬러값) 사용 금지
- 구매·예약·결제 UI 추가 금지
- Lorem ipsum, "준비 중", "정보 확인 필요", 내용 없는 빈 Card 금지
- 이 Task 범위 안에서 신규 Component/Data/API Task를 만들거나 그 구현 파일을 직접 작성하지 않음 — Depends On Task에 위임
- `design-reference/SCREEN_ROUTE_CONTRACT.json`에 정의된 section_order를 임의로 재배열하지 않음
