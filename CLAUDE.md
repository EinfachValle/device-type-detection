# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run build        # tsup -> dist/ (ESM + CJS + .d.ts)
npm test             # Jest unit tests (jsdom, fake timers enabled globally)
npm run test:e2e     # Playwright E2E tests (starts serve + Vite servers)
npm run lint         # ESLint (src, e2e, playground/react)
npm run format       # Prettier (all TS/TSX/JSON + config files)
```

Run a single test file:

```bash
npx jest src/detect/detect.test.ts
```

Run a single E2E spec:

```bash
npx playwright test e2e/vanilla.spec.ts
```

## Architecture

Zero-dependency, framework-agnostic device detection library. Core pattern: **pure detection function + reactive store**.

```text
createDeviceDetector(options?)     # Factory, returns DeviceStore
  ├─ parseUserAgent()              # One-time UA parse at creation
  ├─ detectDeviceType(input)       # Pure function, no globals
  ├─ createObserver(onUpdate)      # ResizeObserver + resize + matchMedia + orientation
  │    └─ throttle(fn, ms)         # Leading-edge with trailing, has .cancel()
  └─ shallowEqual(prev, next)     # Prevents redundant listener notifications
```

**Detection cascade** (in `src/detect/`):

1. UA says mobile + touch + not iPad -> mobile_s/m/l by width
2. UA says tablet/iPad + touch -> tablet_s/m/l by width
3. Viewport-only fallback: tv_4k > tv > desktop > laptop > tablet_l > ... > mobile_s

**SSR path**: If `typeof window === 'undefined'`, factory returns static state immediately — no listeners, no subscriptions.

## Module layout

Each module is a folder under `src/` with `index.ts` (source) and co-located `*.test.ts`. All public API re-exported through `src/index.ts`.

- **types/** — DeviceCategory, DeviceState, BreakpointConfig, DetectorOptions, DeviceStore
- **breakpoints/** — DEFAULT_BREAKPOINTS (8 thresholds: 380–3840px)
- **detect/** — Pure `detectDeviceType(input) -> DeviceState`, no browser APIs
- **ua-parser/** — Regex-based mobile/tablet/iPad detection from UA string
- **throttle/** — Own implementation replacing lodash, with `.cancel()` for cleanup
- **observe/** — Aggregates ResizeObserver, window resize, matchMedia, screen.orientation
- **ssr/** — `isSSR()`, `getSSRDefaults(category)` with consistent dimensions per device type
- **create-detector/** — Factory that wires everything together into a DeviceStore

## Key patterns

- **DeviceState has 23 properties**: deviceType (category without orientation suffix) + orientation as separate field. Boolean flags derived directly from deviceType — this was a deliberate fix from v1 where flags were always false due to suffix mismatch.
- **Shallow equality** in create-detector prevents unnecessary subscriber calls even on frequent resize events.
- **Observe layer** uses ResizeObserver + resize event complementarily (not as fallback) because mobile browsers with dynamic toolbars may only fire one or the other.
- **Tests mock `Date.now`** in throttle tests because Jest legacy fake timers don't mock it automatically.

## Config notes

- `"type": "module"` in package.json — Jest config must be `.cjs` extension
- ESLint uses flat config format (v9) in `eslint.config.js`
- Playwright spins up two web servers: serve on :3000 (vanilla), Vite on :5173 (React playground)
- Prettier uses `@trivago/prettier-plugin-sort-imports` for import ordering
