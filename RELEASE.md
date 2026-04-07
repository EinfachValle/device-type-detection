# v2.0.0 — Framework-agnostic rewrite with zero dependencies

## Highlights

- **Zero dependencies** — removed React, lodash, and react-device-detect
- **Framework-agnostic** — pure store-based API (`createDeviceDetector()`) works with any framework or vanilla JS
- **10 device categories** — mobile (S/M/L), tablet (S/M/L), laptop, desktop, TV, 4K TV
- **Live resize detection** — ResizeObserver + resize events, no page reload
- **UA + viewport detection** — combines User-Agent parsing with viewport measurements
- **SSR support** — sensible defaults in server environments
- **Configurable breakpoints & throttle** — override any threshold
- **Full TypeScript** — 23-property `DeviceState` with complete type definitions

## Interactive Demo

**<https://einfachvalle.github.io/device-type-detection/>**

Drag to resize, click device presets, see detection update in real-time.

## Quick Start

```bash
npm install device-type-detection
```

```typescript
import { createDeviceDetector } from "device-type-detection";

const detector = createDeviceDetector();
console.log(detector.getState().deviceType); // 'desktop', 'mobile_l', etc.

detector.subscribe((state, prev) => {
  console.log(`${prev.deviceType} → ${state.deviceType}`);
});
```

## Breaking Changes from v1

- API: `useDeviceType()` React hook → `createDeviceDetector()` store
- Removed peer dependencies: react, react-dom, lodash, react-device-detect
- `deviceType` no longer includes orientation suffix — orientation is a separate field
- `lowerFunctionality` flag removed — all device types always active
- Boolean flags fixed (v1 bug: flags were always false due to suffix mismatch)
