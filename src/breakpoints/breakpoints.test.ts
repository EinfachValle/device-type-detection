import { DEFAULT_BREAKPOINTS } from ".";
import type { BreakpointConfig } from "../types";

describe("DEFAULT_BREAKPOINTS", () => {
  it("exports a BreakpointConfig object", () => {
    const bp: BreakpointConfig = DEFAULT_BREAKPOINTS;
    expect(bp).toBeDefined();
  });

  it("has all 8 breakpoint values", () => {
    expect(Object.keys(DEFAULT_BREAKPOINTS)).toHaveLength(8);
  });

  it("has correct default values", () => {
    expect(DEFAULT_BREAKPOINTS.mobileS).toBe(380);
    expect(DEFAULT_BREAKPOINTS.mobileM).toBe(480);
    expect(DEFAULT_BREAKPOINTS.tabletS).toBe(834);
    expect(DEFAULT_BREAKPOINTS.tabletM).toBe(1024);
    expect(DEFAULT_BREAKPOINTS.tabletL).toBe(1366);
    expect(DEFAULT_BREAKPOINTS.laptop).toBe(1400);
    expect(DEFAULT_BREAKPOINTS.desktop).toBe(1920);
    expect(DEFAULT_BREAKPOINTS.tv).toBe(3840);
  });

  it("breakpoints are in ascending order", () => {
    const values = Object.values(DEFAULT_BREAKPOINTS);
    for (let i = 1; i < values.length; i++) {
      expect(values[i]).toBeGreaterThan(values[i - 1]);
    }
  });

  it("all values are positive integers", () => {
    for (const value of Object.values(DEFAULT_BREAKPOINTS)) {
      expect(value).toBeGreaterThan(0);
      expect(Number.isInteger(value)).toBe(true);
    }
  });
});
