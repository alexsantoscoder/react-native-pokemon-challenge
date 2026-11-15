import Ionicons from "@expo/vector-icons/Ionicons";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";

import { COLORS, CONTENT_MAX_WIDTH } from "@/config/theme";
import PokemonScreenState from "@/features/pokemon/components/PokemonScreenState";
import { usePokemonDetail } from "@/features/pokemon/hooks/usePokemonDetail";
import { ROUTES } from "@/navigation/routes";
import type { PokemonScreenProps } from "@/navigation/types";

type ScreenProps = PokemonScreenProps<typeof ROUTES.POKEMON.DETAIL>;

const STAT_LABELS: Record<string, string> = {
  hp: "HP",
  attack: "Attack",
  defense: "Defense",
  "special-attack": "Sp. Attack",
  "special-defense": "Sp. Defense",
  speed: "Speed",
};

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

const DetailScreen = ({ route }: ScreenProps) => {
  const { pokemon, isLoading, error, refetch } = usePokemonDetail(route.params.pokemonId);
  const { fontScale } = useWindowDimensions();

  if (isLoading) {
    return <PokemonScreenState kind="loading" message="Loading Pokémon details..." />;
  }

  if (error) {
    return <PokemonScreenState kind="error" message={error} onRetry={refetch} />;
  }

  if (!pokemon) {
    return <PokemonScreenState kind="empty" message="Pokémon details not found." />;
  }

  const attributes = [
    { label: "Height", value: `${pokemon.height.toFixed(1)} m`, icon: "resize-outline" },
    { label: "Weight", value: `${pokemon.weight.toFixed(1)} kg`, icon: "scale-outline" },
    { label: "Base XP", value: pokemon.baseExperience, icon: "flash-outline" },
  ] as const;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      indicatorStyle="white"
    >
      <View style={styles.hero}>
        {!!pokemon.image && (
          <Image
            source={{ uri: pokemon.image }}
            style={styles.image}
            resizeMode="contain"
            accessibilityLabel={`${pokemon.name} artwork`}
          />
        )}

        <Text style={styles.number}>#{String(pokemon.id).padStart(3, "0")}</Text>
        <Text accessibilityRole="header" style={styles.name}>{pokemon.name}</Text>

        {pokemon.types.length > 0 && (
          <View style={styles.types}>
            {pokemon.types.map((type) => {
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

      <View style={styles.attributes}>
        {attributes.map(({ label, value, icon }) => (
          <View key={label} style={[styles.attribute, { flexBasis: 88 * fontScale }]}>
            <Ionicons name={icon} size={20} color={COLORS.textSecondary} accessible={false} />
            <Text style={styles.label}>{label}</Text>
            <Text style={styles.value}>{value}</Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeading}>
          <Ionicons name="layers-outline" size={20} color={COLORS.textSecondary} accessible={false} />
          <Text accessibilityRole="header" style={styles.sectionTitle}>Abilities</Text>
        </View>
        <View style={styles.abilities}>
          {pokemon.abilities.map((ability) => (
            <View key={ability} style={styles.abilityBadge}>
              <Text style={styles.abilityText}>{ability.replace(/-/g, " ")}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeading}>
          <Ionicons name="stats-chart-outline" size={20} color={COLORS.textSecondary} accessible={false} />
          <Text accessibilityRole="header" style={styles.sectionTitle}>Base Stats</Text>
        </View>
        <View style={styles.stats}>
          {pokemon.stats.map((stat) => {
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
      </View>
    </ScrollView>
  );
};

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
  attributes: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  attribute: {
    flexGrow: 1,
    maxWidth: "100%",
    alignItems: "center",
    gap: 6,
    paddingVertical: 14,
    paddingHorizontal: 8,
    backgroundColor: COLORS.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  label: {
    color: COLORS.textSecondary,
    fontSize: 13,
    textAlign: "center",
  },
  value: {
    color: COLORS.text,
    fontSize: 17,
    fontWeight: "700",
    textAlign: "center",
    fontVariant: ["tabular-nums"],
  },
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

export default DetailScreen;
