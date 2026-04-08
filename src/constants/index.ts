import type { DeviceCategory, Orientation } from "../types";

/** Individual device type constants */
export const MOBILE_S: DeviceCategory = "mobile_s";
export const MOBILE_M: DeviceCategory = "mobile_m";
export const MOBILE_L: DeviceCategory = "mobile_l";
export const TABLET_S: DeviceCategory = "tablet_s";
export const TABLET_M: DeviceCategory = "tablet_m";
export const TABLET_L: DeviceCategory = "tablet_l";
export const LAPTOP: DeviceCategory = "laptop";
export const DESKTOP: DeviceCategory = "desktop";
export const TV: DeviceCategory = "tv";
export const TV_4K: DeviceCategory = "tv_4k";

/** All device categories in ascending width order */
export const DEVICE_CATEGORIES: readonly DeviceCategory[] = [
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
] as const;

export const ORIENTATION_PORTRAIT: Orientation = "portrait";
export const ORIENTATION_LANDSCAPE: Orientation = "landscape";

/** Default throttle interval in milliseconds */
export const DEFAULT_THROTTLE_MS = 150;

/** Default device type for SSR rendering */
export const DEFAULT_SSR_DEVICE_TYPE: DeviceCategory = DESKTOP;

/** SSR default dimensions per device type */
export const SSR_DIMENSIONS: Record<
  DeviceCategory,
  { width: number; height: number }
> = {
  [MOBILE_S]: { width: 320, height: 568 },
  [MOBILE_M]: { width: 375, height: 667 },
  [MOBILE_L]: { width: 428, height: 926 },
  [TABLET_S]: { width: 768, height: 1024 },
  [TABLET_M]: { width: 834, height: 1194 },
  [TABLET_L]: { width: 1024, height: 1366 },
  [LAPTOP]: { width: 1366, height: 768 },
  [DESKTOP]: { width: 1920, height: 1080 },
  [TV]: { width: 2560, height: 1440 },
  [TV_4K]: { width: 3840, height: 2160 },
};
