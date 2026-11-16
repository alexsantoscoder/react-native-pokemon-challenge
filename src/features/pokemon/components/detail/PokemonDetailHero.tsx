/**
 * Introduces the selected Pokémon with its artwork, Pokédex number, name,
 * and color-coded type badges.
 */

// Native UI
import { Image, StyleSheet, Text, View } from "react-native";

// App theme
import { COLORS } from "@/config/theme";

// Pokémon model
import type { PokemonDetail } from "@/features/pokemon/models/PokemonDetail";

type PokemonDetailHeroProps = Pick<PokemonDetail, "id" | "name" | "image" | "types">;

const TYPE_COLORS = new Map([
  ["normal", "#C6BDAE"],
  ["fire", "#FFA477"],
  ["water", "#8ABCF6"],
  ["electric", "#E9CD68"],
  ["grass", "#9BCB83"],
  ["ice", "#9CDCDD"],
  ["fighting", "#E99A91"],
  ["poison", "#CAA2E3"],
  ["ground", "#D7B485"],
  ["flying", "#B0B9EC"],
  ["psychic", "#F0A0BA"],
  ["bug", "#BACA73"],
  ["rock", "#D5C28B"],
  ["ghost", "#B9A5DC"],
  ["dragon", "#B7A8F2"],
  ["dark", "#BBA9A5"],
  ["steel", "#B8C1CC"],
  ["fairy", "#E7ADD1"],
]);

export default function PokemonDetailHero({ id, name, image, types }: PokemonDetailHeroProps) {
  return (
    <View style={styles.hero}>
      {!!image && (
        <Image
          source={{ uri: image }}
          style={styles.image}
          resizeMode="contain"
          accessibilityLabel={`${name} artwork`}
        />
      )}

      <Text style={styles.number}>#{String(id).padStart(3, "0")}</Text>
      <Text accessibilityRole="header" style={styles.name}>{name}</Text>

      {types.length > 0 && (
        <View style={styles.types}>
          {types.map((type) => {
            const color = TYPE_COLORS.get(type) ?? COLORS.textSecondary;
            return (
              <View
                key={type}
                style={[styles.typeBadge, { backgroundColor: `${color}1A`, borderColor: `${color}40` }]}
              >
                <Text style={[styles.typeText, { color }]}>{type}</Text>
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    alignItems: "center",
    gap: 6,
  },
  image: {
    width: "100%",
    height: 260,
    marginBottom: 8,
  },
  number: {
    color: COLORS.textSecondary,
    fontSize: 14,
    fontVariant: ["tabular-nums"],
  },
  name: {
    color: COLORS.text,
    fontSize: 36,
    fontWeight: "800",
    textAlign: "center",
    textTransform: "capitalize",
  },
  types: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 8,
    marginTop: 8,
  },
  typeBadge: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  typeText: {
    fontSize: 14,
    fontWeight: "600",
    textTransform: "capitalize",
  },
});
