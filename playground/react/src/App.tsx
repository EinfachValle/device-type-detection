import { useRef, useSyncExternalStore } from "react";

import { type DeviceState, createDeviceDetector } from "device-type-detection";

function useDeviceDetection() {
  const storeRef = useRef(createDeviceDetector());
  return useSyncExternalStore(
    (cb) => storeRef.current.subscribe(cb),
    () => storeRef.current.getState(),
    () => storeRef.current.getState(),
  );
}

const FLAG_NAMES = [
  "isMobile",
  "isMobileS",
  "isMobileM",
  "isMobileL",
  "isTablet",
  "isTabletS",
  "isTabletM",
  "isTabletL",
  "isLaptop",
  "isDesktop",
  "isTV",
  "isTV4K",
  "isPortrait",
  "isLandscape",
  "isMobileVertical",
  "isMobileHorizontal",
  "isTabletVertical",
  "isTabletHorizontal",
] as const;

function Flag({ name, active }: { name: string; active: boolean }) {
  return (
    <span
      style={{
        padding: "0.25rem 0.75rem",
        borderRadius: "9999px",
        fontSize: "0.75rem",
        fontWeight: 600,
        background: active ? "#166534" : "#334155",
        color: active ? "#4ade80" : "#94a3b8",
      }}
    >
      {name}: {String(active)}
    </span>
  );
}

export default function App() {
  const device = useDeviceDetection();

  return (
    <div
      style={{
        padding: "2rem",
        color: "#e2e8f0",
        background: "#0f172a",
        minHeight: "100vh",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      <h1
        style={{ color: "#38bdf8", marginBottom: "1.5rem", fontSize: "1.5rem" }}
      >
        React Device Detection Playground
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "1rem",
          maxWidth: 800,
        }}
      >
        <Card title="Device Type">
          <Value>{device.deviceType}</Value>
        </Card>
        <Card title="Orientation">
          <Value>{device.orientation}</Value>
        </Card>
        <Card title="Viewport">
          <Value>
            {device.width} x {device.height}
          </Value>
          <div
            style={{
              fontSize: "0.875rem",
              color: "#94a3b8",
              marginTop: "0.5rem",
            }}
          >
            {device.touchDevice ? "Touch Device" : "Non-Touch Device"}
          </div>
        </Card>
        <Card title="Flags" span>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
            {FLAG_NAMES.map((name) => (
              <Flag
                key={name}
                name={name}
                active={device[name as keyof DeviceState] as boolean}
              />
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

function Card({
  title,
  children,
  span,
}: {
  title: string;
  children: React.ReactNode;
  span?: boolean;
}) {
  return (
    <div
      style={{
        background: "#1e293b",
        borderRadius: 12,
        padding: "1.25rem",
        border: "1px solid #334155",
        gridColumn: span ? "1 / -1" : undefined,
      }}
    >
      <h2
        style={{
          fontSize: "0.875rem",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          color: "#94a3b8",
          marginBottom: "0.75rem",
        }}
      >
        {title}
      </h2>
      {children}
    </div>
  );
}

function Value({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "#f1f5f9" }}>
      {children}
    </div>
  );
}
