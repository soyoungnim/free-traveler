/**
 * auth-smoke.spec.ts — 로그인이 필요한 Chromium 핵심 Smoke 골격.
 *
 * E2E-006 로그인 사용자의 동행글 작성과 목록·상세 확인
 * E2E-007 동행글 신청과 계정 화면의 내 활동 확인
 *
 * 인증 환경변수(E2E_TEST_USER_EMAIL, E2E_TEST_USER_PASSWORD)가 없으면
 * 이 파일 전체를 명시적으로 skip한다 — CI에 실제 Supabase Secret이 없을 때
 * public-smoke만 실행하는 정책(package.json release:check 참조)과 짝을 이룬다.
 *
 * 두 계정 모두 사전에 이메일 인증·성인 확인이 완료된 시드 계정이어야 한다
 * (DB-SEED-BASE Task 참조). 이 파일은 골격이므로 각 단계의 세부 assertion은
 * 해당 Component Task(CMP-SCR005-AUTH, CMP-SCR003-MATE-TAB, CMP-SCR004-*,
 * CMP-SCR005-MY-ACTIVITY)가 구현된 뒤 TODO를 채운다.
 */
import { test, expect } from "@playwright/test";

const TEST_EMAIL = process.env.E2E_TEST_USER_EMAIL;
const TEST_PASSWORD = process.env.E2E_TEST_USER_PASSWORD;
const hasAuthEnv = Boolean(TEST_EMAIL && TEST_PASSWORD);

test.describe("인증 필요 Smoke", () => {
  test.skip(
    !hasAuthEnv,
    "E2E_TEST_USER_EMAIL/E2E_TEST_USER_PASSWORD가 없어 인증 Smoke를 skip함",
  );

  test.beforeEach(async ({ page }) => {
    await page.goto("/account");
    await page.getByRole("link", { name: "로그인" }).click();
    await page.getByLabel("이메일").fill(TEST_EMAIL!);
    await page.getByLabel("비밀번호").fill(TEST_PASSWORD!);
    await page.getByRole("button", { name: "로그인" }).click();
    await expect(page.getByTestId("profile-summary")).toBeVisible();
  });

  test("E2E-006 로그인 사용자의 동행글 작성과 목록·상세 확인", async ({
    page,
  }) => {
    // 1. /travel-tools 동행 탭에서 모집글 작성(제목·국가·지역·기간·안전수칙 동의).
    await page.goto("/travel-tools");
    await page.getByRole("tab", { name: "동행 구하기" }).click();
    const mateForm = page.getByTestId("mate-tab-panel");
    await expect(mateForm).toBeVisible();
    // TODO: CMP-SCR003-MATE-TAB 구현 후 실제 필드(제목/국가/지역/기간/안전수칙 동의)를 채우고
    //       "모집글 게시하기" 버튼을 클릭해 제출한다.

    // 2. /mates 목록에 방금 작성한 글이 보이는지 확인한다(정확한 항목 식별은 TODO).
    await page.goto("/mates");
    await expect(page.getByTestId("mate-post-card").first()).toBeVisible();

    // 3. 목록에서 상세로 진입해 작성자 표시를 확인한다(연락처 필드는 노출되지 않아야 함).
    await page.getByTestId("mate-post-card").first().click();
    const detail = page.getByTestId("mate-detail-panel");
    await expect(detail).toBeVisible();
    // TODO: detail 안에 전화번호/이메일/메신저 ID 패턴이 없음을 검증한다(REQ-FUNC-033).
  });

  test("E2E-007 동행글 신청과 계정 화면의 내 활동 확인", async ({ page }) => {
    // 1. /mates에서 임의의 모집글에 참가 신청을 제출한다.
    await page.goto("/mates");
    await page.getByTestId("mate-post-card").first().click();
    await page.getByRole("button", { name: "참여 신청하기" }).click();
    // TODO: CMP-SCR004-APPLICATION 구현 후 500자 메시지 입력 필드를 채우고 제출한다.

    // 2. 제출 후 인앱 Toast 안내를 확인한다(실제 이메일 발송 없음, REQ-FUNC-043).
    await expect(page.getByRole("status")).toContainText(/신청|접수/);

    // 3. /account의 내 활동 탭에서 방금 보낸 참가 요청이 보이는지 확인한다.
    await page.goto("/account");
    await expect(page.getByTestId("my-activity-panel")).toBeVisible();
    // TODO: CMP-SCR005-MY-ACTIVITY 구현 후 "보낸 참가 요청" 목록에 항목이 있는지 확인한다.
  });
});
