# Changelog

## [2.1.1] - 2026-04-08

### Fixed

- TV detection now uses User-Agent instead of viewport width — WQHD (2560px) and 4K (3840px) monitors correctly detect as "desktop", not "tv"
- Viewport-only fallback cascade maxes out at "desktop" — tv/tv_4k only reachable via Smart TV UA (Tizen, WebOS, FireTV, Roku, etc.)
- Playground viewport resize now updates detected device type in real-time via postMessage
- Manual resize clears UA simulation so detection matches actual viewport dimensions
- Drag-to-resize works smoothly over iframe (pointer-events: none during drag)
- Breakpoint scale in demo shows all 10 device categories (was missing mobile_l)
- Scrollbar in demo uses accent color that updates with device type changes
- Playground defaults to matching preset for current device (desktop users see Full HD)

### Added

- `isTV` field in `UAResult` from `parseUserAgent()` — detects Smart TV browsers
- `uaTV` field in `DetectionInput` for `detectDeviceType()`
- TV UA simulation in playground (Samsung Tizen) for Smart TV presets
- Auto-scale: iframe scales down to fit available canvas space with zoom % indicator
- New E2E tests verifying detection updates on preset switch, dimension input, rotation, and iframe sync

### Changed

- Detection cascade: new step 3 (UA TV) before viewport fallback
- Viewport fallback no longer returns tv/tv_4k — maximum is desktop
- Playground presets: WQHD/4K moved to Desktop group, TV group uses Smart TV UA simulation
- Default preset matches actual device (was hardcoded to iPhone 15 Pro Max)

## [2.1.0] - 2026-04-08

### Added

- `src/constants/` module — all device type strings, orientations, and defaults as exported constants (no more magic strings)
- Exported constants: `MOBILE_S`, `MOBILE_M`, ..., `TV_4K`, `DEVICE_CATEGORIES`, `ORIENTATION_PORTRAIT`, `ORIENTATION_LANDSCAPE`, `DEFAULT_THROTTLE_MS`, `DEFAULT_SSR_DEVICE_TYPE`, `SSR_DIMENSIONS`
- `notifyDeferred()` in observe layer — uses `requestAnimationFrame` to wait for dimensions after orientation change
- Legacy `orientationchange` event fallback when `screen.orientation` API is unavailable
- `matchMedia("(orientation: portrait)")` listener for reliable cross-browser orientation detection
- IIFE build output (`playground/public/index.global.js`) exposing `DeviceTypeDetection` global
- Playground: redesigned with landing page, integration dialog, PWA manifest, and new device presets
- Constants test suite (70 specs)
- Orientation observer tests (3 new specs)

### Changed

- All source modules now import device type strings from `src/constants/` instead of using string literals
- Observe layer uses `DEFAULT_BREAKPOINTS` values instead of hardcoded breakpoint array
- `create-detector` imports `DEFAULT_THROTTLE_MS` and `DEFAULT_SSR_DEVICE_TYPE` from constants
- `tsup.config.ts` extended with IIFE build configuration

## [2.0.0] - 2026-04-07

### Added

- Framework-agnostic store-based API (`createDeviceDetector()` returning `{ getState, subscribe, destroy }`)
- 10 device categories: mobile_s, mobile_m, mobile_l, tablet_s, tablet_m, tablet_l, laptop, desktop, tv, tv_4k
- Pure detection function `detectDeviceType()` with no browser dependencies
- Own UA parser replacing react-device-detect (regex-based mobile/tablet/iPad detection)
- Own throttle implementation replacing lodash (leading-edge with trailing, cancel support)
- Browser observation layer: ResizeObserver + resize event + matchMedia + screen.orientation
- SSR support with `isSSR()`, `getSSRDefaults()`, and configurable `ssrDeviceType` option
- Configurable breakpoints via `DetectorOptions.breakpoints`
- Configurable resize throttle via `DetectorOptions.throttleMs`
- Orientation detection as separate field with combined flags (isMobileVertical, isTabletHorizontal, etc.)
- Shallow equality to prevent redundant subscriber notifications
- Full TypeScript type definitions (DeviceState, DeviceCategory, DeviceStore, DetectorOptions, etc.)
- Interactive playground with MUI, device presets, drag-to-resize, and live detection panel
- GitHub Pages deployment for playground demo
- Playwright E2E tests (8 specs)
- Jest unit tests (144 specs, 94% coverage)
- ESLint v9 flat config + Prettier formatting
- CLAUDE.md for development guidance
- CONTRIBUTING.md with project setup guidelines

### Changed

- API: `useDeviceType()` React hook → `createDeviceDetector()` store
- `deviceType` no longer includes orientation suffix (e.g. `desktop` instead of `desktop_HORIZONTAL`)
- Boolean flags derived directly from `deviceType` (fixes v1 bug where flags were always false)
- All device types always active (removed `lowerFunctionality` flag)
- Build: webpack → tsup (ESM + CJS dual output)
- Tests: single test file → co-located tests per module

### Removed

- React, react-dom, lodash, react-device-detect as peer/runtime dependencies
- `useDeviceType()` hook (replaced by `createDeviceDetector()`)
- `lowerFunctionality` option
- `DeviceType` enum with orientation suffixes (replaced by `DeviceCategory` union type)

## [1.0.1] - 2025-12-01

### Changed

- Externalized dependencies in build output

## [1.0.0] - 2025-11-15

### Added

- Initial release as React hook (`useDeviceType()`)
- Device detection based on viewport width and User-Agent
- Basic breakpoint configuration
