# API-MATES-WRITE — 동행 모집글 작성·수정·마감·삭제

- **Category:** API
- **Implementation Status:** IMPLEMENT
- **Priority:** P0
- **소스:** `TASKS/00_TASK_LIST.md` Seq 46

## Context

**API-MATES-WRITE — 동행 모집글 작성·수정·마감·삭제** (서버 접근 로직(Server Action) 구현). 특정 Screen에 종속되지 않는 공용/기반 Task다. 우선순위 P0, Depends On: DB-ACCESS, DB-RLS-BASE.

## Project Scope

**Implementation Status:** IMPLEMENT

PROJECT_SCOPE.md에 따라 항공·호텔 조건 입력값에는 서버 API를 두지 않는다(클라이언트 상태로만 처리). 이 Task는 동행/신고/차단/계정 등 실제 DB가 필요한 기능만 다룬다.

## Requirement Ref

REQ-FUNC-031,032,038,080

## Screen / Route / Page Entry

- Screen: -
- Route: -
- Page Entry: -

## Design Ref

- `design-reference/D-001/DESIGN.md` § Do / Do Not

## Depends On

DB-ACCESS, DB-RLS-BASE

## Expected Files

`src/lib/db/mates-write.ts`(create)

> 이 Task는 위에 나열된 파일 외 어떤 파일도 생성·수정하지 않는다.

## Functional AC

안전수칙 동의 시각 저장, 연락처 패턴 서버 측 재검증, 수동 마감/수정/삭제

## Visual AC

해당 없음

## Security/Privacy AC

작성자 본인만 수정 가능(RLS)

## Test Cases

- TC1: 정상 입력에 대해 기대한 DB 상태 변화가 발생한다.
- TC2: 권한 없는 사용자의 호출은 403 또는 빈 결과로 거부된다.
- TC3: 중복/경계 조건(중복 요청, 날짜 역전 등)이 서버 측에서도 재검증되어 차단된다.

## Verify

UNIT-CONTACT-DETECTION, E2E-TRAVEL-TOOLS

## Definition of Done

- [ ] Functional AC 전항목 충족
- [ ] Visual AC 전항목 충족(해당 없음이 아닌 경우)
- [ ] Security/Privacy AC 전항목 충족(해당 없음이 아닌 경우)
- [ ] Test Cases 전항목 통과
- [ ] Verify에 명시된 Task(UNIT-CONTACT-DETECTION, E2E-TRAVEL-TOOLS)와 연동 확인
- [ ] Expected Files 목록 외 파일 변경 없음

## Forbidden

- `Expected Files`에 나열되지 않은 파일 생성·수정 금지
- 구현 코드 커밋, Git Branch 생성, Issue 생성 금지(이 Task 자체는 문서 산출물)
- Airbnb 상표 요소(로고·워드마크·컬러값) 사용 금지
- 구매·예약·결제 UI 추가 금지
- Lorem ipsum, "준비 중", "정보 확인 필요", 내용 없는 빈 Card 금지
