import { expect, test } from "@playwright/test";

test.describe("Unified Playground", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    // Wait for the React app to render the 3-column layout
    await page.waitForSelector("iframe", { timeout: 10000 });
  });

  test("loads and displays the 3-column layout", async ({ page }) => {
    // Sidebar (device presets)
    await expect(page.getByText("device-type-detection")).toBeVisible();
    // Canvas (iframe area with dimension toolbar)
    await expect(page.locator("iframe")).toBeVisible();
    // Detection panel — check for Device Type section header
    await expect(page.getByText("Device Type")).toBeVisible();
  });

  test("shows device presets in sidebar", async ({ page }) => {
    await expect(page.getByText("iPhone SE")).toBeVisible();
    await expect(page.getByText("iPad Air")).toBeVisible();
    await expect(page.getByText("Full HD").first()).toBeVisible();
  });

  test("shows detection state panel", async ({ page }) => {
    await expect(page.getByText("Device Type")).toBeVisible();
    await expect(page.getByText("Orientation")).toBeVisible();
    await expect(page.getByText("Flags")).toBeVisible();
  });

  test("iframe loads demo content", async ({ page }) => {
    const iframe = page.locator("iframe");
    await expect(iframe).toBeVisible();
    await expect(iframe).toHaveAttribute("src", /demo\.html/);

    const frame = page.frameLocator("iframe");
    await expect(frame.locator(".hero h1")).toHaveText("Demo App");
  });

  test("preset click updates viewport dimensions", async ({ page }) => {
    // Click "iPad Air" preset (820 x 1180)
    await page.getByText("iPad Air").click();
    await page.waitForTimeout(500);

    const iframe = page.locator("iframe");
    const box = await iframe.boundingBox();
    expect(box).not.toBeNull();
    // The iframe should be resized to 820px wide
    expect(box!.width).toBeCloseTo(820, -1);
  });

  test("rotate button swaps dimensions", async ({ page }) => {
    // Click a known preset first so dimensions are deterministic
    await page.getByText("iPhone SE").click();
    await page.waitForTimeout(300);

    // Read current width/height from dimension inputs
    const widthInput = page.locator('input[data-field="w"]');
    const heightInput = page.locator('input[data-field="h"]');

    const wBefore = await widthInput.inputValue();
    const hBefore = await heightInput.inputValue();

    // Click the rotate button
    await page.getByTitle("Rotate").click();
    await page.waitForTimeout(300);

    const wAfter = await widthInput.inputValue();
    const hAfter = await heightInput.inputValue();

    // Width and height should be swapped
    expect(wAfter).toBe(hBefore);
    expect(hAfter).toBe(wBefore);
  });

  test("dimension inputs are editable", async ({ page }) => {
    const widthInput = page.locator('input[data-field="w"]');

    // Clear and type a custom width
    await widthInput.click();
    await widthInput.fill("1024");
    await widthInput.press("Enter");
    await page.waitForTimeout(300);

    // Verify the input reflects the new value
    await expect(widthInput).toHaveValue("1024");

    // Verify the iframe width actually changed
    const iframe = page.locator("iframe");
    const box = await iframe.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.width).toBeCloseTo(1024, -1);
  });

  test("detection flags update on resize", async ({ page }) => {
    // Start with a desktop preset
    await page.getByText("Full HD").first().click();
    await page.waitForTimeout(600);

    // Should show isDesktop flag as active
    await expect(page.getByText("isDesktop", { exact: true })).toBeVisible();

    // Now switch to a mobile preset
    await page.getByText("iPhone SE").click();
    await page.waitForTimeout(600);

    // The detection panel should now show isMobile as active
    await expect(page.getByText("isMobile", { exact: true })).toBeVisible();
  });
});
