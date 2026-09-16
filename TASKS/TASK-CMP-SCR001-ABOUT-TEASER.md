# CMP-SCR001-ABOUT-TEASER — free_traveler 소개 요약 섹션

- **Category:** COMPONENT
- **Implementation Status:** IMPLEMENT
- **Priority:** P1
- **소스:** `TASKS/00_TASK_LIST.md` Seq 11

## Context

**CMP-SCR001-ABOUT-TEASER — free_traveler 소개 요약 섹션** (Component 구현). Screen `SCR-001`(Route `/`)의 일부로 동작한다. 우선순위 P1, Depends On: DATA-REPRESENTATIVE.

## Project Scope

**Implementation Status:** IMPLEMENT

PROJECT_SCOPE.md "구현 방식" 표에 명시된 방식(정적 데이터/localStorage/Toast/조회 시 계산 등)을 그대로 따른다. 이 Task가 다루지 않는 PROJECT_SCOPE.md EXCLUDED 항목(예: CMS, 미디어 업로드 승인, 감사 로그, 대시보드)은 구현하지 않는다.

## Requirement Ref

(파생 — REQ-FUNC-057 요약 재사용)

## Screen / Route / Page Entry

- Screen: SCR-001
- Route: `/`
- Page Entry: -

## Design Ref

- `design-reference/D-001/DESIGN.md` § Do / Do Not

## Depends On

DATA-REPRESENTATIVE

## Expected Files

`src/app/_components/scr001/AboutTeaser.tsx`(create)

> 이 Task는 위에 나열된 파일 외 어떤 파일도 생성·수정하지 않는다.

## Functional AC

좌측 텍스트+50+/30+ 배지, 우측 이미지, "대표 이야기 더 보기" CTA → `/about`

## Visual AC

좌우 분할 레이아웃, Desktop 1열 Mobile 스택

## Security/Privacy AC

해당 없음

## Test Cases

- TC1: free_traveler 소개 요약 섹션의 Functional AC에 기술된 각 동작이 지정된 입력에 대해 명세대로 동작한다.
- TC2: Requirement Ref에 나열된 각 REQ 항목의 수용 기준을 개별적으로 만족한다.
- TC3: Visual AC에 기술된 D-001 토큰(색상/모양/여백)만 사용하고 임의 색상이 없다.

## Verify

E2E-PUBLIC-SMOKE

## Definition of Done

- [ ] Functional AC 전항목 충족
- [ ] Visual AC 전항목 충족(해당 없음이 아닌 경우)
- [ ] Security/Privacy AC 전항목 충족(해당 없음이 아닌 경우)
- [ ] Test Cases 전항목 통과
- [ ] Verify에 명시된 Task(E2E-PUBLIC-SMOKE)와 연동 확인
- [ ] Expected Files 목록 외 파일 변경 없음

## Forbidden

- `Expected Files`에 나열되지 않은 파일 생성·수정 금지
- 구현 코드 커밋, Git Branch 생성, Issue 생성 금지(이 Task 자체는 문서 산출물)
- Airbnb 상표 요소(로고·워드마크·컬러값) 사용 금지
- 구매·예약·결제 UI 추가 금지
- Lorem ipsum, "준비 중", "정보 확인 필요", 내용 없는 빈 Card 금지
