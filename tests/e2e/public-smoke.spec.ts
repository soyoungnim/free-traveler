/**
 * public-smoke.spec.ts — 로그인 없이 확인 가능한 Chromium 핵심 Smoke.
 *
 * E2E-001 메인 페이지의 추천 여행지와 주요 CTA
 * E2E-002 대표 소개의 free_traveler, 50회 이상, 30개국 이상
 * E2E-003 여행 도구의 항공 외부 이동 안내와 href
 * E2E-004 여행 도구의 숙소 외부 이동 안내와 href
 * E2E-005 비로그인 동행글 작성의 로그인 안내
 *
 * Selector 우선순위: role > label > test id. CSS 구조·텍스트 위치 기반 선택은 쓰지 않는다.
 * 외부 사이트(항공·숙소 링크)는 실제로 새 탭을 열어 그 사이트 내용을 검사하지 않는다 —
 * 클릭 후에는 href/target/rel 속성과 화면에 남는 안내 문구만 검사한다.
 *
 * 아래 data-testid는 아직 구현되지 않은 SCR-001/002/003 Page Owner·Component Task가
 * 만들어야 하는 접근 계약이다(현재 src/app에는 create-next-app 기본 페이지만 있다):
 *   - domestic-destination-grid / overseas-destination-grid, destination-card
 *   - profile-hero-stats, trip-count-stat, country-count-stat
 *   - flight-tab-panel, hotel-tab-panel, mate-tab-panel
 *   - trip-country-select, trip-region-select, trip-start-date, trip-end-date
 *   - flight-outbound-link, hotel-outbound-link
 *   - mate-unauthenticated-notice
 */
import { test, expect } from "@playwright/test";

test.describe("E2E-001 메인 페이지 — 추천 여행지와 주요 CTA", () => {
  test("추천 여행지 그리드와 전역 내비게이션 CTA가 보인다", async ({
    page,
  }) => {
    await page.goto("/");

    const nav = page.getByRole("navigation");
    for (const label of ["대표 소개", "여행 준비", "동행 찾기", "계정"]) {
      await expect(nav.getByRole("link", { name: label })).toBeVisible();
    }

    const domesticGrid = page.getByTestId("domestic-destination-grid");
    const overseasGrid = page.getByTestId("overseas-destination-grid");
    await expect(domesticGrid).toBeVisible();
    await expect(overseasGrid).toBeVisible();

    // 최소 6개 이상이면 통과 — 정확히 6개를 강제하지 않는다(min_content_counts는 하한선).
    await expect
      .poll(async () => domesticGrid.getByTestId("destination-card").count())
      .toBeGreaterThanOrEqual(6);
    await expect
      .poll(async () => overseasGrid.getByTestId("destination-card").count())
      .toBeGreaterThanOrEqual(6);

    // 카드 클릭 → 상세 Drawer(role=dialog)만 확인한다(내부 콘텐츠 완전성은 이 Smoke의 범위 밖).
    await domesticGrid.getByTestId("destination-card").first().click();
    await expect(page.getByRole("dialog")).toBeVisible();
  });
});

test.describe("E2E-002 대표 소개 — free_traveler, 50회 이상, 30개국 이상", () => {
  test("대표 프로필 핵심 수치가 표시된다", async ({ page }) => {
    await page.goto("/about");

    await expect(
      page.getByRole("heading", { name: /free_traveler/i }),
    ).toBeVisible();

    const stats = page.getByTestId("profile-hero-stats");
    await expect(stats.getByTestId("trip-count-stat")).toContainText(/50\s*\+/);
    await expect(stats.getByTestId("country-count-stat")).toContainText(
      /30\s*\+/,
    );
  });
});

test.describe("E2E-003/004 여행 도구 — 항공·숙소 외부 이동 안내와 href", () => {
  async function fillTripConditionForm(
    panel: import("@playwright/test").Locator,
  ) {
    const countrySelect = panel.getByTestId("trip-country-select");
    await countrySelect.selectOption({ index: 1 }); // 첫 실제 옵션(0번은 placeholder로 가정)
    const regionSelect = panel.getByTestId("trip-region-select");
    await regionSelect.selectOption({ index: 1 });

    const start = new Date();
    start.setDate(start.getDate() + 7);
    const end = new Date();
    end.setDate(end.getDate() + 10);
    const toISODate = (d: Date) => d.toISOString().slice(0, 10);

    await panel.getByTestId("trip-start-date").fill(toISODate(start));
    await panel.getByTestId("trip-end-date").fill(toISODate(end));
  }

  test("항공 탭: 비전달 고지와 외부 이동 링크의 href/target/rel", async ({
    page,
  }) => {
    await page.goto("/travel-tools");
    await page.getByRole("tab", { name: "항공편" }).click();

    const panel = page.getByTestId("flight-tab-panel");
    await fillTripConditionForm(panel);

    await expect(
      panel.getByText("입력값은 외부 사이트로 전달되지 않습니다"),
    ).toBeVisible();

    const outbound = panel.getByTestId("flight-outbound-link");
    await expect(outbound).toHaveAttribute("target", "_blank");
    await expect(outbound).toHaveAttribute("rel", /noopener/);
    await expect(outbound).toHaveAttribute("rel", /noreferrer/);
    const href = await outbound.getAttribute("href");
    expect(href).toBeTruthy();
    expect(href).toMatch(/^https:\/\//);
    expect(href).not.toContain("?"); // 목적지·날짜 query 미부착(REQ-FUNC-016, CON-02)
  });

  test("숙소 탭: 비전달 고지와 외부 이동 링크의 href/target/rel", async ({
    page,
  }) => {
    await page.goto("/travel-tools");
    await page.getByRole("tab", { name: "숙소" }).click();

    const panel = page.getByTestId("hotel-tab-panel");
    await fillTripConditionForm(panel);

    await expect(
      panel.getByText("입력값은 외부 사이트로 전달되지 않습니다"),
    ).toBeVisible();

    const outbound = panel.getByTestId("hotel-outbound-link");
    await expect(outbound).toHaveAttribute("target", "_blank");
    await expect(outbound).toHaveAttribute("rel", /noopener/);
    await expect(outbound).toHaveAttribute("rel", /noreferrer/);
    const href = await outbound.getAttribute("href");
    expect(href).toBeTruthy();
    expect(href).toMatch(/^https:\/\//);
    expect(href).not.toContain("?");
  });
});

test.describe("E2E-005 비로그인 동행글 작성 — 로그인 안내", () => {
  test("동행 탭은 빈 Form이 아니라 로그인/성인확인 안내로 대체된다", async ({
    page,
  }) => {
    await page.goto("/travel-tools");
    await page.getByRole("tab", { name: "동행 구하기" }).click();

    const notice = page.getByTestId("mate-unauthenticated-notice");
    await expect(notice).toBeVisible();

    const loginLink = notice.getByRole("link", { name: "로그인" });
    await expect(loginLink).toHaveAttribute("href", "/account");
  });
});
