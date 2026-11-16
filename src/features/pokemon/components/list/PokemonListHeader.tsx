/**
 * Supplies the Pokédex list screen's visible and accessible heading.
 */

// Native UI
import { StyleSheet, Text, View } from "react-native";

// App theme
import { COLORS, CONTENT_MAX_WIDTH } from "@/config/theme";

export default function PokemonListHeader() {
  return (
    <View style={styles.header}>
      <Text accessibilityRole="header" style={styles.title}>Pokedex</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    alignSelf: "center",
    width: "100%",
    maxWidth: CONTENT_MAX_WIDTH,
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 8,
  },
  title: {
    color: COLORS.primary,
    fontSize: 32,
    fontWeight: "800",
  },
});
