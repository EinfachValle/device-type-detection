# v2.1.0 — Constants, orientation fix, and playground redesign

## Highlights

- **No more magic strings** — all device types and orientations are exported constants (`MOBILE_S`, `DESKTOP`, `ORIENTATION_PORTRAIT`, etc.)
- **Improved orientation detection** — `notifyDeferred()` waits for browser dimensions to update after rotation, with legacy `orientationchange` fallback
- **IIFE build** — `DeviceTypeDetection` global for script-tag usage
- **Playground redesign** — new landing page, integration dialog, PWA support, and additional device presets

## New Exports

```typescript
import {
  DEFAULT_SSR_DEVICE_TYPE,
  DEFAULT_THROTTLE_MS,
  DESKTOP,
  DEVICE_CATEGORIES,
  LAPTOP,
  MOBILE_L,
  MOBILE_M,
  MOBILE_S,
  ORIENTATION_LANDSCAPE,
  ORIENTATION_PORTRAIT,
  SSR_DIMENSIONS,
  TABLET_L,
  TABLET_M,
  TABLET_S,
  TV,
  TV_4K,
} from "device-type-detection";
```

## Interactive Demo

**<https://einfachvalle.github.io/device-type-detection/>**

Redesigned with landing page, integration dialog, and device presets.

## Script Tag Usage (IIFE)

```html
<script src="https://unpkg.com/device-type-detection/playground/public/index.global.js"></script>
<script>
  const detector = DeviceTypeDetection.createDeviceDetector();
  console.log(detector.getState().deviceType);
</script>
```
