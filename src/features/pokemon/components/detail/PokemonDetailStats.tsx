/**
 * Displays each base stat as a label, a numeric value, and a bar on a shared scale.
 */

// Native UI
import { StyleSheet, Text, View } from "react-native";

// App theme
import { COLORS } from "@/config/theme";

// Pokémon model
import type { PokemonStat } from "@/features/pokemon/models/PokemonDetail";

// Related components
import PokemonDetailSection from "./PokemonDetailSection";

interface PokemonDetailStatsProps {
  stats: PokemonStat[];
}

const STAT_LABELS: Record<string, string> = {
  hp: "HP",
  attack: "Attack",
  defense: "Defense",
  "special-attack": "Sp. Attack",
  "special-defense": "Sp. Defense",
  speed: "Speed",
};

export default function PokemonDetailStats({ stats }: PokemonDetailStatsProps) {
  return (
    <PokemonDetailSection title="Base Stats" icon="stats-chart-outline">
      <View style={styles.stats}>
        {stats.map((stat) => {
          // Use the same 255-point scale for every bar and keep the fill within the track.
          const fill = Math.min(Math.max((stat.value / 255) * 100, 0), 100);

          return (
            <View key={stat.name} style={styles.stat}>
              <View style={styles.statHeading}>
                <Text style={styles.statLabel}>{STAT_LABELS[stat.name] ?? stat.name}</Text>
                <Text style={styles.statValue}>{stat.value}</Text>
              </View>
              <View style={styles.statTrack} accessible={false}>
                <View style={[styles.statFill, { width: `${fill}%` }]} />
              </View>
            </View>
          );
        })}
      </View>
    </PokemonDetailSection>
  );
}

const styles = StyleSheet.create({
  stats: {
    gap: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 18,
    backgroundColor: COLORS.card,
  },
  stat: {
    gap: 6,
  },
  statHeading: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    gap: 12,
  },
  statLabel: {
    flexShrink: 1,
    color: COLORS.textSecondary,
    fontSize: 14,
  },
  statValue: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: "700",
    fontVariant: ["tabular-nums"],
  },
  statTrack: {
    height: 8,
    borderRadius: 4,
    overflow: "hidden",
    backgroundColor: COLORS.divider,
  },
  statFill: {
    height: "100%",
    borderRadius: 4,
    backgroundColor: COLORS.primary,
  },
});
