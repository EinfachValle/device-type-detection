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
    const breakpointWidths = breakpoints ?? [
      380, 480, 834, 1024, 1366, 1400, 1920, 3840,
    ];
    for (const bp of breakpointWidths) {
      const mql = matchMedia(`(max-width: ${bp}px)`);
      const handler = () => notify();
      mql.addEventListener("change", handler);
      mediaQueries.push({ mql, handler });
    }
  }

  const orientationApi =
    typeof screen !== "undefined" ? screen.orientation : null;
  const onOrientation = () => notify();
  if (orientationApi) {
    orientationApi.addEventListener("change", onOrientation);
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
      }
    },
  };
}
