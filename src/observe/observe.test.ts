import { createObserver } from ".";

describe("createObserver", () => {
  let originalResizeObserver: typeof ResizeObserver | undefined;

  beforeEach(() => {
    jest.useFakeTimers({ legacyFakeTimers: true });
    originalResizeObserver = (globalThis as any).ResizeObserver;
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
    if (originalResizeObserver) {
      (globalThis as any).ResizeObserver = originalResizeObserver;
    } else {
      delete (globalThis as any).ResizeObserver;
    }
  });

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
  }

  it("returns an object with a destroy method", () => {
    const observer = createObserver(jest.fn(), 100);
    expect(observer).toHaveProperty("destroy");
    expect(typeof observer.destroy).toBe("function");
    observer.destroy();
  });

  it("calls onUpdate on window resize event", () => {
    const now = Date.now;
    Date.now = () => 1000;

    const onUpdate = jest.fn();
    setWindowSize(800, 600);
    const observer = createObserver(onUpdate, 0);

    setWindowSize(1024, 768);
    window.dispatchEvent(new Event("resize"));
    jest.advanceTimersByTime(10);

    expect(onUpdate).toHaveBeenCalledWith(1024, 768);
    observer.destroy();
    Date.now = now;
  });

  it("throttles rapid resize events", () => {
    const now = Date.now;
    let time = 1000;
    Date.now = () => time;

    const onUpdate = jest.fn();
    const observer = createObserver(onUpdate, 200);

    for (let i = 0; i < 10; i++) {
      time += 5;
      setWindowSize(800 + i * 10, 600);
      window.dispatchEvent(new Event("resize"));
    }

    // Only leading call should have fired
    expect(onUpdate.mock.calls.length).toBeLessThanOrEqual(2);

    time += 300;
    jest.advanceTimersByTime(300);
    expect(onUpdate).toHaveBeenCalled();
    observer.destroy();
    Date.now = now;
  });

  it("stops notifying after destroy", () => {
    const now = Date.now;
    Date.now = () => 1000;

    const onUpdate = jest.fn();
    const observer = createObserver(onUpdate, 0);
    observer.destroy();

    onUpdate.mockClear();
    setWindowSize(500, 400);
    window.dispatchEvent(new Event("resize"));
    jest.advanceTimersByTime(100);

    expect(onUpdate).not.toHaveBeenCalled();
    Date.now = now;
  });

  it("works with ResizeObserver when available", () => {
    const now = Date.now;
    Date.now = () => 1000;

    const observeMock = jest.fn();
    const disconnectMock = jest.fn();
    let resizeCallback: (() => void) | null = null;

    (globalThis as any).ResizeObserver = class {
      constructor(cb: () => void) {
        resizeCallback = cb;
      }
      observe = observeMock;
      disconnect = disconnectMock;
      unobserve = jest.fn();
    };

    const onUpdate = jest.fn();
    setWindowSize(1920, 1080);
    const observer = createObserver(onUpdate, 0);

    expect(observeMock).toHaveBeenCalledWith(document.documentElement);

    Date.now = () => 2000;
    setWindowSize(1024, 768);
    resizeCallback!();
    jest.advanceTimersByTime(10);

    expect(onUpdate).toHaveBeenCalledWith(1024, 768);

    observer.destroy();
    expect(disconnectMock).toHaveBeenCalled();
    Date.now = now;
  });

  it("accepts custom breakpoints for matchMedia", () => {
    const onUpdate = jest.fn();
    const observer = createObserver(onUpdate, 100, [500, 1000, 1500]);
    expect(observer).toHaveProperty("destroy");
    observer.destroy();
  });

  it("calls onUpdate on screen.orientation change", () => {
    const now = Date.now;
    Date.now = () => 1000;

    // Force setTimeout fallback for deferred notify
    const origRAF = globalThis.requestAnimationFrame;
    (globalThis as any).requestAnimationFrame = undefined;

    const listeners: Record<string, Set<() => void>> = {};
    const mockOrientation = {
      addEventListener: (type: string, handler: () => void) => {
        if (!listeners[type]) listeners[type] = new Set();
        listeners[type].add(handler);
      },
      removeEventListener: (type: string, handler: () => void) => {
        listeners[type]?.delete(handler);
      },
    };
    const origOrientation = Object.getOwnPropertyDescriptor(
      screen,
      "orientation",
    );
    Object.defineProperty(screen, "orientation", {
      configurable: true,
      value: mockOrientation,
    });

    const onUpdate = jest.fn();
    setWindowSize(600, 800);
    const observer = createObserver(onUpdate, 0);

    Date.now = () => 2000;
    setWindowSize(800, 600);
    listeners["change"]?.forEach((fn) => fn());
    jest.advanceTimersByTime(100);

    expect(onUpdate).toHaveBeenCalledWith(800, 600);

    observer.destroy();
    expect(listeners["change"]?.size ?? 0).toBe(0);

    if (origOrientation) {
      Object.defineProperty(screen, "orientation", origOrientation);
    } else {
      delete (screen as any).orientation;
    }
    globalThis.requestAnimationFrame = origRAF;
    Date.now = now;
  });

  it("falls back to window orientationchange when screen.orientation is unavailable", () => {
    const now = Date.now;
    Date.now = () => 1000;

    const origRAF = globalThis.requestAnimationFrame;
    (globalThis as any).requestAnimationFrame = undefined;

    const origOrientation = Object.getOwnPropertyDescriptor(
      screen,
      "orientation",
    );
    Object.defineProperty(screen, "orientation", {
      configurable: true,
      value: undefined,
    });

    const onUpdate = jest.fn();
    setWindowSize(600, 800);
    const observer = createObserver(onUpdate, 0);

    Date.now = () => 2000;
    setWindowSize(800, 600);
    window.dispatchEvent(new Event("orientationchange"));
    jest.advanceTimersByTime(100);

    expect(onUpdate).toHaveBeenCalledWith(800, 600);

    observer.destroy();

    // Verify cleanup: dispatch again, should not notify
    onUpdate.mockClear();
    Date.now = () => 3000;
    window.dispatchEvent(new Event("orientationchange"));
    jest.advanceTimersByTime(100);
    expect(onUpdate).not.toHaveBeenCalled();

    if (origOrientation) {
      Object.defineProperty(screen, "orientation", origOrientation);
    } else {
      delete (screen as any).orientation;
    }
    globalThis.requestAnimationFrame = origRAF;
    Date.now = now;
  });

  it("registers matchMedia orientation query listener", () => {
    const now = Date.now;
    Date.now = () => 1000;

    const origRAF = globalThis.requestAnimationFrame;
    (globalThis as any).requestAnimationFrame = undefined;

    const handlers: Map<string, () => void> = new Map();
    const origMatchMedia = window.matchMedia;
    (window as any).matchMedia = (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: (_: string, handler: () => void) => {
        handlers.set(query, handler);
      },
      removeEventListener: () => {},
      dispatchEvent: () => false,
    });

    const onUpdate = jest.fn();
    setWindowSize(600, 800);
    const observer = createObserver(onUpdate, 0);

    const orientationHandler = handlers.get("(orientation: portrait)");
    expect(orientationHandler).toBeDefined();

    Date.now = () => 2000;
    setWindowSize(800, 600);
    orientationHandler!();
    jest.advanceTimersByTime(100);

    expect(onUpdate).toHaveBeenCalledWith(800, 600);

    observer.destroy();
    (window as any).matchMedia = origMatchMedia;
    globalThis.requestAnimationFrame = origRAF;
    Date.now = now;
  });
});
