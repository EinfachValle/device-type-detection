import { useCallback, useEffect, useMemo, useState } from "react";

import {
  Brightness4Rounded as BrightnessAutoIcon,
  DarkModeRounded as DarkModeIcon,
  InfoOutlined as InfoOutlinedIcon,
  LightModeRounded as LightModeIcon,
  MenuRounded as MenuIcon,
} from "@mui/icons-material";
import {
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  IconButton,
  ThemeProvider,
  ToggleButton,
  ToggleButtonGroup,
  Toolbar,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";

import { type ThemeMode, getTheme } from "./theme";

import DetectionPanel from "./components/DetectionPanel";
import DevicePresetsSidebar from "./components/DevicePresetsSidebar";
import ViewportCanvas from "./components/ViewportCanvas";
import { DEFAULT_VIEWPORT, type SimulateUA } from "./data/presets";

interface IframeDeviceState {
  type: "deviceState";
  deviceType: string;
  orientation: string;
  width: number;
  height: number;
  flags: Record<string, boolean>;
}

const SIDEBAR_DRAWER_WIDTH = 280;
const PANEL_DRAWER_WIDTH = 300;

export default function App() {
  const systemPrefersDark = useMediaQuery("(prefers-color-scheme: dark)");
  const [themeMode, setThemeMode] = useState<ThemeMode>("auto");
  const theme = useMemo(
    () => getTheme(themeMode, systemPrefersDark),
    [themeMode, systemPrefersDark],
  );
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

  const [viewportWidth, setViewportWidth] = useState(DEFAULT_VIEWPORT.width);
  const [viewportHeight, setViewportHeight] = useState(DEFAULT_VIEWPORT.height);
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const [simulateUA, setSimulateUA] = useState<SimulateUA>("mobile");
  const [deviceState, setDeviceState] = useState<IframeDeviceState | null>(
    null,
  );

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);

  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      const data = event.data;
      if (data && data.type === "deviceState") {
        setDeviceState(data as IframeDeviceState);
      }
    }
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  const handleSelectPreset = useCallback(
    (name: string, width: number, height: number, ua: SimulateUA) => {
      setSelectedPreset(name);
      setViewportWidth(width);
      setViewportHeight(height);
      setSimulateUA(ua);
      if (!isDesktop) setSidebarOpen(false);
    },
    [isDesktop],
  );

  const handleResize = useCallback((width: number, height: number) => {
    setViewportWidth(width);
    setViewportHeight(height);
    setSelectedPreset(null);
  }, []);

  const handleRotate = useCallback(() => {
    setViewportWidth(viewportHeight);
    setViewportHeight(viewportWidth);
  }, [viewportWidth, viewportHeight]);

  const themeToggle = (
    <ToggleButtonGroup
      value={themeMode}
      exclusive
      onChange={(_, val) => val && setThemeMode(val as ThemeMode)}
      size="small"
      sx={{ "& .MuiToggleButton-root": { px: 1, py: 0.5 } }}
    >
      <ToggleButton value="light">
        <Tooltip title="Light">
          <LightModeIcon fontSize="small" />
        </Tooltip>
      </ToggleButton>
      <ToggleButton value="auto">
        <Tooltip title="System">
          <BrightnessAutoIcon fontSize="small" />
        </Tooltip>
      </ToggleButton>
      <ToggleButton value="dark">
        <Tooltip title="Dark">
          <DarkModeIcon fontSize="small" />
        </Tooltip>
      </ToggleButton>
    </ToggleButtonGroup>
  );

  const sidebarContent = (
    <DevicePresetsSidebar
      selectedPreset={selectedPreset}
      onSelectPreset={handleSelectPreset}
      themeToggle={themeToggle}
    />
  );

  const panelContent = <DetectionPanel deviceState={deviceState} />;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          overflow: "hidden",
        }}
      >
        {/* AppBar for tablet/mobile */}
        {!isDesktop && (
          <AppBar
            position="static"
            color="default"
            elevation={1}
            sx={{ bgcolor: "background.paper" }}
          >
            <Toolbar variant="dense">
              <IconButton
                edge="start"
                color="inherit"
                aria-label="open sidebar"
                onClick={() => setSidebarOpen(true)}
                sx={{ mr: 1 }}
              >
                <MenuIcon />
              </IconButton>
              <Typography
                variant="subtitle1"
                sx={{ flexGrow: 1, textAlign: "center", fontWeight: 600 }}
              >
                device-type-detection
              </Typography>
              <IconButton
                edge="end"
                color="inherit"
                aria-label="open detection panel"
                onClick={() => setPanelOpen(true)}
              >
                <InfoOutlinedIcon />
              </IconButton>
            </Toolbar>
          </AppBar>
        )}

        <Box sx={{ display: "flex", flex: 1, overflow: "hidden" }}>
          {isDesktop ? (
            sidebarContent
          ) : (
            <Drawer
              variant="temporary"
              open={sidebarOpen}
              onClose={() => setSidebarOpen(false)}
              ModalProps={{ keepMounted: true }}
              sx={{
                "& .MuiDrawer-paper": {
                  width: SIDEBAR_DRAWER_WIDTH,
                  boxSizing: "border-box",
                },
              }}
            >
              {sidebarContent}
            </Drawer>
          )}

          <ViewportCanvas
            width={viewportWidth}
            height={viewportHeight}
            deviceType={deviceState?.deviceType ?? null}
            simulateUA={simulateUA}
            onResize={handleResize}
            onRotate={handleRotate}
          />

          {isDesktop ? (
            panelContent
          ) : (
            <Drawer
              variant="temporary"
              anchor="right"
              open={panelOpen}
              onClose={() => setPanelOpen(false)}
              ModalProps={{ keepMounted: true }}
              sx={{
                "& .MuiDrawer-paper": {
                  width: PANEL_DRAWER_WIDTH,
                  boxSizing: "border-box",
                },
              }}
            >
              {panelContent}
            </Drawer>
          )}
        </Box>
      </Box>
    </ThemeProvider>
  );
}
