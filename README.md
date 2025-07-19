# device-type-detection

A tiny React hook in form of node module to detect device type and orientation in browsers. It supports mobile, tablet, desktop, TV, and 4K screens, exposing granular breakpoints and orientation flags.

[![npm version](https://img.shields.io/npm/v/device-type-detection.svg)](https://www.npmjs.com/package/device-type-detection)

## Features

- Detects **mobile** (small/medium/large), **tablet** (small/medium/large), **laptop**, **desktop**, **TV**, and **4K TV**
- Provides **portrait** vs. **landscape** orientation
- Touch detection via `navigator.maxTouchPoints` and `react-device-detect`
- Throttled resize listener for performance
- Full TypeScript support with declaration files

## Peer Dependencies

This package relies on the following peer dependencies. Make sure they are installed in your project:

- [react](https://www.npmjs.com/package/react)
- [react-dom](https://www.npmjs.com/package/react-dom)
- [lodash](https://www.npmjs.com/package/lodash)
- [react-device-detect](https://www.npmjs.com/package/react-device-detect)

<details>
<summary>With NPM</summary>

```bash
npm install react react-dom lodash react-device-detect
```

</details>

<details>
<summary>With Yarn</summary>

```bash
yarn add react react-dom lodash react-device-detect
```

</details>

## Installation

<details>
<summary>With NPM</summary>

```bash
npm install device-type-detection
```

</details>

<details>
<summary>With Yarn</summary>

```bash
yarn add device-type-detection
```

</details>

## Quick Start

```tsx
import React from "react";

import { useDeviceTypeDetection } from "device-type-detection";

const App: React.FC = () => {
  const {
    deviceType,
    orientation,
    isMobile,
    isTablet,
    isDesktop,
    isTV,
    isPortrait,
    isLandscape,
    // ...many more flags
  } = useDeviceTypeDetection();

  return (
    <div>
      <p>
        Device: <strong>{deviceType}</strong>
      </p>
      <p>
        Orientation: <strong>{orientation}</strong>
      </p>
      {isMobile && <p>This is a mobile device.</p>}
    </div>
  );
};

export default App;
```

## API

### `useDeviceTypeDetection()`

Returns a `DeviceDetectionResult` object with the following properties:

| Property             | Type                        | Description                                                                    |
| -------------------- | --------------------------- | ------------------------------------------------------------------------------ |
| `deviceType`         | `string`                    | One of the `DEVICE_TYPE` enum values with `_VERTICAL` or `_HORIZONTAL` suffix. |
| `touchDevice`        | `boolean`                   | True if the device supports touch (maxTouchPoints > 0).                        |
| `isPortrait`         | `boolean`                   | True if viewport height > width.                                               |
| `isLandscape`        | `boolean`                   | True if viewport width > height.                                               |
| `orientation`        | `'portrait' \| 'landscape'` | Shorthand for portrait vs. landscape.                                          |
| `isMobile`           | `boolean`                   | Device is any mobile (`MOBILE_S`, `MOBILE_M`, `MOBILE_L`).                     |
| `isTablet`           | `boolean`                   | Device is any tablet (`TABLET_S`, `TABLET_M`, `TABLET_L`).                     |
| `isMobileVertical`   | `boolean`                   | Mobile and portrait orientation.                                               |
| `isMobileHorizontal` | `boolean`                   | Mobile and landscape orientation.                                              |
| `isTabletVertical`   | `boolean`                   | Tablet and portrait orientation.                                               |
| `isTabletHorizontal` | `boolean`                   | Tablet and landscape orientation.                                              |
| `isMobileS`          | `boolean`                   | Exactly small mobile (`MOBILE_S`).                                             |
| `isMobileM`          | `boolean`                   | Exactly medium mobile (`MOBILE_M`).                                            |
| `isMobileL`          | `boolean`                   | Exactly large mobile (`MOBILE_L`).                                             |
| `isTabletS`          | `boolean`                   | Exactly small tablet (`TABLET_S`).                                             |
| `isTabletM`          | `boolean`                   | Exactly medium tablet (`TABLET_M`).                                            |
| `isTabletL`          | `boolean`                   | Exactly large tablet (`TABLET_L`).                                             |
| `isLaptop`           | `boolean`                   | Exactly laptop (`LAPTOP`).                                                     |
| `isDesktop`          | `boolean`                   | Any desktop (`DESKTOP`).                                                       |
| `isTV`               | `boolean`                   | Exactly TV (`TV`).                                                             |
| `isTV4K`             | `boolean`                   | Exactly 4K TV (`TV_4K`).                                                       |

Also export:

```ts
export enum DEVICE_TYPE {
  MOBILE_S,
  MOBILE_M,
  MOBILE_L,
  TABLET_S,
  TABLET_M,
  TABLET_L,
  LAPTOP,
  DESKTOP,
  TV,
  TV_4K,
}

export const BREAKPOINTS = {
  MOBILE_S_MAX_WIDTH: number,
  MOBILE_MAX_WIDTH: number,
  TABLET_S_MAX_WIDTH: number,
  TABLET_M_MAX_WIDTH: number,
  TABLET_L_MAX_WIDTH: number,
  LAPTOP_MAX_WIDTH: number,
  DESKTOP_MAX_WIDTH: number,
  TV_MAX_WIDTH: number,
};
```

## Contributing

1. Fork the repo
2. Create a feature branch (`git checkout -b feat/your-feature`)
3. Commit your changes (`git commit -m "feat: add ..."`)
4. Push to your branch (`git push origin feat/your-feature`)
5. Open a Pull Request

Please follow the [Conventional Commits](https://www.conventionalcommits.org/) standard.

## License

MIT © Valentin Röhle
