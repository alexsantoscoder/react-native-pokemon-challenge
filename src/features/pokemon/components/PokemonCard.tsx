
import Ionicons from "@expo/vector-icons/Ionicons";
import {
  View,
  Text,
  Image,
  Pressable,
  StyleSheet,
} from "react-native";

import { memo } from "react";
import { COLORS } from "@/config/theme";
import type {
  Pokemon,
} from "@/features/pokemon/models/Pokemon";

/**
 * PokemonCard component props.
 */
interface PokemonCardProps {
  pokemon: Pokemon;
  onPress: (pokemonId: number) => void;
}

/**
 * PokemonCard - Displays a Pokémon's image,
 * name, and Pokédex number.
 */
const PokemonCard = ({
  pokemon,
  onPress,
}: PokemonCardProps) => {

  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      onPress={() => onPress(pokemon.id)}
      accessibilityRole="button"
      accessibilityLabel={`View ${pokemon.name} details`}
    >
      <View style={styles.artwork}>
        <Image
          source={{ uri: pokemon.image }}
          style={styles.image}
          resizeMode="contain"
          accessibilityLabel={pokemon.name}
        />
      </View>

      <View style={styles.identity}>
        <Text style={styles.number}>
          #{String(pokemon.id).padStart(3, "0")}
        </Text>
        <View style={styles.nameRow}>
          <Text style={styles.name}>{pokemon.name}</Text>
          <Ionicons
            name="chevron-forward"
            size={20}
            color={COLORS.primarySoft}
            accessible={false}
          />
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    width: "100%",
    maxWidth: 420,
    maxHeight: "100%",
    backgroundColor: COLORS.card,
    borderColor: COLORS.border,
    borderWidth: 1,
    borderRadius: 28,
    padding: 20,
    gap: 16,
  },
  cardPressed: {
    backgroundColor: COLORS.surface,
  },
  artwork: {
    width: "100%",
    aspectRatio: 1,
    flexShrink: 1,
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: 22,
    padding: 12,
  },
  image: {
    flex: 1,
    width: "100%",
  },
  identity: {
    gap: 4,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  name: {
    flexShrink: 1,
    color: COLORS.text,
    fontSize: 34,
    fontWeight: "800",
    textTransform: "capitalize",
  },
  number: {
    fontSize: 14,
    color: COLORS.primarySoft,
    fontVariant: ["tabular-nums"],
    fontWeight: "600",
  },
});

export default memo(PokemonCard);
