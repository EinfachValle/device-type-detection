import { createDeviceDetector } from ".";
import type { DeviceStore } from "../types";

jest.useFakeTimers({ legacyFakeTimers: true });

function setWindowSize(width: number, height: number) {
  Object.defineProperty(window, "innerWidth", {
    writable: true,
    configurable: true,
    value: width,
  });
  Object.defineProperty(window, "innerHeight", {
    writable: true,
    configurable: true,
    value: height,
  });
  window.dispatchEvent(new Event("resize"));
  jest.advanceTimersByTime(200);
}

describe("createDeviceDetector", () => {
  let store: DeviceStore;

  beforeEach(() => {
    // Set a known window size before creating detector
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 1920,
    });
    Object.defineProperty(window, "innerHeight", {
      writable: true,
      configurable: true,
      value: 1080,
    });
  });

  afterEach(() => {
    if (store) store.destroy();
    jest.clearAllTimers();
  });

  it("returns a DeviceStore with getState/subscribe/destroy", () => {
    store = createDeviceDetector();
    expect(typeof store.getState).toBe("function");
    expect(typeof store.subscribe).toBe("function");
    expect(typeof store.destroy).toBe("function");
  });

  it("getState() returns a valid DeviceState", () => {
    store = createDeviceDetector();
    const state = store.getState();
    expect(state).toHaveProperty("deviceType");
    expect(state).toHaveProperty("orientation");
    expect(state).toHaveProperty("width");
    expect(state).toHaveProperty("height");
    expect(state).toHaveProperty("isMobile");
    expect(state).toHaveProperty("isTablet");
    expect(state).toHaveProperty("isLaptop");
    expect(state).toHaveProperty("isDesktop");
    expect(state).toHaveProperty("isTV");
    expect(state).toHaveProperty("isTV4K");
    expect(state).toHaveProperty("isPortrait");
    expect(state).toHaveProperty("isLandscape");
  });

  it("getState() reflects initial window size", () => {
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 1920,
    });
    Object.defineProperty(window, "innerHeight", {
      writable: true,
      configurable: true,
      value: 1080,
    });
    store = createDeviceDetector();
    const state = store.getState();
    expect(state.width).toBe(1920);
    expect(state.height).toBe(1080);
  });

  it("subscribe() returns an unsubscribe function", () => {
    store = createDeviceDetector();
    const unsub = store.subscribe(jest.fn());
    expect(typeof unsub).toBe("function");
    unsub();
  });

  it("listener is called on window resize", () => {
    store = createDeviceDetector();
    const listener = jest.fn();
    store.subscribe(listener);

    setWindowSize(480, 800);
    expect(listener).toHaveBeenCalled();
  });

  it("listener receives (newState, prevState)", () => {
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 1920,
    });
    Object.defineProperty(window, "innerHeight", {
      writable: true,
      configurable: true,
      value: 1080,
    });
    store = createDeviceDetector();

    const listener = jest.fn();
    store.subscribe(listener);

    setWindowSize(480, 800);

    expect(listener).toHaveBeenCalledTimes(1);
    const [newState, prevState] = listener.mock.calls[0];
    expect(newState.width).toBe(480);
    expect(prevState.width).toBe(1920);
  });

  it("unsubscribe stops notifications", () => {
    store = createDeviceDetector();
    const listener = jest.fn();
    const unsub = store.subscribe(listener);

    setWindowSize(480, 800);
    expect(listener).toHaveBeenCalledTimes(1);

    unsub();

    setWindowSize(1920, 1080);
    expect(listener).toHaveBeenCalledTimes(1); // no additional calls
  });

  it("destroy() cleans up (no more notifications after destroy)", () => {
    store = createDeviceDetector();
    const listener = jest.fn();
    store.subscribe(listener);

    store.destroy();

    setWindowSize(480, 800);
    expect(listener).not.toHaveBeenCalled();
  });

  it("multiple subscribers work independently", () => {
    store = createDeviceDetector();
    const listener1 = jest.fn();
    const listener2 = jest.fn();
    const unsub1 = store.subscribe(listener1);
    store.subscribe(listener2);

    setWindowSize(480, 800);
    expect(listener1).toHaveBeenCalledTimes(1);
    expect(listener2).toHaveBeenCalledTimes(1);

    unsub1();
    setWindowSize(1920, 1080);
    expect(listener1).toHaveBeenCalledTimes(1); // unsubscribed
    expect(listener2).toHaveBeenCalledTimes(2); // still active
  });

  it("state does not emit if device type has not changed", () => {
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 1920,
    });
    Object.defineProperty(window, "innerHeight", {
      writable: true,
      configurable: true,
      value: 1080,
    });
    store = createDeviceDetector();
    const listener = jest.fn();
    store.subscribe(listener);

    // Resize to same category (still desktop: 1401-1920)
    setWindowSize(1800, 1000);

    // State changed (width/height differ) so listener IS called
    // But if we set back to exact same values...
    const callCount = listener.mock.calls.length;
    setWindowSize(1800, 1000);
    // No change, so no new notification
    expect(listener).toHaveBeenCalledTimes(callCount);
  });

  it("getState() returns updated state after resize", () => {
    store = createDeviceDetector();
    setWindowSize(360, 640);
    const state = store.getState();
    expect(state.width).toBe(360);
    expect(state.height).toBe(640);
  });

  it("accepts custom breakpoints option", () => {
    store = createDeviceDetector({
      breakpoints: { desktop: 1600 },
    });
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 1601,
    });
    Object.defineProperty(window, "innerHeight", {
      writable: true,
      configurable: true,
      value: 900,
    });
    // Recreate with new window size
    store.destroy();
    store = createDeviceDetector({
      breakpoints: { desktop: 1600 },
    });
    const state = store.getState();
    // width 1601 > desktop(1600) => tv with default tv=3840? No: > 1600(desktop) but <= 1920(default desktop mapped to tv breakpoint)
    // Actually the custom only overrides desktop to 1600, other breakpoints remain default
    // viewport cascade: width 1601 > laptop(1400)? yes, > desktop(1600)? yes => next: > tv(3840)? no => so it's tv?
    // Wait: the cascade is: > tv(3840)? no. > desktop(1600)? yes => tv. No wait:
    // > tv => tv_4k, > desktop => tv, > laptop => desktop
    // With custom desktop=1600: width 1601 > laptop(1400) => desktop... wait let me re-read:
    // if width > breakpoints.tv(3840) -> tv_4k
    // else if width > breakpoints.desktop(1600) -> tv
    // else if width > breakpoints.laptop(1400) -> desktop
    // 1601 > 1600 => tv
    expect(state.deviceType).toBe("tv");
  });

  it("accepts custom throttleMs option", () => {
    store = createDeviceDetector({ throttleMs: 500 });
    const listener = jest.fn();
    store.subscribe(listener);

    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 480,
    });
    Object.defineProperty(window, "innerHeight", {
      writable: true,
      configurable: true,
      value: 800,
    });
    window.dispatchEvent(new Event("resize"));

    // With 200ms, it would have fired; with 500ms throttle, may still fire on leading edge
    jest.advanceTimersByTime(500);
    // Should have fired at some point within the 500ms window
    expect(listener).toHaveBeenCalled();
  });
});
