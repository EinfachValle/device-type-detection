import { DEFAULT_BREAKPOINTS } from "../breakpoints";
import { detectDeviceType } from "../detect";
import { createObserver } from "../observe";
import { getSSRDefaults, isSSR } from "../ssr";
import type {
  BreakpointConfig,
  DetectorOptions,
  DeviceState,
  DeviceStore,
} from "../types";
import { parseUserAgent } from "../ua-parser";

function shallowEqual(a: DeviceState, b: DeviceState): boolean {
  const keys = Object.keys(a) as (keyof DeviceState)[];
  for (const key of keys) {
    if (a[key] !== b[key]) return false;
  }
  return true;
}

export function createDeviceDetector(options?: DetectorOptions): DeviceStore {
  const breakpoints: BreakpointConfig = {
    ...DEFAULT_BREAKPOINTS,
    ...options?.breakpoints,
  };
  const throttleMs = options?.throttleMs ?? 150;
  const ssrDeviceType = options?.ssrDeviceType ?? "desktop";

  if (isSSR()) {
    const state = getSSRDefaults(ssrDeviceType);
    return {
      getState: () => state,
      subscribe: () => () => {},
      destroy: () => {},
    };
  }

  const ua = parseUserAgent(navigator.userAgent, navigator.maxTouchPoints ?? 0);
  const touchCapable = navigator.maxTouchPoints > 0;

  let currentState = detectDeviceType({
    width: window.innerWidth,
    height: window.innerHeight,
    uaMobile: ua.isMobile,
    uaTablet: ua.isTablet,
    uaIPad: ua.isIPad,
    touchCapable,
    breakpoints,
  });

  const listeners = new Set<(state: DeviceState, prev: DeviceState) => void>();

  const observer = createObserver(
    (width, height) => {
      const newState = detectDeviceType({
        width,
        height,
        uaMobile: ua.isMobile,
        uaTablet: ua.isTablet,
        uaIPad: ua.isIPad,
        touchCapable,
        breakpoints,
      });

      if (!shallowEqual(currentState, newState)) {
        const prev = currentState;
        currentState = newState;
        for (const listener of listeners) {
          listener(currentState, prev);
        }
      }
    },
    throttleMs,
    Object.values(breakpoints),
  );

  return {
    getState() {
      return currentState;
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    destroy() {
      observer.destroy();
      listeners.clear();
    },
  };
}
