import type {
  BreakpointConfig,
  DetectorOptions,
  DeviceCategory,
  DeviceState,
  Orientation,
} from ".";

describe("types", () => {
  it("DeviceCategory accepts all valid values", () => {
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
    expect(categories).toHaveLength(10);
  });

  it("Orientation accepts portrait and landscape", () => {
    const orientations: Orientation[] = ["portrait", "landscape"];
    expect(orientations).toHaveLength(2);
  });

  it("DeviceState shape is correct", () => {
    const state: DeviceState = {
      deviceType: "desktop",
      orientation: "landscape",
      touchDevice: false,
      width: 1920,
      height: 1080,
      isMobile: false,
      isMobileS: false,
      isMobileM: false,
      isMobileL: false,
      isTablet: false,
      isTabletS: false,
      isTabletM: false,
      isTabletL: false,
      isLaptop: false,
      isDesktop: true,
      isTV: false,
      isTV4K: false,
      isPortrait: false,
      isLandscape: true,
      isMobileVertical: false,
      isMobileHorizontal: false,
      isTabletVertical: false,
      isTabletHorizontal: false,
    };
    expect(state.deviceType).toBe("desktop");
    expect(state.isDesktop).toBe(true);
    expect(Object.keys(state)).toHaveLength(23);
  });

  it("BreakpointConfig has all required fields", () => {
    const config: BreakpointConfig = {
      mobileS: 380,
      mobileM: 480,
      tabletS: 834,
      tabletM: 1024,
      tabletL: 1366,
      laptop: 1400,
      desktop: 1920,
      tv: 3840,
    };
    expect(Object.keys(config)).toHaveLength(8);
  });

  it("DetectorOptions allows partial breakpoints", () => {
    const opts: DetectorOptions = {
      breakpoints: { mobileS: 320 },
      throttleMs: 100,
      ssrDeviceType: "mobile_s",
    };
    expect(opts.throttleMs).toBe(100);
  });

  it("DetectorOptions allows empty object", () => {
    const opts: DetectorOptions = {};
    expect(opts.breakpoints).toBeUndefined();
  });
});
