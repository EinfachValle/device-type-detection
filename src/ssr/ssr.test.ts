import { getSSRDefaults, isSSR } from ".";
import type { DeviceCategory } from "../types";

describe("isSSR", () => {
  it("returns false in jsdom environment", () => {
    expect(isSSR()).toBe(false);
  });
});

describe("getSSRDefaults", () => {
  it("returns desktop defaults when called without arguments", () => {
    const state = getSSRDefaults();
    expect(state.deviceType).toBe("desktop");
    expect(state.isDesktop).toBe(true);
    expect(state.isLandscape).toBe(true);
    expect(state.isPortrait).toBe(false);
    expect(state.touchDevice).toBe(false);
    expect(state.width).toBe(1920);
    expect(state.height).toBe(1080);
  });

  it("returns correct state for each device category", () => {
    const categories: DeviceCategory[] = [
      "mobile_s",
      "mobile_m",
      "mobile_l",
      "tablet_s",
      "tablet_m",
      "tablet_l",
      "laptop",
      "desktop",
      "tv",
      "tv_4k",
    ];
    for (const cat of categories) {
      const state = getSSRDefaults(cat);
      expect(state.deviceType).toBe(cat);
      expect(state.touchDevice).toBe(false);
    }
  });

  it("sets isMobile flags correctly for mobile categories", () => {
    for (const cat of [
      "mobile_s",
      "mobile_m",
      "mobile_l",
    ] as DeviceCategory[]) {
      const state = getSSRDefaults(cat);
      expect(state.isMobile).toBe(true);
      expect(state.isTablet).toBe(false);
      expect(state.isDesktop).toBe(false);
    }
  });

  it("sets isTablet flags correctly for tablet categories", () => {
    for (const cat of [
      "tablet_s",
      "tablet_m",
      "tablet_l",
    ] as DeviceCategory[]) {
      const state = getSSRDefaults(cat);
      expect(state.isTablet).toBe(true);
      expect(state.isMobile).toBe(false);
      expect(state.isDesktop).toBe(false);
    }
  });

  it("sets specific device flags exclusively", () => {
    const state = getSSRDefaults("laptop");
    expect(state.isLaptop).toBe(true);
    expect(state.isDesktop).toBe(false);
    expect(state.isMobile).toBe(false);
    expect(state.isTablet).toBe(false);
    expect(state.isTV).toBe(false);
    expect(state.isTV4K).toBe(false);
  });

  it("mobile defaults are portrait", () => {
    const state = getSSRDefaults("mobile_s");
    expect(state.isPortrait).toBe(true);
    expect(state.isLandscape).toBe(false);
    expect(state.orientation).toBe("portrait");
    expect(state.height).toBeGreaterThan(state.width);
  });

  it("tablet defaults are portrait", () => {
    const state = getSSRDefaults("tablet_s");
    expect(state.isPortrait).toBe(true);
    expect(state.isLandscape).toBe(false);
    expect(state.height).toBeGreaterThan(state.width);
  });

  it("desktop defaults are landscape", () => {
    const state = getSSRDefaults("desktop");
    expect(state.isPortrait).toBe(false);
    expect(state.isLandscape).toBe(true);
    expect(state.orientation).toBe("landscape");
    expect(state.width).toBeGreaterThan(state.height);
  });

  it("tv defaults are landscape", () => {
    const state = getSSRDefaults("tv");
    expect(state.isLandscape).toBe(true);
    expect(state.width).toBeGreaterThan(state.height);
  });

  it("width and height are positive numbers", () => {
    const categories: DeviceCategory[] = [
      "mobile_s",
      "mobile_m",
      "mobile_l",
      "tablet_s",
      "tablet_m",
      "tablet_l",
      "laptop",
      "desktop",
      "tv",
      "tv_4k",
    ];
    for (const cat of categories) {
      const state = getSSRDefaults(cat);
      expect(state.width).toBeGreaterThan(0);
      expect(state.height).toBeGreaterThan(0);
    }
  });

  it("combined orientation flags are consistent", () => {
    const mobileState = getSSRDefaults("mobile_s");
    expect(mobileState.isMobileVertical).toBe(
      mobileState.isMobile && mobileState.isPortrait,
    );
    expect(mobileState.isMobileHorizontal).toBe(
      mobileState.isMobile && mobileState.isLandscape,
    );

    const tabletState = getSSRDefaults("tablet_m");
    expect(tabletState.isTabletVertical).toBe(
      tabletState.isTablet && tabletState.isPortrait,
    );
    expect(tabletState.isTabletHorizontal).toBe(
      tabletState.isTablet && tabletState.isLandscape,
    );
  });

  it("returns a complete DeviceState with all 24 properties", () => {
    const state = getSSRDefaults();
    expect(Object.keys(state)).toHaveLength(23);
  });
});
