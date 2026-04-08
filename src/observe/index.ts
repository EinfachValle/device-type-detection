import { DEFAULT_BREAKPOINTS } from "../breakpoints";
import { throttle } from "../throttle";

export function createObserver(
  onUpdate: (width: number, height: number) => void,
  throttleMs: number,
  breakpoints?: number[],
): { destroy(): void } {
  const throttled = throttle(
    (w: number, h: number) => onUpdate(w, h),
    throttleMs,
  );

  const notify = () => {
    throttled(window.innerWidth, window.innerHeight);
  };

  // Deferred notify for orientation events — gives the browser one frame
  // to update window.innerWidth/Height after rotation
  let deferredId: number | null = null;
  const notifyDeferred = () => {
    if (deferredId !== null) return;
    if (typeof requestAnimationFrame !== "undefined") {
      deferredId = requestAnimationFrame(() => {
        deferredId = null;
        notify();
      });
    } else {
      deferredId = setTimeout(() => {
        deferredId = null;
        notify();
      }, 50) as unknown as number;
    }
  };

  // Always listen to resize as a complement (mobile browsers with dynamic toolbars)
  window.addEventListener("resize", notify);

  // ResizeObserver for more performant detection
  let resizeObserver: ResizeObserver | null = null;
  if (typeof ResizeObserver !== "undefined") {
    resizeObserver = new ResizeObserver(() => notify());
    resizeObserver.observe(document.documentElement);
  }

  const mediaQueries: { mql: MediaQueryList; handler: () => void }[] = [];
  if (typeof matchMedia !== "undefined") {
    const breakpointWidths = breakpoints ?? Object.values(DEFAULT_BREAKPOINTS);
    for (const bp of breakpointWidths) {
      const mql = matchMedia(`(max-width: ${bp}px)`);
      const handler = () => notify();
      mql.addEventListener("change", handler);
      mediaQueries.push({ mql, handler });
    }

    // Orientation media query — reliable cross-browser orientation signal
    const orientationMql = matchMedia("(orientation: portrait)");
    const orientationMqlHandler = () => notifyDeferred();
    orientationMql.addEventListener("change", orientationMqlHandler);
    mediaQueries.push({ mql: orientationMql, handler: orientationMqlHandler });
  }

  // screen.orientation API with legacy orientationchange fallback
  const orientationApi =
    typeof screen !== "undefined" ? screen.orientation : null;
  const onOrientation = () => notifyDeferred();
  const useLegacyOrientation = !orientationApi;

  if (orientationApi) {
    orientationApi.addEventListener("change", onOrientation);
  } else if (useLegacyOrientation) {
    window.addEventListener("orientationchange", onOrientation);
  }

  return {
    destroy() {
      throttled.cancel();
      window.removeEventListener("resize", notify);
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      for (const { mql, handler } of mediaQueries) {
        mql.removeEventListener("change", handler);
      }
      if (orientationApi) {
        orientationApi.removeEventListener("change", onOrientation);
      } else if (useLegacyOrientation) {
        window.removeEventListener("orientationchange", onOrientation);
      }
      if (deferredId !== null) {
        if (typeof cancelAnimationFrame !== "undefined") {
          cancelAnimationFrame(deferredId);
        } else {
          clearTimeout(deferredId);
        }
        deferredId = null;
      }
    },
  };
}
