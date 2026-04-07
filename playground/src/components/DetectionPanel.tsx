import {
  AspectRatioRounded as AspectRatioIcon,
  CancelRounded as CancelIcon,
  CheckCircleRounded as CheckCircleIcon,
  DevicesRounded as DevicesIcon,
  FlagRounded as FlagIcon,
  ScreenRotationRounded as ScreenRotationIcon,
  TouchAppRounded as TouchAppIcon,
} from "@mui/icons-material";
import { Box, Chip, Paper, Typography } from "@mui/material";
import { alpha, keyframes, useTheme } from "@mui/material/styles";

interface Props {
  deviceState: {
    deviceType: string;
    orientation: string;
    width: number;
    height: number;
    flags: Record<string, boolean>;
  } | null;
}

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

export default function DetectionPanel({ deviceState }: Props) {
  const theme = useTheme();

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
      {/* ── Device Type ── */}
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
            sx={{
              fontWeight: 700,
              color: "primary.main",
              letterSpacing: 0.5,
            }}
          >
            {deviceState ? deviceState.deviceType : "\u2014"}
          </Typography>
        </Paper>
      </Box>

      {/* ── Orientation + Touch row ── */}
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

      {/* ── Viewport ── */}
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

      {/* ── Flags ── */}
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
    </Box>
  );
}
