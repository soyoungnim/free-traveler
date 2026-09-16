# CMP-SCR004-FILTER-LIST — 동행 목록·필터·자동 마감

- **Category:** COMPONENT
- **Implementation Status:** IMPLEMENT
- **Priority:** P0
- **소스:** `TASKS/00_TASK_LIST.md` Seq 22

## Context

**CMP-SCR004-FILTER-LIST — 동행 목록·필터·자동 마감** (Component 구현). Screen `SCR-004`(Route `/mates`)의 일부로 동작한다. 우선순위 P0, Depends On: API-MATES-READ.

## Project Scope

**Implementation Status:** IMPLEMENT

PROJECT_SCOPE.md "구현 방식" 표에 명시된 방식(정적 데이터/localStorage/Toast/조회 시 계산 등)을 그대로 따른다. 이 Task가 다루지 않는 PROJECT_SCOPE.md EXCLUDED 항목(예: CMS, 미디어 업로드 승인, 감사 로그, 대시보드)은 구현하지 않는다.

## Requirement Ref

REQ-FUNC-030,037; REQ-NF-004

## Screen / Route / Page Entry

- Screen: SCR-004
- Route: `/mates`
- Page Entry: -

## Design Ref

- `design-reference/D-001/DESIGN.md` § Search·Filter
- § Desktop·Mobile 규칙

## Depends On

API-MATES-READ

## Expected Files

`src/app/_components/scr004/MateFilterList.tsx`(create)

> 이 Task는 위에 나열된 파일 외 어떤 파일도 생성·수정하지 않는다.

## Functional AC

국가·지역·기간 겹침·연령대·성별·스타일·모집상태 필터, 차단 사용자 글 제외, 조회 시 `end_date` 경과분 CLOSED 판정(배치 없음), 최대 8개 카드 우선 노출 + 결과 요약; 0건 시 필터 초기화+이용 방법+작성 CTA 완성형 Empty State

## Visual AC

코랄 없이 필터 Chip 사용(선택 상태만 coral-soft)

## Security/Privacy AC

차단 관계 상호 비노출

## Test Cases

- TC1: 동행 목록·필터·자동 마감의 Functional AC에 기술된 각 동작이 지정된 입력에 대해 명세대로 동작한다.
- TC2: Requirement Ref에 나열된 각 REQ 항목의 수용 기준을 개별적으로 만족한다.
- TC3: Visual AC에 기술된 D-001 토큰(색상/모양/여백)만 사용하고 임의 색상이 없다.
- TC4: 데이터 0건 상태에서 완성형 Empty State(이유+이용 방법+CTA)가 렌더링된다.

## Verify

UNIT-TRAVEL-DATES(자동마감 계산), E2E-MATE-AUTH

## Definition of Done

- [ ] Functional AC 전항목 충족
- [ ] Visual AC 전항목 충족(해당 없음이 아닌 경우)
- [ ] Security/Privacy AC 전항목 충족(해당 없음이 아닌 경우)
- [ ] Test Cases 전항목 통과
- [ ] Verify에 명시된 Task(UNIT-TRAVEL-DATES(자동마감 계산), E2E-MATE-AUTH)와 연동 확인
- [ ] Expected Files 목록 외 파일 변경 없음

## Forbidden

- `Expected Files`에 나열되지 않은 파일 생성·수정 금지
- 구현 코드 커밋, Git Branch 생성, Issue 생성 금지(이 Task 자체는 문서 산출물)
- Airbnb 상표 요소(로고·워드마크·컬러값) 사용 금지
- 구매·예약·결제 UI 추가 금지
- Lorem ipsum, "준비 중", "정보 확인 필요", 내용 없는 빈 Card 금지
