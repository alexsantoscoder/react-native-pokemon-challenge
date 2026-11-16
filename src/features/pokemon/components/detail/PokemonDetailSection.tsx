/**
 * Gives the abilities and base stats sections a shared layout with an
 * accessible heading and a decorative icon.
 */

// Icons
import Ionicons from "@expo/vector-icons/Ionicons";

// React types
import type { ComponentProps, ReactNode } from "react";

// Native UI
import { StyleSheet, Text, View } from "react-native";

// App theme
import { COLORS } from "@/config/theme";

interface PokemonDetailSectionProps {
  title: string;
  icon: ComponentProps<typeof Ionicons>["name"];
  children: ReactNode;
}

export default function PokemonDetailSection({ title, icon, children }: PokemonDetailSectionProps) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeading}>
        <Ionicons name={icon} size={20} color={COLORS.textSecondary} accessible={false} />
        <Text accessibilityRole="header" style={styles.sectionTitle}>{title}</Text>
      </View>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: 12,
  },
  sectionHeading: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  sectionTitle: {
    flexShrink: 1,
    color: COLORS.text,
    fontSize: 20,
    fontWeight: "700",
  },
});
