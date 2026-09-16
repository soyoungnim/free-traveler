# Free Traveler — Project Scope (MVP 구현 범위 정의서)

- **Document ID:** SCOPE-TRAVEL-001
- **기반 문서:** `00_PRD.md`, `02_SRS_BASELINE.md`
- **적용 대상:** 현재 `app/` Next.js 프로젝트 구현
- **범위 원칙:** SRS의 모든 REQ-FUNC/REQ-NF는 삭제하지 않고 `IMPLEMENT` 또는 `EXCLUDED`로 분류한다.

---

## 1. 화면 구성

### 1-1. 핵심 화면 4개

| 화면 | 라우트 | 대응 항목 |
|---|---|---|
| 여행지 검색·상세 | `/destinations`, `/destinations/[slug]` | 여행지 검색·필터·상세 패널 |
| 항공·숙소 입력·요약 | `/flights`, `/hotels` | 항공·숙소 입력·검증·요약·외부 이동 |
| 동행 찾기 | `/mates`, `/mates/[id]`, `/mates/new` | 동행글 작성·조회·수정·마감, 참가 요청 |
| 국가별 안전정보 | `/safety`, `/safety/[countryCode]` | 국가 안전정보 패널 |

### 1-2. 보조 화면 1개

| 화면 | 라우트 | 대응 항목 |
|---|---|---|
| 대표 소개 | `/about` | free_traveler 대표 소개 |

### 1-3. 지원 화면 (기능 실행에 필요한 인증·개인화·운영 화면)

| 화면 | 라우트 | 대응 항목 |
|---|---|---|
| 인증 | `/auth/*` | Supabase 이메일 인증, 성인 확인 |
| 내 활동 | `/my/*` | 내 글·참가 요청·차단 관리 |
| 관리자 | `/admin/*` | 신고 상태 처리, 외부 URL 설정 |

---

## 2. 구현 방식 원칙

| 항목 | 방식 |
|---|---|
| 여행지·안전·대표 콘텐츠 | `src/data`의 정적 TypeScript/JSON 데이터로 관리하며, 관리자 CRUD 화면은 만들지 않는다. |
| 즐겨찾기 | 서버 저장 없이 브라우저 `localStorage`로 처리한다. |
| 이메일 알림 | 실제 이메일 발송 대신 Toast 또는 화면 내 상태(인앱 알림)로 대체한다. |
| 모집글 자동 마감 | 배치 작업 없이 조회 시점에 `end_date` 기준으로 계산해 CLOSED 상태를 판정한다. |
| 안전정보 최신성(stale) | 배치 작업 없이 렌더링 시점에 `verified_at`과 현재 날짜를 비교해 계산한다. |
| 이미지 | 일반 인터넷 URL과 `alt` 텍스트만 사용하고, 별도 라이선스 승인·업로드 워크플로는 두지 않는다. |
| 관리자 기능 | 신고 상태 변경과 외부 링크(항공·호텔) URL 설정만 다루며, 콘텐츠 CRUD·감사 로그·대시보드는 두지 않는다. |
| 항공·호텔 입력값 | 서버 DB·로그·분석에 저장하지 않고 브라우저 메모리 상태로만 처리한다. |

---

## 3. 제외 기능과 사유

| 제외 항목 | 사유 |
|---|---|
| 전체 콘텐츠 CMS | 콘텐츠는 정적 데이터로 관리되며 게시 빈도가 낮아 CRUD·검수 UI가 불필요하다. |
| 미디어 업로드·라이선스 승인 워크플로 | 이미지는 외부 URL을 직접 참조하므로 업로드·저장·승인 절차가 필요 없다. |
| 범용 감사 로그 | 별도 감사 로그 저장소·조회 UI를 구축하지 않으며, 변경 이력은 git 이력과 최소한의 상태 필드로 대체한다. |
| 자동 백업·장애 알림·부하 테스트 | Supabase/Vercel 관리형 인프라의 기본 제공 범위에 맡기고, 별도 모니터링·알림·부하 테스트 체계는 구축하지 않는다. |
| 외부 이메일 사업자 연동 | 실제 이메일 발송 파이프라인을 두지 않고 인앱 상태로 대체한다. |
| EC2·AWS 인프라 | Vercel과 Supabase만 사용하며 별도 클라우드 인프라를 구성하지 않는다. |
| 무인 자동 Merge Runner | 배포·병합은 수동으로 수행한다. |

---

## 4. 요구사항 분류

> 분류: **IMPLEMENT**(구현 후 테스트) / **EXCLUDED**(제외, 사유 기록). 축소된 범위로 구현하는 항목은 IMPLEMENT로 분류하고 처리 방법에 축소 내용을 명시한다.

### 4-1. F1. Destination Guide (REQ-FUNC-001~010)

| ID | 분류 | 처리 방법 | 확인 방법 |
|---|---|---|---|
| REQ-FUNC-001 | IMPLEMENT | `src/data` 국내/해외 구분 필드로 목록 분기 | Playwright: 탭 전환 시 구분별 결과만 노출 |
| REQ-FUNC-002 | IMPLEMENT | 클라이언트 측 AND 필터(국가·도시·계절·테마·기간) | Playwright: 복수 필터 결과 검증 |
| REQ-FUNC-003 | IMPLEMENT | 클라이언트 키워드 부분 일치 검색 | Playwright: 키워드 검색 결과 확인 |
| REQ-FUNC-004 | IMPLEMENT | 정적 데이터 스키마에 소개·명소·일정·예산·교통·음식·에티켓·출처 필드 포함 | 데이터 검증 스크립트로 필수 필드 존재 확인 |
| REQ-FUNC-005 | IMPLEMENT | 결과 0건 시 안내 문구 + 초기화 버튼 | Playwright: 빈 결과 후 초기화 동작 |
| REQ-FUNC-006 | IMPLEMENT | 여행지의 `countryCode`로 안전정보 페이지 링크 매칭 | Playwright: 해외 상세→안전정보 이동 |
| REQ-FUNC-007 | IMPLEMENT(축소) | 이미지에 `alt`·출처 텍스트만 기록, 라이선스 승인 절차 없음 | 데이터 검증 스크립트로 `alt`·출처 필드 존재 확인 |
| REQ-FUNC-008 | IMPLEMENT | 국내 10곳·해외 15개국 30개 도시 시드 데이터 작성 | 데이터 검증 스크립트로 수량 검사 |
| REQ-FUNC-009 | IMPLEMENT | 동일 국가·테마 기준 정적 데이터 상호 참조로 최대 6개 추천 | Playwright: 관련 여행지 노출 확인 |
| REQ-FUNC-010 | IMPLEMENT | 허용 필터만 URL query로 직렬화/복원 | Playwright: 새로고침 후 필터 유지 확인 |

### 4-2. F2. Flight Link-out (REQ-FUNC-011~018)

| ID | 분류 | 처리 방법 | 확인 방법 |
|---|---|---|---|
| REQ-FUNC-011 | IMPLEMENT | 국가·지역·출발일·귀국일 필수 입력 폼 | Playwright: 필드 렌더링·라벨 확인 |
| REQ-FUNC-012 | IMPLEMENT | 국가별 지역 목록을 정적 데이터로 제공, 국가 변경 시 지역 초기화 | Playwright: 국가 변경 시 지역값 리셋 |
| REQ-FUNC-013 | IMPLEMENT | 클라이언트 날짜 검증(과거일·역전일 차단) | Playwright: 경계값 제출 차단 확인 |
| REQ-FUNC-014 | IMPLEMENT | 검증 통과 후 요약 단계 표시, 세션 내 상태 유지 | Playwright: 수정 후 값 유지 확인 |
| REQ-FUNC-015 | IMPLEMENT | 폼·요약에 비전달 고지 문구 고정 표시 | Playwright: 고지 텍스트 노출 확인 |
| REQ-FUNC-016 | IMPLEMENT | env로 설정된 외부 URL을 `noopener,noreferrer` 새 탭으로 오픈, query 미부착 | Playwright: 새 탭 URL에 query 없음 확인 |
| REQ-FUNC-017 | IMPLEMENT | 입력값은 클라이언트 상태로만 존재, 서버 호출 없음 | 코드 리뷰 + 네트워크 탭 확인(수동) |
| REQ-FUNC-018 | IMPLEMENT(축소) | URL 미설정 시 오류 안내와 재시도 버튼, 운영 로그는 console 수준만 | Playwright: URL 미설정 상태 오류 표시 확인 |

### 4-3. F3. Hotel Link-out (REQ-FUNC-019~026)

| ID | 분류 | 처리 방법 | 확인 방법 |
|---|---|---|---|
| REQ-FUNC-019 | IMPLEMENT | 숙박 국가·지역·체크인·체크아웃 필수 입력 폼 | Playwright: 필드 렌더링 확인 |
| REQ-FUNC-020 | IMPLEMENT | 국가별 지역 목록 매핑, 국가 변경 시 지역 초기화 | Playwright: 지역값 리셋 확인 |
| REQ-FUNC-021 | IMPLEMENT | 클라이언트 날짜 검증(체크아웃 ≤ 체크인 차단) | Playwright: 경계값 제출 차단 확인 |
| REQ-FUNC-022 | IMPLEMENT | 검증 통과 후 요약 표시, 폼 값과 일치 | Playwright: 요약값 일치 확인 |
| REQ-FUNC-023 | IMPLEMENT | 폼·요약에 비전달 고지 표시 | Playwright: 고지 텍스트 확인 |
| REQ-FUNC-024 | IMPLEMENT | env 설정 URL을 `noopener,noreferrer` 새 탭으로 오픈 | Playwright: query 미부착 확인 |
| REQ-FUNC-025 | IMPLEMENT | 입력값 서버 미저장, 클라이언트 상태만 사용 | 코드 리뷰 + 네트워크 탭 확인(수동) |
| REQ-FUNC-026 | IMPLEMENT(축소) | URL 오류 시 현재 입력 유지 + 오류 표시, 별도 운영 알림 없음 | Playwright: 오류 표시·입력 유지 확인 |

### 4-4. F4. Travel Mate (REQ-FUNC-027~045)

| ID | 분류 | 처리 방법 | 확인 방법 |
|---|---|---|---|
| REQ-FUNC-027 | IMPLEMENT | Supabase Auth 세션 확인 후 쓰기 작업 허용 | Playwright: 비로그인 작성 시도 차단 확인 |
| REQ-FUNC-028 | IMPLEMENT | `is_adult`, `adult_verified_at`만 저장, 생년월일 /미저장 | Supabase 테이블 스키마 확인 |
| REQ-FUNC-029 | IMPLEMENT | 닉네임·연령대·여행 스타일 필수, 성별 선택 필드 | Playwright: 프로필 폼 검증 |
| REQ-FUNC-030 | IMPLEMENT | 국가·지역·기간 겹침·연령대·성별·스타일·상태 필터, 차단 사용자 제외 | Playwright: 필터·차단 제외 확인 |
| REQ-FUNC-031 | IMPLEMENT | 필수 필드+날짜 검증+안전수칙 동의 체크박스 | Playwright: 누락·역전 날짜 차단 확인 |
| REQ-FUNC-032 | IMPLEMENT | 정규식 기반 전화번호·이메일·메신저 ID 패턴 탐지 | Playwright: 금지 패턴 포함 시 제출 차단 확인 |
| REQ-FUNC-033 | IMPLEMENT | 응답 데이터에 연락처 필드 자체를 포함하지 않음 | 코드 리뷰: API/컴포넌트 응답 필드 확인 |
| REQ-FUNC-034 | IMPLEMENT | 500자 제한 비공개 메시지, PENDING 상태 저장 | Playwright: 참가 요청 제출 확인 |
| REQ-FUNC-035 | IMPLEMENT | Supabase unique 제약 + UI 중복 안내 | Playwright: 중복 요청 차단 확인 |
| REQ-FUNC-036 | IMPLEMENT | 작성자만 ACCEPTED/REJECTED 전이 가능, RLS로 권한 검증 | Playwright: 승인·거절 흐름 확인 |
| REQ-FUNC-037 | IMPLEMENT | 배치 없이 조회 시 `end_date` 경과분을 CLOSED로 계산해 표시 | Playwright: 종료일 경과 글이 목록에서 제외 확인 |
| REQ-FUNC-038 | IMPLEMENT | 작성자 수동 마감·수정·삭제 기능 | Playwright: 수동 마감/수정 동작 확인 |
| REQ-FUNC-039 | IMPLEMENT | 사유 코드+설명 신고 폼, 접수 ID 표시 | Playwright: 신고 제출·접수 ID 확인 |
| REQ-FUNC-040 | IMPLEMENT | 차단/차단 해제, 차단 시 상호 노출 제한 | Playwright: 차단 후 콘텐츠 미노출 확인 |
| REQ-FUNC-041 | IMPLEMENT(축소) | 관리자 신고 목록과 상태(OPEN/RESOLVED/DISMISSED) 필터만 제공, 우선순위·증거 큐 없음 | Playwright: 관리자 신고 목록·상태 필터 확인 |
| REQ-FUNC-042 | IMPLEMENT(축소) | 신고 상태를 RESOLVED/DISMISSED로 변경하는 기능만 제공, 경고·계정 제한·감사 로그는 제외 | Playwright: 상태 변경 후 목록 반영 확인 |
| REQ-FUNC-043 | IMPLEMENT | 인앱 Toast/상태 표시로 알림 대체, 실제 이메일 발송 없음 | Playwright: 승인/거절 시 Toast 노출 확인 |
| REQ-FUNC-044 | IMPLEMENT | Supabase RLS로 본인·요청 대상·관리자만 비공개 데이터 접근 | Supabase RLS 정책 검토 + 권한별 접근 테스트 |
| REQ-FUNC-045 | IMPLEMENT(축소) | 탈퇴 시 즉시 프로필 비식별화만 처리, 30일 후 자동 물리 삭제 배치는 제외 | Playwright: 탈퇴 후 공개 프로필 비식별화 확인 |

### 4-5. F5. Country Safety (REQ-FUNC-046~056)

| ID | 분류 | 처리 방법 | 확인 방법 |
|---|---|---|---|
| REQ-FUNC-046 | IMPLEMENT | 소개된 해외 15개국 전체에 안전 페이지 데이터 작성 | 데이터 검증 스크립트로 국가 수 일치 확인 |
| REQ-FUNC-047 | IMPLEMENT | 정적 데이터 스키마에 8개 카테고리 필드 고정 | 데이터 검증 스크립트로 카테고리 누락 확인 |
| REQ-FUNC-048 | IMPLEMENT | 출처명·URL·확인일 필드를 정적 데이터에 기록 | 데이터 검증 스크립트로 필드 존재 확인 |
| REQ-FUNC-049 | IMPLEMENT | 외교부 링크를 `noopener,noreferrer` 새 탭으로 제공 | Playwright: 링크 속성·새 탭 확인 |
| REQ-FUNC-050 | IMPLEMENT | 렌더링 시 `verified_at` 기준 7일 초과 여부 계산 후 경고 표시 | Playwright: 7일 초과 데이터에 경고 노출 확인 |
| REQ-FUNC-051 | IMPLEMENT | 중대 경보 텍스트 라벨을 본문 상단에 표시(색상 단독 사용 금지) | Playwright: 상단 노출 확인 |
| REQ-FUNC-052 | IMPLEMENT | `scopeType`/`scopeText` 필드로 국가·지역 범위 구분 | 데이터 검증 스크립트로 필드 존재 확인 |
| REQ-FUNC-053 | IMPLEMENT | 긴급 연락처·영사콜센터 정보를 정적 데이터로 제공 | Playwright: 긴급연락처 섹션 노출 확인 |
| REQ-FUNC-054 | IMPLEMENT | 공식 판단 대체 아님 고지 문구를 안전 페이지에 고정 표시 | Playwright: 고지 텍스트 노출 확인 |
| REQ-FUNC-055 | EXCLUDED | 편집자 작성·검수·게시 워크플로는 CMS 성격이므로 두지 않음. 콘텐츠는 개발자가 `src/data`를 직접 수정해 배포한다. | 해당 없음(정적 데이터 코드 리뷰로 대체) |
| REQ-FUNC-056 | EXCLUDED | 변경 이력(이전값/사유/담당자) 보존은 범용 감사 로그 기능이므로 제외. git 커밋 이력으로 대체한다. | 해당 없음(git log로 대체) |

### 4-6. F6. About free_traveler (REQ-FUNC-057~063)

| ID | 분류 | 처리 방법 | 확인 방법 |
|---|---|---|---|
| REQ-FUNC-057 | IMPLEMENT | 대표명·`50+ Trips`·`30+ Countries`를 단일 정적 데이터 소스로 관리 | Playwright: 홈·대표 페이지 값 일치 확인 |
| REQ-FUNC-058 | IMPLEMENT | 확정 소개문·철학·편집 원칙을 정적 데이터로 렌더링 | Playwright: 텍스트 노출 확인 |
| REQ-FUNC-059 | IMPLEMENT | 방문 국가 목록(30개국 이상)을 정적 데이터로 제공 | 데이터 검증 스크립트로 국가 수 확인 |
| REQ-FUNC-060 | IMPLEMENT | 연도·장소·요약을 포함한 타임라인 정적 데이터 | Playwright: 타임라인 렌더링 확인 |
| REQ-FUNC-061 | IMPLEMENT(축소) | 대표 이미지에 `alt`·출처 텍스트만 기록, 라이선스 승인 절차 없음 | 데이터 검증 스크립트로 `alt`·출처 필드 확인 |
| REQ-FUNC-062 | IMPLEMENT | 관리자 설정값 기반 문의·SNS 링크, 빈 값은 렌더링 생략 | Playwright: 링크 노출/생략 조건 확인 |
| REQ-FUNC-063 | IMPLEMENT | 정적 데이터 상호 참조로 추천 여행지 6곳 연결 | Playwright: 추천 여행지 링크 확인 |

### 4-7. F7. Common, Admin, Governance (REQ-FUNC-064~080)

| ID | 분류 | 처리 방법 | 확인 방법 |
|---|---|---|---|
| REQ-FUNC-064 | IMPLEMENT | 전역 레이아웃에 공통 내비게이션·푸터 배치 | Playwright: 전 페이지 내비게이션 존재 확인 |
| REQ-FUNC-065 | IMPLEMENT | Tailwind 반응형 레이아웃(320px~데스크톱) | Playwright: 모바일 뷰포트 렌더링 확인 |
| REQ-FUNC-066 | IMPLEMENT | Supabase Auth 이메일 가입·인증·로그인·로그아웃·비밀번호 재설정 | Playwright: 인증 핵심 흐름 확인 |
| REQ-FUNC-067 | IMPLEMENT | 클라이언트 통합 검색(여행지+안전정보), 결과 유형 라벨 표시 | Playwright: 통합 검색 결과 확인 |
| REQ-FUNC-068 | IMPLEMENT | `localStorage` 기반 즐겨찾기 추가/해제/조회, 중복 방지 | Playwright: 즐겨찾기 토글·중복 방지 확인 |
| REQ-FUNC-069 | IMPLEMENT | Web Share API 우선 사용, 실패 시 URL 복사로 폴백 | Playwright: 공유/복사 동작 확인 |
| REQ-FUNC-070 | IMPLEMENT | Next.js Metadata API로 title/description/canonical/OG 제공 | 코드 리뷰 + 페이지별 메타태그 확인 |
| REQ-FUNC-071 | EXCLUDED | 별도 행동 분석 파이프라인을 구축하지 않음(자동 백업·모니터링류 인프라 제외 방침과 동일 선상) | 해당 없음 |
| REQ-FUNC-072 | EXCLUDED | 여행지 콘텐츠 CRUD·미리보기 UI는 전체 콘텐츠 CMS이므로 제외. 정적 데이터 직접 수정으로 대체 | 해당 없음 |
| REQ-FUNC-073 | EXCLUDED | 미디어 업로드·라이선스 필수 입력 워크플로 제외. 이미지는 외부 URL 직접 참조 | 해당 없음 |
| REQ-FUNC-074 | IMPLEMENT(축소) | 관리자 게시 게이트 UI 대신, 정적 데이터 필수 필드 존재를 확인하는 검증 스크립트로 대체 | 데이터 검증 스크립트 실행 결과 확인 |
| REQ-FUNC-075 | EXCLUDED | stale 현황 대시보드는 관리자 범위(신고 상태·외부 URL 설정)를 벗어나 제외. stale 경고 자체는 공개 안전 페이지(REQ-FUNC-050)에서 제공 | 해당 없음 |
| REQ-FUNC-076 | EXCLUDED | 범용 감사 로그 저장·조회 기능 제외 | 해당 없음 |
| REQ-FUNC-077 | IMPLEMENT | 관리자 화면에서 항공·호텔 외부 URL을 HTTPS 허용목록 내에서만 설정 | Playwright: 관리자 URL 설정·검증 확인 |
| REQ-FUNC-078 | IMPLEMENT | Next.js 404/500/권한없음/외부연결실패 커스텀 화면과 복구 행동(홈·재시도) 제공 | Playwright: 각 오류 화면 복구 버튼 확인 |
| REQ-FUNC-079 | IMPLEMENT | 시맨틱 HTML과 ARIA 속성을 폼·모달·탭·알림에 적용(최선 노력, 자동 인증 없음) | Playwright + axe-core 스캔(핵심 페이지) |
| REQ-FUNC-080 | IMPLEMENT | 이용약관·개인정보방침·안전수칙·면책 안내 정적 페이지, 동행글 작성 시 동의 시각 저장 | Playwright: 동의 체크 없이 제출 차단 확인 |

### 4-8. Non-Functional Requirements

#### 성능 (REQ-NF-001~007)

| ID | 분류 | 처리 방법 | 확인 방법 |
|---|---|---|---|
| REQ-NF-001 | IMPLEMENT(최선노력) | Next.js 이미지 최적화·SSR로 LCP 개선, 별도 CI 게이트 없음 | 수동 Lighthouse 점검 |
| REQ-NF-002 | IMPLEMENT(최선노력) | 클라이언트 상호작용 최소화로 INP 개선 | 수동 점검 |
| REQ-NF-003 | IMPLEMENT(최선노력) | 레이아웃 크기 고정(이미지 비율, 스켈레톤)으로 CLS 개선 | 수동 점검 |
| REQ-NF-004 | IMPLEMENT | 정적 데이터 기반 클라이언트 필터로 응답 지연 최소화 | Playwright: 필터 응답 체감 확인 |
| REQ-NF-005 | IMPLEMENT(최선노력) | Supabase 쓰기 API 단순 쿼리로 구성, 부하 테스트는 실시하지 않음 | Playwright: 쓰기 흐름 정상 동작 확인 |
| REQ-NF-006 | IMPLEMENT | `next/image` 반응형 크기·lazy load·LCP 이미지 priority 적용 | 코드 리뷰: `next/image` 옵션 확인 |
| REQ-NF-007 | EXCLUDED | Lighthouse CI 성능 게이트는 부하/성능 자동화 인프라이므로 구축하지 않음 | 해당 없음(수동 점검으로 대체) |

#### 신뢰성 (REQ-NF-008~011)

| ID | 분류 | 처리 방법 | 확인 방법 |
|---|---|---|---|
| REQ-NF-008 | EXCLUDED | 가용성 SLA 측정·모니터링 체계를 구축하지 않고 Vercel 관리형 인프라에 의존 | 해당 없음 |
| REQ-NF-009 | EXCLUDED | 5xx 비율 모니터링 체계를 별도로 구축하지 않음 | 해당 없음 |
| REQ-NF-010 | EXCLUDED | 자동 백업·RPO/RTO 목표 관리는 Supabase 기본 관리형 백업에 맡기고 별도 구축하지 않음 | 해당 없음 |
| REQ-NF-011 | EXCLUDED | 외부 링크 주간 자동 점검·관리자 알림 배치는 구축하지 않으며 수동 점검으로 대체 | 해당 없음 |

#### 보안·개인정보 (REQ-NF-012~018)

| ID | 분류 | 처리 방법 | 확인 방법 |
|---|---|---|---|
| REQ-NF-012 | IMPLEMENT | Vercel 기본 제공 HTTPS/TLS 사용 | 배포 후 HTTPS 접속 확인 |
| REQ-NF-013 | IMPLEMENT | Supabase Auth 세션 검증 + RLS 정책으로 서버 측 권한 검증 | Supabase RLS 정책 리뷰 + 권한별 접근 테스트 |
| REQ-NF-014 | IMPLEMENT | Next.js Server Actions 기본 보호 + SameSite 쿠키 설정 | 코드 리뷰: 쿠키·요청 설정 확인 |
| REQ-NF-015 | IMPLEMENT | 입력값 검증과 React 기본 이스케이프로 XSS 방지 | Playwright: 스크립트 태그 입력 시 무해화 확인 |
| REQ-NF-016 | IMPLEMENT | 모든 비밀키는 Vercel 환경변수로 관리, 클라이언트 번들 미포함 | 빌드 산출물에서 비밀키 문자열 검색 |
| REQ-NF-017 | IMPLEMENT | 항공·호텔 입력값은 클라이언트 상태로만 유지, 서버·로그 미저장 | 네트워크 탭·DB 확인(수동) |
| REQ-NF-018 | IMPLEMENT(축소) | 탈퇴·삭제 요청만 제공, 데이터 내보내기 자동화는 제외(요청 시 관리자 수동 대응) | Playwright: 탈퇴 요청 흐름 확인 |

#### 안전·모더레이션 (REQ-NF-019~022)

| ID | 분류 | 처리 방법 | 확인 방법 |
|---|---|---|---|
| REQ-NF-019 | IMPLEMENT | 신고 제출을 단순 Supabase insert로 구성해 지연 최소화 | Playwright: 신고 접수 응답 확인 |
| REQ-NF-020 | EXCLUDED | 24시간 1차 검토 SLA 측정 체계를 구축하지 않고 관리자가 수동으로 신고 큐 확인 | 해당 없음 |
| REQ-NF-021 | EXCLUDED | 별도 요청 속도 제한(rate limit) 인프라를 구축하지 않음(UI 중복 제출 방지만 제공) | 해당 없음 |
| REQ-NF-022 | EXCLUDED | 모더레이터 조치 추적성은 범용 감사 로그 기능이므로 제외 | 해당 없음 |

#### 접근성 (REQ-NF-023~025)

| ID | 분류 | 처리 방법 | 확인 방법 |
|---|---|---|---|
| REQ-NF-023 | IMPLEMENT(목표) | WCAG 2.2 AA를 목표로 시맨틱 마크업·명도 대비 적용, 별도 인증 절차 없음 | 수동 점검 |
| REQ-NF-024 | IMPLEMENT(축소) | Playwright 스모크 테스트에 axe-core 스캔을 포함해 핵심 페이지만 검사 | Playwright + axe-core 결과 확인 |
| REQ-NF-025 | IMPLEMENT(축소) | 핵심 흐름(검색·폼·모달·신고)만 키보드 수동 점검 | 수동 키보드 내비게이션 점검 |

#### 콘텐츠·SEO·저작권 (REQ-NF-026~030)

| ID | 분류 | 처리 방법 | 확인 방법 |
|---|---|---|---|
| REQ-NF-026 | IMPLEMENT | 정적 데이터 작성 시 필수 필드 전부 채움 | 데이터 검증 스크립트 실행 |
| REQ-NF-027 | IMPLEMENT | 해외 15개국 전체 안전정보 데이터 작성 | 데이터 검증 스크립트 실행 |
| REQ-NF-028 | IMPLEMENT(축소) | stale 계산·경고 로직만 구현, 실제 최신성 유지율은 콘텐츠 작성자 책임이며 별도 모니터링 없음 | Playwright: stale 경고 로직 확인 |
| REQ-NF-029 | EXCLUDED | 라이선스 승인 워크플로 제외에 따라 라이선스 메타데이터 필수화도 제외, `alt`·출처 텍스트만 관리 | 해당 없음 |
| REQ-NF-030 | IMPLEMENT | Next.js Metadata API로 공개 페이지 메타데이터 제공 | 코드 리뷰: 페이지별 메타태그 확인 |

#### 유지보수성·모니터링·비용 (REQ-NF-031~034)

| ID | 분류 | 처리 방법 | 확인 방법 |
|---|---|---|---|
| REQ-NF-031 | IMPLEMENT(축소) | TypeScript strict 모드·ESLint를 빌드 조건으로 강제, 별도 유닛 테스트 스위트는 Playwright 스모크 테스트로 대체 | `npm run build`, `npm run lint` 통과 확인 |
| REQ-NF-032 | EXCLUDED | 구조화 로깅(request_id 등) 인프라 별도 구축하지 않고 Vercel 기본 로그만 사용 | 해당 없음 |
| REQ-NF-033 | EXCLUDED | 5xx 비율·외부 링크 실패 자동 알림 체계 구축하지 않음 | 해당 없음 |
| REQ-NF-034 | IMPLEMENT | Vercel/Supabase 무료 또는 저비용 티어로 구성해 목표 비용 충족, 별도 비용 모니터링 도구는 두지 않음 | 청구 콘솔 수동 확인 |

---

## 5. 테스트 범위 (Playwright 핵심 Smoke Test)

다음 핵심 사용자 흐름을 Playwright로 자동화한다.

1. 여행지 목록 진입 → 필터 적용 → 상세 진입 → 안전정보 연결
2. 항공 조건 입력 → 검증 오류 확인 → 요약 확인 → 외부 이동(새 탭, query 없음)
3. 호텔 조건 입력 → 검증 오류 확인 → 요약 확인 → 외부 이동(새 탭, query 없음)
4. 회원가입·이메일 인증·성인 확인 → 동행글 작성(공개 연락처 탐지 포함) → 참가 요청 → 승인/거절
5. 신고·차단 제출 및 상호 노출 제한 확인
6. 관리자 로그인 → 신고 상태 변경 → 외부 URL 설정 변경
7. 국가별 안전정보 페이지의 stale 경고, 중대 경보 표시
8. 대표 소개 페이지의 핵심 정보(50+, 30+) 및 홈과의 일치
9. 404/500/권한없음/외부연결실패 화면의 복구 행동
10. 핵심 페이지 axe-core 접근성 스캔(serious/critical 0건 목표)

---

## 6. 배포

- Vercel에 프로덕션 배포하며, 외부 URL(`FLIGHT_OUTBOUND_URL`, `HOTEL_OUTBOUND_URL`, `MOFA_SAFETY_URL`)과 Supabase 키는 환경변수로 관리한다.
- 배포 파이프라인은 수동 트리거이며, 별도 자동 Merge Runner는 두지 않는다.
