# CMP-SCR004-DETAIL-PANEL — 동행 상세 패널(Desktop 분할/Mobile Drawer)

- **Category:** COMPONENT
- **Implementation Status:** IMPLEMENT
- **Priority:** P0
- **소스:** `TASKS/00_TASK_LIST.md` Seq 23

## Context

**CMP-SCR004-DETAIL-PANEL — 동행 상세 패널(Desktop 분할/Mobile Drawer)** (Component 구현). Screen `SCR-004`(Route `/mates`)의 일부로 동작한다. 우선순위 P0, Depends On: API-MATES-READ.

## Project Scope

**Implementation Status:** IMPLEMENT

PROJECT_SCOPE.md "구현 방식" 표에 명시된 방식(정적 데이터/localStorage/Toast/조회 시 계산 등)을 그대로 따른다. 이 Task가 다루지 않는 PROJECT_SCOPE.md EXCLUDED 항목(예: CMS, 미디어 업로드 승인, 감사 로그, 대시보드)은 구현하지 않는다.

## Requirement Ref

REQ-FUNC-033,069

## Screen / Route / Page Entry

- Screen: SCR-004
- Route: `/mates`
- Page Entry: -

## Design Ref

- `design-reference/D-001/DESIGN.md` § Do / Do Not

## Depends On

API-MATES-READ

## Expected Files

`src/app/_components/scr004/MateDetailPanel.tsx`(create)

> 이 Task는 위에 나열된 파일 외 어떤 파일도 생성·수정하지 않는다.

## Functional AC

작성자·조건·설명 표시(연락처 필드 응답 자체에 미포함), 공유 버튼

## Visual AC

Desktop 좌우 분할/Mobile Drawer 전환

## Security/Privacy AC

HTML/JSON 응답에 이메일·전화번호 필드 자체를 포함하지 않음

## Test Cases

- TC1: 동행 상세 패널(Desktop 분할/Mobile Drawer)의 Functional AC에 기술된 각 동작이 지정된 입력에 대해 명세대로 동작한다.
- TC2: Requirement Ref에 나열된 각 REQ 항목의 수용 기준을 개별적으로 만족한다.
- TC3: Visual AC에 기술된 D-001 토큰(색상/모양/여백)만 사용하고 임의 색상이 없다.

## Verify

E2E-MATE-AUTH

## Definition of Done

- [ ] Functional AC 전항목 충족
- [ ] Visual AC 전항목 충족(해당 없음이 아닌 경우)
- [ ] Security/Privacy AC 전항목 충족(해당 없음이 아닌 경우)
- [ ] Test Cases 전항목 통과
- [ ] Verify에 명시된 Task(E2E-MATE-AUTH)와 연동 확인
- [ ] Expected Files 목록 외 파일 변경 없음

## Forbidden

- `Expected Files`에 나열되지 않은 파일 생성·수정 금지
- 구현 코드 커밋, Git Branch 생성, Issue 생성 금지(이 Task 자체는 문서 산출물)
- Airbnb 상표 요소(로고·워드마크·컬러값) 사용 금지
- 구매·예약·결제 UI 추가 금지
- Lorem ipsum, "준비 중", "정보 확인 필요", 내용 없는 빈 Card 금지
