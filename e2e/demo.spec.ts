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
    await expect(frame.locator(".hero h1")).toBeVisible();
  });

  test("preset click updates viewport dimensions", async ({ page }) => {
    // Click "iPad Air" preset (820 x 1180)
    await page.getByText("iPad Air").click();
    await page.waitForTimeout(500);

    // Verify logical dimensions via input fields (iframe may be CSS-scaled to fit)
    const widthInput = page.locator('input[data-field="w"]');
    const heightInput = page.locator('input[data-field="h"]');
    await expect(widthInput).toHaveValue("820");
    await expect(heightInput).toHaveValue("1180");
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
  });

  test("preset switch changes detected device type", async ({ page }) => {
    const frame = page.frameLocator("iframe");
    const heroType = frame.locator(".hero h1");

    // Select Full HD (1920x1080) → should detect "desktop"
    await page.getByText("Full HD").first().click();
    await expect(heroType).toHaveText("desktop", { timeout: 3000 });

    // Select iPhone SE (375x667) → should detect a mobile type
    await page.getByText("iPhone SE").click();
    await expect(heroType).toHaveText(/mobile/, { timeout: 3000 });
  });

  test("dimension input changes detected device type", async ({ page }) => {
    const frame = page.frameLocator("iframe");
    const heroType = frame.locator(".hero h1");
    const widthInput = page.locator('input[data-field="w"]');

    // Start with a desktop preset (no mobile UA simulation)
    await page.getByText("Full HD").first().click();
    await expect(heroType).toHaveText("desktop", { timeout: 3000 });

    // Shrink width to tablet range
    await widthInput.click();
    await widthInput.fill("800");
    await widthInput.press("Enter");
    await expect(heroType).toHaveText(/tablet/, { timeout: 3000 });
  });

  test("iframe detection matches parent toolbar chip", async ({ page }) => {
    const frame = page.frameLocator("iframe");
    const heroType = frame.locator(".hero h1");

    // Select a preset and wait for detection
    await page.getByText("iPhone SE").click();
    await expect(heroType).toHaveText(/mobile/, { timeout: 3000 });

    // The toolbar chip should match the iframe detection
    const iframeDeviceType = await heroType.textContent();
    const chip = page.locator(".MuiChip-label").first();
    await expect(chip).toHaveText(iframeDeviceType!, { timeout: 3000 });
  });

  test("rotate updates orientation in iframe", async ({ page }) => {
    const frame = page.frameLocator("iframe");
    const heroType = frame.locator(".hero h1");

    // Select iPhone SE (375x667, portrait)
    await page.getByText("iPhone SE").click();
    await expect(heroType).toHaveText(/mobile/, { timeout: 3000 });

    // Get orientation before rotate
    const orientBefore = await frame.locator("#orient").textContent();
    expect(orientBefore).toBe("portrait");

    // Rotate
    await page.getByTitle("Rotate").click();
    await page.waitForTimeout(500);

    // Orientation should change
    const orientAfter = await frame.locator("#orient").textContent();
    expect(orientAfter).toBe("landscape");
  });
});
