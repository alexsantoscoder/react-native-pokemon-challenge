
/**
 * App - Root component of the Pokémon application.
 *
 * Initialization flow:
 * 1. Configures the native splash screen.
 * 2. Prevents automatic splash screen dismissal.
 * 3. Initializes SQLite and applies migrations.
 * 4. Renders the application navigation tree.
 * 5. Dismisses the splash screen when navigation is ready.
 */

// Expo components and utilities
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";
import { SQLiteProvider } from "expo-sqlite";

// Navigation
import { DarkTheme, NavigationContainer } from "@react-navigation/native";
import { COLORS } from "@/config/theme";
import MainNavigator from "@/navigation/MainNavigator";

// Database
import { initializeDatabase } from "@/db/database";

const navigationTheme = {
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

// Configure native splash screen fade-out animation.
SplashScreen.setOptions({
  duration: 500,
  fade: true,
});

// Prevent automatic splash screen dismissal.
void SplashScreen.preventAutoHideAsync();

export default function App() {
  return (
    <SQLiteProvider
      databaseName="pokemon.db"
      onInit={initializeDatabase}>
      <NavigationContainer
        theme={navigationTheme}
        onReady={() => {
          void SplashScreen.hideAsync();
        }}>
        <StatusBar style="light" />
        <MainNavigator />
      </NavigationContainer>
    </SQLiteProvider>
  );
}
