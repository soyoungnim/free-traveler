# Free Traveler — UI/UX Traceability Matrix

- **Document ID:** UIUX-TRACE-001
- **기반 문서:** `02_SRS_BASELINE.md`, `PROJECT_SCOPE.md`, `03_UI_COVERAGE_ANALYSIS.md`, `design-reference/UI_CONTRACT.md`, `design-reference/SCREEN_ROUTE_CONTRACT.json`
- **범위:** REQ-FUNC-001~080, REQ-NF-001~034 (총 114개, 삭제 없음)

## 열 정의

| 열 | 정의 |
|---|---|
| **Requirement** | `02_SRS_BASELINE.md` 원문 ID |
| **Implementation Status** | `PROJECT_SCOPE.md` 분류(IMPLEMENT / IMPLEMENT(축소) / IMPLEMENT(최선노력) / IMPLEMENT(목표) / EXCLUDED) |
| **Screen** | 배치된 승인 Screen ID(SCR-001~005) 또는 전역/기술 Route/해당 없음 |
| **Route** | `SCREEN_ROUTE_CONTRACT.json` 기준 공개 Route |
| **Page Entry** | `SCREEN_ROUTE_CONTRACT.json` 기준 구현 파일 |
| **Task** | 구현 Task ID. Task가 아직 생성되지 않았으므로 EXCLUDED가 아닌 모든 행은 `PENDING_TASK_GENERATION`, EXCLUDED 행은 `N/A (EXCLUDED)` |
| **Test** | `PROJECT_SCOPE.md` 확인 방법(테스트/검증 수단) |
| **Status** | 현재 실제 구현 상태. `src/app`에는 아직 기본 페이지 외 구현이 없으므로 EXCLUDED가 아닌 모든 행은 `PENDING_IMPLEMENTATION`으로 기록하며 `IMPLEMENTED`로 거짓 기록하지 않는다. EXCLUDED 행은 `EXCLUDED` |

---

## F1. Destination Guide (REQ-FUNC-001~010)

| Requirement | Implementation Status | Screen | Route | Page Entry | Task | Test | Status |
|---|---|---|---|---|---|---|---|
| REQ-FUNC-001 | IMPLEMENT | SCR-001 | `/` | `src/app/page.tsx` | PENDING_TASK_GENERATION | Playwright: 탭 전환 시 구분별 결과만 노출 | PENDING_IMPLEMENTATION |
| REQ-FUNC-002 | IMPLEMENT | SCR-001 | `/` | `src/app/page.tsx` | PENDING_TASK_GENERATION | Playwright: 복수 필터 결과 검증 | PENDING_IMPLEMENTATION |
| REQ-FUNC-003 | IMPLEMENT | SCR-001 | `/` | `src/app/page.tsx` | PENDING_TASK_GENERATION | Playwright: 키워드 검색 결과 확인 | PENDING_IMPLEMENTATION |
| REQ-FUNC-004 | IMPLEMENT | SCR-001 | `/` | `src/app/page.tsx` | PENDING_TASK_GENERATION | 데이터 검증 스크립트로 필수 필드 존재 확인 | PENDING_IMPLEMENTATION |
| REQ-FUNC-005 | IMPLEMENT | SCR-001 | `/` | `src/app/page.tsx` | PENDING_TASK_GENERATION | Playwright: 빈 결과 후 초기화 동작 | PENDING_IMPLEMENTATION |
| REQ-FUNC-006 | IMPLEMENT | SCR-001 | `/` | `src/app/page.tsx` | PENDING_TASK_GENERATION | Playwright: 해외 상세→안전정보 이동 | PENDING_IMPLEMENTATION |
| REQ-FUNC-007 | IMPLEMENT(축소) | SCR-001 | `/` | `src/app/page.tsx` | PENDING_TASK_GENERATION | 데이터 검증 스크립트로 alt·출처 필드 존재 확인 | PENDING_IMPLEMENTATION |
| REQ-FUNC-008 | IMPLEMENT | - (배포 게이트) | N/A | N/A | PENDING_TASK_GENERATION | 데이터 검증 스크립트로 수량 검사 | PENDING_IMPLEMENTATION |
| REQ-FUNC-009 | IMPLEMENT | SCR-001 | `/` | `src/app/page.tsx` | PENDING_TASK_GENERATION | Playwright: 관련 여행지 노출 확인 | PENDING_IMPLEMENTATION |
| REQ-FUNC-010 | IMPLEMENT | SCR-001 | `/` | `src/app/page.tsx` | PENDING_TASK_GENERATION | Playwright: 새로고침 후 필터 유지 확인 | PENDING_IMPLEMENTATION |

## F2. Flight Link-out (REQ-FUNC-011~018)

| Requirement | Implementation Status | Screen | Route | Page Entry | Task | Test | Status |
|---|---|---|---|---|---|---|---|
| REQ-FUNC-011 | IMPLEMENT | SCR-003(항공 탭) | `/travel-tools` | `src/app/travel-tools/page.tsx` | PENDING_TASK_GENERATION | Playwright: 필드 렌더링·라벨 확인 | PENDING_IMPLEMENTATION |
| REQ-FUNC-012 | IMPLEMENT | SCR-003(항공 탭) | `/travel-tools` | `src/app/travel-tools/page.tsx` | PENDING_TASK_GENERATION | Playwright: 국가 변경 시 지역값 리셋 | PENDING_IMPLEMENTATION |
| REQ-FUNC-013 | IMPLEMENT | SCR-003(항공 탭) | `/travel-tools` | `src/app/travel-tools/page.tsx` | PENDING_TASK_GENERATION | Playwright: 경계값 제출 차단 확인 | PENDING_IMPLEMENTATION |
| REQ-FUNC-014 | IMPLEMENT | SCR-003(항공 탭) | `/travel-tools` | `src/app/travel-tools/page.tsx` | PENDING_TASK_GENERATION | Playwright: 수정 후 값 유지 확인 | PENDING_IMPLEMENTATION |
| REQ-FUNC-015 | IMPLEMENT | SCR-003(항공 탭) | `/travel-tools` | `src/app/travel-tools/page.tsx` | PENDING_TASK_GENERATION | Playwright: 고지 텍스트 노출 확인 | PENDING_IMPLEMENTATION |
| REQ-FUNC-016 | IMPLEMENT | SCR-003(항공 탭) | `/travel-tools` | `src/app/travel-tools/page.tsx` | PENDING_TASK_GENERATION | Playwright: 새 탭 URL에 query 없음 확인 | PENDING_IMPLEMENTATION |
| REQ-FUNC-017 | IMPLEMENT | - (클라이언트 상태 정책) | N/A | N/A | PENDING_TASK_GENERATION | 코드 리뷰 + 네트워크 탭 확인(수동) | PENDING_IMPLEMENTATION |
| REQ-FUNC-018 | IMPLEMENT(축소) | SCR-003(항공 탭) | `/travel-tools` | `src/app/travel-tools/page.tsx` | PENDING_TASK_GENERATION | Playwright: URL 미설정 상태 오류 표시 확인 | PENDING_IMPLEMENTATION |

## F3. Hotel Link-out (REQ-FUNC-019~026)

| Requirement | Implementation Status | Screen | Route | Page Entry | Task | Test | Status |
|---|---|---|---|---|---|---|---|
| REQ-FUNC-019 | IMPLEMENT | SCR-003(숙소 탭) | `/travel-tools` | `src/app/travel-tools/page.tsx` | PENDING_TASK_GENERATION | Playwright: 필드 렌더링 확인 | PENDING_IMPLEMENTATION |
| REQ-FUNC-020 | IMPLEMENT | SCR-003(숙소 탭) | `/travel-tools` | `src/app/travel-tools/page.tsx` | PENDING_TASK_GENERATION | Playwright: 지역값 리셋 확인 | PENDING_IMPLEMENTATION |
| REQ-FUNC-021 | IMPLEMENT | SCR-003(숙소 탭) | `/travel-tools` | `src/app/travel-tools/page.tsx` | PENDING_TASK_GENERATION | Playwright: 경계값 제출 차단 확인 | PENDING_IMPLEMENTATION |
| REQ-FUNC-022 | IMPLEMENT | SCR-003(숙소 탭) | `/travel-tools` | `src/app/travel-tools/page.tsx` | PENDING_TASK_GENERATION | Playwright: 요약값 일치 확인 | PENDING_IMPLEMENTATION |
| REQ-FUNC-023 | IMPLEMENT | SCR-003(숙소 탭) | `/travel-tools` | `src/app/travel-tools/page.tsx` | PENDING_TASK_GENERATION | Playwright: 고지 텍스트 확인 | PENDING_IMPLEMENTATION |
| REQ-FUNC-024 | IMPLEMENT | SCR-003(숙소 탭) | `/travel-tools` | `src/app/travel-tools/page.tsx` | PENDING_TASK_GENERATION | Playwright: query 미부착 확인 | PENDING_IMPLEMENTATION |
| REQ-FUNC-025 | IMPLEMENT | - (클라이언트 상태 정책) | N/A | N/A | PENDING_TASK_GENERATION | 코드 리뷰 + 네트워크 탭 확인(수동) | PENDING_IMPLEMENTATION |
| REQ-FUNC-026 | IMPLEMENT(축소) | SCR-003(숙소 탭) | `/travel-tools` | `src/app/travel-tools/page.tsx` | PENDING_TASK_GENERATION | Playwright: 오류 표시·입력 유지 확인 | PENDING_IMPLEMENTATION |

## F4. Travel Mate (REQ-FUNC-027~045)

| Requirement | Implementation Status | Screen | Route | Page Entry | Task | Test | Status |
|---|---|---|---|---|---|---|---|
| REQ-FUNC-027 | IMPLEMENT | SCR-003(동행 작성 탭) | `/travel-tools` | `src/app/travel-tools/page.tsx` | PENDING_TASK_GENERATION | Playwright: 비로그인 작성 시도 차단 확인 | PENDING_IMPLEMENTATION |
| REQ-FUNC-028 | IMPLEMENT | SCR-005(프로필 탭) | `/account` | `src/app/account/page.tsx` | PENDING_TASK_GENERATION | Supabase 테이블 스키마 확인 | PENDING_IMPLEMENTATION |
| REQ-FUNC-029 | IMPLEMENT | SCR-005(프로필 탭) | `/account` | `src/app/account/page.tsx` | PENDING_TASK_GENERATION | Playwright: 프로필 폼 검증 | PENDING_IMPLEMENTATION |
| REQ-FUNC-030 | IMPLEMENT | SCR-004 | `/mates` | `src/app/mates/page.tsx` | PENDING_TASK_GENERATION | Playwright: 필터·차단 제외 확인 | PENDING_IMPLEMENTATION |
| REQ-FUNC-031 | IMPLEMENT | SCR-003(동행 작성 탭) | `/travel-tools` | `src/app/travel-tools/page.tsx` | PENDING_TASK_GENERATION | Playwright: 누락·역전 날짜 차단 확인 | PENDING_IMPLEMENTATION |
| REQ-FUNC-032 | IMPLEMENT | SCR-003(동행 작성 탭) | `/travel-tools` | `src/app/travel-tools/page.tsx` | PENDING_TASK_GENERATION | Playwright: 금지 패턴 포함 시 제출 차단 확인 | PENDING_IMPLEMENTATION |
| REQ-FUNC-033 | IMPLEMENT | SCR-004 | `/mates` | `src/app/mates/page.tsx` | PENDING_TASK_GENERATION | 코드 리뷰: API/컴포넌트 응답 필드 확인 | PENDING_IMPLEMENTATION |
| REQ-FUNC-034 | IMPLEMENT | SCR-004 | `/mates` | `src/app/mates/page.tsx` | PENDING_TASK_GENERATION | Playwright: 참가 요청 제출 확인 | PENDING_IMPLEMENTATION |
| REQ-FUNC-035 | IMPLEMENT | SCR-004 | `/mates` | `src/app/mates/page.tsx` | PENDING_TASK_GENERATION | Playwright: 중복 요청 차단 확인 | PENDING_IMPLEMENTATION |
| REQ-FUNC-036 | IMPLEMENT | SCR-005(내 활동 탭) | `/account` | `src/app/account/page.tsx` | PENDING_TASK_GENERATION | Playwright: 승인·거절 흐름 확인 | PENDING_IMPLEMENTATION |
| REQ-FUNC-037 | IMPLEMENT | SCR-004 | `/mates` | `src/app/mates/page.tsx` | PENDING_TASK_GENERATION | Playwright: 종료일 경과 글이 목록에서 제외 확인 | PENDING_IMPLEMENTATION |
| REQ-FUNC-038 | IMPLEMENT | SCR-005(내 활동 탭, 폼은 SCR-003 재사용) | `/account` | `src/app/account/page.tsx` | PENDING_TASK_GENERATION | Playwright: 수동 마감/수정 동작 확인 | PENDING_IMPLEMENTATION |
| REQ-FUNC-039 | IMPLEMENT | SCR-004 | `/mates` | `src/app/mates/page.tsx` | PENDING_TASK_GENERATION | Playwright: 신고 제출·접수 ID 확인 | PENDING_IMPLEMENTATION |
| REQ-FUNC-040 | IMPLEMENT | SCR-004 | `/mates` | `src/app/mates/page.tsx` | PENDING_TASK_GENERATION | Playwright: 차단 후 콘텐츠 미노출 확인 | PENDING_IMPLEMENTATION |
| REQ-FUNC-041 | IMPLEMENT(축소) | SCR-005(관리자 탭) | `/account` | `src/app/account/page.tsx` | PENDING_TASK_GENERATION | Playwright: 관리자 신고 목록·상태 필터 확인 | PENDING_IMPLEMENTATION |
| REQ-FUNC-042 | IMPLEMENT(축소) | SCR-005(관리자 탭) | `/account` | `src/app/account/page.tsx` | PENDING_TASK_GENERATION | Playwright: 상태 변경 후 목록 반영 확인 | PENDING_IMPLEMENTATION |
| REQ-FUNC-043 | IMPLEMENT | SCR-004 (+SCR-005 내 활동) | `/mates` | `src/app/mates/page.tsx` | PENDING_TASK_GENERATION | Playwright: 승인/거절 시 Toast 노출 확인 | PENDING_IMPLEMENTATION |
| REQ-FUNC-044 | IMPLEMENT | - (RLS 정책) | N/A | N/A | PENDING_TASK_GENERATION | Supabase RLS 정책 검토 + 권한별 접근 테스트 | PENDING_IMPLEMENTATION |
| REQ-FUNC-045 | IMPLEMENT(축소) | SCR-005(내 활동 탭) | `/account` | `src/app/account/page.tsx` | PENDING_TASK_GENERATION | Playwright: 탈퇴 후 공개 프로필 비식별화 확인 | PENDING_IMPLEMENTATION |

## F5. Country Safety (REQ-FUNC-046~056)

| Requirement | Implementation Status | Screen | Route | Page Entry | Task | Test | Status |
|---|---|---|---|---|---|---|---|
| REQ-FUNC-046 | IMPLEMENT | - (콘텐츠 게이트) | N/A | N/A | PENDING_TASK_GENERATION | 데이터 검증 스크립트로 국가 수 일치 확인 | PENDING_IMPLEMENTATION |
| REQ-FUNC-047 | IMPLEMENT | SCR-001(안전정보 Modal) | `/` | `src/app/page.tsx` | PENDING_TASK_GENERATION | 데이터 검증 스크립트로 카테고리 누락 확인 | PENDING_IMPLEMENTATION |
| REQ-FUNC-048 | IMPLEMENT | SCR-001(안전정보 Modal) | `/` | `src/app/page.tsx` | PENDING_TASK_GENERATION | 데이터 검증 스크립트로 필드 존재 확인 | PENDING_IMPLEMENTATION |
| REQ-FUNC-049 | IMPLEMENT | SCR-001(안전정보 Modal) | `/` | `src/app/page.tsx` | PENDING_TASK_GENERATION | Playwright: 링크 속성·새 탭 확인 | PENDING_IMPLEMENTATION |
| REQ-FUNC-050 | IMPLEMENT | SCR-001(안전정보 Modal) | `/` | `src/app/page.tsx` | PENDING_TASK_GENERATION | Playwright: 7일 초과 데이터에 경고 노출 확인 | PENDING_IMPLEMENTATION |
| REQ-FUNC-051 | IMPLEMENT | SCR-001(안전정보 Modal) | `/` | `src/app/page.tsx` | PENDING_TASK_GENERATION | Playwright: 상단 노출 확인 | PENDING_IMPLEMENTATION |
| REQ-FUNC-052 | IMPLEMENT | SCR-001(안전정보 Modal) | `/` | `src/app/page.tsx` | PENDING_TASK_GENERATION | 데이터 검증 스크립트로 필드 존재 확인 | PENDING_IMPLEMENTATION |
| REQ-FUNC-053 | IMPLEMENT | SCR-001(안전정보 Modal) | `/` | `src/app/page.tsx` | PENDING_TASK_GENERATION | Playwright: 긴급연락처 섹션 노출 확인 | PENDING_IMPLEMENTATION |
| REQ-FUNC-054 | IMPLEMENT | SCR-001(안전정보 Modal) | `/` | `src/app/page.tsx` | PENDING_TASK_GENERATION | Playwright: 고지 텍스트 노출 확인 | PENDING_IMPLEMENTATION |
| REQ-FUNC-055 | EXCLUDED | N/A | N/A | N/A | N/A (EXCLUDED) | 해당 없음(정적 데이터 코드 리뷰로 대체) | EXCLUDED |
| REQ-FUNC-056 | EXCLUDED | N/A | N/A | N/A | N/A (EXCLUDED) | 해당 없음(git log로 대체) | EXCLUDED |

## F6. About free_traveler (REQ-FUNC-057~063)

| Requirement | Implementation Status | Screen | Route | Page Entry | Task | Test | Status |
|---|---|---|---|---|---|---|---|
| REQ-FUNC-057 | IMPLEMENT | SCR-002 | `/about` | `src/app/about/page.tsx` | PENDING_TASK_GENERATION | Playwright: 홈·대표 페이지 값 일치 확인 | PENDING_IMPLEMENTATION |
| REQ-FUNC-058 | IMPLEMENT | SCR-002 | `/about` | `src/app/about/page.tsx` | PENDING_TASK_GENERATION | Playwright: 텍스트 노출 확인 | PENDING_IMPLEMENTATION |
| REQ-FUNC-059 | IMPLEMENT | SCR-002 | `/about` | `src/app/about/page.tsx` | PENDING_TASK_GENERATION | 데이터 검증 스크립트로 국가 수 확인 | PENDING_IMPLEMENTATION |
| REQ-FUNC-060 | IMPLEMENT | SCR-002 | `/about` | `src/app/about/page.tsx` | PENDING_TASK_GENERATION | Playwright: 타임라인 렌더링 확인 | PENDING_IMPLEMENTATION |
| REQ-FUNC-061 | IMPLEMENT(축소) | SCR-002 | `/about` | `src/app/about/page.tsx` | PENDING_TASK_GENERATION | 데이터 검증 스크립트로 alt·출처 필드 확인 | PENDING_IMPLEMENTATION |
| REQ-FUNC-062 | IMPLEMENT | SCR-002 | `/about` | `src/app/about/page.tsx` | PENDING_TASK_GENERATION | Playwright: 링크 노출/생략 조건 확인 | PENDING_IMPLEMENTATION |
| REQ-FUNC-063 | IMPLEMENT | SCR-002 | `/about` | `src/app/about/page.tsx` | PENDING_TASK_GENERATION | Playwright: 추천 여행지 링크 확인 | PENDING_IMPLEMENTATION |

## F7. Common, Admin, Governance (REQ-FUNC-064~080)

| Requirement | Implementation Status | Screen | Route | Page Entry | Task | Test | Status |
|---|---|---|---|---|---|---|---|
| REQ-FUNC-064 | IMPLEMENT | 전역(공통 레이아웃) | 전체 Route | `src/app/layout.tsx` | PENDING_TASK_GENERATION | Playwright: 전 페이지 내비게이션 존재 확인 | PENDING_IMPLEMENTATION |
| REQ-FUNC-065 | IMPLEMENT | 전역(공통 레이아웃) | 전체 Route | `src/app/layout.tsx` | PENDING_TASK_GENERATION | Playwright: 모바일 뷰포트 렌더링 확인 | PENDING_IMPLEMENTATION |
| REQ-FUNC-066 | IMPLEMENT | SCR-005(로그인/가입 탭) | `/account` | `src/app/account/page.tsx` | PENDING_TASK_GENERATION | Playwright: 인증 핵심 흐름 확인 | PENDING_IMPLEMENTATION |
| REQ-FUNC-067 | IMPLEMENT | SCR-001 | `/` | `src/app/page.tsx` | PENDING_TASK_GENERATION | Playwright: 통합 검색 결과 확인 | PENDING_IMPLEMENTATION |
| REQ-FUNC-068 | IMPLEMENT | SCR-001 | `/` | `src/app/page.tsx` | PENDING_TASK_GENERATION | Playwright: 즐겨찾기 토글·중복 방지 확인 | PENDING_IMPLEMENTATION |
| REQ-FUNC-069 | IMPLEMENT | SCR-001 (+SCR-004) | `/` | `src/app/page.tsx` | PENDING_TASK_GENERATION | Playwright: 공유/복사 동작 확인 | PENDING_IMPLEMENTATION |
| REQ-FUNC-070 | IMPLEMENT | - (메타데이터, 전 Screen 적용) | N/A | N/A | PENDING_TASK_GENERATION | 코드 리뷰 + 페이지별 메타태그 확인 | PENDING_IMPLEMENTATION |
| REQ-FUNC-071 | EXCLUDED | N/A | N/A | N/A | N/A (EXCLUDED) | 해당 없음 | EXCLUDED |
| REQ-FUNC-072 | EXCLUDED | N/A | N/A | N/A | N/A (EXCLUDED) | 해당 없음 | EXCLUDED |
| REQ-FUNC-073 | EXCLUDED | N/A | N/A | N/A | N/A (EXCLUDED) | 해당 없음 | EXCLUDED |
| REQ-FUNC-074 | IMPLEMENT(축소) | - (데이터 검증 스크립트) | N/A | N/A | PENDING_TASK_GENERATION | 데이터 검증 스크립트 실행 결과 확인 | PENDING_IMPLEMENTATION |
| REQ-FUNC-075 | EXCLUDED | N/A | N/A | N/A | N/A (EXCLUDED) | 해당 없음 | EXCLUDED |
| REQ-FUNC-076 | EXCLUDED | N/A | N/A | N/A | N/A (EXCLUDED) | 해당 없음 | EXCLUDED |
| REQ-FUNC-077 | IMPLEMENT | SCR-005(관리자 탭) | `/account` | `src/app/account/page.tsx` | PENDING_TASK_GENERATION | Playwright: 관리자 URL 설정·검증 확인 | PENDING_IMPLEMENTATION |
| REQ-FUNC-078 | IMPLEMENT | 기술 Route(디자인 Screen 아님) | `*`(오류 상황) | `src/app/not-found.tsx`, `src/app/error.tsx` | PENDING_TASK_GENERATION | Playwright: 각 오류 화면 복구 버튼 확인 | PENDING_IMPLEMENTATION |
| REQ-FUNC-079 | IMPLEMENT | 전역(공통 컴포넌트) | 전체 Route | `src/app/layout.tsx` | PENDING_TASK_GENERATION | Playwright + axe-core 스캔(핵심 페이지) | PENDING_IMPLEMENTATION |
| REQ-FUNC-080 | IMPLEMENT | SCR-003(동행 작성 탭) | `/travel-tools` | `src/app/travel-tools/page.tsx` | PENDING_TASK_GENERATION | Playwright: 동의 체크 없이 제출 차단 확인 | PENDING_IMPLEMENTATION |

## NF-1. Performance (REQ-NF-001~007)

| Requirement | Implementation Status | Screen | Route | Page Entry | Task | Test | Status |
|---|---|---|---|---|---|---|---|
| REQ-NF-001 | IMPLEMENT(최선노력) | - | N/A | N/A | PENDING_TASK_GENERATION | 수동 Lighthouse 점검 | PENDING_IMPLEMENTATION |
| REQ-NF-002 | IMPLEMENT(최선노력) | - | N/A | N/A | PENDING_TASK_GENERATION | 수동 점검 | PENDING_IMPLEMENTATION |
| REQ-NF-003 | IMPLEMENT(최선노력) | - | N/A | N/A | PENDING_TASK_GENERATION | 수동 점검 | PENDING_IMPLEMENTATION |
| REQ-NF-004 | IMPLEMENT | SCR-001 (+SCR-004) | `/` | `src/app/page.tsx` | PENDING_TASK_GENERATION | Playwright: 필터 응답 체감 확인 | PENDING_IMPLEMENTATION |
| REQ-NF-005 | IMPLEMENT(최선노력) | - | N/A | N/A | PENDING_TASK_GENERATION | Playwright: 쓰기 흐름 정상 동작 확인 | PENDING_IMPLEMENTATION |
| REQ-NF-006 | IMPLEMENT | - (SCR-001/002 이미지에 적용) | N/A | N/A | PENDING_TASK_GENERATION | 코드 리뷰: next/image 옵션 확인 | PENDING_IMPLEMENTATION |
| REQ-NF-007 | EXCLUDED | N/A | N/A | N/A | N/A (EXCLUDED) | 해당 없음(수동 점검으로 대체) | EXCLUDED |

## NF-2. Reliability (REQ-NF-008~011)

| Requirement | Implementation Status | Screen | Route | Page Entry | Task | Test | Status |
|---|---|---|---|---|---|---|---|
| REQ-NF-008 | EXCLUDED | N/A | N/A | N/A | N/A (EXCLUDED) | 해당 없음 | EXCLUDED |
| REQ-NF-009 | EXCLUDED | N/A | N/A | N/A | N/A (EXCLUDED) | 해당 없음 | EXCLUDED |
| REQ-NF-010 | EXCLUDED | N/A | N/A | N/A | N/A (EXCLUDED) | 해당 없음 | EXCLUDED |
| REQ-NF-011 | EXCLUDED | N/A | N/A | N/A | N/A (EXCLUDED) | 해당 없음 | EXCLUDED |

## NF-3. Security and Privacy (REQ-NF-012~018)

| Requirement | Implementation Status | Screen | Route | Page Entry | Task | Test | Status |
|---|---|---|---|---|---|---|---|
| REQ-NF-012 | IMPLEMENT | - | N/A | N/A | PENDING_TASK_GENERATION | 배포 후 HTTPS 접속 확인 | PENDING_IMPLEMENTATION |
| REQ-NF-013 | IMPLEMENT | - | N/A | N/A | PENDING_TASK_GENERATION | Supabase RLS 정책 리뷰 + 권한별 접근 테스트 | PENDING_IMPLEMENTATION |
| REQ-NF-014 | IMPLEMENT | - | N/A | N/A | PENDING_TASK_GENERATION | 코드 리뷰: 쿠키·요청 설정 확인 | PENDING_IMPLEMENTATION |
| REQ-NF-015 | IMPLEMENT | - | N/A | N/A | PENDING_TASK_GENERATION | Playwright: 스크립트 태그 입력 시 무해화 확인 | PENDING_IMPLEMENTATION |
| REQ-NF-016 | IMPLEMENT | - | N/A | N/A | PENDING_TASK_GENERATION | 빌드 산출물에서 비밀키 문자열 검색 | PENDING_IMPLEMENTATION |
| REQ-NF-017 | IMPLEMENT | - | N/A | N/A | PENDING_TASK_GENERATION | 네트워크 탭·DB 확인(수동) | PENDING_IMPLEMENTATION |
| REQ-NF-018 | IMPLEMENT(축소) | SCR-005(내 활동 탭) | `/account` | `src/app/account/page.tsx` | PENDING_TASK_GENERATION | Playwright: 탈퇴 요청 흐름 확인 | PENDING_IMPLEMENTATION |

## NF-4. Safety and Moderation (REQ-NF-019~022)

| Requirement | Implementation Status | Screen | Route | Page Entry | Task | Test | Status |
|---|---|---|---|---|---|---|---|
| REQ-NF-019 | IMPLEMENT | - (SCR-004 신고 폼에 적용) | N/A | N/A | PENDING_TASK_GENERATION | Playwright: 신고 접수 응답 확인 | PENDING_IMPLEMENTATION |
| REQ-NF-020 | EXCLUDED | N/A | N/A | N/A | N/A (EXCLUDED) | 해당 없음 | EXCLUDED |
| REQ-NF-021 | EXCLUDED | N/A | N/A | N/A | N/A (EXCLUDED) | 해당 없음 | EXCLUDED |
| REQ-NF-022 | EXCLUDED | N/A | N/A | N/A | N/A (EXCLUDED) | 해당 없음 | EXCLUDED |

## NF-5. Accessibility (REQ-NF-023~025)

| Requirement | Implementation Status | Screen | Route | Page Entry | Task | Test | Status |
|---|---|---|---|---|---|---|---|
| REQ-NF-023 | IMPLEMENT(목표) | 전역(공통 컴포넌트) | 전체 Route | `src/app/layout.tsx` | PENDING_TASK_GENERATION | 수동 점검 | PENDING_IMPLEMENTATION |
| REQ-NF-024 | IMPLEMENT(축소) | - (QA 프로세스) | N/A | N/A | PENDING_TASK_GENERATION | Playwright + axe-core 결과 확인 | PENDING_IMPLEMENTATION |
| REQ-NF-025 | IMPLEMENT(축소) | - (QA 프로세스) | N/A | N/A | PENDING_TASK_GENERATION | 수동 키보드 내비게이션 점검 | PENDING_IMPLEMENTATION |

## NF-6. Content, Freshness, SEO, Copyright (REQ-NF-026~030)

| Requirement | Implementation Status | Screen | Route | Page Entry | Task | Test | Status |
|---|---|---|---|---|---|---|---|
| REQ-NF-026 | IMPLEMENT | - (데이터 검증 게이트) | N/A | N/A | PENDING_TASK_GENERATION | 데이터 검증 스크립트 실행 | PENDING_IMPLEMENTATION |
| REQ-NF-027 | IMPLEMENT | - (데이터 검증 게이트) | N/A | N/A | PENDING_TASK_GENERATION | 데이터 검증 스크립트 실행 | PENDING_IMPLEMENTATION |
| REQ-NF-028 | IMPLEMENT(축소) | - (경고 UI는 SCR-001 FUNC-050) | N/A | N/A | PENDING_TASK_GENERATION | Playwright: stale 경고 로직 확인 | PENDING_IMPLEMENTATION |
| REQ-NF-029 | EXCLUDED | N/A | N/A | N/A | N/A (EXCLUDED) | 해당 없음 | EXCLUDED |
| REQ-NF-030 | IMPLEMENT | - (전 Screen 메타데이터) | N/A | N/A | PENDING_TASK_GENERATION | 코드 리뷰: 페이지별 메타태그 확인 | PENDING_IMPLEMENTATION |

## NF-7. Maintainability, Monitoring, Cost (REQ-NF-031~034)

| Requirement | Implementation Status | Screen | Route | Page Entry | Task | Test | Status |
|---|---|---|---|---|---|---|---|
| REQ-NF-031 | IMPLEMENT(축소) | - (빌드 게이트) | N/A | N/A | PENDING_TASK_GENERATION | `npm run build`, `npm run lint` 통과 확인 | PENDING_IMPLEMENTATION |
| REQ-NF-032 | EXCLUDED | N/A | N/A | N/A | N/A (EXCLUDED) | 해당 없음 | EXCLUDED |
| REQ-NF-033 | EXCLUDED | N/A | N/A | N/A | N/A (EXCLUDED) | 해당 없음 | EXCLUDED |
| REQ-NF-034 | IMPLEMENT | - | N/A | N/A | PENDING_TASK_GENERATION | 청구 콘솔 수동 확인 | PENDING_IMPLEMENTATION |

---

## 집계

| 구분 | 개수 |
|---|---:|
| 총 Requirement | 114 |
| Implementation Status = EXCLUDED | 18 (REQ-FUNC 7건: 055·056·071·072·073·075·076 / REQ-NF 11건: 007·008·009·010·011·020·021·022·029·032·033) |
| Implementation Status = IMPLEMENT* (전체) | 96 |
| Status = PENDING_IMPLEMENTATION | 96 |
| Status = EXCLUDED | 18 |
| Status = IMPLEMENTED(구현 완료로 기록된 행) | 0 |

현재 `src/app`에는 `page.tsx`(App Router 기본 페이지) 외 구현이 없으므로, Task가 실제로 생성되고 코드가 작성되기 전까지 어떤 행도 `IMPLEMENTED`로 기록하지 않는다.
