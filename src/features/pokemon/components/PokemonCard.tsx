
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
      <Image
        source={{ uri: pokemon.image }}
        style={styles.image}
        resizeMode="contain"
        accessibilityLabel={pokemon.name}
      />

      <View style={styles.identity}>
        <Text style={styles.name}>
          {pokemon.name}
        </Text>

        <Text style={styles.number}>
          #{String(pokemon.id).padStart(3, "0")}
        </Text>
      </View>

      <Ionicons
        name="chevron-forward"
        size={20}
        color={COLORS.textSecondary}
        accessible={false}
      />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.card,
    borderColor: COLORS.border,
    borderWidth: 1,
    borderRadius: 18,
    padding: 12,
    gap: 14,
  },
  cardPressed: {
    backgroundColor: COLORS.surface,
  },
  image: {
    width: 84,
    height: 84,
  },
  identity: {
    flex: 1,
  },
  name: {
    color: COLORS.text,
    fontSize: 20,
    fontWeight: "700",
    textTransform: "capitalize",
  },
  number: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontVariant: ["tabular-nums"],
    marginTop: 4,
  },
});

export default memo(PokemonCard);
