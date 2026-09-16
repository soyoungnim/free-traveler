# DATA-SAFETY — 국가 안전정보 정적 데이터

- **Category:** DATA
- **Implementation Status:** IMPLEMENT
- **Priority:** P0
- **소스:** `TASKS/00_TASK_LIST.md` Seq 39

## Context

**DATA-SAFETY — 국가 안전정보 정적 데이터** (정적 데이터 구현). 특정 Screen에 종속되지 않는 공용/기반 Task다. 우선순위 P0, Depends On: -.

## Project Scope

**Implementation Status:** IMPLEMENT

PROJECT_SCOPE.md에 따라 여행지·안전정보·대표 프로필은 `src/data`의 정적 데이터로만 관리하며, 관리자 CRUD·게시 워크플로(REQ-FUNC-055,072 등, EXCLUDED)는 만들지 않는다.

## Requirement Ref

REQ-FUNC-046~054

## Screen / Route / Page Entry

- Screen: -
- Route: -
- Page Entry: -

## Design Ref

- `design-reference/D-001/DESIGN.md` § 완성형 Empty State와 Placeholder 문구 금지 규칙(콘텐츠 완전성 기준)

## Depends On

-

## Expected Files

`src/data/safety/countries.ts`(create)

> 이 Task는 위에 나열된 파일 외 어떤 파일도 생성·수정하지 않는다.

## Functional AC

소개된 해외 15개국 전체, 8개 카테고리, 출처·확인일·편집자, 경보 단계·범위, 긴급연락처 필드 전량 포함

## Visual AC

해당 없음

## Security/Privacy AC

해당 없음

## Test Cases

- TC1: 데이터 파일을 정적 import했을 때 스키마가 요구하는 필수 필드가 모두 존재한다.
- TC2: `scripts`(향후 `CI-CONTENT-VALIDATION`)로 수량·완전성 검증 시 실패 항목이 0건이다.
- TC3: 이미지 필드는 일반 URL + 실제 장소를 설명하는 alt 텍스트를 갖는다.

## Verify

CI-CONTENT-VALIDATION

## Definition of Done

- [ ] Functional AC 전항목 충족
- [ ] Visual AC 전항목 충족(해당 없음이 아닌 경우)
- [ ] Security/Privacy AC 전항목 충족(해당 없음이 아닌 경우)
- [ ] Test Cases 전항목 통과
- [ ] Verify에 명시된 Task(CI-CONTENT-VALIDATION)와 연동 확인
- [ ] Expected Files 목록 외 파일 변경 없음

## Forbidden

- `Expected Files`에 나열되지 않은 파일 생성·수정 금지
- 구현 코드 커밋, Git Branch 생성, Issue 생성 금지(이 Task 자체는 문서 산출물)
- Airbnb 상표 요소(로고·워드마크·컬러값) 사용 금지
- 구매·예약·결제 UI 추가 금지
- Lorem ipsum, "준비 중", "정보 확인 필요", 내용 없는 빈 Card 금지
