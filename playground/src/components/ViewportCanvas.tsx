import { useEffect, useMemo, useRef, useState } from "react";

import {
  ScreenRotationRounded as ScreenRotationIcon,
  StayCurrentLandscapeRounded as StayCurrentLandscapeIcon,
  StayCurrentPortraitRounded as StayCurrentPortraitIcon,
} from "@mui/icons-material";
import {
  Box,
  Chip,
  Divider,
  IconButton,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import {
  ORIENTATION_LANDSCAPE,
  ORIENTATION_PORTRAIT,
} from "device-type-detection";

import type { SimulateUA } from "../data/presets";
import { useResizable } from "../hooks/useResizable";

interface Props {
  width: number;
  height: number;
  deviceType?: string | null;
  simulateUA?: SimulateUA;
  onResize: (width: number, height: number) => void;
  onRotate: () => void;
}

export default function ViewportCanvas({
  width,
  height,
  deviceType,
  simulateUA,
  onResize,
  onRotate,
}: Props) {
  const theme = useTheme();
  const { handleMouseDown } = useResizable({ onResize });
  const iframeRef = useRef<HTMLIFrameElement>(null);
  // Iframe content is inverted: dark shell → light content, light shell → dark content
  const iframeDarkMode = theme.palette.mode === "light";

  const iframeSrc = useMemo(() => {
    const params = new URLSearchParams();
    params.set("theme", iframeDarkMode ? "dark" : "light");
    if (simulateUA) params.set("ua", simulateUA);
    return import.meta.env.BASE_URL + "demo.html?" + params.toString();
  }, [iframeDarkMode, simulateUA]);

  // Notify iframe of theme changes
  useEffect(() => {
    iframeRef.current?.contentWindow?.postMessage(
      { type: "themeChange", dark: iframeDarkMode },
      "*",
    );
  }, [iframeDarkMode]);

  const [localW, setLocalW] = useState<string>(String(width));
  const [localH, setLocalH] = useState<string>(String(height));

  // Sync local state when props change (e.g. from drag or preset)
  if (
    Number(localW) !== width &&
    document.activeElement?.getAttribute("data-field") !== "w"
  ) {
    if (String(width) !== localW) setLocalW(String(width));
  }
  if (
    Number(localH) !== height &&
    document.activeElement?.getAttribute("data-field") !== "h"
  ) {
    if (String(height) !== localH) setLocalH(String(height));
  }

  const commitWidth = () => {
    const parsed = parseInt(localW, 10);
    if (!isNaN(parsed) && parsed > 0) {
      onResize(parsed, height);
    } else {
      setLocalW(String(width));
    }
  };

  const commitHeight = () => {
    const parsed = parseInt(localH, 10);
    if (!isNaN(parsed) && parsed > 0) {
      onResize(width, parsed);
    } else {
      setLocalH(String(height));
    }
  };

  const orientation =
    width >= height ? ORIENTATION_LANDSCAPE : ORIENTATION_PORTRAIT;

  /* Grip dot pattern for drag handles */
  const gripDot = (color: string) =>
    `radial-gradient(circle, ${color} 1.2px, transparent 1.2px)`;

  return (
    <Box
      sx={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        height: "100%",
        bgcolor: "background.default",
        overflow: "hidden",
      }}
    >
      {/* Toolbar */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          p: 1,
          borderBottom: 1,
          borderColor: "divider",
          bgcolor: "background.paper",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 1,
            flexWrap: "wrap",
          }}
        >
          {/* Dimension inputs */}
          <TextField
            type="number"
            size="small"
            variant="outlined"
            value={localW}
            onChange={(e) => setLocalW(e.target.value)}
            onBlur={commitWidth}
            onKeyDown={(e) => {
              if (e.key === "Enter") commitWidth();
            }}
            slotProps={{ htmlInput: { "data-field": "w" } }}
            sx={{
              width: 68,
              "& .MuiOutlinedInput-root": {
                borderRadius: 1.5,
                "& input": {
                  py: 0.5,
                  px: 1,
                  fontSize: "0.8rem",
                  textAlign: "center",
                },
              },
            }}
          />
          <Typography
            variant="caption"
            color="text.disabled"
            sx={{ userSelect: "none" }}
          >
            ×
          </Typography>
          <TextField
            type="number"
            size="small"
            variant="outlined"
            value={localH}
            onChange={(e) => setLocalH(e.target.value)}
            onBlur={commitHeight}
            onKeyDown={(e) => {
              if (e.key === "Enter") commitHeight();
            }}
            slotProps={{ htmlInput: { "data-field": "h" } }}
            sx={{
              width: 68,
              "& .MuiOutlinedInput-root": {
                borderRadius: 1.5,
                "& input": {
                  py: 0.5,
                  px: 1,
                  fontSize: "0.8rem",
                  textAlign: "center",
                },
              },
            }}
          />

          <Divider orientation="vertical" flexItem />

          <Chip
            label={deviceType || "\u2014"}
            size="small"
            color={deviceType ? "primary" : "default"}
            variant={deviceType ? "filled" : "outlined"}
            sx={{ fontWeight: 600, fontSize: "0.75rem" }}
          />
          <Chip
            icon={
              orientation === "portrait" ? (
                <StayCurrentPortraitIcon sx={{ fontSize: 14 }} />
              ) : (
                <StayCurrentLandscapeIcon sx={{ fontSize: 14 }} />
              )
            }
            label={orientation}
            size="small"
            variant="outlined"
          />

          {deviceType &&
            (deviceType.startsWith("mobile") ||
              deviceType.startsWith("tablet")) && (
              <>
                <Divider orientation="vertical" flexItem />

                <IconButton
                  size="small"
                  onClick={onRotate}
                  title="Rotate"
                  sx={{
                    transition: "transform 0.2s",
                    "&:hover": { transform: "rotate(90deg)" },
                  }}
                >
                  <ScreenRotationIcon fontSize="small" />
                </IconButton>
              </>
            )}
        </Box>
      </Box>

      {/* Resizable iframe container */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          overflow: "auto",
          p: 3,
          /* Dot-grid background like design tools */
          backgroundImage: (theme) =>
            `radial-gradient(${theme.palette.mode === "dark" ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.08)"} 1px, transparent 1px)`,
          backgroundSize: "16px 16px",
        }}
      >
        <Box sx={{ position: "relative" }}>
          <iframe
            ref={iframeRef}
            src={iframeSrc}
            title="Device preview"
            style={{
              width,
              height,
              border: "none",
              borderRadius: 8,
              display: "block",
              background: "#fff",
            }}
          />
          {/* Shadow overlay */}
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              borderRadius: 2,
              boxShadow: 8,
              pointerEvents: "none",
            }}
          />

          {/* Right drag handle - vertical grip dots */}
          <Box
            onMouseDown={handleMouseDown("right", width, height)}
            sx={{
              position: "absolute",
              width: 10,
              height: 48,
              top: "50%",
              right: -12,
              transform: "translateY(-50%)",
              cursor: "ew-resize",
              borderRadius: 1.5,
              opacity: 0.5,
              backgroundImage: (theme) =>
                gripDot(
                  theme.palette.mode === "dark"
                    ? "rgba(255,255,255,0.6)"
                    : "rgba(0,0,0,0.35)",
                ),
              backgroundSize: "5px 6px",
              backgroundPosition: "center",
              backgroundRepeat: "repeat-y",
              transition:
                "opacity 0.2s, transform 0.2s, box-shadow 0.2s, background-color 0.2s",
              "&:hover": {
                opacity: 1,
                transform: "translateY(-50%) scaleY(1.15)",
                bgcolor: "action.hover",
                boxShadow: (theme) =>
                  `0 0 8px 2px ${theme.palette.primary.main}40`,
              },
            }}
          />

          {/* Bottom drag handle - horizontal grip dots */}
          <Box
            onMouseDown={handleMouseDown("bottom", width, height)}
            sx={{
              position: "absolute",
              width: 48,
              height: 10,
              bottom: -12,
              left: "50%",
              transform: "translateX(-50%)",
              cursor: "ns-resize",
              borderRadius: 1.5,
              opacity: 0.5,
              backgroundImage: (theme) =>
                gripDot(
                  theme.palette.mode === "dark"
                    ? "rgba(255,255,255,0.6)"
                    : "rgba(0,0,0,0.35)",
                ),
              backgroundSize: "6px 5px",
              backgroundPosition: "center",
              backgroundRepeat: "repeat-x",
              transition:
                "opacity 0.2s, transform 0.2s, box-shadow 0.2s, background-color 0.2s",
              "&:hover": {
                opacity: 1,
                transform: "translateX(-50%) scaleX(1.15)",
                bgcolor: "action.hover",
                boxShadow: (theme) =>
                  `0 0 8px 2px ${theme.palette.primary.main}40`,
              },
            }}
          />

          {/* Corner drag handle - grid grip dots */}
          <Box
            onMouseDown={handleMouseDown("corner", width, height)}
            sx={{
              position: "absolute",
              width: 14,
              height: 14,
              bottom: -14,
              right: -14,
              cursor: "nwse-resize",
              borderRadius: 1,
              opacity: 0.5,
              backgroundImage: (theme) =>
                gripDot(
                  theme.palette.mode === "dark"
                    ? "rgba(255,255,255,0.6)"
                    : "rgba(0,0,0,0.35)",
                ),
              backgroundSize: "5px 5px",
              backgroundPosition: "center",
              transition:
                "opacity 0.2s, transform 0.2s, box-shadow 0.2s, background-color 0.2s",
              "&:hover": {
                opacity: 1,
                transform: "scale(1.25)",
                bgcolor: "action.hover",
                boxShadow: (theme) =>
                  `0 0 8px 2px ${theme.palette.primary.main}40`,
              },
            }}
          />
        </Box>
      </Box>
    </Box>
  );
}
