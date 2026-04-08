export interface DevicePreset {
  name: string;
  width: number;
  height: number;
}

export type SimulateUA = "mobile" | "tablet" | "tv" | null;

export interface PresetGroup {
  label: string;
  icon: "phone" | "tablet" | "laptop" | "tv";
  simulateUA: SimulateUA;
  presets: DevicePreset[];
}

export const DEFAULT_VIEWPORT = { width: 430, height: 932 } as const;

/** Pick initial preset matching the actual device viewport */
export function getInitialPreset(): {
  width: number;
  height: number;
  simulateUA: SimulateUA;
  presetName: string | null;
} {
  if (typeof window === "undefined") {
    return { ...DEFAULT_VIEWPORT, simulateUA: "mobile", presetName: null };
  }

  const w = window.innerWidth;
  const touchCapable = navigator.maxTouchPoints > 0;

  // Find the best matching preset group and preset
  for (const group of PRESET_GROUPS) {
    for (const preset of group.presets) {
      if (Math.abs(preset.width - w) < 50) {
        return {
          width: preset.width,
          height: preset.height,
          simulateUA: group.simulateUA,
          presetName: preset.name,
        };
      }
    }
  }

  // No exact match — pick by category
  if (w <= 480 && touchCapable) {
    return {
      width: 393,
      height: 852,
      simulateUA: "mobile",
      presetName: "iPhone 15",
    };
  }
  if (w <= 1024 && touchCapable) {
    return {
      width: 820,
      height: 1180,
      simulateUA: "tablet",
      presetName: "iPad Air",
    };
  }
  // Desktop/laptop users always start with Full HD — fits any screen
  return { width: 1920, height: 1080, simulateUA: null, presetName: "Full HD" };
}

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
      { name: "4K UHD", width: 3840, height: 2160 },
    ],
  },
  {
    label: "TV",
    icon: "tv",
    simulateUA: "tv",
    presets: [
      { name: "Smart TV 1080p", width: 1920, height: 1080 },
      { name: "Smart TV 4K", width: 3840, height: 2160 },
    ],
  },
];
