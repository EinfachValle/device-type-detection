export function throttle<T extends (...args: any[]) => void>(
  fn: T,
  ms: number,
): T & { cancel(): void } {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  let lastCallTime = 0;

  const throttled = function (this: any, ...args: any[]) {
    const now = Date.now();
    const remaining = ms - (now - lastCallTime);

    if (remaining <= 0) {
      if (timeoutId !== null) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
      lastCallTime = now;
      fn.apply(this, args);
    } else if (timeoutId === null) {
      timeoutId = setTimeout(() => {
        lastCallTime = Date.now();
        timeoutId = null;
        fn.apply(this, args);
      }, remaining);
    }
  } as T & { cancel(): void };

  throttled.cancel = () => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
    lastCallTime = 0;
  };

  return throttled;
}
