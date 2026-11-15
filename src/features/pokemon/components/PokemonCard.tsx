
import {
  View,
  Text,
  Image,
  Pressable,
  StyleSheet,
} from "react-native";

import { memo } from "react";
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
      style={styles.card}
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

      <View>
        <Text style={styles.name}>
          {pokemon.name}
        </Text>

        <Text style={styles.number}>
          #{String(pokemon.id).padStart(3, "0")}
        </Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    padding: 16,
    gap: 16,
  },
  image: {
    width: 90,
    height: 90,
  },
  name: {
    fontSize: 18,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  number: {
    fontSize: 14,
    color: "#666666",
    marginTop: 4,
  },
});

export default memo(PokemonCard);
