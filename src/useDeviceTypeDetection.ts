import { useCallback, useEffect, useState } from "react";

import { throttle } from "lodash";
import {
  isMobile as detectMobile,
  isTablet as detectTablet,
} from "react-device-detect";

import { BREAKPOINTS, DEVICE_TYPE } from "./constants";

const {
  MOBILE_S_MAX_WIDTH,
  MOBILE_MAX_WIDTH,
  TABLET_S_MAX_WIDTH,
  TABLET_M_MAX_WIDTH,
  TABLET_L_MAX_WIDTH,
  LAPTOP_MAX_WIDTH,
  DESKTOP_MAX_WIDTH,
  TV_MAX_WIDTH,
} = BREAKPOINTS;

interface Orientation {
  isPortrait: boolean;
  isLandscape: boolean;
}

export interface DeviceDetectionResult {
  deviceType: string;
  touchDevice: boolean;
  isPortrait: boolean;
  isLandscape: boolean;
  orientation: "portrait" | "landscape";
  isMobile: boolean;
  isTablet: boolean;
  isMobileVertical: boolean;
  isMobileHorizontal: boolean;
  isTabletVertical: boolean;
  isTabletHorizontal: boolean;
  isMobileS: boolean;
  isMobileM: boolean;
  isMobileL: boolean;
  isTabletS: boolean;
  isTabletM: boolean;
  isTabletL: boolean;
  isLaptop: boolean;
  isDesktop: boolean;
  isTV: boolean;
  isTV4K: boolean;
}

const lowerFunctionality = true;

const useDeviceTypeDetection = (): DeviceDetectionResult => {
  const [deviceType, setDeviceType] = useState<string>("");
  const [orientation, setOrientation] = useState<Orientation>({
    isPortrait:
      typeof window !== "undefined"
        ? window.innerHeight > window.innerWidth
        : true,
    isLandscape:
      typeof window !== "undefined"
        ? window.innerWidth > window.innerHeight
        : false,
  });

  const hasWindow = typeof window !== "undefined";
  const touchDevice = hasWindow ? navigator.maxTouchPoints > 0 : false;

  const checkDeviceType = useCallback(() => {
    if (!hasWindow) return;

    const width = window.innerWidth;
    const height = window.innerHeight;

    const shortSide = Math.min(width, height);
    const isPortrait = height > width;
    const isLandscape = width > height;

    setOrientation((prev) => {
      if (prev.isPortrait !== isPortrait || prev.isLandscape !== isLandscape) {
        return { isPortrait, isLandscape };
      }
      return prev;
    });

    let newDeviceType = "";

    const ua = navigator.userAgent;

    const isIPadUA =
      /iPad/i.test(ua) ||
      (ua.includes("Macintosh") && navigator.maxTouchPoints >= 1);

    const detectRealTablet = detectTablet || isIPadUA;

    // -----------------------------------------------
    // 1. If react-device-detect says it's mobile, override.
    //    (This covers large-resolution phones like iPhone 15 Pro Max.)
    // -----------------------------------------------
    if (detectMobile && touchDevice && !isIPadUA) {
      if (width <= MOBILE_S_MAX_WIDTH) {
        newDeviceType = DEVICE_TYPE.MOBILE_S;
      } else if (width <= 380) {
        newDeviceType = DEVICE_TYPE.MOBILE_M;
      } else {
        // For large phones, classify as MOBILE_L
        newDeviceType = DEVICE_TYPE.MOBILE_L;
      }
    }

    // -----------------------------------------------
    // 2. If react-device-detect says it's a tablet, override
    // -----------------------------------------------
    else if (detectRealTablet && touchDevice) {
      // Optionally subdivide: TABLET_S, TABLET_M, TABLET_L
      if (width <= TABLET_S_MAX_WIDTH) {
        newDeviceType = DEVICE_TYPE.TABLET_S;
      } else if (width <= TABLET_M_MAX_WIDTH) {
        newDeviceType = DEVICE_TYPE.TABLET_M;
      } else {
        newDeviceType = DEVICE_TYPE.TABLET_L;
      }
    }

    // -----------------------------------------------
    // 3. Otherwise, fall back to raw width breakpoints
    // -----------------------------------------------
    else if (lowerFunctionality) {
      newDeviceType = DEVICE_TYPE.DESKTOP;
    } else {
      if (width > TV_MAX_WIDTH) {
        // 4K or bigger
        newDeviceType = DEVICE_TYPE.TV_4K;
      } else if (width > DESKTOP_MAX_WIDTH && width <= TV_MAX_WIDTH) {
        newDeviceType = DEVICE_TYPE.TV;
      } else if (width > LAPTOP_MAX_WIDTH && width <= DESKTOP_MAX_WIDTH) {
        newDeviceType = DEVICE_TYPE.DESKTOP;
      } else if (width > TABLET_L_MAX_WIDTH && width <= LAPTOP_MAX_WIDTH) {
        newDeviceType = DEVICE_TYPE.LAPTOP;
      } else if (width > TABLET_M_MAX_WIDTH && width <= TABLET_L_MAX_WIDTH) {
        newDeviceType = DEVICE_TYPE.TABLET_L;
      } else if (width > TABLET_S_MAX_WIDTH && width <= TABLET_M_MAX_WIDTH) {
        newDeviceType = DEVICE_TYPE.TABLET_M;
      } else if (width >= 768 && width <= TABLET_S_MAX_WIDTH) {
        newDeviceType = DEVICE_TYPE.TABLET_S;
      } else if (width > 320 && width <= MOBILE_MAX_WIDTH) {
        // This captures small non-touch laptops or specific user agents not recognized, etc.
        // But typically phones will be captured by react-device-detect above
        if (width <= 380) {
          newDeviceType = DEVICE_TYPE.MOBILE_M;
        } else {
          newDeviceType = DEVICE_TYPE.MOBILE_L;
        }
      } else if (width <= 320) {
        newDeviceType = DEVICE_TYPE.MOBILE_S;
      } else {
        // If it doesn't fit any known category, you could consider it Desktop as fallback
        newDeviceType = DEVICE_TYPE.DESKTOP;
      }
    }

    if (newDeviceType) {
      const suffix = isPortrait ? "_VERTICAL" : "_HORIZONTAL";
      newDeviceType = `${newDeviceType}${suffix}`;
    }

    // Update state only if changed (prevent unnecessary re-renders)
    setDeviceType((prev) => {
      if (prev !== newDeviceType) {
        // Uncomment to see the device type in console
        // console.log("@@ Device Type:", { newDeviceType, width });
        return newDeviceType;
      }
      return prev;
    });
  }, [hasWindow, touchDevice]);

  const handleResizeThrottled = useCallback(
    throttle(() => {
      checkDeviceType();
    }, 150),
    [checkDeviceType],
  );

  useEffect(() => {
    if (!hasWindow) return;

    checkDeviceType();

    window.addEventListener("resize", handleResizeThrottled);

    const orientationApi = window.screen?.orientation;
    const onOrient = () => checkDeviceType();
    orientationApi?.addEventListener("change", onOrient);

    return () => {
      window.removeEventListener("resize", handleResizeThrottled);
      orientationApi?.removeEventListener("change", onOrient);
      handleResizeThrottled.cancel();
    };
  }, [checkDeviceType, handleResizeThrottled, hasWindow]);

  const isMobile = deviceType.startsWith("MOBILE");
  const isTablet = deviceType.startsWith("TABLET");

  // Mobile and Tablet specific orientation exports
  const isMobileVertical =
    (deviceType.startsWith(DEVICE_TYPE.MOBILE_S) ||
      deviceType.startsWith(DEVICE_TYPE.MOBILE_M) ||
      deviceType.startsWith(DEVICE_TYPE.MOBILE_L)) &&
    deviceType.endsWith("_VERTICAL");
  const isMobileHorizontal =
    (deviceType.startsWith(DEVICE_TYPE.MOBILE_S) ||
      deviceType.startsWith(DEVICE_TYPE.MOBILE_M) ||
      deviceType.startsWith(DEVICE_TYPE.MOBILE_L)) &&
    deviceType.endsWith("_HORIZONTAL");
  const isTabletVertical =
    (deviceType.startsWith(DEVICE_TYPE.TABLET_S) ||
      deviceType.startsWith(DEVICE_TYPE.TABLET_M) ||
      deviceType.startsWith(DEVICE_TYPE.TABLET_L)) &&
    deviceType.endsWith("_VERTICAL");
  const isTabletHorizontal =
    (deviceType.startsWith(DEVICE_TYPE.TABLET_S) ||
      deviceType.startsWith(DEVICE_TYPE.TABLET_M) ||
      deviceType.startsWith(DEVICE_TYPE.TABLET_L)) &&
    deviceType.endsWith("_HORIZONTAL");

  const isMobileS = deviceType === DEVICE_TYPE.MOBILE_S;
  const isMobileM = deviceType === DEVICE_TYPE.MOBILE_M;
  const isMobileL = deviceType === DEVICE_TYPE.MOBILE_L;
  const isTabletS = deviceType === DEVICE_TYPE.TABLET_S;
  const isTabletM = deviceType === DEVICE_TYPE.TABLET_M;
  const isTabletL = deviceType === DEVICE_TYPE.TABLET_L;
  const isLaptop = deviceType === DEVICE_TYPE.LAPTOP;
  const isDesktop = deviceType.startsWith(DEVICE_TYPE.DESKTOP);
  const isTV = deviceType === DEVICE_TYPE.TV;
  const isTV4K = deviceType === DEVICE_TYPE.TV_4K;

  return {
    deviceType,
    touchDevice,
    isPortrait: orientation.isPortrait,
    isLandscape: orientation.isLandscape,
    orientation: orientation.isPortrait ? "portrait" : "landscape",
    isMobile,
    isTablet,
    isMobileVertical,
    isMobileHorizontal,
    isTabletVertical,
    isTabletHorizontal,
    isMobileS,
    isMobileM,
    isMobileL,
    isTabletS,
    isTabletM,
    isTabletL,
    isLaptop,
    isDesktop,
    isTV,
    isTV4K,
  };
};

export default useDeviceTypeDetection;
