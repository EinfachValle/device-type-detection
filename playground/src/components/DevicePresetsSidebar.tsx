import {
  LaptopMacRounded as LaptopMacIcon,
  PhoneIphoneRounded as PhoneIphoneIcon,
  TabletMacRounded as TabletMacIcon,
  TvRounded as TvIcon,
} from "@mui/icons-material";
import {
  Box,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Typography,
} from "@mui/material";

import {
  PRESET_GROUPS,
  type PresetGroup,
  type SimulateUA,
} from "../data/presets";

const GROUP_ICONS: Record<PresetGroup["icon"], React.ElementType> = {
  phone: PhoneIphoneIcon,
  tablet: TabletMacIcon,
  laptop: LaptopMacIcon,
  tv: TvIcon,
};

interface Props {
  selectedPreset: string | null;
  onSelectPreset: (
    name: string,
    width: number,
    height: number,
    simulateUA: SimulateUA,
  ) => void;
  onClose?: () => void;
  themeToggle?: React.ReactNode;
}

export default function DevicePresetsSidebar({
  selectedPreset,
  onSelectPreset,
  onClose,
  themeToggle,
}: Props) {
  return (
    <Box
      sx={{
        width: 260,
        flexShrink: 0,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        bgcolor: "background.paper",
        borderRight: 1,
        borderColor: "divider",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          px: 2.5,
          pt: 3,
          pb: 2,
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        <Box
          component="img"
          src={import.meta.env.BASE_URL + "img/favicon/logo-64.png"}
          alt="Logo"
          sx={{ width: 28, height: 28 }}
        />
        <Box>
          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: 700,
              lineHeight: 1.2,
              textTransform: "uppercase",
              letterSpacing: "0.03em",
            }}
          >
            DEVICE-TYPE-DETECTION
          </Typography>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ fontWeight: 500, letterSpacing: "0.06em" }}
          >
            Playground &middot; v{__APP_VERSION__}
          </Typography>
        </Box>
      </Box>

      {/* Presets list — scrollable */}
      <Box sx={{ flex: 1, overflowY: "auto" }}>
        <List disablePadding sx={{ pt: 1 }}>
          {PRESET_GROUPS.map((group) => {
            const Icon = GROUP_ICONS[group.icon];
            return (
              <li key={group.label}>
                <ul style={{ padding: 0 }}>
                  <ListSubheader
                    sx={{
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                      fontSize: "0.7rem",
                      lineHeight: "36px",
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <Icon sx={{ fontSize: "1rem", color: "text.secondary" }} />
                    {group.label}
                  </ListSubheader>
                  {group.presets.map((preset) => {
                    const isSelected = selectedPreset === preset.name;
                    return (
                      <ListItemButton
                        key={preset.name}
                        selected={isSelected}
                        onClick={() => {
                          onSelectPreset(
                            preset.name,
                            preset.width,
                            preset.height,
                            group.simulateUA,
                          );
                          onClose?.();
                        }}
                        sx={{
                          py: 0.5,
                          borderLeft: 3,
                          borderColor: isSelected
                            ? "primary.main"
                            : "transparent",
                          transition:
                            "border-color 0.15s ease, background-color 0.15s ease",
                        }}
                      >
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          <Icon
                            fontSize="small"
                            color={isSelected ? "primary" : "disabled"}
                          />
                        </ListItemIcon>
                        <ListItemText
                          primary={preset.name}
                          primaryTypographyProps={{
                            variant: "body2",
                            noWrap: true,
                          }}
                        />
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ ml: 1, flexShrink: 0 }}
                        >
                          {preset.width}&times;{preset.height}
                        </Typography>
                      </ListItemButton>
                    );
                  })}
                </ul>
              </li>
            );
          })}
        </List>
      </Box>

      {/* Theme toggle — pinned at bottom */}
      {themeToggle && (
        <>
          <Divider />
          <Box
            sx={{
              p: 1.5,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 1,
            }}
          >
            {themeToggle}
          </Box>
        </>
      )}
    </Box>
  );
}
