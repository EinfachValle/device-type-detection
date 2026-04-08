import { type ReactNode, useState } from "react";

import {
  AutoAwesomeRounded as AIIcon,
  AspectRatioRounded as AspectRatioIcon,
  CancelRounded as CancelIcon,
  CheckCircleRounded as CheckCircleIcon,
  CheckRounded as CheckIcon,
  CloseRounded as CloseIcon,
  CodeRounded as CodeIcon,
  ContentCopyRounded as CopyIcon,
  DevicesRounded as DevicesIcon,
  FlagRounded as FlagIcon,
  ScreenRotationRounded as ScreenRotationIcon,
  TouchAppRounded as TouchAppIcon,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Chip,
  Dialog,
  IconButton,
  Paper,
  Tab,
  Tabs,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
} from "@mui/material";
import { alpha, keyframes, useTheme } from "@mui/material/styles";
import { siJavascript, siReact, siSvelte, siVuedotjs } from "simple-icons";

/* ══════════════════════════════════════════════
   Types
   ══════════════════════════════════════════════ */

interface DeviceStateData {
  deviceType: string;
  orientation: string;
  width: number;
  height: number;
  flags: Record<string, boolean>;
}

interface Props {
  deviceState: DeviceStateData | null;
}

function SimpleIcon({ path, size = 14 }: { path: string; size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor">
      <path d={path} />
    </svg>
  );
}

type Framework = "vanilla" | "react" | "vue" | "svelte";
type Lang = "ts" | "js";
type PkgManager = "npm" | "yarn" | "pnpm" | "bun";

/* ══════════════════════════════════════════════
   Code generation
   ══════════════════════════════════════════════ */

const SPECIFIC_FLAGS = [
  "isMobileS",
  "isMobileM",
  "isMobileL",
  "isTabletS",
  "isTabletM",
  "isTabletL",
  "isLaptop",
  "isDesktop",
  "isTV",
  "isTV4K",
];
const ORIENTATION_FLAGS = ["isPortrait", "isLandscape"];

function getConditions(state: DeviceStateData): {
  conditionStr: string;
  comment: string;
} {
  const active = Object.entries(state.flags)
    .filter(([, v]) => v)
    .map(([k]) => k);
  const specific = active.find((f) => SPECIFIC_FLAGS.includes(f));
  const orient = active.find((f) => ORIENTATION_FLAGS.includes(f));
  const parts: string[] = [];
  if (specific) parts.push(specific);
  if (orient) parts.push(orient);
  const conditionStr =
    parts.length > 0 ? parts.map((p) => `state.${p}`).join(" && ") : "true";
  // For React/Vue where we use device?.flag
  const comment = `${state.deviceType} ${state.orientation} (${state.width}\u00d7${state.height})`;
  return { conditionStr, comment };
}

function getDeviceConditions(state: DeviceStateData): {
  deviceCondStr: string;
} {
  const active = Object.entries(state.flags)
    .filter(([, v]) => v)
    .map(([k]) => k);
  const specific = active.find((f) => SPECIFIC_FLAGS.includes(f));
  const orient = active.find((f) => ORIENTATION_FLAGS.includes(f));
  const parts: string[] = [];
  if (specific) parts.push(`device?.${specific}`);
  if (orient) parts.push(`device?.${orient}`);
  return { deviceCondStr: parts.length > 0 ? parts.join(" && ") : "true" };
}

function generateSnippet(
  state: DeviceStateData,
  framework: Framework,
  lang: Lang,
): string {
  const { conditionStr, comment } = getConditions(state);
  const { deviceCondStr } = getDeviceConditions(state);
  const isTs = lang === "ts";

  if (framework === "vanilla") {
    const typeImport = isTs
      ? "\nimport type { DeviceState } from 'device-type-detection';"
      : "";
    const annotation = isTs ? ": DeviceState" : "";
    return `import { createDeviceDetector } from 'device-type-detection';${typeImport}

const detector = createDeviceDetector();

// ${comment}
detector.subscribe((state${annotation}) => {
  if (${conditionStr}) {
    // Handle layout
  }
});`;
  }

  if (framework === "react") {
    const typeImport = isTs
      ? "\nimport type { DeviceState } from 'device-type-detection';"
      : "";
    const stateType = isTs ? "<DeviceState | null>" : "";
    return `import { useEffect, useState } from 'react';
import { createDeviceDetector } from 'device-type-detection';${typeImport}

function useDeviceDetector() {
  const [state, setState] = useState${stateType}(null);

  useEffect(() => {
    const detector = createDeviceDetector();
    setState(detector.getState());
    const unsub = detector.subscribe((s) => setState(s));
    return () => { unsub(); detector.destroy(); };
  }, []);

  return state;
}

// ${comment}
function App() {
  const device = useDeviceDetector();

  if (${deviceCondStr}) {
    // Handle layout
  }
}`;
  }

  if (framework === "vue") {
    const typeImport = isTs
      ? "\nimport type { DeviceState } from 'device-type-detection';"
      : "";
    const refType = isTs ? "<DeviceState | null>" : "";
    return `import { onMounted, onUnmounted, ref } from 'vue';
import { createDeviceDetector } from 'device-type-detection';${typeImport}

export function useDeviceDetector() {
  const state = ref${refType}(null);
  let unsub${isTs ? ": (() => void) | undefined" : ""};
  let detector${isTs ? ": ReturnType<typeof createDeviceDetector> | undefined" : ""};

  onMounted(() => {
    detector = createDeviceDetector();
    state.value = detector.getState();
    unsub = detector.subscribe((s) => { state.value = s; });
  });

  onUnmounted(() => { unsub?.(); detector?.destroy(); });

  return state; // ${comment}
}`;
  }

  // svelte
  return `import { onDestroy, onMount } from 'svelte';
import { writable } from 'svelte/store';
import { createDeviceDetector } from 'device-type-detection';

export function createDeviceStore() {
  const { subscribe, set } = writable(null);
  let unsub, detector;

  onMount(() => {
    detector = createDeviceDetector();
    set(detector.getState());
    unsub = detector.subscribe((s) => set(s));
  });

  onDestroy(() => { unsub?.(); detector?.destroy(); });

  return { subscribe }; // ${comment}
}`;
}

function generateAIPrompt(state: DeviceStateData): string {
  const activeFlags = Object.entries(state.flags)
    .filter(([, v]) => v)
    .map(([k]) => k);
  return `I'm using the \`device-type-detection\` npm library for responsive behavior.

Current device state:
- Device type: ${state.deviceType}
- Orientation: ${state.orientation}
- Viewport: ${state.width} x ${state.height}
- Active flags: ${activeFlags.join(", ")}

The library provides a \`createDeviceDetector()\` factory that returns a store with \`getState()\`, \`subscribe(callback)\`, and \`destroy()\`. The callback receives a \`DeviceState\` object with boolean flags like \`${activeFlags[0] || "isMobile"}\`.

Help me implement responsive behavior that adapts to this device configuration. Use the library's subscribe pattern to react to device changes.`;
}

const INSTALL_COMMANDS: Record<PkgManager, string> = {
  npm: "npm install device-type-detection",
  yarn: "yarn add device-type-detection",
  pnpm: "pnpm add device-type-detection",
  bun: "bun add device-type-detection",
};

/* ══════════════════════════════════════════════
   Syntax highlighting
   ══════════════════════════════════════════════ */

const KW_SET = new Set([
  "import",
  "from",
  "const",
  "let",
  "type",
  "if",
  "return",
  "function",
  "export",
  "typeof",
]);
const FN_SET = new Set([
  "createDeviceDetector",
  "subscribe",
  "getState",
  "destroy",
  "useState",
  "useEffect",
  "useDeviceDetector",
  "ref",
  "onMounted",
  "onUnmounted",
  "writable",
  "onMount",
  "onDestroy",
  "createDeviceStore",
  "setState",
  "set",
]);
const TYPE_SET = new Set(["DeviceState", "DeviceStore"]);

interface SyntaxPalette {
  keyword: string;
  string: string;
  func: string;
  comment: string;
  punct: string;
  type: string;
  text: string;
}

function HighlightedCode({
  code,
  palette,
}: {
  code: string;
  palette: SyntaxPalette;
}) {
  const elements: ReactNode[] = [];
  const lines = code.split("\n");

  for (let li = 0; li < lines.length; li++) {
    if (li > 0) elements.push("\n");
    const line = lines[li];
    const ci = line.indexOf("//");
    const before = ci >= 0 ? line.slice(0, ci) : line;
    const comment = ci >= 0 ? line.slice(ci) : "";

    const re = /('[^']*')|([a-zA-Z_]\w*)|([{}();&|.:,<>?!])|(\s+)/g;
    let m;
    let last = 0;
    while ((m = re.exec(before)) !== null) {
      if (m.index > last) elements.push(before.slice(last, m.index));
      const tok = m[0];
      const k = `${li}-${m.index}`;
      if (m[1]) {
        elements.push(
          <span key={k} style={{ color: palette.string }}>
            {tok}
          </span>,
        );
      } else if (m[2] && KW_SET.has(tok)) {
        elements.push(
          <span
            key={k}
            style={{
              color: palette.keyword,
              fontStyle: tok === "type" ? "italic" : undefined,
            }}
          >
            {tok}
          </span>,
        );
      } else if (m[2] && FN_SET.has(tok)) {
        elements.push(
          <span key={k} style={{ color: palette.func }}>
            {tok}
          </span>,
        );
      } else if (m[2] && TYPE_SET.has(tok)) {
        elements.push(
          <span key={k} style={{ color: palette.type }}>
            {tok}
          </span>,
        );
      } else if (m[3]) {
        elements.push(
          <span key={k} style={{ color: palette.punct }}>
            {tok}
          </span>,
        );
      } else {
        elements.push(tok);
      }
      last = m.index + tok.length;
    }
    if (last < before.length) elements.push(before.slice(last));
    if (comment) {
      elements.push(
        <span key={`${li}-c`} style={{ color: palette.comment }}>
          {comment}
        </span>,
      );
    }
  }

  return (
    <code style={{ display: "block", color: palette.text }}>{elements}</code>
  );
}

/* ══════════════════════════════════════════════
   Panel constants
   ══════════════════════════════════════════════ */

const FLAG_ORDER = [
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
];

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.03); }
  100% { transform: scale(1); }
`;

function SectionHeader({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, mb: 1 }}>
      {icon}
      <Typography
        variant="overline"
        sx={{ lineHeight: 1, letterSpacing: 1.2, color: "text.secondary" }}
      >
        {label}
      </Typography>
    </Box>
  );
}

/* ══════════════════════════════════════════════
   Main component
   ══════════════════════════════════════════════ */

export default function DetectionPanel({ deviceState }: Props) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const [codeOpen, setCodeOpen] = useState(false);
  const [tab, setTab] = useState(0);
  const [framework, setFramework] = useState<Framework>("vanilla");
  const [lang, setLang] = useState<Lang>("ts");
  const [pkgManager, setPkgManager] = useState<PkgManager>("npm");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const snippet = deviceState
    ? generateSnippet(deviceState, framework, lang)
    : "";
  const aiPrompt = deviceState ? generateAIPrompt(deviceState) : "";
  const installCmd = INSTALL_COMMANDS[pkgManager];

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    });
  };

  // Theme-aware dialog palette
  const d = {
    bg: isDark ? "#0d1117" : "#ffffff",
    bgElevated: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)",
    border: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.08)",
    text: isDark ? "#e6edf3" : "#1f2328",
    subtle: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.45)",
    muted: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)",
    codeBg: isDark ? "#161b22" : "#f6f8fa",
    codeShadow: isDark
      ? "inset 0 1px 4px rgba(0,0,0,0.3)"
      : "inset 0 1px 3px rgba(0,0,0,0.04)",
    copyBg: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)",
    copyBgHover: isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.1)",
    copyColor: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.4)",
    copyColorHover: isDark ? "rgba(255,255,255,0.8)" : "rgba(0,0,0,0.7)",
    checkColor: isDark ? "#c3e88d" : "#1a7f37",
    promptColor: isDark ? "rgba(255,255,255,0.75)" : "rgba(0,0,0,0.7)",
  };

  const syntax: SyntaxPalette = isDark
    ? {
        keyword: "#c792ea",
        string: "#c3e88d",
        func: "#82aaff",
        comment: "#546e7a",
        punct: "#89ddff",
        type: "#ffcb6b",
        text: "#d6deeb",
      }
    : {
        keyword: "#cf222e",
        string: "#0a3069",
        func: "#8250df",
        comment: "#6e7781",
        punct: "#24292f",
        type: "#953800",
        text: "#24292f",
      };

  // Toggle styling
  const toggleSx = {
    "& .MuiToggleButton-root": {
      textTransform: "none" as const,
      fontSize: "0.7rem",
      fontWeight: 600,
      py: 0.25,
      px: 0.8,
      lineHeight: 1.6,
      color: d.subtle,
      borderColor: d.border,
      "&.Mui-selected": {
        color: d.text,
        bgcolor: d.muted,
        borderColor: d.border,
      },
      "&:hover": { bgcolor: d.muted },
    },
  };

  const sortedFlags: [string, boolean][] = deviceState
    ? FLAG_ORDER.filter((key) => key in deviceState.flags).map((key) => [
        key,
        deviceState.flags[key],
      ])
    : [];

  return (
    <Box
      sx={{
        width: 280,
        flexShrink: 0,
        height: "100%",
        overflowY: "auto",
        bgcolor: "background.paper",
        borderLeft: 1,
        borderColor: "divider",
        p: 2,
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      {/* Device Type */}
      <Box>
        <SectionHeader
          icon={<DevicesIcon sx={{ fontSize: 16, color: "text.secondary" }} />}
          label="Device Type"
        />
        <Paper
          elevation={0}
          sx={{
            p: 2,
            textAlign: "center",
            bgcolor: alpha(theme.palette.primary.main, 0.08),
            border: `1px solid ${alpha(theme.palette.primary.main, 0.24)}`,
            borderRadius: 2,
            animation: deviceState ? `${pulse} 0.4s ease-in-out` : "none",
          }}
          key={deviceState?.deviceType}
        >
          <Typography
            variant="h5"
            sx={{ fontWeight: 700, color: "primary.main", letterSpacing: 0.5 }}
          >
            {deviceState ? deviceState.deviceType : "\u2014"}
          </Typography>
        </Paper>
      </Box>

      {/* Orientation + Touch */}
      <Box sx={{ display: "flex", gap: 1 }}>
        <Paper variant="outlined" sx={{ p: 1.5, flex: 1, borderRadius: 2 }}>
          <SectionHeader
            icon={
              <ScreenRotationIcon
                sx={{ fontSize: 14, color: "text.secondary" }}
              />
            }
            label="Orientation"
          />
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            {deviceState ? deviceState.orientation : "\u2014"}
          </Typography>
        </Paper>
        <Paper variant="outlined" sx={{ p: 1.5, flex: 1, borderRadius: 2 }}>
          <SectionHeader
            icon={
              <TouchAppIcon sx={{ fontSize: 14, color: "text.secondary" }} />
            }
            label="Touch"
          />
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            No
          </Typography>
        </Paper>
      </Box>

      {/* Viewport */}
      <Paper variant="outlined" sx={{ p: 1.5, borderRadius: 2 }}>
        <SectionHeader
          icon={
            <AspectRatioIcon sx={{ fontSize: 14, color: "text.secondary" }} />
          }
          label="Viewport"
        />
        <Typography variant="body2" sx={{ fontWeight: 500 }}>
          {deviceState
            ? `${deviceState.width} \u00d7 ${deviceState.height}`
            : "\u2014"}
        </Typography>
      </Paper>

      {/* Flags */}
      <Box>
        <SectionHeader
          icon={<FlagIcon sx={{ fontSize: 16, color: "text.secondary" }} />}
          label="Flags"
        />
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75 }}>
          {sortedFlags.map(([name, active]) => (
            <Chip
              key={name}
              label={name}
              size="small"
              icon={
                active ? (
                  <CheckCircleIcon fontSize="inherit" />
                ) : (
                  <CancelIcon fontSize="inherit" />
                )
              }
              variant={active ? "filled" : "outlined"}
              color={active ? "success" : "default"}
              sx={{
                fontSize: "0.72rem",
                height: 26,
                ...(!active && {
                  opacity: 0.5,
                  borderColor: alpha(theme.palette.action.disabled, 0.2),
                  color: "text.disabled",
                }),
              }}
            />
          ))}
        </Box>
      </Box>

      {/* Integration Button */}
      <Button
        variant="outlined"
        startIcon={<CodeIcon />}
        onClick={() => setCodeOpen(true)}
        disabled={!deviceState}
        fullWidth
        sx={{ textTransform: "none", fontWeight: 600 }}
      >
        Show Integration Code
      </Button>

      {/* ════════════════════════════════════════
         Integration Dialog
         ════════════════════════════════════════ */}
      <Dialog
        open={codeOpen}
        onClose={() => setCodeOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          elevation: 24,
          sx: {
            borderRadius: 3,
            overflow: "hidden",
            bgcolor: d.bg,
            backgroundImage: "none",
            border: `1px solid ${d.border}`,
          },
        }}
      >
        {/* Header */}
        <Box
          sx={{
            px: 3,
            pt: 2.5,
            pb: 0,
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "linear-gradient(135deg, #e8860c 0%, #f5a623 100%)",
              }}
            >
              <CodeIcon sx={{ fontSize: 20, color: "#fff" }} />
            </Box>
            <Box>
              <Typography
                variant="h6"
                sx={{ fontWeight: 700, lineHeight: 1.2, color: d.text }}
              >
                Integration
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: d.subtle,
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "0.7rem",
                }}
              >
                {deviceState
                  ? `${deviceState.deviceType} \u00b7 ${deviceState.orientation} \u00b7 ${deviceState.width}\u00d7${deviceState.height}`
                  : ""}
              </Typography>
            </Box>
          </Box>
          <IconButton
            size="small"
            onClick={() => setCodeOpen(false)}
            sx={{ color: d.subtle, "&:hover": { color: d.text } }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>

        {/* Install command — always visible */}
        <Box
          sx={{
            mx: 3,
            mt: 2,
            display: "flex",
            flexDirection: "column",
            gap: 1,
          }}
        >
          <ToggleButtonGroup
            value={pkgManager}
            exclusive
            size="small"
            onChange={(_, v) => v && setPkgManager(v)}
            sx={toggleSx}
          >
            <ToggleButton value="npm">npm</ToggleButton>
            <ToggleButton value="yarn">yarn</ToggleButton>
            <ToggleButton value="pnpm">pnpm</ToggleButton>
            <ToggleButton value="bun">bun</ToggleButton>
          </ToggleButtonGroup>
          <Box sx={{ position: "relative" }}>
            <Tooltip
              title={copiedKey === "install" ? "Copied!" : "Copy"}
              placement="left"
            >
              <IconButton
                size="small"
                onClick={() => handleCopy(installCmd, "install")}
                sx={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  zIndex: 1,
                  color: d.copyColor,
                  bgcolor: d.copyBg,
                  border: `1px solid ${d.border}`,
                  backdropFilter: "blur(4px)",
                  "&:hover": {
                    bgcolor: d.copyBgHover,
                    color: d.copyColorHover,
                  },
                }}
              >
                {copiedKey === "install" ? (
                  <CheckIcon sx={{ fontSize: 15, color: d.checkColor }} />
                ) : (
                  <CopyIcon sx={{ fontSize: 15 }} />
                )}
              </IconButton>
            </Tooltip>
            <Box
              sx={{
                p: 1.5,
                pr: 5,
                borderRadius: 2,
                bgcolor: d.codeBg,
                border: `1px solid ${d.border}`,
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.8rem",
                color: d.subtle,
                boxShadow: d.codeShadow,
              }}
            >
              <span style={{ color: syntax.func }}>$</span> {installCmd}
            </Box>
          </Box>
        </Box>

        {/* Tabs */}
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          sx={{
            px: 3,
            mt: 2,
            minHeight: 36,
            "& .MuiTab-root": {
              minHeight: 36,
              textTransform: "none",
              fontWeight: 600,
              fontSize: "0.82rem",
              color: d.subtle,
              "&.Mui-selected": { color: d.text },
            },
            "& .MuiTabs-indicator": {
              backgroundColor: "#e8860c",
              height: 2,
              borderRadius: 1,
            },
          }}
        >
          <Tab
            icon={<CodeIcon sx={{ fontSize: 16 }} />}
            iconPosition="start"
            label="Code"
          />
          <Tab
            icon={<AIIcon sx={{ fontSize: 16 }} />}
            iconPosition="start"
            label="AI Prompt"
          />
        </Tabs>

        {/* Content */}
        <Box sx={{ p: 3 }}>
          {tab === 0 && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {/* Framework + Lang selectors */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: 1,
                }}
              >
                <ToggleButtonGroup
                  value={framework}
                  exclusive
                  size="small"
                  onChange={(_, v) => v && setFramework(v)}
                  sx={toggleSx}
                >
                  <ToggleButton value="vanilla" sx={{ gap: 0.5 }}>
                    <SimpleIcon path={siJavascript.path} /> Vanilla
                  </ToggleButton>
                  <ToggleButton value="react" sx={{ gap: 0.5 }}>
                    <SimpleIcon path={siReact.path} /> React
                  </ToggleButton>
                  <ToggleButton value="vue" sx={{ gap: 0.5 }}>
                    <SimpleIcon path={siVuedotjs.path} /> Vue
                  </ToggleButton>
                  <ToggleButton value="svelte" sx={{ gap: 0.5 }}>
                    <SimpleIcon path={siSvelte.path} /> Svelte
                  </ToggleButton>
                </ToggleButtonGroup>
                <ToggleButtonGroup
                  value={lang}
                  exclusive
                  size="small"
                  onChange={(_, v) => v && setLang(v)}
                  sx={toggleSx}
                >
                  <ToggleButton value="ts">TS</ToggleButton>
                  <ToggleButton value="js">JS</ToggleButton>
                </ToggleButtonGroup>
              </Box>

              {/* Code block */}
              <Box sx={{ position: "relative" }}>
                <Tooltip
                  title={copiedKey === "code" ? "Copied!" : "Copy"}
                  placement="left"
                >
                  <IconButton
                    size="small"
                    onClick={() => handleCopy(snippet, "code")}
                    sx={{
                      position: "absolute",
                      top: 12,
                      right: 12,
                      zIndex: 1,
                      color: d.copyColor,
                      bgcolor: d.copyBg,
                      border: `1px solid ${d.border}`,
                      backdropFilter: "blur(4px)",
                      "&:hover": {
                        bgcolor: d.copyBgHover,
                        color: d.copyColorHover,
                      },
                    }}
                  >
                    {copiedKey === "code" ? (
                      <CheckIcon sx={{ fontSize: 15, color: d.checkColor }} />
                    ) : (
                      <CopyIcon sx={{ fontSize: 15 }} />
                    )}
                  </IconButton>
                </Tooltip>
                <Box
                  component="pre"
                  sx={{
                    p: 2.5,
                    pr: 6,
                    borderRadius: 2.5,
                    bgcolor: d.codeBg,
                    border: `1px solid ${d.border}`,
                    overflow: "auto",
                    fontSize: "0.85rem",
                    fontFamily:
                      "'JetBrains Mono', 'Fira Code', 'SF Mono', Menlo, monospace",
                    lineHeight: 1.75,
                    whiteSpace: "pre",
                    m: 0,
                    boxShadow: d.codeShadow,
                  }}
                >
                  <HighlightedCode code={snippet} palette={syntax} />
                </Box>
              </Box>
            </Box>
          )}

          {tab === 1 && (
            <Box sx={{ position: "relative" }}>
              <Tooltip
                title={copiedKey === "ai" ? "Copied!" : "Copy"}
                placement="left"
              >
                <IconButton
                  size="small"
                  onClick={() => handleCopy(aiPrompt, "ai")}
                  sx={{
                    position: "absolute",
                    top: 12,
                    right: 12,
                    zIndex: 1,
                    color: d.copyColor,
                    bgcolor: d.copyBg,
                    border: `1px solid ${d.border}`,
                    backdropFilter: "blur(4px)",
                    "&:hover": {
                      bgcolor: d.copyBgHover,
                      color: d.copyColorHover,
                    },
                  }}
                >
                  {copiedKey === "ai" ? (
                    <CheckIcon sx={{ fontSize: 15, color: d.checkColor }} />
                  ) : (
                    <CopyIcon sx={{ fontSize: 15 }} />
                  )}
                </IconButton>
              </Tooltip>
              <Box
                component="pre"
                sx={{
                  p: 2.5,
                  pr: 6,
                  borderRadius: 2.5,
                  bgcolor: d.codeBg,
                  border: `1px solid ${d.border}`,
                  overflow: "auto",
                  fontSize: "0.85rem",
                  fontFamily:
                    "'JetBrains Mono', 'Fira Code', 'SF Mono', Menlo, monospace",
                  lineHeight: 1.75,
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                  m: 0,
                  color: d.promptColor,
                  boxShadow: d.codeShadow,
                }}
              >
                {aiPrompt}
              </Box>
            </Box>
          )}
        </Box>
      </Dialog>
    </Box>
  );
}
