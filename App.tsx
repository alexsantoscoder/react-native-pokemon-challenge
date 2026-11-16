/**
 * Root component for the Pokémon app. It initializes SQLite and applies
 * pending migrations before mounting the themed navigation tree. The splash
 * screen stays visible until navigation is ready.
 */

// Expo startup and status bar
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";

// Navigation
import { NavigationContainer } from "@react-navigation/native";
import MainNavigator from "@/navigation/MainNavigator";
import { navigationTheme } from "@/navigation/navigationTheme";

// SQLite setup and migrations
import { SQLiteProvider } from "expo-sqlite";
import { initializeDatabase } from "@/db/database";

SplashScreen.setOptions({
  duration: 500,
  fade: true,
});

// Keep the splash screen visible until navigation is ready after database initialization.
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
