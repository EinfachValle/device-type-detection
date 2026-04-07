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

Opens at **http://localhost:5173**.

## What You See

- **Device presets sidebar** -- click any preset to simulate that device's viewport
- **Drag-to-resize** -- grab the iframe edge to set a custom viewport size
- **Detection panel** -- live display of device type, orientation, viewport dimensions, touch capability, and all boolean flags

## Deployment

The playground is deployed to GitHub Pages for public access without needing to clone the repository.
