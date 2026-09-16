# Free Traveler — UI Coverage Analysis

- **Document ID:** UICOV-TRAVEL-001
- **기반 문서:** `02_SRS_BASELINE.md`, `PROJECT_SCOPE.md`
- **목적:** SRS의 REQ-FUNC-001~080, REQ-NF-001~034(총 114개)를 삭제 없이 5개 디자인 Screen에 배치한다.

---

## 1. 분류 기준

| 분류 | 정의 |
|---|---|
| **UI_DIRECT** | 화면에 직접 보이는 요소(목록, 상세, 폼, 버튼, 배지, 문구)로 구현되는 요구사항 |
| **UI_STATE** | 화면 동작을 뒷받침하는 클라이언트 상태·검증·계산 로직 요구사항(그 자체는 별도 위젯이 아님) |
| **NON_UI** | 화면에 직접 나타나지 않는 서버·데이터·보안 규칙 요구사항 |
| **OPERATIONS** | 운영·거버넌스·모니터링·릴리즈 게이트 성격의 요구사항(다수가 PROJECT_SCOPE상 EXCLUDED) |

PROJECT_SCOPE 분류는 `PROJECT_SCOPE.md`의 표기를 그대로 인용한다(IMPLEMENT / IMPLEMENT(축소) / IMPLEMENT(최선노력) / IMPLEMENT(목표) / EXCLUDED).

---

## 2. 디자인 Screen 5개 정의

### SCR-001 `/` 메인

| 항목 | 내용 |
|---|---|
| 사용자 목표 | 여행지를 탐색하고 상세·안전정보를 확인한 뒤 다음 행동(항공/호텔/동행)을 정한다. |
| 주요 영역 | 통합 검색바, 국내·해외 탭, 필터 패널, 여행지 카드 목록, **여행지 상세 Drawer/Modal**, **국가 안전정보 Drawer/Modal**, 전역 내비게이션·푸터 |
| 상태 | 기본 목록 / 필터 적용 / 검색결과 없음 / 여행지 상세 열림 / 안전정보 상세 열림(경보 상단 고정, stale 경고) / 즐겨찾기 On·Off |
| 이동 목적지 | 상세 내 "항공 조건 입력" · "숙소 조건 입력" → SCR-003 / "동행 찾기" → SCR-004 / 대표 소개 → SCR-002 / 로그인·즐겨찾기 관리 → SCR-005 |

### SCR-002 `/about` 대표 소개

| 항목 | 내용 |
|---|---|
| 사용자 목표 | free_traveler의 여행 경험과 콘텐츠 기준을 확인한다. |
| 주요 영역 | 대표 프로필 히어로(50+/30+), 여행 철학·편집 원칙, 방문 국가 목록, 여행 타임라인, 추천 여행지 6곳, 문의·SNS 링크 |
| 상태 | 단일 열람 뷰(모달 없음) / 빈 링크 생략 |
| 이동 목적지 | 추천 여행지 클릭 → SCR-001 상세 Drawer |

### SCR-003 `/travel-tools` 통합 여행 준비

| 항목 | 내용 |
|---|---|
| 사용자 목표 | 항공·숙소 조건을 정리해 외부 사이트로 이동하거나 동행 모집글을 작성한다. |
| 주요 영역 | **탭1 항공**(입력·검증·요약·외부이동), **탭2 숙소**(입력·검증·요약·외부이동), **탭3 동행 작성**(모집글 폼·연락처 탐지·안전수칙 동의) |
| 상태 | 입력 중 / 검증 오류 / 요약 확인(비전달 고지) / 외부이동 성공 / 외부이동 실패(재시도) / 동행 작성 완료 |
| 이동 목적지 | 항공·숙소 "보러가기" → 외부 사이트(새 탭) / 동행 작성 완료 → SCR-004 상세 또는 SCR-005 내 활동 / 미인증 시 → SCR-005 |

### SCR-004 `/mates` 동행 조회

| 항목 | 내용 |
|---|---|
| 사용자 목표 | 조건에 맞는 동행 모집글을 찾고 참가를 요청하거나 신고·차단한다. |
| 주요 영역 | 모집글 목록·필터, **동행 상세 패널**(작성자 정보 비공개 연락처 제외, 참가 요청 폼, 신고·차단 버튼) |
| 상태 | 목록 기본 / 필터 적용 / 결과 없음 / 상세 패널 열림 / 참가 요청 제출·중복 차단 / 자동 마감 반영 / 신고·차단 완료 |
| 이동 목적지 | 글쓰기 → SCR-003(동행 작성 탭) / 미인증 시 → SCR-005 / 내 요청 상태 확인 → SCR-005 내 활동 |

### SCR-005 `/account` 계정·관리

| 항목 | 내용 |
|---|---|
| 사용자 목표 | 로그인·회원가입·성인 확인을 완료하고 프로필·활동을 관리하며(관리자) 신고·외부 URL을 처리한다. |
| 주요 영역 | **탭1 로그인/가입**(이메일 인증, 비밀번호 재설정), **탭2 프로필**(닉네임·연령대·스타일·성인확인), **탭3 내 활동**(내 글·참가 요청 승인거절·차단 관리·탈퇴), **탭4 간단 관리자**(신고 상태 처리, 외부 URL 설정) |
| 상태 | 미인증/인증됨 / 성인확인 필요·완료 / 요청 대기·승인·거절 / 신고 OPEN·RESOLVED·DISMISSED / URL 저장 성공·실패 |
| 이동 목적지 | 동행 글 확인 → SCR-004 / 여행지 즐겨찾기 확인 → SCR-001 |

> API Route, 인증 콜백(`/auth/callback` 등), 404/500/오류 처리 라우트는 기술 Route이며 위 5개 디자인 Screen에 포함하지 않는다.

---

## 3. Requirement 매핑 — Functional (REQ-FUNC-001~080)

### 3.1 F1. Destination Guide (10)

| ID | UI 분류 | PROJECT_SCOPE | Screen | 배치 위치 |
|---|---|---|---|---|
| REQ-FUNC-001 | UI_DIRECT | IMPLEMENT | SCR-001 | 국내·해외 탭 |
| REQ-FUNC-002 | UI_DIRECT | IMPLEMENT | SCR-001 | 필터 패널 |
| REQ-FUNC-003 | UI_DIRECT | IMPLEMENT | SCR-001 | 검색바 |
| REQ-FUNC-004 | UI_DIRECT | IMPLEMENT | SCR-001 | 여행지 상세 Drawer/Modal |
| REQ-FUNC-005 | UI_DIRECT | IMPLEMENT | SCR-001 | 목록 빈 결과 안내 |
| REQ-FUNC-006 | UI_DIRECT | IMPLEMENT | SCR-001 | 상세 Drawer → 안전정보 Modal 연결 |
| REQ-FUNC-007 | UI_DIRECT | IMPLEMENT(축소) | SCR-001 | 상세 Drawer 이미지 alt/출처 |
| REQ-FUNC-008 | OPERATIONS | IMPLEMENT | - | 배포 전 콘텐츠 수량 검증 게이트(스크립트) |
| REQ-FUNC-009 | UI_DIRECT | IMPLEMENT | SCR-001 | 상세 Drawer 하단 추천 여행지 |
| REQ-FUNC-010 | UI_STATE | IMPLEMENT | SCR-001 | 필터 상태 URL query 동기화 |

### 3.2 F2. Flight Link-out (8)

| ID | UI 분류 | PROJECT_SCOPE | Screen | 배치 위치 |
|---|---|---|---|---|
| REQ-FUNC-011 | UI_DIRECT | IMPLEMENT | SCR-003 | 항공 탭 입력 폼 |
| REQ-FUNC-012 | UI_STATE | IMPLEMENT | SCR-003 | 항공 탭 국가→지역 연동 로직 |
| REQ-FUNC-013 | UI_STATE | IMPLEMENT | SCR-003 | 항공 탭 날짜 검증 로직 |
| REQ-FUNC-014 | UI_DIRECT | IMPLEMENT | SCR-003 | 항공 탭 요약 화면 |
| REQ-FUNC-015 | UI_DIRECT | IMPLEMENT | SCR-003 | 항공 탭 비전달 고지 문구 |
| REQ-FUNC-016 | UI_DIRECT | IMPLEMENT | SCR-003 | 항공 탭 외부이동 버튼 |
| REQ-FUNC-017 | NON_UI | IMPLEMENT | - | 항공 입력값 서버 미저장 정책 |
| REQ-FUNC-018 | UI_DIRECT | IMPLEMENT(축소) | SCR-003 | 항공 탭 외부이동 오류 안내 |

### 3.3 F3. Hotel Link-out (8)

| ID | UI 분류 | PROJECT_SCOPE | Screen | 배치 위치 |
|---|---|---|---|---|
| REQ-FUNC-019 | UI_DIRECT | IMPLEMENT | SCR-003 | 숙소 탭 입력 폼 |
| REQ-FUNC-020 | UI_STATE | IMPLEMENT | SCR-003 | 숙소 탭 국가→지역 연동 로직 |
| REQ-FUNC-021 | UI_STATE | IMPLEMENT | SCR-003 | 숙소 탭 날짜 검증 로직 |
| REQ-FUNC-022 | UI_DIRECT | IMPLEMENT | SCR-003 | 숙소 탭 요약 화면 |
| REQ-FUNC-023 | UI_DIRECT | IMPLEMENT | SCR-003 | 숙소 탭 비전달 고지 문구 |
| REQ-FUNC-024 | UI_DIRECT | IMPLEMENT | SCR-003 | 숙소 탭 외부이동 버튼 |
| REQ-FUNC-025 | NON_UI | IMPLEMENT | - | 숙소 입력값 서버 미저장 정책 |
| REQ-FUNC-026 | UI_DIRECT | IMPLEMENT(축소) | SCR-003 | 숙소 탭 외부이동 오류 안내 |

### 3.4 F4. Travel Mate (19)

| ID | UI 분류 | PROJECT_SCOPE | Screen | 배치 위치 |
|---|---|---|---|---|
| REQ-FUNC-027 | UI_STATE | IMPLEMENT | SCR-003 | 동행 작성 탭 진입 인증 가드(미인증 시 SCR-005 이동) |
| REQ-FUNC-028 | UI_STATE | IMPLEMENT | SCR-005 | 프로필 탭 성인 확인 절차 |
| REQ-FUNC-029 | UI_DIRECT | IMPLEMENT | SCR-005 | 프로필 탭 입력 필드 |
| REQ-FUNC-030 | UI_DIRECT | IMPLEMENT | SCR-004 | 모집글 목록 필터 |
| REQ-FUNC-031 | UI_DIRECT | IMPLEMENT | SCR-003 | 동행 작성 탭 입력 폼 |
| REQ-FUNC-032 | UI_STATE | IMPLEMENT | SCR-003 | 동행 작성 탭 연락처 패턴 탐지 로직 |
| REQ-FUNC-033 | UI_DIRECT | IMPLEMENT | SCR-004 | 동행 상세 패널 작성자·조건 표시(연락처 비노출) |
| REQ-FUNC-034 | UI_DIRECT | IMPLEMENT | SCR-004 | 동행 상세 패널 참가 요청 폼 |
| REQ-FUNC-035 | UI_STATE | IMPLEMENT | SCR-004 | 동행 상세 패널 중복 요청 차단 로직 |
| REQ-FUNC-036 | UI_DIRECT | IMPLEMENT | SCR-005 | 내 활동 탭 요청 승인·거절 |
| REQ-FUNC-037 | UI_STATE | IMPLEMENT | SCR-004 | 목록·상세 자동 마감(종료일 계산) 로직 |
| REQ-FUNC-038 | UI_DIRECT | IMPLEMENT | SCR-005 | 내 활동 탭 내 글 수정·마감·삭제(폼은 SCR-003 재사용) |
| REQ-FUNC-039 | UI_DIRECT | IMPLEMENT | SCR-004 | 동행 상세 패널 신고 버튼·폼 |
| REQ-FUNC-040 | UI_DIRECT | IMPLEMENT | SCR-004 | 동행 상세 패널 차단 버튼(관리는 SCR-005) |
| REQ-FUNC-041 | UI_DIRECT | IMPLEMENT(축소) | SCR-005 | 관리자 탭 신고 목록·상태 필터 |
| REQ-FUNC-042 | UI_DIRECT | IMPLEMENT(축소) | SCR-005 | 관리자 탭 신고 상태 변경 |
| REQ-FUNC-043 | UI_DIRECT | IMPLEMENT | SCR-004 / SCR-005 | 참가·신고 처리 Toast 알림, 상태는 SCR-005 내 활동에서 확인 |
| REQ-FUNC-044 | NON_UI | IMPLEMENT | - | Supabase RLS 비공개 데이터 접근 제어 |
| REQ-FUNC-045 | UI_DIRECT | IMPLEMENT(축소) | SCR-005 | 내 활동 탭 탈퇴 버튼·비식별화 반영 |

### 3.5 F5. Country Safety (11)

| ID | UI 분류 | PROJECT_SCOPE | Screen | 배치 위치 |
|---|---|---|---|---|
| REQ-FUNC-046 | OPERATIONS | IMPLEMENT | - | 해외 국가 안전 페이지 커버리지 검증(콘텐츠 게이트) |
| REQ-FUNC-047 | UI_DIRECT | IMPLEMENT | SCR-001 | 안전정보 Modal 8개 카테고리 섹션 |
| REQ-FUNC-048 | UI_DIRECT | IMPLEMENT | SCR-001 | 안전정보 Modal 출처·확인일·편집자 표시 |
| REQ-FUNC-049 | UI_DIRECT | IMPLEMENT | SCR-001 | 안전정보 Modal 외교부 링크 |
| REQ-FUNC-050 | UI_DIRECT | IMPLEMENT | SCR-001 | 안전정보 Modal stale 경고 배지 |
| REQ-FUNC-051 | UI_DIRECT | IMPLEMENT | SCR-001 | 안전정보 Modal 상단 중대 경보 |
| REQ-FUNC-052 | UI_DIRECT | IMPLEMENT | SCR-001 | 안전정보 Modal 국가·지역 범위 표시 |
| REQ-FUNC-053 | UI_DIRECT | IMPLEMENT | SCR-001 | 안전정보 Modal 긴급연락처 섹션 |
| REQ-FUNC-054 | UI_DIRECT | IMPLEMENT | SCR-001 | 안전정보 Modal 면책 고지 문구 |
| REQ-FUNC-055 | OPERATIONS | EXCLUDED | - | 편집자 작성·검수·게시 워크플로(CMS) |
| REQ-FUNC-056 | OPERATIONS | EXCLUDED | - | 안전정보 변경 이력 보존(감사 로그) |

### 3.6 F6. About free_traveler (7)

| ID | UI 분류 | PROJECT_SCOPE | Screen | 배치 위치 |
|---|---|---|---|---|
| REQ-FUNC-057 | UI_DIRECT | IMPLEMENT | SCR-002 | 대표 프로필 히어로(50+/30+) |
| REQ-FUNC-058 | UI_DIRECT | IMPLEMENT | SCR-002 | 소개문·철학·편집 원칙 |
| REQ-FUNC-059 | UI_DIRECT | IMPLEMENT | SCR-002 | 방문 국가 목록 |
| REQ-FUNC-060 | UI_DIRECT | IMPLEMENT | SCR-002 | 여행 타임라인 |
| REQ-FUNC-061 | UI_DIRECT | IMPLEMENT(축소) | SCR-002 | 대표 이미지 alt/출처 |
| REQ-FUNC-062 | UI_DIRECT | IMPLEMENT | SCR-002 | 문의·SNS 링크 |
| REQ-FUNC-063 | UI_DIRECT | IMPLEMENT | SCR-002 | 추천 여행지 6곳(→ SCR-001 연결) |

### 3.7 F7. Common, Admin, Governance (17)

| ID | UI 분류 | PROJECT_SCOPE | Screen | 배치 위치 |
|---|---|---|---|---|
| REQ-FUNC-064 | UI_DIRECT | IMPLEMENT | 전역(공통 레이아웃) | 전 Screen 공통 내비게이션·푸터 |
| REQ-FUNC-065 | UI_DIRECT | IMPLEMENT | 전역(공통 레이아웃) | 전 Screen 반응형 레이아웃 |
| REQ-FUNC-066 | UI_DIRECT | IMPLEMENT | SCR-005 | 로그인/가입 탭(인증 콜백은 기술 Route) |
| REQ-FUNC-067 | UI_DIRECT | IMPLEMENT | SCR-001 | 통합 검색바(여행지+안전정보) |
| REQ-FUNC-068 | UI_DIRECT | IMPLEMENT | SCR-001 | 여행지 카드 즐겨찾기 토글 |
| REQ-FUNC-069 | UI_DIRECT | IMPLEMENT | SCR-001 / SCR-004 | 상세 화면 공유 버튼 |
| REQ-FUNC-070 | NON_UI | IMPLEMENT | - | 공개 페이지 메타데이터(title/OG/canonical) |
| REQ-FUNC-071 | OPERATIONS | EXCLUDED | - | 행동 분석 이벤트 파이프라인 |
| REQ-FUNC-072 | OPERATIONS | EXCLUDED | - | 여행지 콘텐츠 CRUD(CMS) |
| REQ-FUNC-073 | OPERATIONS | EXCLUDED | - | 미디어 업로드·라이선스 필수 입력 워크플로 |
| REQ-FUNC-074 | OPERATIONS | IMPLEMENT(축소) | - | 게시 전 완전성 검증(데이터 스크립트) |
| REQ-FUNC-075 | OPERATIONS | EXCLUDED | - | 안전정보 stale 현황 대시보드 |
| REQ-FUNC-076 | OPERATIONS | EXCLUDED | - | 관리자 변경·신고 처리 감사 로그 |
| REQ-FUNC-077 | UI_DIRECT | IMPLEMENT | SCR-005 | 관리자 탭 외부 URL 설정 |
| REQ-FUNC-078 | UI_DIRECT | IMPLEMENT | 기술 Route(디자인 Screen 아님) | 404/500/권한없음/외부연결실패 화면 |
| REQ-FUNC-079 | UI_STATE | IMPLEMENT | 전역(공통 컴포넌트) | 폼·모달·탭·알림 ARIA 상태 |
| REQ-FUNC-080 | UI_DIRECT | IMPLEMENT | SCR-003 | 동행 작성 탭 안전수칙 동의 체크(정책 본문은 기술 Route 정적 페이지) |

---

## 4. Requirement 매핑 — Non-Functional (REQ-NF-001~034)

### 4.1 Performance (7)

| ID | UI 분류 | PROJECT_SCOPE | Screen | 배치 위치 |
|---|---|---|---|---|
| REQ-NF-001 | NON_UI | IMPLEMENT(최선노력) | - | LCP 목표(렌더링 최적화) |
| REQ-NF-002 | NON_UI | IMPLEMENT(최선노력) | - | INP 목표 |
| REQ-NF-003 | NON_UI | IMPLEMENT(최선노력) | - | CLS 목표 |
| REQ-NF-004 | UI_STATE | IMPLEMENT | SCR-001 / SCR-004 | 필터·목록 응답 체감 속도 |
| REQ-NF-005 | NON_UI | IMPLEMENT(최선노력) | - | 쓰기 API 응답 목표 |
| REQ-NF-006 | NON_UI | IMPLEMENT | - | 이미지 반응형·lazy load 기법(SCR-001/002 이미지에 적용) |
| REQ-NF-007 | OPERATIONS | EXCLUDED | - | Lighthouse CI 성능 게이트 |

### 4.2 Reliability (4)

| ID | UI 분류 | PROJECT_SCOPE | Screen | 배치 위치 |
|---|---|---|---|---|
| REQ-NF-008 | OPERATIONS | EXCLUDED | - | 월간 가용성 SLA |
| REQ-NF-009 | OPERATIONS | EXCLUDED | - | 내부 API 5xx 비율 모니터링 |
| REQ-NF-010 | OPERATIONS | EXCLUDED | - | 자동 백업 RPO/RTO |
| REQ-NF-011 | OPERATIONS | EXCLUDED | - | 외부 링크 주간 자동 점검·알림 |

### 4.3 Security and Privacy (7)

| ID | UI 분류 | PROJECT_SCOPE | Screen | 배치 위치 |
|---|---|---|---|---|
| REQ-NF-012 | NON_UI | IMPLEMENT | - | TLS 1.2 이상 |
| REQ-NF-013 | NON_UI | IMPLEMENT | - | 인증·역할·RLS 서버 검증 |
| REQ-NF-014 | NON_UI | IMPLEMENT | - | CSRF 방어·SameSite 쿠키 |
| REQ-NF-015 | NON_UI | IMPLEMENT | - | 입력 검증·XSS 차단 |
| REQ-NF-016 | NON_UI | IMPLEMENT | - | 비밀키 환경변수 관리 |
| REQ-NF-017 | NON_UI | IMPLEMENT | - | 항공·호텔 원시 입력값 서버 미보존 |
| REQ-NF-018 | UI_DIRECT | IMPLEMENT(축소) | SCR-005 | 내 활동 탭 탈퇴·삭제 요청 버튼 |

### 4.4 Safety and Moderation (4)

| ID | UI 분류 | PROJECT_SCOPE | Screen | 배치 위치 |
|---|---|---|---|---|
| REQ-NF-019 | NON_UI | IMPLEMENT | - | 신고 접수 응답 속도(SCR-004 신고 폼에 적용) |
| REQ-NF-020 | OPERATIONS | EXCLUDED | - | 신고 1차 검토 24h SLA |
| REQ-NF-021 | OPERATIONS | EXCLUDED | - | 사용자 요청 속도 제한(rate limit) |
| REQ-NF-022 | OPERATIONS | EXCLUDED | - | Moderator 조치 추적성(감사 로그) |

### 4.5 Accessibility (3)

| ID | UI 분류 | PROJECT_SCOPE | Screen | 배치 위치 |
|---|---|---|---|---|
| REQ-NF-023 | UI_STATE | IMPLEMENT(목표) | 전역(공통 컴포넌트) | WCAG 2.2 AA 목표 적용 |
| REQ-NF-024 | OPERATIONS | IMPLEMENT(축소) | - | axe-core 자동 접근성 검사(QA 프로세스) |
| REQ-NF-025 | OPERATIONS | IMPLEMENT(축소) | - | 키보드·스크린리더 수동 검사(QA 프로세스) |

### 4.6 Content, Freshness, SEO, Copyright (5)

| ID | UI 분류 | PROJECT_SCOPE | Screen | 배치 위치 |
|---|---|---|---|---|
| REQ-NF-026 | OPERATIONS | IMPLEMENT | - | 여행지 콘텐츠 완전성 100%(데이터 검증 게이트) |
| REQ-NF-027 | OPERATIONS | IMPLEMENT | - | 해외 안전정보 커버리지 100%(데이터 검증 게이트) |
| REQ-NF-028 | OPERATIONS | IMPLEMENT(축소) | - | 안전정보 최신 확인율(경고 표시는 SCR-001 FUNC-050) |
| REQ-NF-029 | OPERATIONS | EXCLUDED | - | 미디어 라이선스 메타데이터 필수화 |
| REQ-NF-030 | NON_UI | IMPLEMENT | - | 공개 페이지 SEO 메타데이터 |

### 4.7 Maintainability, Monitoring, Cost (4)

| ID | UI 분류 | PROJECT_SCOPE | Screen | 배치 위치 |
|---|---|---|---|---|
| REQ-NF-031 | OPERATIONS | IMPLEMENT(축소) | - | TypeScript strict·lint 빌드 게이트 |
| REQ-NF-032 | OPERATIONS | EXCLUDED | - | 구조화 로그(request_id 등) |
| REQ-NF-033 | OPERATIONS | EXCLUDED | - | 핵심 오류 자동 알림 |
| REQ-NF-034 | OPERATIONS | IMPLEMENT | - | 월 인프라 비용 목표 |

---

## 5. 집계 검증

### 5.1 Requirement 총수

| 구분 | 개수 |
|---|---:|
| REQ-FUNC-001~080 | 80 |
| REQ-NF-001~034 | 34 |
| **합계** | **114** |

### 5.2 UI 분류별 집계

| 분류 | FUNC | NF | 합계 |
|---|---:|---:|---:|
| UI_DIRECT | 55 | 1 | 56 |
| UI_STATE | 11 | 2 | 13 |
| NON_UI | 4 | 13 | 17 |
| OPERATIONS | 10 | 18 | 28 |
| **합계** | **80** | **34** | **114** |

### 5.3 Screen별 배치 요구사항 수 (UI_DIRECT + UI_STATE, 전역/기술 Route 제외)

| Screen | 배치된 Requirement 수 |
|---|---:|
| SCR-001 `/` 메인 | 21 |
| SCR-002 `/about` | 7 |
| SCR-003 `/travel-tools` | 18 |
| SCR-004 `/mates` | 8 |
| SCR-005 `/account` | 10 |
| 전역(공통 레이아웃/컴포넌트) | 4 |
| 기술 Route(디자인 Screen 아님) | 1 |

> 두 화면에 걸쳐 배치되는 항목(REQ-FUNC-043, REQ-FUNC-069, REQ-NF-004)은 위 집계에서 첫 번째로 표기한 화면에만 1회 계상했다. 위 7개 합계는 69로, UI_DIRECT(56) + UI_STATE(13) = 69와 일치한다.

> 디자인 Screen은 SCR-001~005의 5개로 고정되며, 전역 공통 레이아웃과 기술 Route는 6번째 Screen으로 세지 않는다.
