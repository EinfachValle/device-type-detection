import { createTheme } from "@mui/material";

export type ThemeMode = "light" | "dark" | "auto";

export function getTheme(mode: ThemeMode, systemPrefersDark: boolean) {
  const isDark =
    mode === "auto" ? systemPrefersDark : mode === "dark" ? true : false;

  return createTheme({
    palette: {
      mode: isDark ? "dark" : "light",
      primary: {
        main: isDark ? "#bb86fc" : "#7c4dff",
      },
      success: {
        main: "#4caf50",
      },
      background: {
        default: isDark ? "#121212" : "#f5f5f5",
        paper: isDark ? "#1e1e1e" : "#ffffff",
      },
    },
    typography: {
      fontFamily: "'Roboto', sans-serif",
    },
    shape: {
      borderRadius: 8,
    },
  });
}
