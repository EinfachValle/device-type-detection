import { DetectionInput, detectDeviceType } from ".";
import { DEFAULT_BREAKPOINTS } from "../breakpoints";
import type { DeviceCategory, DeviceState } from "../types";

const bp = DEFAULT_BREAKPOINTS;

function detect(overrides: Partial<DetectionInput> = {}): DeviceState {
  return detectDeviceType({
    width: 1920,
    height: 1080,
    uaMobile: false,
    uaTablet: false,
    uaIPad: false,
    uaTV: false,
    touchCapable: false,
    breakpoints: bp,
    ...overrides,
  });
}

// ---------------------------------------------------------------------------
// 1. Mobile detection (UA-based)
// ---------------------------------------------------------------------------
describe("detectDeviceType", () => {
  describe("Mobile detection (UA-based)", () => {
    it("width <= 380 + uaMobile + touch -> mobile_s", () => {
      const state = detect({
        width: 360,
        height: 640,
        uaMobile: true,
        touchCapable: true,
      });
      expect(state.deviceType).toBe("mobile_s");
      expect(state.isMobileS).toBe(true);
      expect(state.isMobile).toBe(true);
    });

    it("width == 380 + uaMobile + touch -> mobile_s", () => {
      const state = detect({
        width: 380,
        height: 640,
        uaMobile: true,
        touchCapable: true,
      });
      expect(state.deviceType).toBe("mobile_s");
    });

    it("width 381 + uaMobile + touch -> mobile_m", () => {
      const state = detect({
        width: 381,
        height: 640,
        uaMobile: true,
        touchCapable: true,
      });
      expect(state.deviceType).toBe("mobile_m");
      expect(state.isMobileM).toBe(true);
      expect(state.isMobile).toBe(true);
    });

    it("width 480 + uaMobile + touch -> mobile_m", () => {
      const state = detect({
        width: 480,
        height: 800,
        uaMobile: true,
        touchCapable: true,
      });
      expect(state.deviceType).toBe("mobile_m");
    });

    it("width 481 + uaMobile + touch -> mobile_l", () => {
      const state = detect({
        width: 481,
        height: 800,
        uaMobile: true,
        touchCapable: true,
      });
      expect(state.deviceType).toBe("mobile_l");
      expect(state.isMobileL).toBe(true);
      expect(state.isMobile).toBe(true);
    });

    it("width 700 + uaMobile + touch -> mobile_l", () => {
      const state = detect({
        width: 700,
        height: 900,
        uaMobile: true,
        touchCapable: true,
      });
      expect(state.deviceType).toBe("mobile_l");
    });

    it("portrait (h > w) sets isMobileVertical", () => {
      const state = detect({
        width: 360,
        height: 640,
        uaMobile: true,
        touchCapable: true,
      });
      expect(state.isPortrait).toBe(true);
      expect(state.isMobileVertical).toBe(true);
      expect(state.isMobileHorizontal).toBe(false);
    });

    it("landscape (w > h) sets isMobileHorizontal", () => {
      const state = detect({
        width: 640,
        height: 360,
        uaMobile: true,
        touchCapable: true,
      });
      expect(state.isLandscape).toBe(true);
      expect(state.isMobileHorizontal).toBe(true);
      expect(state.isMobileVertical).toBe(false);
    });

    it("uaMobile but NOT touch -> falls through to viewport cascade", () => {
      const state = detect({
        width: 1920,
        height: 1080,
        uaMobile: true,
        touchCapable: false,
      });
      // viewport cascade: width 1920 > laptop(1400) => desktop
      expect(state.deviceType).toBe("desktop");
      expect(state.isMobile).toBe(false);
    });

    it("uaMobile + uaIPad -> falls through to tablet (iPad takes priority)", () => {
      const state = detect({
        width: 810,
        height: 1080,
        uaMobile: true,
        uaIPad: true,
        uaTablet: true,
        touchCapable: true,
      });
      // uaMobile && touch && !uaIPad fails because uaIPad=true
      // then (uaTablet || uaIPad) && touch -> tablet branch
      expect(state.isTablet).toBe(true);
      expect(state.isMobile).toBe(false);
    });
  });

  // ---------------------------------------------------------------------------
  // 2. Tablet detection (UA-based)
  // ---------------------------------------------------------------------------
  describe("Tablet detection (UA-based)", () => {
    it("width <= 834 + uaTablet + touch -> tablet_s", () => {
      const state = detect({
        width: 768,
        height: 1024,
        uaTablet: true,
        touchCapable: true,
      });
      expect(state.deviceType).toBe("tablet_s");
      expect(state.isTabletS).toBe(true);
      expect(state.isTablet).toBe(true);
    });

    it("width == 834 + uaTablet + touch -> tablet_s", () => {
      const state = detect({
        width: 834,
        height: 1112,
        uaTablet: true,
        touchCapable: true,
      });
      expect(state.deviceType).toBe("tablet_s");
    });

    it("width 835 + uaTablet + touch -> tablet_m", () => {
      const state = detect({
        width: 835,
        height: 1112,
        uaTablet: true,
        touchCapable: true,
      });
      expect(state.deviceType).toBe("tablet_m");
      expect(state.isTabletM).toBe(true);
      expect(state.isTablet).toBe(true);
    });

    it("width 1024 + uaTablet + touch -> tablet_m", () => {
      const state = detect({
        width: 1024,
        height: 1366,
        uaTablet: true,
        touchCapable: true,
      });
      expect(state.deviceType).toBe("tablet_m");
    });

    it("width 1025 + uaTablet + touch -> tablet_l", () => {
      const state = detect({
        width: 1025,
        height: 1366,
        uaTablet: true,
        touchCapable: true,
      });
      expect(state.deviceType).toBe("tablet_l");
      expect(state.isTabletL).toBe(true);
      expect(state.isTablet).toBe(true);
    });

    it("width 1400 + uaTablet + touch -> tablet_l", () => {
      const state = detect({
        width: 1400,
        height: 1024,
        uaTablet: true,
        touchCapable: true,
      });
      expect(state.deviceType).toBe("tablet_l");
    });

    it("iPad detection: uaIPad + touch -> tablet regardless of uaTablet", () => {
      const state = detect({
        width: 810,
        height: 1080,
        uaIPad: true,
        uaTablet: false,
        touchCapable: true,
      });
      expect(state.isTablet).toBe(true);
      expect(state.deviceType).toBe("tablet_s");
    });

    it("iPad large width -> tablet_l", () => {
      const state = detect({
        width: 1200,
        height: 1600,
        uaIPad: true,
        touchCapable: true,
      });
      expect(state.deviceType).toBe("tablet_l");
    });

    it("tablet portrait sets isTabletVertical", () => {
      const state = detect({
        width: 768,
        height: 1024,
        uaTablet: true,
        touchCapable: true,
      });
      expect(state.isPortrait).toBe(true);
      expect(state.isTabletVertical).toBe(true);
      expect(state.isTabletHorizontal).toBe(false);
    });

    it("tablet landscape sets isTabletHorizontal", () => {
      const state = detect({
        width: 1024,
        height: 768,
        uaTablet: true,
        touchCapable: true,
      });
      expect(state.isLandscape).toBe(true);
      expect(state.isTabletHorizontal).toBe(true);
      expect(state.isTabletVertical).toBe(false);
    });

    it("uaTablet but NOT touch -> falls through to viewport", () => {
      const state = detect({
        width: 1024,
        height: 768,
        uaTablet: true,
        touchCapable: false,
      });
      // viewport cascade: width 1024 > tabletS(834) => tablet_m
      expect(state.deviceType).toBe("tablet_m");
    });
  });

  // ---------------------------------------------------------------------------
  // 3. Viewport cascade (no UA match)
  // ---------------------------------------------------------------------------
  describe("Viewport cascade (no UA match)", () => {
    it("width <= 380 -> mobile_s", () => {
      const state = detect({ width: 320, height: 568 });
      expect(state.deviceType).toBe("mobile_s");
    });

    it("width 380 -> mobile_s (exact boundary)", () => {
      const state = detect({ width: 380, height: 640 });
      expect(state.deviceType).toBe("mobile_s");
    });

    it("width 381 -> mobile_m", () => {
      const state = detect({ width: 381, height: 640 });
      expect(state.deviceType).toBe("mobile_m");
    });

    it("width 480 -> mobile_m", () => {
      const state = detect({ width: 480, height: 800 });
      expect(state.deviceType).toBe("mobile_m");
    });

    it("width 481 -> tablet_s", () => {
      const state = detect({ width: 481, height: 800 });
      expect(state.deviceType).toBe("tablet_s");
    });

    it("width 834 -> tablet_s", () => {
      const state = detect({ width: 834, height: 1112 });
      expect(state.deviceType).toBe("tablet_s");
    });

    it("width 835 -> tablet_m", () => {
      const state = detect({ width: 835, height: 1112 });
      expect(state.deviceType).toBe("tablet_m");
    });

    it("width 1024 -> tablet_m", () => {
      const state = detect({ width: 1024, height: 768 });
      expect(state.deviceType).toBe("tablet_m");
    });

    it("width 1025 -> tablet_l", () => {
      const state = detect({ width: 1025, height: 768 });
      expect(state.deviceType).toBe("tablet_l");
    });

    it("width 1366 -> tablet_l", () => {
      const state = detect({ width: 1366, height: 768 });
      expect(state.deviceType).toBe("tablet_l");
    });

    it("width 1367 -> laptop", () => {
      const state = detect({ width: 1367, height: 768 });
      expect(state.deviceType).toBe("laptop");
      expect(state.isLaptop).toBe(true);
    });

    it("width 1400 -> laptop", () => {
      const state = detect({ width: 1400, height: 900 });
      expect(state.deviceType).toBe("laptop");
    });

    it("width 1401 -> desktop", () => {
      const state = detect({ width: 1401, height: 900 });
      expect(state.deviceType).toBe("desktop");
      expect(state.isDesktop).toBe(true);
    });

    it("width 1920 -> desktop", () => {
      const state = detect({ width: 1920, height: 1080 });
      expect(state.deviceType).toBe("desktop");
    });

    it("width 1921 -> desktop (no TV UA)", () => {
      const state = detect({ width: 1921, height: 1080 });
      expect(state.deviceType).toBe("desktop");
      expect(state.isDesktop).toBe(true);
    });

    it("width 3840 -> desktop (no TV UA)", () => {
      const state = detect({ width: 3840, height: 2160 });
      expect(state.deviceType).toBe("desktop");
    });

    it("width 7680 (8K) -> desktop (no TV UA)", () => {
      const state = detect({ width: 7680, height: 4320 });
      expect(state.deviceType).toBe("desktop");
    });
  });

  // ---------------------------------------------------------------------------
  // 3b. TV detection (UA-based)
  // ---------------------------------------------------------------------------
  describe("TV detection (UA-based)", () => {
    it("uaTV + width 1920 -> tv", () => {
      const state = detect({ width: 1920, height: 1080, uaTV: true });
      expect(state.deviceType).toBe("tv");
      expect(state.isTV).toBe(true);
    });

    it("uaTV + width 3839 -> tv", () => {
      const state = detect({ width: 3839, height: 2160, uaTV: true });
      expect(state.deviceType).toBe("tv");
    });

    it("uaTV + width 3840 (4K) -> tv_4k", () => {
      const state = detect({ width: 3840, height: 2160, uaTV: true });
      expect(state.deviceType).toBe("tv_4k");
      expect(state.isTV4K).toBe(true);
    });

    it("uaTV + width 7680 (8K) -> tv_4k", () => {
      const state = detect({ width: 7680, height: 4320, uaTV: true });
      expect(state.deviceType).toBe("tv_4k");
    });

    it("uaTV + small width -> tv (not mobile)", () => {
      const state = detect({ width: 320, height: 240, uaTV: true });
      expect(state.deviceType).toBe("tv");
    });
  });

  // ---------------------------------------------------------------------------
  // 4. Boundary tests
  // ---------------------------------------------------------------------------
  describe("Boundary tests (viewport cascade)", () => {
    const boundaries: [number, DeviceCategory, DeviceCategory][] = [
      [380, "mobile_s", "mobile_m"],
      [480, "mobile_m", "tablet_s"],
      [834, "tablet_s", "tablet_m"],
      [1024, "tablet_m", "tablet_l"],
      [1366, "tablet_l", "laptop"],
      [1400, "laptop", "desktop"],
    ];

    boundaries.forEach(([value, atBoundary, aboveBoundary]) => {
      it(`width ${value} is ${atBoundary}, width ${value + 1} is ${aboveBoundary}`, () => {
        expect(detect({ width: value, height: 768 }).deviceType).toBe(
          atBoundary,
        );
        expect(detect({ width: value + 1, height: 768 }).deviceType).toBe(
          aboveBoundary,
        );
      });
    });
  });

  // ---------------------------------------------------------------------------
  // 5. Boolean flags correctness
  // ---------------------------------------------------------------------------
  describe("Boolean flags correctness", () => {
    const allDeviceTypes: DeviceCategory[] = [
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

    const flagMap: Record<DeviceCategory, keyof DeviceState> = {
      mobile_s: "isMobileS",
      mobile_m: "isMobileM",
      mobile_l: "isMobileL",
      tablet_s: "isTabletS",
      tablet_m: "isTabletM",
      tablet_l: "isTabletL",
      laptop: "isLaptop",
      desktop: "isDesktop",
      tv: "isTV",
      tv_4k: "isTV4K",
    };

    // Generate a state for each device type
    function stateForType(dt: DeviceCategory): DeviceState {
      switch (dt) {
        case "mobile_s":
          return detect({
            width: 320,
            height: 640,
            uaMobile: true,
            touchCapable: true,
          });
        case "mobile_m":
          return detect({
            width: 420,
            height: 640,
            uaMobile: true,
            touchCapable: true,
          });
        case "mobile_l":
          return detect({
            width: 500,
            height: 800,
            uaMobile: true,
            touchCapable: true,
          });
        case "tablet_s":
          return detect({
            width: 768,
            height: 1024,
            uaTablet: true,
            touchCapable: true,
          });
        case "tablet_m":
          return detect({
            width: 900,
            height: 1200,
            uaTablet: true,
            touchCapable: true,
          });
        case "tablet_l":
          return detect({
            width: 1200,
            height: 1600,
            uaTablet: true,
            touchCapable: true,
          });
        case "laptop":
          return detect({ width: 1380, height: 900 });
        case "desktop":
          return detect({ width: 1600, height: 1080 });
        case "tv":
          return detect({ width: 2560, height: 1440, uaTV: true });
        case "tv_4k":
          return detect({ width: 4096, height: 2160, uaTV: true });
      }
    }

    allDeviceTypes.forEach((dt) => {
      it(`${dt}: only ${flagMap[dt]} is true among specific flags`, () => {
        const state = stateForType(dt);
        expect(state.deviceType).toBe(dt);
        expect(state[flagMap[dt]]).toBe(true);
        // All other specific flags must be false
        allDeviceTypes
          .filter((t) => t !== dt)
          .forEach((other) => {
            expect(state[flagMap[other]]).toBe(false);
          });
      });
    });

    it("isMobile = isMobileS || isMobileM || isMobileL", () => {
      (["mobile_s", "mobile_m", "mobile_l"] as DeviceCategory[]).forEach(
        (dt) => {
          const state = stateForType(dt);
          expect(state.isMobile).toBe(true);
          expect(state.isTablet).toBe(false);
        },
      );
      // Non-mobile types
      (
        ["tablet_s", "laptop", "desktop", "tv", "tv_4k"] as DeviceCategory[]
      ).forEach((dt) => {
        expect(stateForType(dt).isMobile).toBe(false);
      });
    });

    it("isTablet = isTabletS || isTabletM || isTabletL", () => {
      (["tablet_s", "tablet_m", "tablet_l"] as DeviceCategory[]).forEach(
        (dt) => {
          const state = stateForType(dt);
          expect(state.isTablet).toBe(true);
          expect(state.isMobile).toBe(false);
        },
      );
    });

    it("isPortrait when h > w, isLandscape when w >= h", () => {
      const portrait = detect({ width: 400, height: 800 });
      expect(portrait.isPortrait).toBe(true);
      expect(portrait.isLandscape).toBe(false);
      expect(portrait.orientation).toBe("portrait");

      const landscape = detect({ width: 800, height: 400 });
      expect(landscape.isPortrait).toBe(false);
      expect(landscape.isLandscape).toBe(true);
      expect(landscape.orientation).toBe("landscape");

      // Equal dimensions -> landscape
      const square = detect({ width: 500, height: 500 });
      expect(square.isPortrait).toBe(false);
      expect(square.isLandscape).toBe(true);
    });

    it("isMobileVertical = isMobile && isPortrait", () => {
      const state = detect({
        width: 360,
        height: 640,
        uaMobile: true,
        touchCapable: true,
      });
      expect(state.isMobile).toBe(true);
      expect(state.isPortrait).toBe(true);
      expect(state.isMobileVertical).toBe(true);
      expect(state.isMobileHorizontal).toBe(false);
    });

    it("isMobileHorizontal = isMobile && isLandscape", () => {
      const state = detect({
        width: 640,
        height: 360,
        uaMobile: true,
        touchCapable: true,
      });
      expect(state.isMobile).toBe(true);
      expect(state.isLandscape).toBe(true);
      expect(state.isMobileHorizontal).toBe(true);
      expect(state.isMobileVertical).toBe(false);
    });

    it("isTabletVertical = isTablet && isPortrait", () => {
      const state = detect({
        width: 768,
        height: 1024,
        uaTablet: true,
        touchCapable: true,
      });
      expect(state.isTablet).toBe(true);
      expect(state.isPortrait).toBe(true);
      expect(state.isTabletVertical).toBe(true);
      expect(state.isTabletHorizontal).toBe(false);
    });

    it("isTabletHorizontal = isTablet && isLandscape", () => {
      const state = detect({
        width: 1024,
        height: 768,
        uaTablet: true,
        touchCapable: true,
      });
      expect(state.isTablet).toBe(true);
      expect(state.isLandscape).toBe(true);
      expect(state.isTabletHorizontal).toBe(true);
      expect(state.isTabletVertical).toBe(false);
    });

    it("non-mobile/tablet types have all combined orientation flags false", () => {
      const state = detect({ width: 1600, height: 1080 }); // desktop
      expect(state.isMobileVertical).toBe(false);
      expect(state.isMobileHorizontal).toBe(false);
      expect(state.isTabletVertical).toBe(false);
      expect(state.isTabletHorizontal).toBe(false);
    });

    it("touchDevice reflects touchCapable input", () => {
      expect(
        detect({ touchCapable: true, uaMobile: true, width: 400, height: 800 })
          .touchDevice,
      ).toBe(true);
      expect(detect({ touchCapable: false }).touchDevice).toBe(false);
    });

    it("width and height are passed through", () => {
      const state = detect({ width: 1234, height: 5678 });
      expect(state.width).toBe(1234);
      expect(state.height).toBe(5678);
    });
  });

  // ---------------------------------------------------------------------------
  // 6. Custom breakpoints
  // ---------------------------------------------------------------------------
  describe("Custom breakpoints", () => {
    const customBp = {
      mobileS: 320,
      mobileM: 400,
      tabletS: 700,
      tabletM: 900,
      tabletL: 1200,
      laptop: 1300,
      desktop: 1600,
      tv: 3000,
    };

    it("width 321 with custom bp -> mobile_m (was mobile_s with default)", () => {
      const withDefault = detect({ width: 321, height: 640 });
      expect(withDefault.deviceType).toBe("mobile_s"); // still <= 380

      const withCustom = detect({
        width: 321,
        height: 640,
        breakpoints: customBp,
      });
      expect(withCustom.deviceType).toBe("mobile_m"); // > 320
    });

    it("width 701 with custom bp -> tablet_m", () => {
      const state = detect({ width: 701, height: 900, breakpoints: customBp });
      expect(state.deviceType).toBe("tablet_m");
    });

    it("width 1301 with custom bp -> desktop", () => {
      const state = detect({ width: 1301, height: 900, breakpoints: customBp });
      expect(state.deviceType).toBe("desktop");
    });

    it("width 3001 with custom bp -> desktop (no TV UA)", () => {
      const state = detect({
        width: 3001,
        height: 2000,
        breakpoints: customBp,
      });
      expect(state.deviceType).toBe("desktop");
    });

    it("width 3001 with custom bp + uaTV -> tv_4k", () => {
      const state = detect({
        width: 3001,
        height: 2000,
        uaTV: true,
        breakpoints: customBp,
      });
      expect(state.deviceType).toBe("tv_4k");
    });

    it("custom breakpoints also apply to UA-based mobile detection", () => {
      const state = detect({
        width: 350,
        height: 640,
        uaMobile: true,
        touchCapable: true,
        breakpoints: customBp,
      });
      // 350 > customBp.mobileS(320) && <= customBp.mobileM(400) -> mobile_m
      expect(state.deviceType).toBe("mobile_m");
    });

    it("custom breakpoints also apply to UA-based tablet detection", () => {
      const state = detect({
        width: 850,
        height: 1100,
        uaTablet: true,
        touchCapable: true,
        breakpoints: customBp,
      });
      // 850 <= customBp.tabletM(900) but > customBp.tabletS(700) -> still <= 900 -> tablet_m? no, <= 900 -> tablet_m
      // Actually: width <= tabletS(700)? No. <= tabletM(900)? Yes. -> tablet_m
      expect(state.deviceType).toBe("tablet_m");
    });
  });
});
