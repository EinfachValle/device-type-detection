# Playgrounds

The project includes two playgrounds for testing the library interactively. Both show the same information — device type, orientation, viewport dimensions, and all boolean flags — updating live as you resize the browser.

## Quick Start

From the project root:

```bash
# Vanilla (plain HTML, no build tools)
npm run playground:vanilla

# React (Vite + React 19)
npm run playground:react
```

Both commands build the library first, so you always test against the latest source.

## Vanilla Playground

**Location:** `playground/vanilla/`

**How it works:** A single HTML file that imports the library directly via ES module:

```html
<script type="module">
  import { createDeviceDetector } from "../../dist/index.js";
</script>
```

The `npm start` script in `playground/vanilla/package.json` runs `npx serve` from the project root, which makes the relative import path `../../dist/index.js` resolve correctly.

**Start:**

```bash
npm run playground:vanilla
# or manually:
npm run build
cd playground/vanilla
npm start
```

Opens at **http://localhost:3000/playground/vanilla/**

**Best for:** Quick testing without any build tooling. Edit the HTML, refresh the browser.

## React Playground

**Location:** `playground/react/`

**How it works:** A proper Vite + React 19 project. The library is linked as a local dependency:

```json
{
  "dependencies": {
    "device-type-detection": "file:../../"
  }
}
```

The React integration uses `useSyncExternalStore` — 4 lines, no wrapper library needed:

```tsx
function useDeviceDetection() {
  const storeRef = useRef(createDeviceDetector());
  return useSyncExternalStore(
    (cb) => storeRef.current.subscribe(cb),
    () => storeRef.current.getState(),
  );
}
```

**Start:**

```bash
npm run playground:react
# or manually:
npm run build
cd playground/react
npm install
npm run dev
```

Opens at **http://localhost:5173**

**Best for:** Testing how the library integrates with React, including hot module replacement during development.

## What You See

Both playgrounds display:

- **Device Type** — current `DeviceCategory` (e.g., `desktop`, `mobile_l`, `tablet_m`)
- **Orientation** — `portrait` or `landscape`
- **Viewport** — current width x height in pixels
- **Touch** — whether the device supports touch
- **Flags** — all 18 boolean flags with active/inactive status highlighted

Resize the browser window to see everything update in real-time.

## Adding a New Playground

To create a playground for another framework (Vue, Svelte, Angular, etc.):

1. Create `playground/<framework>/` with its own `package.json`
2. Add `"device-type-detection": "file:../../"` as a dependency
3. Use the store API — `createDeviceDetector()` returns `{ getState, subscribe, destroy }` which maps to any framework's reactive primitives
4. Add a script to the root `package.json`:
   ```json
   "playground:<framework>": "npm run build && cd playground/<framework> && npm install && npm run dev"
   ```
5. If you want E2E tests, add a web server entry in `playwright.config.ts` and create `e2e/<framework>.spec.ts`
