import type { DeviceCategory, DeviceState, Orientation } from "../types";

const SSR_DIMENSIONS: Record<
  DeviceCategory,
  { width: number; height: number }
> = {
  mobile_s: { width: 320, height: 568 },
  mobile_m: { width: 375, height: 667 },
  mobile_l: { width: 428, height: 926 },
  tablet_s: { width: 768, height: 1024 },
  tablet_m: { width: 834, height: 1194 },
  tablet_l: { width: 1024, height: 1366 },
  laptop: { width: 1366, height: 768 },
  desktop: { width: 1920, height: 1080 },
  tv: { width: 2560, height: 1440 },
  tv_4k: { width: 3840, height: 2160 },
};

export function isSSR(): boolean {
  return typeof window === "undefined";
}

export function getSSRDefaults(
  deviceType: DeviceCategory = "desktop",
): DeviceState {
  const isMobileS = deviceType === "mobile_s";
  const isMobileM = deviceType === "mobile_m";
  const isMobileL = deviceType === "mobile_l";
  const isTabletS = deviceType === "tablet_s";
  const isTabletM = deviceType === "tablet_m";
  const isTabletL = deviceType === "tablet_l";
  const isMobile = isMobileS || isMobileM || isMobileL;
  const isTablet = isTabletS || isTabletM || isTabletL;

  const { width, height } = SSR_DIMENSIONS[deviceType];
  const isPortrait = height > width;
  const orientation: Orientation = isPortrait ? "portrait" : "landscape";

  return {
    deviceType,
    orientation,
    touchDevice: false,
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
    isLaptop: deviceType === "laptop",
    isDesktop: deviceType === "desktop",
    isTV: deviceType === "tv",
    isTV4K: deviceType === "tv_4k",
    isPortrait,
    isLandscape: !isPortrait,
    isMobileVertical: isMobile && isPortrait,
    isMobileHorizontal: isMobile && !isPortrait,
    isTabletVertical: isTablet && isPortrait,
    isTabletHorizontal: isTablet && !isPortrait,
  };
}
