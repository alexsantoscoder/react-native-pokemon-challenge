import type { ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { COLORS } from "@/config/theme";

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
