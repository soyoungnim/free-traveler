# CI-SECURITY-BASELINE — 보안 기본기(CSRF/XSS/env)

- **Category:** CI_OPS
- **Implementation Status:** IMPLEMENT
- **Priority:** P1
- **소스:** `TASKS/00_TASK_LIST.md` Seq 52

## Context

**CI-SECURITY-BASELINE — 보안 기본기(CSRF/XSS/env)** (CI/운영 스크립트 구현). 특정 Screen에 종속되지 않는 공용/기반 Task다. 우선순위 P1, Depends On: DB-RLS-BASE.

## Project Scope

**Implementation Status:** IMPLEMENT

PROJECT_SCOPE.md "제외 기능"(자동 백업·장애 알림·부하 테스트)은 이 Task의 범위가 아니다. 콘텐츠 완전성 검증·빌드 게이트·보안 기본기 등 명시적으로 IMPLEMENT로 분류된 항목만 다룬다.

## Requirement Ref

REQ-NF-014,015,016

## Screen / Route / Page Entry

- Screen: -
- Route: -
- Page Entry: -

## Design Ref

- `design-reference/D-001/DESIGN.md` § Do / Do Not

## Depends On

DB-RLS-BASE

## Expected Files

`next.config.ts`(modify), `.env.example`(create)

> 이 Task는 위에 나열된 파일 외 어떤 파일도 생성·수정하지 않는다.

## Functional AC

SameSite 쿠키, Server Actions CSRF 기본 보호 확인, 입력 이스케이프, 비밀키는 환경변수로만 관리(클라이언트 번들 미포함)

## Visual AC

해당 없음

## Security/Privacy AC

빌드 산출물에서 비밀키 문자열 부재 확인

## Test Cases

- TC1: 정상 상태 입력에 대해 스크립트/게이트가 통과(exit 0)한다.
- TC2: 규칙을 위반한 입력에 대해 실패(exit 1)하고 원인을 출력한다.

## Verify

RELEASE-CHECK-VERCEL-SUPABASE

## Definition of Done

- [ ] Functional AC 전항목 충족
- [ ] Visual AC 전항목 충족(해당 없음이 아닌 경우)
- [ ] Security/Privacy AC 전항목 충족(해당 없음이 아닌 경우)
- [ ] Test Cases 전항목 통과
- [ ] Verify에 명시된 Task(RELEASE-CHECK-VERCEL-SUPABASE)와 연동 확인
- [ ] Expected Files 목록 외 파일 변경 없음

## Forbidden

- `Expected Files`에 나열되지 않은 파일 생성·수정 금지
- 구현 코드 커밋, Git Branch 생성, Issue 생성 금지(이 Task 자체는 문서 산출물)
- Airbnb 상표 요소(로고·워드마크·컬러값) 사용 금지
- 구매·예약·결제 UI 추가 금지
- Lorem ipsum, "준비 중", "정보 확인 필요", 내용 없는 빈 Card 금지
- 자동 Merge Runner, EC2, AWS 인프라 관련 설정 추가 금지(Vercel/Supabase만 사용)
