# E2E-PUBLIC-SMOKE — Playwright Chromium 스모크 — 공개 열람 흐름

- **Category:** TEST_E2E
- **Implementation Status:** IMPLEMENT
- **Priority:** P1
- **소스:** `TASKS/00_TASK_LIST.md` Seq 61

## Context

**E2E-PUBLIC-SMOKE — Playwright Chromium 스모크 — 공개 열람 흐름** (Playwright E2E(Chromium Smoke) 구현). 특정 Screen에 종속되지 않는 공용/기반 Task다. 우선순위 P1, Depends On: PAGE-SCR001, PAGE-SCR002.

## Project Scope

**Implementation Status:** IMPLEMENT

PROJECT_SCOPE.md에 따라 Playwright는 Chromium 단일 브라우저의 핵심 흐름 Smoke Test로 한정하며, 다중 브라우저·전체 회귀 스위트로 확장하지 않는다.

## Requirement Ref

REQ-FUNC-001~010,047~054,057~065,067~070,078,079

## Screen / Route / Page Entry

- Screen: -
- Route: -
- Page Entry: -

## Design Ref

- `design-reference/D-001/DESIGN.md` § Do / Do Not

## Depends On

PAGE-SCR001, PAGE-SCR002

## Expected Files

`e2e/public-smoke.spec.ts`(create)

> 이 Task는 위에 나열된 파일 외 어떤 파일도 생성·수정하지 않는다.

## Functional AC

① 여행지 목록→필터→상세→안전정보 연결 ② 대표 소개 페이지 핵심 정보·홈 수치 일치 ③ 404/오류 화면 복구 버튼, Chromium 전용 스모크(다른 브라우저 프로젝트 없음)

## Visual AC

해당 없음

## Security/Privacy AC

해당 없음

## Test Cases

- TC1: 명세된 핵심 흐름이 Chromium에서 처음부터 끝까지 성공적으로 완료된다.
- TC2: 흐름 중 하나라도 실패하면 전체 Smoke Test가 실패로 보고된다.

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
- Chromium 외 브라우저 프로젝트(Firefox, WebKit) 추가 금지, 전체 회귀 스위트로 확장 금지
