# Free Traveler — Root Agent Rules

이 파일이 이 리포지토리에서 작업하는 모든 Agent의 유일한 규칙 정본이다. 다른 Agent 규칙 파일(`AGENTS.md` 등)을 참조하거나 위임하지 않고, 필요한 규칙을 전부 이 파일에 직접 기록한다.

## Harness Marker

```
HARNESS_SCHEMA=traveler-screen-route-v1
DESIGN_PATH=design-reference/D-001/DESIGN.md
SCREEN_CONTRACT=design-reference/SCREEN_ROUTE_CONTRACT.json
PROJECT_SCOPE=docs/PROJECT_SCOPE.md
PLAYWRIGHT_ENABLED=true
PLAYWRIGHT_SCOPE=chromium-smoke
AUTO_MERGE=false
AWS_ENABLED=false
```

이 마커의 값은 코드나 프롬프트에서 임의로 바꾸지 않는다. 값을 바꿔야 하는 상황이라면 먼저 사람에게 확인한다.

## 정본 문서

| 정본 | 파일 |
|---|---|
| SRS | `docs/06_SRS_UIUX_REVISED.md` |
| Scope 분류(IMPLEMENT/EXCLUDED) | `docs/PROJECT_SCOPE.md` |
| 디자인 토큰·컴포넌트 규칙 | `design-reference/D-001/DESIGN.md` |
| Screen·Route·Page Entry 계약 | `design-reference/SCREEN_ROUTE_CONTRACT.json` |

이 네 문서와 실제 코드가 어긋나면, 코드를 정본에 맞춘다. 정본을 코드에 맞춰 고치지 않는다.

## 필수 규칙

1. **작업 전 확인**: 매 작업 시작 시 `package.json`의 실제 의존성 버전과 `node_modules/next/dist/docs/`의 현재 Next.js 문서를 확인한다. 이 프로젝트의 Next.js는 학습 데이터의 관례와 다를 수 있으므로, 기억에 의존해 API를 추측하지 않는다.
2. SRS 정본은 `docs/06_SRS_UIUX_REVISED.md`다. 요구사항 원문·배치를 확인할 때 다른 문서(`02_SRS_BASELINE.md` 등)보다 이 문서를 우선한다.
3. Scope 분류 정본은 `docs/PROJECT_SCOPE.md`다. 어떤 요구사항이 IMPLEMENT/EXCLUDED인지는 이 문서로만 판단한다.
4. 디자인 정본은 `design-reference/D-001/DESIGN.md`다. 컬러·타이포·spacing·radius·shadow·Do/Do Not은 이 문서의 토큰만 사용한다.
5. Screen 정본은 `design-reference/SCREEN_ROUTE_CONTRACT.json`이다. Screen 목록·Route·Page Entry·Section 순서·최소 콘텐츠 수는 이 파일을 유일한 소스로 읽는다.
6. `/run-wave WXX`를 표준 개발 명령으로 사용한다. Wave 단위가 아닌 임의 순서로 Task를 골라 진행하지 않는다.
7. Wave 내부 Task는 `Depends On` 순서를 따르며, 한 번에 하나의 Task만 구현한다. 여러 Task를 동시에 병렬로 건드리지 않는다.
8. 현재 진행 중인 Task의 `Expected Files` 목록 밖에 있는 파일은 만들거나 수정하지 않는다.
9. Page Owner Task는 자신의 Page Entry(`page.tsx`)에서 이미 존재하는 Component Task 결과물을 실제로 조립하는 것만 범위로 한다. Page Owner Task 안에서 새 Component를 직접 만들지 않는다.
10. SCR-001(`src/app/page.tsx`) 완료 시 `create-next-app` 기본 Starter 콘텐츠를 전량 제거한다.
11. SCR-003(`/travel-tools`)은 항공·숙소·동행 작성 세 탭을 모두 조립하며, 탭별 입력·검증·완료 상태를 서로 완전히 분리한다.
12. 항공·숙소 입력값(국가·지역·날짜)은 서버 API, DB, 외부 이동 URL의 query string, 서버 로그, 분석 이벤트 어디로도 보내지 않는다. Client Component의 컴포넌트 상태로만 유지한다.
13. Supabase 쓰기 작업은 Auth(가입·로그인·성인확인), 동행(모집글·참가 요청), 신고·차단, 관리자 설정(`app_settings`)의 범위로 제한한다. 이 범위를 넘는 새 쓰기 대상을 추가하지 않는다.
14. RLS를 우회하는 Client 코드(예: `service_role` 키를 이용한 우회 조회, RLS 없는 임시 테이블 접근)를 작성하지 않는다.
15. Service Role Key를 어떤 Client Component나 클라이언트로 전달되는 코드에도 사용하지 않는다. Service Role Key는 서버 전용 관리 스크립트에서만 환경변수로 읽는다.
16. 여행지·안전정보·`free_traveler` 대표 프로필은 `src/data`의 정적 TypeScript Data를 사용한다. 이 콘텐츠를 위해 새 DB 테이블이나 CMS를 만들지 않는다.
17. Prisma나 다른 ORM, AWS, EC2를 이 프로젝트에 추가하지 않는다. DB는 Supabase 클라이언트를 직접 사용하고, 인프라는 Vercel·Supabase만 사용한다.
18. Playwright는 Chromium 기준 핵심 Smoke Test만 작성한다(`PLAYWRIGHT_SCOPE=chromium-smoke`). 다중 브라우저 매트릭스나 전체 회귀 스위트를 추가하지 않는다.
19. `docs/PROJECT_SCOPE.md`에서 EXCLUDED로 분류된 기능을 임의로 구현하지 않는다. 구현이 필요하다고 판단되면 먼저 `PROJECT_SCOPE.md`를 갱신하도록 사람에게 확인을 구한다.
20. `git reset --hard`, `git checkout --`, `git clean -f`, `git push --force`, `git branch -D` 등 destructive Git 명령을 임의로 사용하지 않는다. 반드시 필요하다면 먼저 `git status`로 현재 상태를 확인하고 사람의 명시적 승인을 받는다.
21. 자동 PR 생성이나 자동 Merge를 실행하지 않는다(`AUTO_MERGE=false`). PR 생성까지는 요청받으면 수행할 수 있으나, Merge는 항상 사람이 수동으로 한다.
22. 화면(Screen) 단위 Wave를 마치면 사람이 Preview를 확인할 때까지 기다린다. 사람의 확인 없이 다음 화면 Wave로 임의 진행하지 않는다.
23. 작업 완료 시 다음 세 가지를 반드시 보고한다: **변경 파일 목록**, **검증 결과**(Lint/TypeScript/Unit Test/Playwright 실행 결과), **남은 제한사항**(이번 Task에서 처리하지 못했거나 다음 Task로 넘긴 것).

## Task 완료 순서

Task를 수행할 때는 항상 다음 순서를 따른다. 순서를 건너뛰거나 뒤바꾸지 않는다.

1. **Task 읽기** — `TASKS/TASK-<ID>.md`의 Context, Requirement Ref, Expected Files, Functional/Visual/Security AC, Forbidden을 전부 읽는다.
2. **입력 확인** — Depends On에 명시된 선행 Task의 결과물이 실제로 존재하는지, 정본 문서(SRS/PROJECT_SCOPE/D-001/SCREEN_ROUTE_CONTRACT)와 어긋나지 않는지 확인한다.
3. **구현** — Expected Files 안에서만 코드를 작성한다.
4. **관련 포맷·Unit Test** — 해당 Task와 관련된 포맷(lint/type check)과 Unit Test를 실행한다.
5. **필요 시 Playwright** — Task가 Chromium Smoke 흐름에 해당하면 관련 Playwright 시나리오를 실행한다.
6. **Diff 확인** — Expected Files 밖의 변경이 없는지, Forbidden 항목을 어기지 않았는지 diff로 재확인한다.
7. **완료 보고** — 위 23번 규칙에 따라 변경 파일·검증 결과·남은 제한사항을 보고한다.
