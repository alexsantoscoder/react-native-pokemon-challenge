import { StyleSheet, Text, View } from "react-native";

import { COLORS } from "@/config/theme";

import PokemonDetailSection from "./PokemonDetailSection";

interface PokemonDetailAbilitiesProps {
  abilities: string[];
}

export default function PokemonDetailAbilities({ abilities }: PokemonDetailAbilitiesProps) {
  return (
    <PokemonDetailSection title="Abilities" icon="layers-outline">
      <View style={styles.abilities}>
        {abilities.map((ability) => (
          <View key={ability} style={styles.abilityBadge}>
            <Text style={styles.abilityText}>{ability.replace(/-/g, " ")}</Text>
          </View>
        ))}
      </View>
    </PokemonDetailSection>
  );
}

const styles = StyleSheet.create({
  abilities: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  abilityBadge: {
    backgroundColor: COLORS.surface,
    borderColor: COLORS.border,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  abilityText: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: "500",
    textTransform: "capitalize",
  },
});
