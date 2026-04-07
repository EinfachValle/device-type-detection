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
});
