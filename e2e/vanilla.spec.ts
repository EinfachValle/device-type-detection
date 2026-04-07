import { expect, test } from "@playwright/test";

test.use({ baseURL: "http://localhost:3000" });

test.describe("Vanilla Playground", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/playground/vanilla/");
    await page.waitForSelector('#deviceType:not(:text("Loading..."))');
  });

  test("displays device type on load", async ({ page }) => {
    const deviceType = await page.textContent("#deviceType");
    expect(deviceType).toBeTruthy();
    expect(deviceType).not.toBe("Loading...");
  });

  test("displays orientation", async ({ page }) => {
    const orientation = await page.textContent("#orientation");
    expect(["portrait", "landscape"]).toContain(orientation);
  });

  test("displays viewport dimensions", async ({ page }) => {
    const viewport = await page.textContent("#viewport");
    expect(viewport).toMatch(/\d+\s*[×x]\s*\d+/);
  });

  test("shows flags section with items", async ({ page }) => {
    const flags = await page.locator(".flag").count();
    expect(flags).toBeGreaterThan(0);
  });

  test("detects desktop at 1920x1080", async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.waitForTimeout(300);
    expect(await page.textContent("#deviceType")).toBe("desktop");
  });

  test("detects laptop at 1380x800", async ({ page }) => {
    await page.setViewportSize({ width: 1380, height: 800 });
    await page.waitForTimeout(300);
    expect(await page.textContent("#deviceType")).toBe("laptop");
  });

  test("detects tablet_m at 900x1200 (portrait)", async ({ page }) => {
    await page.setViewportSize({ width: 900, height: 1200 });
    await page.waitForTimeout(300);
    expect(await page.textContent("#deviceType")).toBe("tablet_m");
    expect(await page.textContent("#orientation")).toBe("portrait");
  });

  test("detects tablet_s at 600x800", async ({ page }) => {
    await page.setViewportSize({ width: 600, height: 800 });
    await page.waitForTimeout(300);
    expect(await page.textContent("#deviceType")).toBe("tablet_s");
  });

  test("detects mobile_m at 400x700", async ({ page }) => {
    await page.setViewportSize({ width: 400, height: 700 });
    await page.waitForTimeout(300);
    expect(await page.textContent("#deviceType")).toBe("mobile_m");
  });

  test("detects mobile_s at 320x568", async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 568 });
    await page.waitForTimeout(300);
    expect(await page.textContent("#deviceType")).toBe("mobile_s");
  });

  test("viewport dimensions update on resize", async ({ page }) => {
    await page.setViewportSize({ width: 800, height: 600 });
    await page.waitForTimeout(300);
    const viewport = await page.textContent("#viewport");
    expect(viewport).toContain("800");
  });

  test("orientation changes between portrait and landscape", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1024, height: 600 });
    await page.waitForTimeout(300);
    expect(await page.textContent("#orientation")).toBe("landscape");

    await page.setViewportSize({ width: 600, height: 1024 });
    await page.waitForTimeout(300);
    expect(await page.textContent("#orientation")).toBe("portrait");
  });

  test("live resize updates device type without reload", async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.waitForTimeout(300);
    expect(await page.textContent("#deviceType")).toBe("desktop");

    await page.setViewportSize({ width: 900, height: 1200 });
    await page.waitForTimeout(300);
    expect(await page.textContent("#deviceType")).toBe("tablet_m");

    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(300);
    expect(await page.textContent("#deviceType")).toMatch(/mobile/);
  });

  test("active flags match device type", async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.waitForTimeout(300);

    await expect(
      page.locator(".flag.active", { hasText: "isDesktop: true" }),
    ).toBeVisible();
    await expect(
      page.locator(".flag.active", { hasText: "isLandscape: true" }),
    ).toBeVisible();
    await expect(
      page.locator(".flag.active", { hasText: "isMobile: true" }),
    ).toHaveCount(0);
  });
});
