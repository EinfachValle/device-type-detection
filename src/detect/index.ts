import {
  DESKTOP,
  LAPTOP,
  MOBILE_L,
  MOBILE_M,
  MOBILE_S,
  ORIENTATION_LANDSCAPE,
  ORIENTATION_PORTRAIT,
  TABLET_L,
  TABLET_M,
  TABLET_S,
  TV,
  TV_4K,
} from "../constants";
import type {
  BreakpointConfig,
  DeviceCategory,
  DeviceState,
  Orientation,
} from "../types";

export interface DetectionInput {
  width: number;
  height: number;
  uaMobile: boolean;
  uaTablet: boolean;
  uaIPad: boolean;
  uaTV: boolean;
  touchCapable: boolean;
  breakpoints: BreakpointConfig;
}

export function detectDeviceType(input: DetectionInput): DeviceState {
  const {
    width,
    height,
    uaMobile,
    uaTablet,
    uaIPad,
    uaTV,
    touchCapable,
    breakpoints,
  } = input;

  const isPortrait = height > width;
  const orientation: Orientation = isPortrait
    ? ORIENTATION_PORTRAIT
    : ORIENTATION_LANDSCAPE;

  let deviceType: DeviceCategory;

  // 1. UA mobile + touch + not iPad
  if (uaMobile && touchCapable && !uaIPad) {
    if (width <= breakpoints.mobileS) {
      deviceType = MOBILE_S;
    } else if (width <= breakpoints.mobileM) {
      deviceType = MOBILE_M;
    } else {
      deviceType = MOBILE_L;
    }
  }
  // 2. UA tablet or iPad + touch
  else if ((uaTablet || uaIPad) && touchCapable) {
    if (width <= breakpoints.tabletS) {
      deviceType = TABLET_S;
    } else if (width <= breakpoints.tabletM) {
      deviceType = TABLET_M;
    } else {
      deviceType = TABLET_L;
    }
  }
  // 3. UA TV (Smart TV browsers)
  else if (uaTV) {
    if (width > breakpoints.tv) {
      deviceType = TV_4K;
    } else {
      deviceType = TV;
    }
  }
  // 4. Viewport cascade (max: desktop)
  else {
    if (width > breakpoints.laptop) {
      deviceType = DESKTOP;
    } else if (width > breakpoints.tabletL) {
      deviceType = LAPTOP;
    } else if (width > breakpoints.tabletM) {
      deviceType = TABLET_L;
    } else if (width > breakpoints.tabletS) {
      deviceType = TABLET_M;
    } else if (width > breakpoints.mobileM) {
      deviceType = TABLET_S;
    } else if (width > breakpoints.mobileS) {
      deviceType = MOBILE_M;
    } else {
      deviceType = MOBILE_S;
    }
  }

  const isMobileS = deviceType === MOBILE_S;
  const isMobileM = deviceType === MOBILE_M;
  const isMobileL = deviceType === MOBILE_L;
  const isTabletS = deviceType === TABLET_S;
  const isTabletM = deviceType === TABLET_M;
  const isTabletL = deviceType === TABLET_L;
  const isMobile = isMobileS || isMobileM || isMobileL;
  const isTablet = isTabletS || isTabletM || isTabletL;
  const isLaptop = deviceType === LAPTOP;
  const isDesktop = deviceType === DESKTOP;
  const isTV = deviceType === TV;
  const isTV4K = deviceType === TV_4K;

  return {
    deviceType,
    orientation,
    touchDevice: touchCapable,
    width,
    height,
    isMobile,
    isMobileS,
    isMobileM,
    isMobileL,
    isTablet,
    isTabletS,
    isTabletM,
    isTabletL,
    isLaptop,
    isDesktop,
    isTV,
    isTV4K,
    isPortrait,
    isLandscape: !isPortrait,
    isMobileVertical: isMobile && isPortrait,
    isMobileHorizontal: isMobile && !isPortrait,
    isTabletVertical: isTablet && isPortrait,
    isTabletHorizontal: isTablet && !isPortrait,
  };
}
