# RELEASE-CHECK-VERCEL-SUPABASE — Vercel/Supabase 배포·비용 확인

- **Category:** RELEASE
- **Implementation Status:** IMPLEMENT
- **Priority:** P2
- **소스:** `TASKS/00_TASK_LIST.md` Seq 56

## Context

**RELEASE-CHECK-VERCEL-SUPABASE — Vercel/Supabase 배포·비용 확인** (릴리스 점검(코드 산출물 없음)). 특정 Screen에 종속되지 않는 공용/기반 Task다. 우선순위 P2, Depends On: PAGE-SCR001, PAGE-SCR002, PAGE-SCR003, PAGE-SCR004, PAGE-SCR005, DB-SCHEMA-BASE, CI-BUILD-LINT-GATE, CI-CONTENT-VALIDATION, CI-SECURITY-BASELINE.

## Project Scope

**Implementation Status:** IMPLEMENT

PROJECT_SCOPE.md에 따라 Vercel/Supabase 관리형 인프라의 기본 제공 범위에 의존하며(자동 백업·SLA 모니터링은 EXCLUDED) 배포·비용 확인은 수동 릴리스 체크로 수행한다.

## Requirement Ref

REQ-NF-012,034

## Screen / Route / Page Entry

- Screen: -
- Route: -
- Page Entry: -

## Design Ref

- `design-reference/D-001/DESIGN.md` § Do / Do Not

## Depends On

PAGE-SCR001, PAGE-SCR002, PAGE-SCR003, PAGE-SCR004, PAGE-SCR005, DB-SCHEMA-BASE, CI-BUILD-LINT-GATE, CI-CONTENT-VALIDATION, CI-SECURITY-BASELINE

## Expected Files

(코드 산출물 없음 — 배포 확인 기록만)

> 이 Task는 위에 나열된 파일 외 어떤 파일도 생성·수정하지 않는다.

## Functional AC

배포 후 HTTPS 접속 확인, Vercel/Supabase 청구 콘솔에서 월 비용 목표(10만원 이하) 확인

## Visual AC

해당 없음

## Security/Privacy AC

해당 없음

## Test Cases

- TC1: 점검 체크리스트의 각 항목을 실제 배포/브라우저 환경에서 확인하고 결과를 기록한다.

## Verify

해당 Task가 최종 릴리스 체크

## Definition of Done

- [ ] Functional AC 전항목 충족
- [ ] Visual AC 전항목 충족(해당 없음이 아닌 경우)
- [ ] Security/Privacy AC 전항목 충족(해당 없음이 아닌 경우)
- [ ] Test Cases 전항목 통과
- [ ] Verify에 명시된 Task(해당 Task가 최종 릴리스 체크)와 연동 확인
- [ ] Expected Files 목록 외 파일 변경 없음

## Forbidden

- `Expected Files`에 나열되지 않은 파일 생성·수정 금지
- 구현 코드 커밋, Git Branch 생성, Issue 생성 금지(이 Task 자체는 문서 산출물)
- Airbnb 상표 요소(로고·워드마크·컬러값) 사용 금지
- 구매·예약·결제 UI 추가 금지
- Lorem ipsum, "준비 중", "정보 확인 필요", 내용 없는 빈 Card 금지
- 자동 Merge Runner, EC2, AWS 인프라 관련 설정 추가 금지(Vercel/Supabase만 사용)
