/**
 * Provides a scrollable layout for Pokémon details and centers the content
 * within the app's maximum content width.
 */

// React types
import type { ReactNode } from "react";

// Native scroll layout
import { ScrollView, StyleSheet } from "react-native";

// App theme
import { COLORS, CONTENT_MAX_WIDTH } from "@/config/theme";

interface PokemonDetailScreenProps {
  children: ReactNode;
}

export default function PokemonDetailScreen({ children }: PokemonDetailScreenProps) {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      indicatorStyle="white"
    >
      {children}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    alignSelf: "center",
    width: "100%",
    maxWidth: CONTENT_MAX_WIDTH,
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 32,
    gap: 24,
  },
});
