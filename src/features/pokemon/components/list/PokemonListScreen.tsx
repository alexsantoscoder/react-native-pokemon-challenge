/**
 * Places the Pokédex heading above the list content and keeps both within
 * the device's safe area.
 */

// React types
import type { ReactNode } from "react";

// Native layout and safe area
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// App theme
import { COLORS } from "@/config/theme";

// Pokédex heading
import PokemonListHeader from "./PokemonListHeader";

interface PokemonListScreenProps {
  children: ReactNode;
}

export default function PokemonListScreen({ children }: PokemonListScreenProps) {
  const { top, bottom, left, right } = useSafeAreaInsets();

  return (
    <View style={[
      styles.container,
      { paddingTop: top, paddingBottom: bottom, paddingLeft: left, paddingRight: right },
    ]}>
      <PokemonListHeader />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
});
