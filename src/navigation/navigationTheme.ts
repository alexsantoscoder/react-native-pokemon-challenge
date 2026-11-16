/**
 * Applies the app palette to React Navigation while retaining the other
 * dark theme defaults.
 */

// React Navigation theme
import { DarkTheme } from "@react-navigation/native";

// App palette
import { COLORS } from "@/config/theme";

export const navigationTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: COLORS.primary,
    background: COLORS.background,
    card: COLORS.backgroundSecondary,
    text: COLORS.text,
    border: COLORS.border,
    notification: COLORS.error,
  },
};
