
/**
 * App - Root component of the Pokémon application.
 *
 * Initialization flow:
 * 1. Configures the native splash screen fade-out animation.
 * 2. Prevents the splash screen from hiding automatically.
 * 3. Keeps the splash screen visible for 2.5 seconds after mounting.
 * 4. Dismisses the splash screen with a 500ms fade-out animation.
 * 5. Renders the application navigation tree.
 */

// React hooks
import { useEffect } from "react";

// Expo components and utilities
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";

// Navigation
import MainNavigator from "@/navigation/MainNavigator";
import { NavigationContainer } from "@react-navigation/native";

// Configure native splash screen fade-out animation.
SplashScreen.setOptions({
  duration: 500,
  fade: true,
});

// Keep the native splash screen visible until explicitly dismissed.
SplashScreen.preventAutoHideAsync();

export default function App() {

  useEffect(() => {

    // Schedule splash screen dismissal after 2.5 seconds.
    const timer = setTimeout(() => {
      void SplashScreen.hideAsync();
    }, 2500);

    // Clear the timer if the component unmounts.
    return () => clearTimeout(timer);

  }, []);

  // Render the root navigation container and application screens.
  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <MainNavigator />
    </NavigationContainer>
  );
}
