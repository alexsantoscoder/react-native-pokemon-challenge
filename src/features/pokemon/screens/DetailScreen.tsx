
import {
  View,
  Text,
  Image,
  ScrollView,
  Pressable,
  ActivityIndicator,
  StyleSheet,
} from "react-native";

// Navigation
import { ROUTES } from "@/navigation/routes";
import type { PokemonScreenProps } from "@/navigation/types";

// Pokémon feature
import { usePokemonDetail } from "@/features/pokemon/hooks/usePokemonDetail";

type ScreenProps = PokemonScreenProps<
  typeof ROUTES.POKEMON.DETAIL
>;

/**
 * Human-readable labels for Pokémon statistics.
 */
const STAT_LABELS: Record<string, string> = {
  hp: "HP",
  attack: "Attack",
  defense: "Defense",
  "special-attack": "Sp. Attack",
  "special-defense": "Sp. Defense",
  speed: "Speed",
};

/**
 * DetailScreen - Displays information about
 * the selected Pokémon.
 *
 * Responsibilities:
 * 1. Retrieves the selected Pokémon ID.
 * 2. Displays Pokémon attributes and base stats.
 * 3. Handles loading, error, and retry states.
 */
const DetailScreen = ({ route }: ScreenProps) => {

  const { pokemonId } = route.params;

  const {
    pokemon,
    isLoading,
    error,
    refetch,
  } = usePokemonDetail(pokemonId);

  // Loading state
  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text>Loading Pokémon details...</Text>
      </View>
    );
  }

  // Error state
  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>

        <Pressable
          style={styles.retryButton}
          onPress={refetch}
          accessibilityRole="button"
        >
          <Text style={styles.retryText}>Try again</Text>
        </Pressable>
      </View>
    );
  }

  // Empty state
  if (!pokemon) {
    return (
      <View style={styles.center}>
        <Text>Pokémon details not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >

      {/* Pokémon artwork */}
      {pokemon.image ? (
        <Image
          source={{ uri: pokemon.image }}
          style={styles.image}
          resizeMode="contain"
          accessibilityLabel={`${pokemon.name} artwork`}
        />
      ) : null}

      {/* Pokémon name and number */}
      <Text style={styles.number}>
        #{String(pokemon.id).padStart(3, "0")}
      </Text>

      <Text style={styles.name}>
        {pokemon.name}
      </Text>

      {/* Pokémon types */}
      <View style={styles.types}>
        {pokemon.types.map((type) => (
          <View key={type} style={styles.typeBadge}>
            <Text style={styles.typeText}>
              {type}
            </Text>
          </View>
        ))}
      </View>

      {/* Physical attributes */}
      <View style={styles.attributes}>

        <View style={styles.attribute}>
          <Text style={styles.label}>Height</Text>
          <Text style={styles.value}>
            {pokemon.height.toFixed(1)} m
          </Text>
        </View>

        <View style={styles.attribute}>
          <Text style={styles.label}>Weight</Text>
          <Text style={styles.value}>
            {pokemon.weight.toFixed(1)} kg
          </Text>
        </View>

        <View style={styles.attribute}>
          <Text style={styles.label}>Base XP</Text>
          <Text style={styles.value}>
            {pokemon.baseExperience}
          </Text>
        </View>

      </View>

      {/* Pokémon abilities */}
      <Text style={styles.sectionTitle}>
        Abilities
      </Text>

      <View style={styles.abilities}>
        {pokemon.abilities.map((ability) => (
          <View key={ability} style={styles.abilityBadge}>
            <Text style={styles.abilityText}>
              {ability.replace(/-/g, " ")}
            </Text>
          </View>
        ))}
      </View>

      {/* Pokémon base stats */}
      <Text style={styles.sectionTitle}>
        Base Stats
      </Text>

      {pokemon.stats.map((stat) => (
        <View key={stat.name} style={styles.statRow}>

          <Text style={styles.statLabel}>
            {STAT_LABELS[stat.name] ?? stat.name}
          </Text>

          <View style={styles.statTrack}>
            <View
              style={[
                styles.statFill,
                {
                  width: `${Math.min(
                    Math.max((stat.value / 255) * 100, 0),
                    100
                  )}%`,
                },
              ]}
            />
          </View>

          <Text style={styles.statValue}>
            {stat.value}
          </Text>

        </View>
      ))}

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    gap: 12,
  },
  image: {
    width: "100%",
    height: 260,
  },
  number: {
    fontSize: 16,
    color: "#777777",
    textAlign: "center",
    marginTop: 12,
  },
  name: {
    fontSize: 30,
    fontWeight: "700",
    textAlign: "center",
    textTransform: "capitalize",
    marginTop: 4,
  },
  types: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 8,
    marginTop: 16,
  },
  typeBadge: {
    backgroundColor: "#E8F1FF",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  typeText: {
    color: "#2454A6",
    fontWeight: "600",
    textTransform: "capitalize",
  },
  attributes: {
    flexDirection: "row",
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    padding: 16,
    marginTop: 24,
    gap: 8,
  },
  attribute: {
    flex: 1,
    alignItems: "center",
    gap: 6,
  },
  label: {
    color: "#666666",
    fontSize: 13,
  },
  value: {
    fontSize: 16,
    fontWeight: "600",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginTop: 28,
    marginBottom: 14,
  },
  abilities: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  abilityBadge: {
    backgroundColor: "#F0F0F0",
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 10,
  },
  abilityText: {
    textTransform: "capitalize",
    fontWeight: "500",
  },
  statRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 14,
  },
  statLabel: {
    width: 90,
    fontSize: 12,
    color: "#555555",
  },
  statTrack: {
    flex: 1,
    height: 10,
    backgroundColor: "#E6E6E6",
    borderRadius: 5,
    overflow: "hidden",
  },
  statFill: {
    height: "100%",
    backgroundColor: "#54B78A",
    borderRadius: 5,
  },
  statValue: {
    width: 30,
    fontSize: 13,
    fontWeight: "600",
    textAlign: "right",
  },
  errorText: {
    color: "#B42318",
    textAlign: "center",
  },
  retryButton: {
    backgroundColor: "#222222",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
});

export default DetailScreen;
