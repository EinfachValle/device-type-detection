import {
  DEFAULT_SSR_DEVICE_TYPE,
  DEFAULT_THROTTLE_MS,
  DESKTOP,
  DEVICE_CATEGORIES,
  LAPTOP,
  MOBILE_L,
  MOBILE_M,
  MOBILE_S,
  ORIENTATION_LANDSCAPE,
  ORIENTATION_PORTRAIT,
  SSR_DIMENSIONS,
  TABLET_L,
  TABLET_M,
  TABLET_S,
  TV,
  TV_4K,
} from ".";

describe("constants", () => {
  it("has all 10 device categories", () => {
    expect(DEVICE_CATEGORIES).toHaveLength(10);
    expect(DEVICE_CATEGORIES).toEqual([
      MOBILE_S,
      MOBILE_M,
      MOBILE_L,
      TABLET_S,
      TABLET_M,
      TABLET_L,
      LAPTOP,
      DESKTOP,
      TV,
      TV_4K,
    ]);
  });

  it("device type constants match their string values", () => {
    expect(MOBILE_S).toBe("mobile_s");
    expect(MOBILE_M).toBe("mobile_m");
    expect(MOBILE_L).toBe("mobile_l");
    expect(TABLET_S).toBe("tablet_s");
    expect(TABLET_M).toBe("tablet_m");
    expect(TABLET_L).toBe("tablet_l");
    expect(LAPTOP).toBe("laptop");
    expect(DESKTOP).toBe("desktop");
    expect(TV).toBe("tv");
    expect(TV_4K).toBe("tv_4k");
  });

  it("has correct orientation values", () => {
    expect(ORIENTATION_PORTRAIT).toBe("portrait");
    expect(ORIENTATION_LANDSCAPE).toBe("landscape");
  });

  it("has correct default throttle", () => {
    expect(DEFAULT_THROTTLE_MS).toBe(150);
  });

  it("has correct default SSR device type", () => {
    expect(DEFAULT_SSR_DEVICE_TYPE).toBe(DESKTOP);
  });

  it("SSR_DIMENSIONS has entry for every device category", () => {
    for (const category of DEVICE_CATEGORIES) {
      expect(SSR_DIMENSIONS[category]).toBeDefined();
      expect(SSR_DIMENSIONS[category].width).toBeGreaterThan(0);
      expect(SSR_DIMENSIONS[category].height).toBeGreaterThan(0);
    }
  });
});
