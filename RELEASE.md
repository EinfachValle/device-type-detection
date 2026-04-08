# v2.1.1 — TV detection via User-Agent, playground fixes

## Highlights

- **TV detection via UA** — Smart TVs (Tizen, WebOS, FireTV, Roku, etc.) are now detected by User-Agent, not viewport width
- **WQHD/4K = desktop** — viewport-only fallback maxes out at "desktop", no false "tv" classification
- **Playground fixes** — resize updates detection in real-time, auto-scaling, smooth drag, correct defaults

## Breaking Change from 2.1.0

The viewport-only detection cascade no longer returns `tv` or `tv_4k`. These device types are now **only reachable via Smart TV User-Agent**. If you relied on `isTV` or `isTV4K` being `true` for wide desktop monitors, they will now be `isDesktop: true`.

### Before (2.1.0)

```text
2560px desktop monitor → deviceType: "tv"     ← wrong
3840px 4K monitor      → deviceType: "tv"     ← wrong
```

### After (2.1.1)

```text
2560px desktop monitor → deviceType: "desktop" ← correct
3840px 4K monitor      → deviceType: "desktop" ← correct
Samsung Tizen TV       → deviceType: "tv"      ← correct (via UA)
```

## New API Fields

`parseUserAgent()` now returns `isTV: boolean`:

```typescript
const ua = parseUserAgent(navigator.userAgent, navigator.maxTouchPoints);
// ua.isTV — true for Smart TV browsers (Tizen, WebOS, FireTV, Roku, etc.)
```

`detectDeviceType()` accepts `uaTV: boolean`:

```typescript
const state = detectDeviceType({
  width: 1920,
  height: 1080,
  uaTV: true, // ← new
  // ... other fields
});
// state.deviceType === "tv"
```

## Detection Cascade

```text
1. UA mobile + touch + !iPad  → mobile_s / mobile_m / mobile_l
2. UA tablet/iPad + touch     → tablet_s / tablet_m / tablet_l
3. UA TV                      → tv / tv_4k                      ← NEW
4. Viewport-only              → mobile_s ... desktop (max)       ← CHANGED
```
