# Free Traveler — Architecture

- **Document ID:** ARCH-TRAVEL-001
- **기반 문서:** `package.json`, `docs/06_SRS_UIUX_REVISED.md`, `docs/PROJECT_SCOPE.md`, `design-reference/D-001/DESIGN.md`, `design-reference/UI_CONTRACT.md`, `design-reference/SCREEN_ROUTE_CONTRACT.json`, `TASKS/TASK_MANIFEST.csv`
- **목적:** 구현 시 "어디까지가 이 프로젝트의 경계인가"를 코드 작성 전에 확정한다. 여기 없는 기술·서비스는 이 프로젝트에 추가하지 않는다.

---

## 1. 런타임·언어

- **Next.js App Router**(`package.json` 기준 `next@16.3.4`) 단일 풀스택 애플리케이션으로 구현한다. 별도 백엔드 서버·마이크로서비스를 두지 않는다.
- **TypeScript**로 작성한다(`typescript@^5`). `src/app`의 모든 신규 파일은 `.tsx`/`.ts`이며 `.jsx`/`.js`를 신규로 추가하지 않는다.
- 스타일은 Tailwind CSS(`@tailwindcss/postcss`)로 처리하며, `design-reference/D-001/DESIGN.md`의 토큰(컬러/타이포/스페이싱/라운드/셰도)만 사용한다.

---

## 2. 화면 구성 — 핵심 4개 · 보조 1개

`design-reference/SCREEN_ROUTE_CONTRACT.json`이 정본이며, Route는 정확히 5개다.

| 구분 | Screen | Route | Page Entry |
|---|---|---|---|
| 핵심 | SCR-001 | `/` | `src/app/page.tsx` |
| 보조 | SCR-002 | `/about` | `src/app/about/page.tsx` |
| 핵심 | SCR-003 | `/travel-tools` | `src/app/travel-tools/page.tsx` |
| 핵심 | SCR-004 | `/mates` | `src/app/mates/page.tsx` |
| 핵심 | SCR-005 | `/account` | `src/app/account/page.tsx` |

`TASKS/TASK_MANIFEST.csv`의 `PAGE_OWNER` 5행이 이 표와 1:1로 대응하며, 각 Page Entry는 정확히 1개의 Task만 소유한다(중복 소유 금지). 5개를 넘는 공개 Route(예: 여행지 상세, 안전정보, 동행 상세의 개별 페이지)는 만들지 않고 SCR-001의 Drawer/Modal 또는 SCR-004의 상세 패널로 흡수한다.

---

## 3. Server Component와 Client Component 구분

| 구분 | 위치·용도 | 예시 |
|---|---|---|
| **Server Component (기본)** | 데이터 조회·정적 데이터 렌더링·SEO 메타데이터. 각 `page.tsx`의 최상위는 기본적으로 Server Component다. | 여행지/안전/대표 정적 데이터 렌더링, 동행 목록 최초 조회, 관리자 신고 목록 최초 조회 |
| **Client Component (`"use client"`)** | 사용자 입력, 브라우저 상태(로컬 상태·`localStorage`), 상호작용이 필요한 부분만 명시적으로 분리한다. | 검색·필터 입력, 항공/숙소 폼, 동행 작성 폼, Drawer/Modal 열림 상태, 즐겨찾기 토글, 탭 전환 |

- Client Component는 필요한 최소 단위로 분리한다(페이지 전체를 Client Component로 만들지 않는다).
- Client Component에서 Supabase에 쓰기 작업이 필요한 경우 Server Action을 호출하는 방식을 기본으로 하며, Route Handler(`src/app/api/**/route.ts`)는 인증 콜백·외부 연동이 필요한 경우로 한정한다.

---

## 4. 항공·숙소 입력 폼 — Client Component 일시 상태만 사용

- SCR-003의 항공/숙소 탭 입력 폼(국가·지역·출발일/귀국일 또는 체크인/체크아웃)은 **Client Component의 컴포넌트 상태(`useState`/`useReducer`)로만** 보관한다.
- 페이지 새로고침·탭 전환 시 초기화되는 것을 허용하며, 영속화를 위해 `localStorage`/`sessionStorage`/서버 상태로 옮기지 않는다.
- 이 폼에는 전용 API Route나 Server Action을 두지 않는다. "요약 확인" 이후의 "보러 가기"는 설정된 외부 URL을 `noopener,noreferrer`로 새 탭에 여는 순수 클라이언트 동작이다.

## 5. 항공·숙소 입력값 미전달 원칙

항공·숙소 조건(국가·지역·날짜)은 다음 어디에도 보내지 않는다:

- 자체 API Route 또는 Server Action(**해당 입력 전용 API를 만들지 않음**)
- Supabase 등 어떤 DB
- 외부 이동 URL의 query string(`?destination=...` 같은 파라미터 부착 금지)
- 서버 로그·분석 이벤트 속성(이벤트에는 `provider`, `source_page` 등 비식별 속성만 허용)

`TASKS/TASK-CMP-SCR003-FLIGHT-TAB.md`, `TASKS/TASK-CMP-SCR003-HOTEL-TAB.md`의 Security/Privacy AC가 이 원칙을 Task 단위로 강제한다.

---

## 6. 정적 데이터 — `src/data`

여행지, 국가 안전정보, `free_traveler` 대표 프로필은 Supabase 테이블이 아니라 **`src/data`의 TypeScript 정적 데이터**로 관리한다.

```
src/data/
  destinations/domestic.ts
  destinations/overseas.ts
  safety/countries.ts
  representative/profile.ts
```

- 콘텐츠 변경은 이 파일들을 직접 코드 수정하는 것으로 처리한다. 관리자 CRUD/CMS 화면을 만들지 않는다(§11 참조).
- 이미지는 일반 인터넷 URL + `alt` 텍스트만 사용한다. 별도 업로드·라이선스 승인 워크플로는 두지 않는다.

---

## 7. Supabase 사용 범위 — Auth와 동행 기능 중심

Supabase는 다음 두 가지 목적에만 사용한다:

1. **Auth**: 이메일 회원가입·인증·로그인·로그아웃·비밀번호 재설정, 성인 확인 상태·시각 기록.
2. **동행(Mate) 기능**: 모집글, 참가 요청, 차단, 신고, 그리고 관리자가 설정하는 외부 URL(`app_settings`).

여행지·안전정보·대표 프로필 조회(§6)와 항공·숙소 폼(§4~§5)은 Supabase를 거치지 않는다.

### 8. DB — 정확히 6개 테이블

| 테이블 | 역할 |
|---|---|
| `user_profiles` | 닉네임, 연령대, 성별(선택), 여행 스타일, 성인 확인 상태(`is_adult`, `adult_verified_at`) — 정확한 생년월일은 저장하지 않음 |
| `mate_posts` | 동행 모집글(국가·지역·기간·모집인원·조건·상태) |
| `mate_applications` | 참가 요청과 승인/거절 상태 |
| `user_blocks` | 사용자 간 차단 관계 |
| `reports` | 신고 대상·사유·상태(OPEN/RESOLVED/DISMISSED) |
| `app_settings` | 관리자가 설정하는 항공·숙소 외부 URL(HTTPS 허용목록) |

이 6개를 넘는 테이블(예: 범용 감사 로그 `audit_log`, 미디어 관리 `media_asset`)은 만들지 않는다. `TASKS/TASK-DB-SCHEMA-BASE.md`가 이 allowlist를 강제한다.

### 9. Browser·Server Supabase Client 구분

| 위치 | 클라이언트 | 용도 |
|---|---|---|
| Client Component | Browser Supabase Client(`@supabase/ssr`의 `createBrowserClient`) | 로그인 상태 구독, 클라이언트 측 세션 확인 |
| Server Component / Server Action / Route Handler | Server Supabase Client(`@supabase/ssr`의 `createServerClient`, 쿠키 기반) | 데이터 조회·쓰기, RLS가 적용된 상태로 요청 처리 |

두 클라이언트 모두 `anon` 키만 사용한다. `service_role` 키는 서버 전용 관리 스크립트(시드 등) 외에는 애플리케이션 코드에 노출하지 않는다.

### 10. RLS 원칙(간단)

- 6개 테이블 모두 RLS를 활성화한다.
- 원칙은 세 줄로 요약된다: **본인 데이터는 본인만 쓰고, 관련자(요청 대상 작성자)는 관련 데이터만 읽고, Moderator/Admin은 운영에 필요한 범위만 넘본다.** 그 외 접근은 전부 거부(빈 결과 또는 403)한다.
- 복잡한 다단계 정책 언어나 커스텀 함수 체계를 만들지 않는다 — 위 원칙을 테이블별로 그대로 옮긴 단순 정책만 작성한다.

### 11. ORM 미사용

**Prisma 등 ORM을 사용하지 않는다.** Supabase JS 클라이언트(`@supabase/supabase-js`)의 쿼리 빌더를 직접 사용하고, `src/lib/db/*.ts`에 타입 안전한 얇은 래퍼 함수만 둔다. 스키마 마이그레이션은 `supabase/migrations/*.sql`로 직접 관리한다.

---

## 12. 테스트 — Vitest + Playwright(Chromium Smoke)

| 계층 | 도구 | 범위 |
|---|---|---|
| Unit | **Vitest** | 날짜 검증, 연락처 탐지, 동행/신고 상태 전이(`TASKS/TASK-UNIT-*.md`) |
| RLS | Vitest 또는 Supabase SQL 테스트 | 6개 테이블 RLS 정책 시나리오(`TASKS/TASK-TEST-RLS-BASIC.md`) |
| E2E | **Playwright, Chromium 단일 브라우저 Smoke만** | 5개 Screen의 핵심 흐름 3묶음(`E2E-PUBLIC-SMOKE`, `E2E-TRAVEL-TOOLS`, `E2E-MATE-AUTH`) |

Firefox/WebKit 등 다중 브라우저 매트릭스나 전체 회귀 스위트는 만들지 않는다.

---

## 13. CI/CD — GitHub Actions + Vercel Preview

- **GitHub Actions**: PR마다 `npm run lint`, `tsc --noEmit`(TypeScript strict), `vitest run`을 실행하는 단일 워크플로만 둔다.
- **Vercel Preview**: PR 생성 시 Vercel이 자동 생성하는 Preview Deployment로 시각 확인한다. Production 배포는 `main` 병합 후 수동으로 승인한다.
- 별도 자체 CI 러너, 배포 스크립트, 인프라 as code 도구는 두지 않는다.

## 14. AWS·EC2 미사용

컴퓨트·인프라는 **Vercel(애플리케이션)과 Supabase(DB·Auth)만** 사용한다. EC2, Lambda, S3 등 AWS 서비스나 다른 클라우드 VM은 이 프로젝트에 추가하지 않는다.

## 15. 자동 Merge 미사용

PR 병합은 항상 사람이 검토 후 수동으로 수행한다. 자동 Merge Runner, 상태 체크 통과 시 자동 병합(auto-merge) 규칙, Merge Queue 자동화는 구성하지 않는다.

---

## 16. 프로젝트 범위에서 명시적으로 제외하는 것

다음은 `docs/PROJECT_SCOPE.md`에서 이미 EXCLUDED로 확정된 항목이며, 이 아키텍처 문서에서도 동일하게 범위 밖임을 재확인한다.

| 항목 | 제외 사유 |
|---|---|
| **CMS** | 콘텐츠는 §6의 `src/data` 정적 파일로 관리하며 별도 콘텐츠 관리 시스템(관리자 CRUD·게시 워크플로)을 두지 않는다. |
| **외부 이메일 공급자** | 실제 이메일 발송 파이프라인(SendGrid, Resend 등)을 연동하지 않는다. 참가 요청·신고 처리 알림은 인앱 Toast/상태 표시로 대체한다. Supabase Auth의 기본 이메일 인증 메일만 예외로 사용한다. |
| **Monitoring** | Sentry, Datadog 등 별도 모니터링·오류 추적 서비스를 연동하지 않는다. Vercel 기본 로그/애널리틱스 범위에만 의존한다. |

---

## 17. 착수 차단(Blockers)

아래는 **실제로 파일 트리·`package.json`을 확인한 결과** 현재 저장소에 없는, 구현 착수 전 반드시 채워야 하는 항목만 기록한다. 존재 여부를 확인하지 않은 항목은 여기 적지 않는다.

### 17-1. 누락된 의존성(`package.json`에 없음)

- `@supabase/supabase-js`, `@supabase/ssr` — §7~§9의 Supabase 클라이언트 구현에 필요하나 `dependencies`에 없음
- `vitest` — §12 Unit/RLS 테스트에 필요하나 설치되어 있지 않음
- `@playwright/test` — §12 E2E Smoke Test에 필요하나 설치되어 있지 않음

### 17-2. 누락된 환경변수(`.env` 계열 파일 자체가 없음)

리포지토리에 `.env`, `.env.local`, `.env.example` 파일이 하나도 없다. 최소한 아래 변수가 정의되어야 Supabase 연동(§7~§10)을 시작할 수 있다.

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`(시드/마이그레이션 스크립트 전용, 애플리케이션 런타임에는 미노출)

### 17-3. 누락된 설정 파일·경로

- `supabase/` 디렉터리 자체가 없음 — `supabase/migrations/0001_schema.sql`(§8) 작성 전 `supabase init` 또는 동등한 프로젝트 연결이 필요
- `.github/workflows/` 디렉터리 자체가 없음 — §13 GitHub Actions 워크플로 파일 작성 전 필요
- `git remote`가 설정되어 있지 않음(로컬 `main` 브랜치만 존재) — GitHub Actions와 Vercel 연동에는 원격 저장소 연결이 선행되어야 함

이 세 범주 외에는 착수를 막는 누락 사항이 확인되지 않았다(`src/app/page.tsx`, `src/app/layout.tsx` 등 App Router 기본 골격은 이미 존재).
