# CMP-SCR003-FLIGHT-TAB — 항공 탭(입력·검증·요약·외부이동)

- **Category:** COMPONENT
- **Implementation Status:** IMPLEMENT(축소)
- **Priority:** P0
- **소스:** `TASKS/00_TASK_LIST.md` Seq 19

## Context

**CMP-SCR003-FLIGHT-TAB — 항공 탭(입력·검증·요약·외부이동)** (Component 구현). Screen `SCR-003`(Route `/travel-tools`)의 일부로 동작한다. 우선순위 P0, Depends On: CMP-SCR003-TAB-SHELL.

## Project Scope

**Implementation Status:** IMPLEMENT(축소)

PROJECT_SCOPE.md "구현 방식" 표에 명시된 방식(정적 데이터/localStorage/Toast/조회 시 계산 등)을 그대로 따른다. 이 Task가 다루지 않는 PROJECT_SCOPE.md EXCLUDED 항목(예: CMS, 미디어 업로드 승인, 감사 로그, 대시보드)은 구현하지 않는다.

## Requirement Ref

REQ-FUNC-011~018; REQ-NF-017

## Screen / Route / Page Entry

- Screen: SCR-003
- Route: `/travel-tools`
- Page Entry: -

## Design Ref

- `design-reference/D-001/DESIGN.md` § Form·Tabs

## Depends On

CMP-SCR003-TAB-SHELL

## Expected Files

`src/app/_components/scr003/FlightTab.tsx`(create)

> 이 Task는 위에 나열된 파일 외 어떤 파일도 생성·수정하지 않는다.

## Functional AC

국가·지역·출발일·귀국일 필수 입력, 국가 변경 시 지역 초기화, 날짜 검증(과거일·역전일 차단), 요약 표시, 비전달 고지, `noopener,noreferrer` 새 탭 이동, URL 미설정 시 오류+재시도; Tip 3개 실 콘텐츠

## Visual AC

코랄 CTA "항공편 보러 가기" 1개

## Security/Privacy AC

입력값 서버 DB·로그·URL query 미저장(클라이언트 상태만)

## Test Cases

- TC1: 항공 탭(입력·검증·요약·외부이동)의 Functional AC에 기술된 각 동작이 지정된 입력에 대해 명세대로 동작한다.
- TC2: Requirement Ref에 나열된 각 REQ 항목의 수용 기준을 개별적으로 만족한다.
- TC3: Visual AC에 기술된 D-001 토큰(색상/모양/여백)만 사용하고 임의 색상이 없다.

## Verify

UNIT-TRAVEL-DATES, E2E-TRAVEL-TOOLS

## Definition of Done

- [ ] Functional AC 전항목 충족
- [ ] Visual AC 전항목 충족(해당 없음이 아닌 경우)
- [ ] Security/Privacy AC 전항목 충족(해당 없음이 아닌 경우)
- [ ] Test Cases 전항목 통과
- [ ] Verify에 명시된 Task(UNIT-TRAVEL-DATES, E2E-TRAVEL-TOOLS)와 연동 확인
- [ ] Expected Files 목록 외 파일 변경 없음

## Forbidden

- `Expected Files`에 나열되지 않은 파일 생성·수정 금지
- 구현 코드 커밋, Git Branch 생성, Issue 생성 금지(이 Task 자체는 문서 산출물)
- Airbnb 상표 요소(로고·워드마크·컬러값) 사용 금지
- 구매·예약·결제 UI 추가 금지
- Lorem ipsum, "준비 중", "정보 확인 필요", 내용 없는 빈 Card 금지
- 항공·숙소 입력값(국가·지역·날짜)을 서버 DB·로그·URL 쿼리에 저장/전달하지 않음
