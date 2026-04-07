# device-type-detection

Framework-agnostic device type detection with live resize, SSR support, and zero dependencies.

[![npm version](https://img.shields.io/npm/v/device-type-detection.svg)](https://www.npmjs.com/package/device-type-detection)
[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://einfachvalle.github.io/device-type-detection/)

**[Interactive Demo](https://einfachvalle.github.io/device-type-detection/)** — try device presets, drag to resize, see detection in real-time.

## Features

- **Zero dependencies** — no React, no lodash, no runtime bloat
- **Framework-agnostic** — works with vanilla JS, React, Vue, Svelte, or anything else
- **Live resize** — device type updates instantly when the viewport changes, no reload needed
- **10 device categories** — mobile (S/M/L), tablet (S/M/L), laptop, desktop, TV, 4K TV
- **Orientation detection** — portrait/landscape with combined flags (e.g. `isMobileVertical`)
- **UA + viewport detection** — combines User-Agent parsing with viewport measurements
- **SSR-safe** — returns sensible defaults in server environments
- **Configurable breakpoints** — override any breakpoint threshold
- **Tiny** — ~9 KB ESM, ~10 KB CJS (uncompressed)
- **TypeScript** — full type definitions included

## Installation

```bash
npm install device-type-detection
```

## Quick Start

```typescript
import { createDeviceDetector } from "device-type-detection";

const detector = createDeviceDetector();

// Read current state
const state = detector.getState();
console.log(state.deviceType); // 'desktop', 'mobile_l', 'tablet_m', etc.
console.log(state.isMobile); // true/false
console.log(state.orientation); // 'portrait' | 'landscape'

// Subscribe to live changes
const unsubscribe = detector.subscribe((state, prev) => {
  console.log(`Changed: ${prev.deviceType} → ${state.deviceType}`);
});

// Clean up when done
unsubscribe();
detector.destroy();
```

## Framework Integration

The store-based API works with any framework in a few lines:

### React

```tsx
import { useRef, useSyncExternalStore } from "react";

import { createDeviceDetector } from "device-type-detection";

function useDeviceDetection() {
  const store = useRef(createDeviceDetector()).current;
  return useSyncExternalStore(
    (cb) => store.subscribe(cb),
    () => store.getState(),
  );
}

function App() {
  const { isMobile, deviceType, orientation } = useDeviceDetection();
  return (
    <div>
      {isMobile ? "Mobile" : deviceType} — {orientation}
    </div>
  );
}
```

### Vue

```vue
<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { createDeviceDetector } from 'device-type-detection';

const state = ref(null);
let detector;

onMounted(() => {
  detector = createDeviceDetector();
  state.value = detector.getState();
  detector.subscribe((s) => { state.value = s; });
});

onUnmounted(() => detector?.destroy());
</script>

<template>
  <div v-if="state">{{ state.deviceType }} — {{ state.orientation }}</div>
</template>
```

### Svelte

```svelte
<script>
  import { createDeviceDetector } from 'device-type-detection';
  import { readable } from 'svelte/store';

  const device = readable(null, (set) => {
    const store = createDeviceDetector();
    set(store.getState());
    const unsub = store.subscribe((s) => set(s));
    return () => { unsub(); store.destroy(); };
  });
</script>

{#if $device}
  <p>{$device.deviceType} — {$device.orientation}</p>
{/if}
```

## API

### `createDeviceDetector(options?)`

Creates a detector instance. Returns a `DeviceStore`:

```typescript
interface DeviceStore {
  getState(): DeviceState;
  subscribe(
    listener: (state: DeviceState, prev: DeviceState) => void,
  ): () => void;
  destroy(): void;
}
```

### Options

```typescript
interface DetectorOptions {
  breakpoints?: Partial<BreakpointConfig>; // Override individual breakpoints
  throttleMs?: number; // Resize throttle (default: 150)
  ssrDeviceType?: DeviceCategory; // SSR default (default: 'desktop')
}
```

### `DeviceState`

| Property             | Type             | Description                                                                                                                                      |
| -------------------- | ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `deviceType`         | `DeviceCategory` | `'mobile_s'` \| `'mobile_m'` \| `'mobile_l'` \| `'tablet_s'` \| `'tablet_m'` \| `'tablet_l'` \| `'laptop'` \| `'desktop'` \| `'tv'` \| `'tv_4k'` |
| `orientation`        | `Orientation`    | `'portrait'` \| `'landscape'`                                                                                                                    |
| `touchDevice`        | `boolean`        | `navigator.maxTouchPoints > 0`                                                                                                                   |
| `width`              | `number`         | Current viewport width                                                                                                                           |
| `height`             | `number`         | Current viewport height                                                                                                                          |
| `isMobile`           | `boolean`        | Any mobile device                                                                                                                                |
| `isMobileS`          | `boolean`        | Small mobile (width <= 380)                                                                                                                      |
| `isMobileM`          | `boolean`        | Medium mobile (width <= 480)                                                                                                                     |
| `isMobileL`          | `boolean`        | Large mobile (width > 480, UA mobile)                                                                                                            |
| `isTablet`           | `boolean`        | Any tablet device                                                                                                                                |
| `isTabletS`          | `boolean`        | Small tablet (width <= 834)                                                                                                                      |
| `isTabletM`          | `boolean`        | Medium tablet (width <= 1024)                                                                                                                    |
| `isTabletL`          | `boolean`        | Large tablet (width > 1024)                                                                                                                      |
| `isLaptop`           | `boolean`        | Laptop (1367–1400)                                                                                                                               |
| `isDesktop`          | `boolean`        | Desktop (1401–1920)                                                                                                                              |
| `isTV`               | `boolean`        | TV (1921–3840)                                                                                                                                   |
| `isTV4K`             | `boolean`        | 4K TV (> 3840)                                                                                                                                   |
| `isPortrait`         | `boolean`        | Height > width                                                                                                                                   |
| `isLandscape`        | `boolean`        | Width >= height                                                                                                                                  |
| `isMobileVertical`   | `boolean`        | Mobile + portrait                                                                                                                                |
| `isMobileHorizontal` | `boolean`        | Mobile + landscape                                                                                                                               |
| `isTabletVertical`   | `boolean`        | Tablet + portrait                                                                                                                                |
| `isTabletHorizontal` | `boolean`        | Tablet + landscape                                                                                                                               |

### Default Breakpoints

| Breakpoint | Width (px) |
| ---------- | ---------- |
| `mobileS`  | 380        |
| `mobileM`  | 480        |
| `tabletS`  | 834        |
| `tabletM`  | 1024       |
| `tabletL`  | 1366       |
| `laptop`   | 1400       |
| `desktop`  | 1920       |
| `tv`       | 3840       |

### Custom Breakpoints

```typescript
const detector = createDeviceDetector({
  breakpoints: {
    mobileS: 320,
    desktop: 1600,
  },
});
```

### Pure Detection Function

For advanced use cases, you can use the detection function directly without any browser dependencies:

```typescript
import { detectDeviceType } from "device-type-detection";

const state = detectDeviceType({
  width: 1024,
  height: 768,
  uaMobile: false,
  uaTablet: true,
  uaIPad: false,
  touchCapable: true,
  breakpoints: DEFAULT_BREAKPOINTS,
});
```

### SSR

```typescript
import {
  createDeviceDetector,
  getSSRDefaults,
  isSSR,
} from "device-type-detection";

// Option A: Factory handles SSR automatically
const detector = createDeviceDetector({ ssrDeviceType: "mobile_s" });

// Option B: Manual SSR defaults
if (isSSR()) {
  const state = getSSRDefaults("mobile_s");
}
```

## Detection Logic

1. **UA-based mobile** — User-Agent says mobile + touch + not iPad → `mobile_s` / `mobile_m` / `mobile_l` by width
2. **UA-based tablet** — User-Agent says tablet or iPad + touch → `tablet_s` / `tablet_m` / `tablet_l` by width
3. **Viewport cascade** — Otherwise: `tv_4k` > `tv` > `desktop` > `laptop` > `tablet_l` > `tablet_m` > `tablet_s` > `mobile_m` > `mobile_s`

## Development

```bash
npm install
npm run build        # Build ESM + CJS + types
npm test             # Unit tests (Jest)
npm run test:e2e     # E2E tests (Playwright)
```

### Playground

Interactive demo with device presets, drag-to-resize, and live detection:

```bash
npm run playground
```

Opens at <http://localhost:5173>. Also deployed to GitHub Pages.

## License

MIT
