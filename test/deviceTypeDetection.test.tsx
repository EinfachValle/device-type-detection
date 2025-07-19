// test/deviceTypeDetection.test.tsx
import { act, renderHook } from "@testing-library/react";
import * as deviceDetect from "react-device-detect";

import { BREAKPOINTS, DEVICE_TYPE } from "../src/constants";
import type { DeviceDetectionResult } from "../src/useDeviceTypeDetection";
import useDeviceTypeDetection from "../src/useDeviceTypeDetection";

// Enable legacy fake timers so jest.advanceTimersByTime() works
jest.useFakeTimers({ legacyFakeTimers: true });

/**
 * Set window size and fast-forward the throttle timer (150ms).
 */
function setWindowSize(width: number, height: number) {
  Object.defineProperty(window, "innerWidth", {
    writable: true,
    configurable: true,
    value: width,
  });
  Object.defineProperty(window, "innerHeight", {
    writable: true,
    configurable: true,
    value: height,
  });
  window.dispatchEvent(new Event("resize"));
  act(() => {
    jest.advanceTimersByTime(200);
  });
}

/**
 * Simulate touch capability.
 */
function setTouchDevice(isTouch: boolean) {
  Object.defineProperty(navigator, "maxTouchPoints", {
    configurable: true,
    get: () => (isTouch ? 1 : 0),
  });
}

describe("useDeviceTypeDetection Hook", () => {
  afterAll(() => {
    jest.useRealTimers();
  });

  describe("Mobile detection", () => {
    beforeAll(() => {
      // Simulate a touch-mobile device via react-device-detect
      Object.defineProperty(deviceDetect, "isMobile", {
        configurable: true,
        get: () => true,
      });
      Object.defineProperty(deviceDetect, "isTablet", {
        configurable: true,
        get: () => false,
      });
      setTouchDevice(true);
    });

    it("returns MOBILE_S_HORIZONTAL for a narrow landscape viewport", () => {
      setWindowSize(300, 200);
      const { result } = renderHook<DeviceDetectionResult, []>(() =>
        useDeviceTypeDetection(),
      );

      expect(result.current.deviceType).toBe(
        `${DEVICE_TYPE.MOBILE_S}_HORIZONTAL`,
      );
      expect(result.current.isMobileHorizontal).toBe(true);
      expect(result.current.isMobile).toBe(true);
    });

    it("returns MOBILE_L_VERTICAL for a wider portrait viewport", () => {
      setWindowSize(400, 800);
      const { result } = renderHook<DeviceDetectionResult, []>(() =>
        useDeviceTypeDetection(),
      );

      expect(result.current.deviceType).toBe(
        `${DEVICE_TYPE.MOBILE_L}_VERTICAL`,
      );
      expect(result.current.isMobileVertical).toBe(true);
    });
  });

  describe("Tablet detection", () => {
    beforeAll(() => {
      // Simulate a touch-tablet device
      Object.defineProperty(deviceDetect, "isMobile", {
        configurable: true,
        get: () => false,
      });
      Object.defineProperty(deviceDetect, "isTablet", {
        configurable: true,
        get: () => true,
      });
      setTouchDevice(true);
    });

    it("returns TABLET_M_HORIZONTAL for a medium landscape viewport", () => {
      const width = BREAKPOINTS.TABLET_S_MAX_WIDTH + 100;
      setWindowSize(width, 600);
      const { result } = renderHook<DeviceDetectionResult, []>(() =>
        useDeviceTypeDetection(),
      );

      expect(result.current.deviceType).toBe(
        `${DEVICE_TYPE.TABLET_M}_HORIZONTAL`,
      );
      expect(result.current.isTabletHorizontal).toBe(true);
      expect(result.current.isTablet).toBe(true);
    });

    it("returns TABLET_S_VERTICAL for a small portrait viewport", () => {
      setWindowSize(600, 900);
      const { result } = renderHook<DeviceDetectionResult, []>(() =>
        useDeviceTypeDetection(),
      );

      expect(result.current.deviceType).toBe(
        `${DEVICE_TYPE.TABLET_S}_VERTICAL`,
      );
      expect(result.current.isTabletVertical).toBe(true);
    });
  });

  describe("Fallback Desktop (lowerFunctionality)", () => {
    beforeAll(() => {
      // Simulate a non-touch desktop device
      Object.defineProperty(deviceDetect, "isMobile", {
        configurable: true,
        get: () => false,
      });
      Object.defineProperty(deviceDetect, "isTablet", {
        configurable: true,
        get: () => false,
      });
      setTouchDevice(false);
    });

    it("returns DESKTOP_HORIZONTAL for a large landscape viewport", () => {
      setWindowSize(BREAKPOINTS.DESKTOP_MAX_WIDTH + 100, 800);
      const { result } = renderHook<DeviceDetectionResult, []>(() =>
        useDeviceTypeDetection(),
      );

      expect(result.current.deviceType).toBe(
        `${DEVICE_TYPE.DESKTOP}_HORIZONTAL`,
      );
      expect(result.current.isDesktop).toBe(true);
    });

    it("returns DESKTOP_VERTICAL for a small portrait viewport", () => {
      setWindowSize(200, 300);
      const { result } = renderHook<DeviceDetectionResult, []>(() =>
        useDeviceTypeDetection(),
      );

      expect(result.current.deviceType).toBe(`${DEVICE_TYPE.DESKTOP}_VERTICAL`);
      expect(result.current.isDesktop).toBe(true);
    });
  });
});
