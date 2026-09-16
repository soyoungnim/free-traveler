# MANUAL-A11Y-CHECK — 접근성 수동 점검(키보드·axe)

- **Category:** MANUAL
- **Implementation Status:** IMPLEMENT(축소)
- **Priority:** P2
- **소스:** `TASKS/00_TASK_LIST.md` Seq 55

## Context

**MANUAL-A11Y-CHECK — 접근성 수동 점검(키보드·axe)** (수동 점검(코드 산출물 없음)). 특정 Screen에 종속되지 않는 공용/기반 Task다. 우선순위 P2, Depends On: CMP-GLOBAL-A11Y, PAGE-SCR001, PAGE-SCR002, PAGE-SCR003, PAGE-SCR004, PAGE-SCR005.

## Project Scope

**Implementation Status:** IMPLEMENT(축소)

PROJECT_SCOPE.md에 따라 자동 성능/접근성 CI 게이트는 구축하지 않으므로(EXCLUDED: REQ-NF-007 등) 이 Task는 수동 점검으로 대체한다. 점검 결과는 기록만 남기고 코드는 생성하지 않는다.

## Requirement Ref

REQ-NF-024,025

## Screen / Route / Page Entry

- Screen: -
- Route: -
- Page Entry: -

## Design Ref

- `design-reference/D-001/DESIGN.md` 접근성 공통 규칙(§0-1-5), § Do / Do Not

## Depends On

CMP-GLOBAL-A11Y, PAGE-SCR001, PAGE-SCR002, PAGE-SCR003, PAGE-SCR004, PAGE-SCR005

## Expected Files

(코드 산출물 없음 — 점검 기록만)

> 이 Task는 위에 나열된 파일 외 어떤 파일도 생성·수정하지 않는다.

## Functional AC

axe-core 스캔(핵심 페이지 serious/critical 0건 목표) + 키보드·스크린리더 수동 점검 기록

## Visual AC

해당 없음

## Security/Privacy AC

해당 없음

## Test Cases

- TC1: 점검 체크리스트의 각 항목을 실제 배포/브라우저 환경에서 확인하고 결과를 기록한다.

## Verify

해당 Task 자체가 Release Check 입력

## Definition of Done

- [ ] Functional AC 전항목 충족
- [ ] Visual AC 전항목 충족(해당 없음이 아닌 경우)
- [ ] Security/Privacy AC 전항목 충족(해당 없음이 아닌 경우)
- [ ] Test Cases 전항목 통과
- [ ] Verify에 명시된 Task(해당 Task 자체가 Release Check 입력)와 연동 확인
- [ ] Expected Files 목록 외 파일 변경 없음

## Forbidden

- `Expected Files`에 나열되지 않은 파일 생성·수정 금지
- 구현 코드 커밋, Git Branch 생성, Issue 생성 금지(이 Task 자체는 문서 산출물)
- Airbnb 상표 요소(로고·워드마크·컬러값) 사용 금지
- 구매·예약·결제 UI 추가 금지
- Lorem ipsum, "준비 중", "정보 확인 필요", 내용 없는 빈 Card 금지
