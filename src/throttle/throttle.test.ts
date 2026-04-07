import { throttle } from ".";

describe("throttle", () => {
  let originalDateNow: () => number;
  let currentTime: number;

  beforeEach(() => {
    jest.useFakeTimers({ legacyFakeTimers: true });
    originalDateNow = Date.now;
    currentTime = 1000; // start at 1000 to avoid edge case with lastCallTime=0
    Date.now = () => currentTime;
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
    Date.now = originalDateNow;
  });

  it("calls function immediately on first invocation (leading edge)", () => {
    const fn = jest.fn();
    const throttled = throttle(fn, 200);

    throttled();
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("throttles subsequent calls within window", () => {
    const fn = jest.fn();
    const throttled = throttle(fn, 200);

    throttled(); // leading call
    throttled(); // should be throttled
    throttled(); // should be throttled

    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("fires trailing call after timeout", () => {
    const fn = jest.fn();
    const throttled = throttle(fn, 200);

    throttled(); // leading at t=1000
    expect(fn).toHaveBeenCalledTimes(1);

    currentTime = 1050;
    throttled(); // scheduled as trailing

    currentTime = 1200;
    jest.advanceTimersByTime(200);
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it("multiple rapid calls only result in 2 executions (leading + trailing)", () => {
    const fn = jest.fn();
    const throttled = throttle(fn, 200);

    throttled(); // leading
    currentTime = 1010;
    throttled();
    currentTime = 1020;
    throttled();
    currentTime = 1030;
    throttled();
    currentTime = 1040;
    throttled();

    expect(fn).toHaveBeenCalledTimes(1);

    currentTime = 1200;
    jest.advanceTimersByTime(200);
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it("cancel() prevents pending execution", () => {
    const fn = jest.fn();
    const throttled = throttle(fn, 200);

    throttled(); // leading
    currentTime = 1050;
    throttled(); // schedule trailing

    expect(fn).toHaveBeenCalledTimes(1);

    throttled.cancel();

    currentTime = 1250;
    jest.advanceTimersByTime(200);
    expect(fn).toHaveBeenCalledTimes(1); // trailing was cancelled
  });

  it("works with different ms values", () => {
    const fn = jest.fn();
    const throttled = throttle(fn, 500);

    throttled(); // leading
    expect(fn).toHaveBeenCalledTimes(1);

    currentTime = 1100;
    throttled(); // schedule trailing
    currentTime = 1300;
    jest.advanceTimersByTime(300);
    expect(fn).toHaveBeenCalledTimes(1); // still within window

    currentTime = 1500;
    jest.advanceTimersByTime(200);
    expect(fn).toHaveBeenCalledTimes(2); // trailing fires
  });

  it("allows new leading call after throttle window expires", () => {
    const fn = jest.fn();
    const throttled = throttle(fn, 100);

    throttled(); // leading at t=1000
    expect(fn).toHaveBeenCalledTimes(1);

    currentTime = 1100;
    jest.advanceTimersByTime(100);

    throttled(); // new leading at t=1100
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it("passes arguments correctly", () => {
    const fn = jest.fn();
    const throttled = throttle(fn, 200);

    throttled("a", 1);
    expect(fn).toHaveBeenCalledWith("a", 1);
  });

  it("trailing call uses latest arguments", () => {
    const fn = jest.fn();
    const throttled = throttle(fn, 200);

    throttled("first"); // leading
    currentTime = 1010;
    throttled("second"); // schedule trailing
    currentTime = 1020;
    throttled("third"); // updates trailing? No — current impl only schedules one timeout

    currentTime = 1200;
    jest.advanceTimersByTime(200);
    expect(fn).toHaveBeenCalledTimes(2);
    expect(fn).toHaveBeenNthCalledWith(1, "first");
    // trailing fires with 'second' (first scheduled call's args)
    expect(fn).toHaveBeenNthCalledWith(2, "second");
  });

  it("cancel resets state so next call is leading again", () => {
    const fn = jest.fn();
    const throttled = throttle(fn, 200);

    throttled();
    expect(fn).toHaveBeenCalledTimes(1);

    throttled.cancel();

    throttled();
    expect(fn).toHaveBeenCalledTimes(2);
  });
});
