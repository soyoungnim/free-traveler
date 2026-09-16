# TEST-RLS-BASIC — Supabase RLS 정책 테스트

- **Category:** TEST_RLS
- **Implementation Status:** IMPLEMENT
- **Priority:** P0
- **소스:** `TASKS/00_TASK_LIST.md` Seq 60

## Context

**TEST-RLS-BASIC — Supabase RLS 정책 테스트** (RLS Test 구현). 특정 Screen에 종속되지 않는 공용/기반 Task다. 우선순위 P0, Depends On: DB-RLS-BASE.

## Project Scope

**Implementation Status:** IMPLEMENT

PROJECT_SCOPE.md에 따라 Supabase RLS 정책은 필수 구현·검증 대상이다(REQ-FUNC-044, REQ-NF-013).

## Requirement Ref

REQ-FUNC-044; REQ-NF-013

## Screen / Route / Page Entry

- Screen: -
- Route: -
- Page Entry: -

## Design Ref

- `design-reference/D-001/DESIGN.md` § Do / Do Not

## Depends On

DB-RLS-BASE

## Expected Files

`supabase/tests/rls_basic.sql` 또는 `src/lib/db/__tests__/rls.test.ts`(create)

> 이 Task는 위에 나열된 파일 외 어떤 파일도 생성·수정하지 않는다.

## Functional AC

역할별(Guest/Adult Member/Owner/Moderator/Admin) 비공개 데이터 접근 시나리오 전량 403/빈 결과 확인

## Visual AC

해당 없음

## Security/Privacy AC

해당 없음

## Test Cases

- TC1: Guest/Adult Member/Owner/Moderator/Admin 각 역할별 접근 시나리오가 정책과 일치한다.
- TC2: 타인의 비공개 데이터에 대한 SELECT/UPDATE/DELETE 시도가 전부 거부된다.

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
