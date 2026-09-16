---
version: D-001
name: Free-Traveler-design-system
status: LOCKED
description: A warm, photography-led travel-preparation platform on a pure white canvas with a single Coral accent (#FF6B4A) carrying every primary CTA, active tab, and selected chip. Type runs Inter with a Korean system-font fallback. Cards are gently rounded (12px), search bars and filter chips are fully pill-shaped, and anything that signals risk, warning, or official safety information is deliberately never Coral. There is no purchase, booking, or payment UI anywhere in the system — every "다음 행동" is either an external link-out, a preparation form, or a companion request.

colors:
  coral: "#FF6B4A"
  coral-active: "#E8532E"
  coral-disabled: "#FFD9CC"
  coral-soft: "#FFF1EC"
  canvas: "#FFFFFF"
  surface-soft: "#F7F6F5"
  surface-strong: "#EFEDEB"
  ink: "#262626"
  body: "#4B4B4B"
  muted: "#767676"
  hairline: "#E2E2E2"
  error: "#C1352B"
  warning: "#B45309"
  advisory: "#8C1D18"
  safety-info: "#2A6F97"
  success: "#1E7F4D"
  on-coral: "#FFFFFF"

typography:
  display-lg:
    fontFamily: "'Inter', -apple-system, 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif"
    fontSize: 32px
    fontWeight: 700
    lineHeight: 40px
    letterSpacing: 0
  display-md:
    fontFamily: "'Inter', -apple-system, 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif"
    fontSize: 24px
    fontWeight: 700
    lineHeight: 32px
    letterSpacing: 0
  title-lg:
    fontFamily: "'Inter', -apple-system, 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif"
    fontSize: 20px
    fontWeight: 600
    lineHeight: 28px
    letterSpacing: 0
  title-md:
    fontFamily: "'Inter', -apple-system, 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif"
    fontSize: 18px
    fontWeight: 600
    lineHeight: 26px
    letterSpacing: 0
  body-lg:
    fontFamily: "'Inter', -apple-system, 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif"
    fontSize: 16px
    fontWeight: 400
    lineHeight: 26px
    letterSpacing: 0
  body-md:
    fontFamily: "'Inter', -apple-system, 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif"
    fontSize: 15px
    fontWeight: 400
    lineHeight: 24px
    letterSpacing: 0
  caption:
    fontFamily: "'Inter', -apple-system, 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif"
    fontSize: 13px
    fontWeight: 500
    lineHeight: 20px
    letterSpacing: 0
  button:
    fontFamily: "'Inter', -apple-system, 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif"
    fontSize: 16px
    fontWeight: 600
    lineHeight: 24px
    letterSpacing: 0

rounded:
  sm: 8px
  md: 12px
  lg: 16px
  full: 9999px

spacing:
  xs: 4px
  sm: 8px
  md: 12px
  base: 16px
  lg: 24px
  xl: 32px
  section-desktop-min: 64px
  section-desktop-max: 96px
  section-mobile-min: 40px
  section-mobile-max: 64px

shadow:
  card: "0 1px 2px rgba(0,0,0,.04), 0 4px 12px rgba(0,0,0,.08)"
  none: "none"

components:
  button-primary:
    backgroundColor: "{colors.coral}"
    textColor: "{colors.on-coral}"
    typography: "{typography.button}"
    rounded: "{rounded.sm}"
    padding: 14px 24px
    height: 48px
  button-primary-disabled:
    backgroundColor: "{colors.coral-disabled}"
    textColor: "{colors.on-coral}"
    rounded: "{rounded.sm}"
  button-secondary:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.button}"
    rounded: "{rounded.sm}"
    padding: 13px 23px
    height: 48px
  search-bar-pill:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.full}"
    padding: 14px 24px
    height: 56px
  chip:
    backgroundColor: "{colors.surface-strong}"
    textColor: "{colors.ink}"
    typography: "{typography.caption}"
    rounded: "{rounded.full}"
    padding: 8px 16px
  chip-selected:
    backgroundColor: "{colors.coral-soft}"
    textColor: "{colors.coral-active}"
    rounded: "{rounded.full}"
    padding: 8px 16px
  destination-card:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.md}"
    shadow-hover: "{shadow.card}"
  mate-post-card:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.md}"
    padding: 16px
  safety-badge-warning:
    backgroundColor: "{colors.warning}"
    textColor: "{colors.on-coral}"
    typography: "{typography.caption}"
    rounded: "{rounded.full}"
    padding: 4px 10px
  safety-badge-advisory:
    backgroundColor: "{colors.advisory}"
    textColor: "{colors.on-coral}"
    typography: "{typography.caption}"
    rounded: "{rounded.full}"
    padding: 4px 10px
  safety-badge-info:
    backgroundColor: "{colors.safety-info}"
    textColor: "{colors.on-coral}"
    typography: "{typography.caption}"
    rounded: "{rounded.full}"
    padding: 4px 10px
  text-input:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.sm}"
    padding: 14px 12px
    height: 56px
  tab:
    backgroundColor: transparent
    textColor: "{colors.muted}"
    typography: "{typography.title-md}"
  tab-active:
    backgroundColor: transparent
    textColor: "{colors.ink}"
    typography: "{typography.title-md}"
    underline: "{colors.coral}"
  drawer-modal:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    shadow: "{shadow.card}"
    scrim: "rgba(0,0,0,.5)"
  toast:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.canvas}"
    rounded: "{rounded.sm}"
    typography: "{typography.body-md}"
  header-bar:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.title-md}"
    height-desktop: 80px
    height-mobile: 64px
  footer-light:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    padding-desktop: 48px 80px
    padding-mobile: 32px 16px
---

## Visual Theme

Free Traveler is a **travel-preparation hub, not a booking marketplace**. The visual theme reads as warm, editorial, and photography-first — closer to a well-curated travel magazine than a transaction funnel. The canvas is **pure white** (`{colors.canvas}`) with **Ink** (`{colors.ink}` — #262626) carrying headlines and body copy, and a single accent, **Coral** (`{colors.coral}` — #FF6B4A), reserved for primary CTAs, active tab underlines, and selected chips. Coral appears at most once per Section as a primary button — it is never used for warnings, safety content, or decorative emphasis.

Anything that communicates risk, official notice, or validation state is deliberately **not** Coral: stale-safety warnings use `{colors.warning}`, major travel advisories use `{colors.advisory}`, neutral safety categories use `{colors.safety-info}`, and inline form errors use `{colors.error}`. Every semantic color is paired with a Korean text label — color is never the sole signal.

The shape language is soft but restrained: cards round at `{rounded.md}` (12px), Drawer/Modal panels round at `{rounded.lg}` (16px), and only search bars, chips, and badges use the fully pill-shaped `{rounded.full}`. There is exactly one shadow tier (`{shadow.card}`), applied only to hover-floated cards, Drawer/Modal panels, and dropdowns — 95% of the surface stays flat.

This design system is derived from `docs/04_UIUX_PLAN.md` and validated against the Stitch screens recorded in `docs/STITCH_VALIDATION_REPORT.md`; it supersedes ad-hoc styling choices made in any individual Stitch generation.

## Color Token

| Token | Value | Use |
|---|---|---|
| `color.canvas` | `#FFFFFF` | Base background everywhere, including Header/Footer |
| `color.surface-soft` | `#F7F6F5` | Alternating Section background band |
| `color.surface-strong` | `#EFEDEB` | Default (unselected) Chip fill |
| `color.ink` | `#262626` | Headlines, body text, primary nav |
| `color.body` | `#4B4B4B` | Secondary running text |
| `color.muted` | `#767676` | Captions, meta text, inactive labels |
| `color.hairline` | `#E2E2E2` | 1px borders, card outlines |
| `color.coral` | `#FF6B4A` | Primary CTA fill, active tab underline, selected chip text |
| `color.coral-active` | `#E8532E` | Primary CTA pressed state, selected chip text |
| `color.coral-disabled` | `#FFD9CC` | Primary CTA disabled fill |
| `color.coral-soft` | `#FFF1EC` | Selected chip fill |
| `color.error` | `#C1352B` | Form validation errors, failed external link-out |
| `color.warning` | `#B45309` | Safety stale warning ("확인 필요") |
| `color.advisory` | `#8C1D18` | Major travel advisory ("여행 금지" level) |
| `color.safety-info` | `#2A6F97` | Neutral safety category badges |
| `color.success` | `#1E7F4D` | Submission/approval confirmation |
| `color.on-coral` | `#FFFFFF` | Text on Coral or semantic-color fills |

Every color used anywhere in the product **must** resolve to a token in this table. No screen, component, or Stitch prompt may introduce a raw hex value that is not listed here — see [Do / Do Not](#do--do-not).

## Typography

Font stack: `"Inter", -apple-system, "Apple SD Gothic Neo", "Malgun Gothic", sans-serif`. Inter is open-source (SIL OFL) and ships as a web font reference or system-installed fallback — **no proprietary font files are bundled or licensed**. Korean text automatically falls back to the OS-native Korean system font so glyphs never render as a mismatched Latin substitute.

| Token | Size / Line height | Weight | Use |
|---|---|---|---|
| `type.display-lg` | 32px / 40px | 700 | SCR-001·SCR-002 Hero title |
| `type.display-md` | 24px / 32px | 700 | Section H2 title |
| `type.title-lg` | 20px / 28px | 600 | Card title, Sub-section title |
| `type.title-md` | 18px / 26px | 600 | List card title, Tab label |
| `type.body-lg` | 16px / 26px | 400 | Section description, body paragraph |
| `type.body-md` | 15px / 24px | 400 | Card meta, form help text |
| `type.caption` | 13px / 20px | 500 | Badge, timestamp, label |
| `type.button` | 16px / 24px | 600 | Button label |

Display sizes stay modest (max 32px) — destination photography, safety badges, and real content carry visual weight instead of oversized type.

## Spacing

| Token | Value |
|---|---|
| `space.xs` | 4px |
| `space.sm` | 8px |
| `space.md` | 12px |
| `space.base` | 16px |
| `space.lg` | 24px |
| `space.xl` | 32px |
| `space.section-desktop` | 64–96px (Section 상하 여백, Desktop) |
| `space.section-mobile` | 40–64px (Section 상하 여백, Mobile) |

## Radius

| Token | Value | Use |
|---|---|---|
| `radius.sm` | 8px | Buttons, text inputs |
| `radius.md` | 12px | Cards (Destination, Mate Post, Stat) |
| `radius.lg` | 16px | Drawer/Modal panels |
| `radius.full` | 9999px | Search bar, Chip, Badge, Tab pill indicator |

## Shadow

There is **one** shadow tier plus flat baseline — no progressive elevation system.

- **Flat (no shadow):** Header, Footer, Hero, all Section bodies — the default for ~95% of surfaces.
- **`shadow.card`:** `0 1px 2px rgba(0,0,0,.04), 0 4px 12px rgba(0,0,0,.08)` — used only on hover-floated Destination/Mate Post cards, Drawer/Modal panels, and the search/filter dropdown.
- **Scrim:** `rgba(0,0,0,.5)` flat black at 50% opacity behind any open Drawer or Modal.

## Header · Footer

Shared across all 5 Screens — never redefined per screen.

**Header**
- Height: 80px Desktop / 64px Mobile. Background `{colors.canvas}`, 1px `{colors.hairline}` bottom border.
- Left: "Free Traveler" text wordmark → `/`. Right (Desktop): 홈 · 대표 소개 · 여행 준비 · 동행 찾기 · 계정.
- Mobile: logo + hamburger icon opening a full-screen sheet with the same 5 links.

**Footer**
- Background `{colors.canvas}` — matches page canvas, no contrast band.
- 3 columns Desktop → 1 column Mobile: **서비스** (홈·여행 준비·동행 찾기·대표 소개), **정책** (이용약관·개인정보 처리방침·동행 안전수칙·콘텐츠 면책 안내), **문의** (고객 문의, SNS 링크).
- Legal band: "© Free Traveler. 안전정보는 외교부 해외안전여행 공식 발표를 우선 확인하세요." + 최종 배포일.
- Padding: 48px×80px Desktop / 32px×16px Mobile.

## Search · Filter

- **`search-bar-pill`**: white fill, `{rounded.full}`, 56px height, 1px hairline border, single input with a placeholder such as "여행지, 국가, 도시를 검색해보세요". Used once as the SCR-001 Hero's primary interactive element.
- **Filter chips** (`chip` / `chip-selected`): pill-shaped, used for theme/country/status filtering (SCR-001 여행 스타일, SCR-004 국가·기간·모집 상태). Default fill `{colors.surface-strong}`; selected fill `{colors.coral-soft}` with `{colors.coral-active}` text — never a solid Coral fill (Coral solid is reserved for buttons).
- **Filter + result summary** (SCR-004): filter row followed by a one-line result count ("모집중 12건"). Filters apply as AND conditions; a "필터 초기화" text action is always present once any filter is active.

## Destination Card

- Photo-first: 4:3 or 1:1 image, `{rounded.md}` clipping, real travel photography with a Korean `alt` describing the actual place.
- Beneath the image: title (`type.title-md`), one meta line (`type.body-md`, muted), optional favorite-toggle icon top-right.
- Hover state: `{shadow.card}` lift, no color change.
- Grid: 3–4 columns Desktop, 1 column Mobile; a horizontal-scroll variant is permitted for a second card row on the same screen to avoid two visually identical grids back-to-back (e.g., SCR-001 해외 여행지 row vs. 국내 여행지 grid).

## Form · Tabs

- **`text-input`**: white fill, 1px hairline border, `{rounded.sm}`, 56px height, stacked label above in `{typography.caption}`. On focus: border thickens to 2px `{colors.ink}`, no glow/ring. Validation error: border and helper text switch to `{colors.error}`.
- **Tabs** (`tab` / `tab-active`): used for SCR-003's 항공편/숙소/동행 구하기 tab group. Active tab: `{colors.ink}` label + `{colors.coral}` 2px underline. Each tab keeps **independent input, validation, and completion state** — switching tabs never clears or mixes another tab's values.
- Minimum touch target for every input, tab, and control: 44×44px.

## Mate Post Card

- Compact card, `{rounded.md}`, 16px internal padding, no photo required (text-first, unlike Destination Card).
- Content: title (`type.title-md`), country + date range (`type.body-md`), status badge ("모집중" default-ink pill / "마감" muted pill — never Coral, since Coral is reserved for actions not status), capacity/style meta line.
- **Never renders contact info** (phone, email, messenger ID) on the card or in the detail panel — participation is request-based only.
- Detail view (SCR-004): Desktop 좌우 분할 (list left, detail right); Mobile bottom Drawer triggered by card tap.

## Drawer · Modal

- Used for: SCR-001 여행지 상세 / 안전정보 패널, SCR-004 Mobile 동행 상세.
- Panel: `{colors.canvas}` fill, `{rounded.lg}` (top corners only if bottom-anchored on Mobile), `{shadow.card}`, scrim `rgba(0,0,0,.5)` behind.
- Opens over the current screen without full navigation — closing returns to the exact prior scroll position.
- Keyboard: focus moves into the panel on open, `Esc` and a visible close control both dismiss it, focus returns to the trigger element on close.

## Alert · Toast

- **Inline alert** (safety advisory, form error banner): left-aligned icon + `type.body-md` text in the matching semantic color (`error`/`warning`/`advisory`/`safety-info`), plus a text label — never a color chip alone.
- **Toast**: `{colors.ink}` fill, white text, `{rounded.sm}`, auto-dismiss after a few seconds, used for transient confirmations (참가 요청 접수, 승인/거절 처리, 저장 완료). Toasts never carry the only record of a state change — the underlying list/status always reflects it too.

## Loading · Empty · Error 상태

- **Loading**: skeleton blocks matching the target card/section shape (no spinner-only full-page blocks except initial session check on SCR-005). Never show stale zero-state content while loading.
- **Empty**: always a *complete* composition — one sentence explaining why it's empty, one sentence on how the feature works, and one CTA to the next action (e.g., SCR-001 동행 소식 Empty → "동행 글 작성하기" → SCR-003). An Empty State is never a bare icon or a blank card.
- **Error**: a short, specific sentence (never a raw technical message) + a retry or alternate action. Errors are scoped to the failing Section only — the rest of the screen keeps functioning.
- **Unauthorized** (where applicable — SCR-003 동행 탭, SCR-004 참가/신고/차단, SCR-005 내 활동): replaces the action area with a login/adult-verification prompt CTA to SCR-005, never a silent disabled button with no explanation.

## Desktop · Mobile 규칙

| 기준 | Desktop | Mobile |
|---|---|---|
| Viewport 기준 | 1440px | 390px |
| Page Section 최대 폭 | 1200–1280px, 중앙 정렬 | viewport − 32px (좌우 16px) |
| Section 상하 여백 | 64–96px | 40–64px |
| Card 배치 | 3–4열 그리드 | 1열 |
| 목록+상세(SCR-004) | 좌우 분할 | 하단 Drawer |
| Header 높이 | 80px | 64px, 햄버거 시트 |

## Page Section 최대 폭과 상하 여백

Every Section's content is constrained to **1200–1280px** centered on Desktop; Mobile content spans the full viewport minus 16px side padding. Vertical rhythm: **64–96px** top/bottom padding per Section on Desktop, **40–64px** on Mobile. Sections alternate background between `{colors.canvas}` and `{colors.surface-soft}` to create visual separation without borders or shadows.

## Hero 높이와 다음 Section 노출 규칙

Hero sections (SCR-001, SCR-002) are **height-capped** so that on a 1440px Desktop viewport, the next Section's title is visibly peeking below the fold — the Hero must never consume the full first screen height. Target Hero height: **520–560px** Desktop, proportionally shorter on Mobile. This is a hard rule: any Hero that pushes the second Section fully below the fold on a 1440px screen fails design review.

## Section별 제목·설명·본문·CTA 계층과 시각적 리듬

Every Section, without exception, follows this internal hierarchy:

1. **제목** — `type.display-md`, one Korean H2, states the Section's purpose in plain language (never a generic label like "Section 2").
2. **설명** — 1–3 Korean sentences at `type.body-lg`, directly under the title, explaining what the user will find or do here.
3. **본문 또는 CTA** — real content (cards, chips, timeline items, form fields) and/or exactly one primary CTA. A Section never ships title+description with no body content.

Visual rhythm across a screen must **cross-cut** layout patterns — Hero, Card Grid, 좌우 분할, Chip 목록, 3단계 안내, CTA Banner, Timeline, Gallery — so that no two adjacent Sections use an identical layout pattern with identical card styling.

## 화면별 Section 순서와 최소 콘텐츠 수

| Screen | Section 수 | 순서 | 최소 콘텐츠 수 |
|---|---|---|---|
| **SCR-001** `/` | 7 | Hero → 국내 여행지 Card Grid → 해외 여행지 Card Grid → 여행 동기 Chip → 국가별 주의사항 Card+Drawer → 최근 동행글/Empty → free_traveler 소개 | 국내 6 / 해외 6 / 테마 6 / 안전 6 / 동행글 3(or Empty) |
| **SCR-002** `/about` | 7 | Profile Hero → 여행 지표 → 소개·철학 → Timeline → 방문 국가 → Gallery → 기억에 남는 여행지+CTA | Timeline 6개 이상 / 방문 국가 30개 / Gallery 사진 8장 이상 / 추천 여행지 4개 |
| **SCR-003** `/travel-tools` | 6 | Intro → 탭(항공/숙소/동행) → 여행정보 Form → 요약·외부 이동 → 찾기 Tip 3개 → 동행 작성 또는 로그인 안내 | Tip 3개, 세 탭 상태 완전 분리 |
| **SCR-004** `/mates` | 6 | Intro → Filter·결과 요약 → 동행 목록 → 상세(분할/Drawer) → 신청 방법 3단계 → 안전·신고·차단 안내+CTA | 목록 카드 최대 8개 우선 노출, 신청 3단계 |
| **SCR-005** `/account` | 역할별 탭 (Section 수 고정 아님) | Guest: Intro→로그인/가입 Card→로그인 후 기능→보안 안내 / Member: 프로필·성인확인→내 글→참가 요청→차단 목록→작성 CTA / Admin: Intro→신고 상태 처리→외부 URL 설정 | 역할에 없는 탭은 렌더링하지 않음 |

## 완성형 Empty State와 Placeholder 문구 금지 규칙

- 다음 문구는 **어떤 화면에도 절대 사용 금지**: `Lorem ipsum`, `준비 중`, `정보 확인 필요`, 의미 없는 반복 문구, 내용 없는 빈 Card.
- 목록형 데이터가 0건이어도 **완성된 3요소**를 갖춘 Empty State만 허용한다 — ① 왜 비어 있는지 1문장, ② 기능 이용 방법 1문장, ③ 다음 행동 CTA 1개. 세 요소 중 하나라도 없으면 미완성 Empty State로 간주해 반려한다.
- 안전정보 등 시점 의존 데이터가 오래된 경우, "정보 확인 필요" 같은 모호한 문구 대신 구체적 문구("최종 확인 후 7일이 지났어요 — 최신 정보를 다시 확인해 주세요")와 공식 출처 링크를 함께 제공한다.

## Desktop · Mobile 변형이 존재하는 Screen

승인된 Stitch 범위 기준으로 **SCR-001, SCR-003만** 390px Mobile 변형을 필수로 갖는다(`DESIGN_MANIFEST.md` 참고). 나머지 Screen도 반응형 규칙(위 표)을 따르되 전용 Mobile 승인 변형은 이 버전(D-001)의 필수 산출물이 아니다.

---

## Do / Do Not

### Do
- 모든 컬러는 위 [Color Token](#color-token) 표의 토큰만 사용한다.
- 오류·경고·중대 경보·안전 일반 정보는 각각 `error`/`warning`/`advisory`/`safety-info` 토큰 + 텍스트 라벨로 병기한다.
- 모든 Section에 제목·설명·본문/CTA 3요소를 모두 채운다.
- 목록이 비어도 이유·이용 방법·다음 행동 CTA가 있는 완성형 Empty State를 만든다.
- 이미지에는 실제 장소·상황을 설명하는 한국어 `alt`를 붙인다.
- 키보드 포커스는 항상 시각적으로 표시하고, 모든 인터랙션 요소는 44×44px 이상을 확보한다.
- Inter + 시스템 한글 폰트만 사용한다(웹폰트 참조 또는 OS 폴백, 파일 번들 없음).

### Do Not
- **Airbnb 상표 요소를 사용하지 않는다** — 로고, 워드마크, "Airbnb"/"에어비앤비" 텍스트, 아이콘 세트, 컬러 값(#ff385c 등)을 포함해 어떤 형태로도 재사용하지 않는다. `design-reference/vendor/airbnb/DESIGN.md`는 구조·톤 참고용일 뿐이다.
- **구매·예약·결제 UI를 만들지 않는다** — 가격 비교, 재고/가용 객실 표시, 장바구니, 결제 폼, 예약 확정 버튼은 어떤 화면에도 존재해서는 안 된다. 항공·숙소는 조건 입력 후 외부 사이트로의 "이동"만 제공한다.
- **Proprietary Font 파일을 추가하지 않는다** — Airbnb Cereal 등 라이선스가 필요한 서체 파일을 프로젝트에 포함하지 않는다.
- **토큰에 없는 임의 색상을 추가하지 않는다** — 새로운 색이 필요하면 먼저 이 문서의 Color Token 표를 갱신한 뒤 사용한다.
- **광고, 별점(star rating), 신뢰도(%) 배지, 실시간 항공권/호텔 가격을 추가하지 않는다** — Stitch 생성 과정에서 자동으로 끼어들 수 있는 요소이며, `docs/STITCH_VALIDATION_REPORT.md`에서 실제로 발견되어 금지 항목에 등재되었다.
- **검증되지 않은 신원 보증 표현을 사용하지 않는다** — "신원 인증", "정부 발급 신분증 확인" 등은 `docs/PROJECT_SCOPE.md`의 명시적 Out-of-Scope(OS-06)이므로 어떤 카피에도 사용하지 않는다.
- **대시보드·복잡한 통계 화면을 만들지 않는다** — SCR-005 관리자 영역은 신고 상태 처리와 외부 URL 설정으로 한정한다.
