export interface DevicePreset {
  name: string;
  width: number;
  height: number;
}

export type SimulateUA = "mobile" | "tablet" | null;

export interface PresetGroup {
  label: string;
  icon: "phone" | "tablet" | "laptop" | "tv";
  simulateUA: SimulateUA;
  presets: DevicePreset[];
}

export const DEFAULT_VIEWPORT = { width: 430, height: 932 } as const;

export const PRESET_GROUPS: PresetGroup[] = [
  {
    label: "Mobile",
    icon: "phone",
    simulateUA: "mobile",
    presets: [
      { name: "iPhone SE", width: 375, height: 667 },
      { name: "iPhone 15", width: 393, height: 852 },
      { name: "iPhone 15 Pro Max", width: 430, height: 932 },
      { name: "Galaxy S24", width: 360, height: 780 },
      { name: "Pixel 8", width: 412, height: 915 },
    ],
  },
  {
    label: "Tablet",
    icon: "tablet",
    simulateUA: "tablet",
    presets: [
      { name: "iPad Mini", width: 768, height: 1024 },
      { name: "iPad Air", width: 820, height: 1180 },
      { name: 'iPad Pro 12.9"', width: 1024, height: 1366 },
      { name: "Galaxy Tab S9", width: 800, height: 1280 },
    ],
  },
  {
    label: "Desktop",
    icon: "laptop",
    simulateUA: null,
    presets: [
      { name: 'MacBook Air 13"', width: 1440, height: 900 },
      { name: 'MacBook Pro 16"', width: 1728, height: 1117 },
      { name: "Full HD", width: 1920, height: 1080 },
      { name: "WQHD", width: 2560, height: 1440 },
    ],
  },
  {
    label: "TV",
    icon: "tv",
    simulateUA: null,
    presets: [
      { name: "Full HD TV", width: 1920, height: 1080 },
      { name: "4K UHD", width: 3840, height: 2160 },
    ],
  },
];
