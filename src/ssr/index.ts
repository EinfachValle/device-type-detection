import {
  DEFAULT_SSR_DEVICE_TYPE,
  DESKTOP,
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
} from "../constants";
import type { DeviceCategory, DeviceState, Orientation } from "../types";

export function isSSR(): boolean {
  return typeof window === "undefined";
}

export function getSSRDefaults(
  deviceType: DeviceCategory = DEFAULT_SSR_DEVICE_TYPE,
): DeviceState {
  const isMobileS = deviceType === MOBILE_S;
  const isMobileM = deviceType === MOBILE_M;
  const isMobileL = deviceType === MOBILE_L;
  const isTabletS = deviceType === TABLET_S;
  const isTabletM = deviceType === TABLET_M;
  const isTabletL = deviceType === TABLET_L;
  const isMobile = isMobileS || isMobileM || isMobileL;
  const isTablet = isTabletS || isTabletM || isTabletL;

  const { width, height } = SSR_DIMENSIONS[deviceType];
  const isPortrait = height > width;
  const orientation: Orientation = isPortrait
    ? ORIENTATION_PORTRAIT
    : ORIENTATION_LANDSCAPE;

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
    isLaptop: deviceType === LAPTOP,
    isDesktop: deviceType === DESKTOP,
    isTV: deviceType === TV,
    isTV4K: deviceType === TV_4K,
    isPortrait,
    isLandscape: !isPortrait,
    isMobileVertical: isMobile && isPortrait,
    isMobileHorizontal: isMobile && !isPortrait,
    isTabletVertical: isTablet && isPortrait,
    isTabletHorizontal: isTablet && !isPortrait,
  };
}
