# UNIT-MATE-STATE — 동행 상태 전이 Unit Test

- **Category:** TEST_UNIT
- **Implementation Status:** IMPLEMENT
- **Priority:** P1
- **소스:** `TASKS/00_TASK_LIST.md` Seq 59

## Context

**UNIT-MATE-STATE — 동행 상태 전이 Unit Test** (Unit Test 구현). 특정 Screen에 종속되지 않는 공용/기반 Task다. 우선순위 P1, Depends On: API-MATES-APPLICATIONS, API-MODERATION.

## Project Scope

**Implementation Status:** IMPLEMENT

PROJECT_SCOPE.md의 확인 방법 표에 명시된 Unit Test 대상(날짜 검증·연락처 탐지·상태 전이)만 다루며 범위를 벗어난 테스트는 추가하지 않는다.

## Requirement Ref

REQ-FUNC-035,036,041,042

## Screen / Route / Page Entry

- Screen: -
- Route: -
- Page Entry: -

## Design Ref

- `design-reference/D-001/DESIGN.md` § Do / Do Not

## Depends On

API-MATES-APPLICATIONS, API-MODERATION

## Expected Files

`src/lib/db/__tests__/mate-state.test.ts`(create)

> 이 Task는 위에 나열된 파일 외 어떤 파일도 생성·수정하지 않는다.

## Functional AC

중복 요청 차단, PENDING→ACCEPTED/REJECTED 전이 권한, 신고 OPEN→RESOLVED/DISMISSED 전이 검증

## Visual AC

해당 없음

## Security/Privacy AC

해당 없음

## Test Cases

- TC1: 정상 케이스가 기대값과 일치한다.
- TC2: 경계값(과거일, 역전일, 동일값 등)이 올바르게 차단/처리된다.
- TC3: 알려진 실패 케이스(오탐/미탐 포함)가 회귀하지 않는다.

## Verify

(Test 자체)

## Definition of Done

- [ ] Functional AC 전항목 충족
- [ ] Visual AC 전항목 충족(해당 없음이 아닌 경우)
- [ ] Security/Privacy AC 전항목 충족(해당 없음이 아닌 경우)
- [ ] Test Cases 전항목 통과
- [ ] Verify에 명시된 Task((Test 자체))와 연동 확인
- [ ] Expected Files 목록 외 파일 변경 없음

## Forbidden

- `Expected Files`에 나열되지 않은 파일 생성·수정 금지
- 구현 코드 커밋, Git Branch 생성, Issue 생성 금지(이 Task 자체는 문서 산출물)
- Airbnb 상표 요소(로고·워드마크·컬러값) 사용 금지
- 구매·예약·결제 UI 추가 금지
- Lorem ipsum, "준비 중", "정보 확인 필요", 내용 없는 빈 Card 금지
