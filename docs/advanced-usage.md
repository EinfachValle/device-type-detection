# Advanced Usage

This guide covers advanced topics beyond the [Quick Start](../README.md#quick-start). For API reference and basic usage, see the [README](../README.md).

## Custom Breakpoints

Override any breakpoint threshold via the `breakpoints` option. Unspecified breakpoints keep their defaults.

```typescript
import { createDeviceDetector } from "device-type-detection";

const detector = createDeviceDetector({
  breakpoints: {
    tabletS: 768, // default: 834
    desktop: 1600, // default: 1920
  },
});
```

**How overrides affect detection:** The viewport cascade compares the current width against each breakpoint in descending order. Changing `desktop` from 1920 to 1600 means any viewport wider than 1600 (but <= 3840) is classified as `tv` instead of `desktop`. Think through the full cascade when overriding.

Default breakpoints for reference:

| Key       | Default (px) | Cascade boundary                        |
| --------- | ------------ | --------------------------------------- |
| `mobileS` | 380          | <= 380 = `mobile_s`                     |
| `mobileM` | 480          | <= 480 = `mobile_m`                     |
| `tabletS` | 834          | <= 834 = `tablet_s`                     |
| `tabletM` | 1024         | <= 1024 = `tablet_m`                    |
| `tabletL` | 1366         | <= 1366 = `tablet_l` (viewport cascade) |
| `laptop`  | 1400         | <= 1400 = `laptop`                      |
| `desktop` | 1920         | <= 1920 = `desktop`                     |
| `tv`      | 3840         | <= 3840 = `tv`, > 3840 = `tv_4k`        |

**Example: E-commerce with split tablet breakpoint**

```typescript
const detector = createDeviceDetector({
  breakpoints: {
    tabletS: 768, // iPad Mini and smaller tablets
    tabletM: 1080, // iPad Air / standard tablets
  },
});
```

## Throttle Tuning

Resize events fire rapidly during window resizing. The `throttleMs` option controls how often the detector recalculates. Default is **150ms** with leading-edge execution and a trailing call.

- **Leading edge:** The first resize event fires immediately, so the UI responds without delay.
- **Trailing call:** After throttling ends, one final recalculation runs to ensure the final viewport size is captured.

```typescript
// Fast updates for resize animations (more CPU, smoother)
const detector = createDeviceDetector({ throttleMs: 50 });

// Relaxed updates for analytics tracking (less CPU)
const detector = createDeviceDetector({ throttleMs: 500 });
```

**When to adjust:**

- Lower (50-100ms) when you animate or transition based on device type changes
- Higher (300-500ms) when you only log or track device type for analytics
- Default (150ms) is a good balance for most UI-driven use cases

## Multiple Detectors

You can run multiple detectors simultaneously with different configurations. Each instance is independent with its own listeners and state.

```typescript
const navDetector = createDeviceDetector({
  breakpoints: { tabletM: 900 }, // Navigation collapses earlier
});

const gridDetector = createDeviceDetector({
  breakpoints: { desktop: 1600 }, // Grid switches at a wider viewport
});

// Each has its own state
navDetector.subscribe((state) => updateNavigation(state));
gridDetector.subscribe((state) => updateGrid(state));

// Clean up both when done
navDetector.destroy();
gridDetector.destroy();
```

## Pure Detection Function

`detectDeviceType()` is a pure function with zero browser dependencies. It takes explicit input and returns a `DeviceState` — no globals, no side effects.

```typescript
import {
  DEFAULT_BREAKPOINTS,
  detectDeviceType,
  parseUserAgent,
} from "device-type-detection";

const state = detectDeviceType({
  width: 1024,
  height: 768,
  uaMobile: false,
  uaTablet: true,
  uaIPad: false,
  touchCapable: true,
  breakpoints: DEFAULT_BREAKPOINTS,
});

console.log(state.deviceType); // 'tablet_m'
console.log(state.isTablet); // true
```

### Server-side detection from request headers

```typescript
import {
  DEFAULT_BREAKPOINTS,
  detectDeviceType,
  parseUserAgent,
} from "device-type-detection";

function detectFromRequest(req: Request): DeviceState {
  const ua = req.headers.get("user-agent") || "";
  const parsed = parseUserAgent(ua, 0); // no maxTouchPoints on server

  return detectDeviceType({
    width: parsed.isMobile ? 390 : parsed.isTablet ? 1024 : 1920,
    height: parsed.isMobile ? 844 : parsed.isTablet ? 768 : 1080,
    uaMobile: parsed.isMobile,
    uaTablet: parsed.isTablet,
    uaIPad: parsed.isIPad,
    touchCapable: parsed.isMobile || parsed.isTablet,
    breakpoints: DEFAULT_BREAKPOINTS,
  });
}
```

### Unit testing with pure detection

Since `detectDeviceType` needs no DOM, you can test device-dependent logic without browser mocks:

```typescript
import { DEFAULT_BREAKPOINTS, detectDeviceType } from "device-type-detection";

test("shows mobile layout for small phones", () => {
  const state = detectDeviceType({
    width: 360,
    height: 640,
    uaMobile: true,
    uaTablet: false,
    uaIPad: false,
    touchCapable: true,
    breakpoints: DEFAULT_BREAKPOINTS,
  });

  expect(state.isMobile).toBe(true);
  expect(state.deviceType).toBe("mobile_m");
});
```

## Avoiding Memory Leaks

Every `createDeviceDetector()` call registers browser event listeners (ResizeObserver, window resize, matchMedia, screen.orientation). Always call `destroy()` when the detector is no longer needed.

### Vanilla JS

```typescript
const detector = createDeviceDetector();

// When your component/page is torn down:
detector.destroy();
```

### React

```tsx
import { useEffect, useRef, useSyncExternalStore } from "react";

import { createDeviceDetector } from "device-type-detection";

function useDeviceDetection() {
  const storeRef = useRef<ReturnType<typeof createDeviceDetector>>(null);
  if (!storeRef.current) {
    storeRef.current = createDeviceDetector();
  }

  useEffect(() => {
    return () => storeRef.current?.destroy();
  }, []);

  return useSyncExternalStore(
    (cb) => storeRef.current!.subscribe(cb),
    () => storeRef.current!.getState(),
  );
}
```

### Vue

```vue
<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { createDeviceDetector } from "device-type-detection";

const state = ref(null);
let detector;

onMounted(() => {
  detector = createDeviceDetector();
  state.value = detector.getState();
  detector.subscribe((s) => {
    state.value = s;
  });
});

onUnmounted(() => detector?.destroy());
</script>
```

## Observer Behavior

The observation layer uses **ResizeObserver and window resize events complementarily** (not as a fallback). This is intentional:

- **ResizeObserver** detects changes to `document.documentElement` size, including CSS-driven layout changes.
- **Window resize event** catches viewport changes that ResizeObserver may miss on mobile browsers with dynamic toolbars (e.g., Safari's collapsing address bar changes `window.innerHeight` without triggering ResizeObserver).

Additionally, `matchMedia` listeners fire at each breakpoint boundary, and `screen.orientation` change events catch device rotation. All listeners are cleaned up by `destroy()`.
