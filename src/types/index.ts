export type DeviceCategory =
  | "mobile_s"
  | "mobile_m"
  | "mobile_l"
  | "tablet_s"
  | "tablet_m"
  | "tablet_l"
  | "laptop"
  | "desktop"
  | "tv"
  | "tv_4k";

export type Orientation = "portrait" | "landscape";

export interface DeviceState {
  deviceType: DeviceCategory;
  orientation: Orientation;
  touchDevice: boolean;
  width: number;
  height: number;
  isMobile: boolean;
  isMobileS: boolean;
  isMobileM: boolean;
  isMobileL: boolean;
  isTablet: boolean;
  isTabletS: boolean;
  isTabletM: boolean;
  isTabletL: boolean;
  isLaptop: boolean;
  isDesktop: boolean;
  isTV: boolean;
  isTV4K: boolean;
  isPortrait: boolean;
  isLandscape: boolean;
  isMobileVertical: boolean;
  isMobileHorizontal: boolean;
  isTabletVertical: boolean;
  isTabletHorizontal: boolean;
}

export interface BreakpointConfig {
  mobileS: number;
  mobileM: number;
  tabletS: number;
  tabletM: number;
  tabletL: number;
  laptop: number;
  desktop: number;
  tv: number;
}

export interface DetectorOptions {
  breakpoints?: Partial<BreakpointConfig>;
  throttleMs?: number;
  ssrDeviceType?: DeviceCategory;
}

export interface DeviceStore {
  getState(): DeviceState;
  subscribe(
    listener: (state: DeviceState, prev: DeviceState) => void,
  ): () => void;
  destroy(): void;
}
