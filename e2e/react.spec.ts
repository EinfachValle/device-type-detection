import { expect, test } from "@playwright/test";

test.use({ baseURL: "http://localhost:5173" });

test.describe("React Playground", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.waitForSelector("#root div", { timeout: 10000 });
  });

  test("renders device type", async ({ page }) => {
    const body = await page.textContent("#root");
    expect(body).toMatch(
      /mobile_s|mobile_m|mobile_l|tablet_s|tablet_m|tablet_l|laptop|desktop|tv|tv_4k/,
    );
  });

  test("updates on viewport resize", async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.waitForTimeout(300);
    expect(await page.textContent("#root")).toContain("desktop");

    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(300);
    expect(await page.textContent("#root")).toMatch(/mobile/);
  });

  test("shows orientation info", async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 768 });
    await page.waitForTimeout(300);
    expect(await page.textContent("#root")).toContain("landscape");
  });

  test("shows touch status", async ({ page }) => {
    const body = await page.textContent("#root");
    expect(body).toMatch(/Touch|Non-Touch/);
  });

  test("shows flags", async ({ page }) => {
    const body = await page.textContent("#root");
    expect(body).toContain("isDesktop");
    expect(body).toContain("isMobile");
  });
});
