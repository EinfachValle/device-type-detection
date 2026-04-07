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
    touchCapable,
    breakpoints,
  } = input;

  const isPortrait = height > width;
  const orientation: Orientation = isPortrait ? "portrait" : "landscape";

  let deviceType: DeviceCategory;

  // 1. UA mobile + touch + not iPad
  if (uaMobile && touchCapable && !uaIPad) {
    if (width <= breakpoints.mobileS) {
      deviceType = "mobile_s";
    } else if (width <= breakpoints.mobileM) {
      deviceType = "mobile_m";
    } else {
      deviceType = "mobile_l";
    }
  }
  // 2. UA tablet or iPad + touch
  else if ((uaTablet || uaIPad) && touchCapable) {
    if (width <= breakpoints.tabletS) {
      deviceType = "tablet_s";
    } else if (width <= breakpoints.tabletM) {
      deviceType = "tablet_m";
    } else {
      deviceType = "tablet_l";
    }
  }
  // 3. Viewport cascade
  else {
    if (width > breakpoints.tv) {
      deviceType = "tv_4k";
    } else if (width > breakpoints.desktop) {
      deviceType = "tv";
    } else if (width > breakpoints.laptop) {
      deviceType = "desktop";
    } else if (width > breakpoints.tabletL) {
      deviceType = "laptop";
    } else if (width > breakpoints.tabletM) {
      deviceType = "tablet_l";
    } else if (width > breakpoints.tabletS) {
      deviceType = "tablet_m";
    } else if (width > breakpoints.mobileM) {
      deviceType = "tablet_s";
    } else if (width > breakpoints.mobileS) {
      deviceType = "mobile_m";
    } else {
      deviceType = "mobile_s";
    }
  }

  const isMobileS = deviceType === "mobile_s";
  const isMobileM = deviceType === "mobile_m";
  const isMobileL = deviceType === "mobile_l";
  const isTabletS = deviceType === "tablet_s";
  const isTabletM = deviceType === "tablet_m";
  const isTabletL = deviceType === "tablet_l";
  const isMobile = isMobileS || isMobileM || isMobileL;
  const isTablet = isTabletS || isTabletM || isTabletL;
  const isLaptop = deviceType === "laptop";
  const isDesktop = deviceType === "desktop";
  const isTV = deviceType === "tv";
  const isTV4K = deviceType === "tv_4k";

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
