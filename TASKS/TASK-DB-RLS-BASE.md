# DB-RLS-BASE — Row Level Security 정책

- **Category:** DB
- **Implementation Status:** IMPLEMENT
- **Priority:** P0
- **소스:** `TASKS/00_TASK_LIST.md` Seq 42

## Context

**DB-RLS-BASE — Row Level Security 정책** (Database 구현). 특정 Screen에 종속되지 않는 공용/기반 Task다. 우선순위 P0, Depends On: DB-SCHEMA-BASE.

## Project Scope

**Implementation Status:** IMPLEMENT

PROJECT_SCOPE.md에 따라 동적 데이터는 정의된 6개 테이블(`user_profiles`,`mate_posts`,`mate_applications`,`user_blocks`,`reports`,`app_settings`)로 한정하며, `audit_log`·`media_asset` 등 범용 감사 로그·미디어 관리 테이블(EXCLUDED)은 추가하지 않는다.

## Requirement Ref

REQ-FUNC-044; REQ-NF-013

## Screen / Route / Page Entry

- Screen: -
- Route: -
- Page Entry: -

## Design Ref

- `design-reference/D-001/DESIGN.md` § Do / Do Not

## Depends On

DB-SCHEMA-BASE

## Expected Files

`supabase/migrations/0002_rls.sql`(create)

> 이 Task는 위에 나열된 파일 외 어떤 파일도 생성·수정하지 않는다.

## Functional AC

본인·요청 대상 작성자·Moderator/Admin만 비공개 데이터 접근하도록 6개 테이블 전체에 RLS 정책 적용

## Visual AC

해당 없음

## Security/Privacy AC

권한별 부정 접근 테스트 전량 403/빈 결과

## Test Cases

- TC1: 마이그레이션 적용 후 정확히 6개 테이블(user_profiles, mate_posts, mate_applications, user_blocks, reports, app_settings)만 존재한다.
- TC2: 각 테이블에 정의된 컬럼이 관련 REQ의 수용 기준(예: 정확한 생년월일 미저장)을 만족한다.
- TC3: RLS/Access 관련 Task와 조합했을 때 비인가 접근이 거부된다(해당 시 `TEST-RLS-BASIC` 참조).

## Verify

TEST-RLS-BASIC

## Definition of Done

- [ ] 신규 테이블이 6개 allowlist(user_profiles, mate_posts, mate_applications, user_blocks, reports, app_settings) 밖으로 늘어나지 않음
- [ ] Functional AC 전항목 충족
- [ ] Visual AC 전항목 충족(해당 없음이 아닌 경우)
- [ ] Security/Privacy AC 전항목 충족(해당 없음이 아닌 경우)
- [ ] Test Cases 전항목 통과
- [ ] Verify에 명시된 Task(TEST-RLS-BASIC)와 연동 확인
- [ ] Expected Files 목록 외 파일 변경 없음

## Forbidden

- `Expected Files`에 나열되지 않은 파일 생성·수정 금지
- 구현 코드 커밋, Git Branch 생성, Issue 생성 금지(이 Task 자체는 문서 산출물)
- Airbnb 상표 요소(로고·워드마크·컬러값) 사용 금지
- 구매·예약·결제 UI 추가 금지
- Lorem ipsum, "준비 중", "정보 확인 필요", 내용 없는 빈 Card 금지
- 허용된 6개 테이블(user_profiles, mate_posts, mate_applications, user_blocks, reports, app_settings) 외 신규 테이블 생성 금지(`audit_log`, `media_asset` 등)
