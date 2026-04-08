# Playground

An interactive Vite + React + MUI application for testing the device-type-detection library. Located in `playground/`.

The playground uses an iframe loaded with `demo.html` to run the detection library in an authentic browser context. A sidebar provides device presets (phones, tablets, laptops, desktops, TVs) that resize the iframe to match real device dimensions. You can also drag to resize the iframe freely and watch the detection panel update in real time.

## Quick Start

From the project root:

```bash
npm run playground
```

This builds the library, installs playground dependencies, and starts the Vite dev server.

## Manual Start

```bash
npm run build
cd playground
npm install
npm run dev
```

Opens at **<http://localhost:5173>**.

## What You See

- **Device presets sidebar** -- click any preset to simulate that device's viewport. Mobile presets simulate a mobile User Agent, tablet presets simulate a tablet UA, so detection matches real devices (e.g. rotated iPhone correctly shows `mobile_l landscape`).
- **Drag-to-resize** -- grab the iframe edge to set a custom viewport size
- **Rotate button** -- swaps width/height (only visible for mobile and tablet devices)
- **Detection panel** -- live display of device type, orientation, viewport dimensions, touch capability, and all boolean flags
- **Integration dialog** -- "Show Integration Code" button opens a dialog with:
  - Package manager selector (npm/yarn/pnpm/bun) with copy-able install command
  - Framework selector (Vanilla/React/Vue/Svelte) with `simple-icons` logos
  - TS/JS toggle for typed vs untyped code examples
  - AI prompt tab for copy-pasting into Claude Code or other AI tools
- **Theme toggle** -- light/dark/system mode (pinned at sidebar bottom)
- **Version badge** -- shows current library version from `package.json` next to "Playground"

## Landing page (demo.html)

The iframe content (`playground/public/demo.html`) is a responsive landing page that uses the library's IIFE bundle (`index.global.js`). It showcases live detection with a hero section, breakpoint scale, detection flags dashboard, feature cards, and a quick-start code snippet. Supports dark/light theme via `postMessage` from the parent. UA simulation is passed via `?ua=mobile|tablet` URL parameter.

## Deployment

The playground is deployed to GitHub Pages for public access without needing to clone the repository.
