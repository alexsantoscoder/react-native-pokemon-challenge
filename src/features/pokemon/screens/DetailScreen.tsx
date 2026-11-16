import { ScrollView, StyleSheet } from "react-native";

import { COLORS, CONTENT_MAX_WIDTH } from "@/config/theme";
import PokemonDetailAbilities from "@/features/pokemon/components/PokemonDetailAbilities";
import PokemonDetailAttributes from "@/features/pokemon/components/PokemonDetailAttributes";
import PokemonDetailHero from "@/features/pokemon/components/PokemonDetailHero";
import PokemonDetailStats from "@/features/pokemon/components/PokemonDetailStats";
import PokemonScreenState from "@/features/pokemon/components/PokemonScreenState";
import { usePokemonDetail } from "@/features/pokemon/hooks/usePokemonDetail";
import { ROUTES } from "@/navigation/routes";
import type { PokemonScreenProps } from "@/navigation/types";

type ScreenProps = PokemonScreenProps<typeof ROUTES.POKEMON.DETAIL>;

const DetailScreen = ({ route }: ScreenProps) => {
  
  const { pokemon, isLoading, error, refetch } = usePokemonDetail(route.params.pokemonId);

  if (isLoading) {
    return <PokemonScreenState kind="loading" message="Loading Pokémon details..." />;
  }

  if (error) {
    return <PokemonScreenState kind="error" message={error} onRetry={refetch} />;
  }

  if (!pokemon) {
    return <PokemonScreenState kind="empty" message="Pokémon details not found." />;
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      indicatorStyle="white"
    >
      <PokemonDetailHero
        id={pokemon.id}
        name={pokemon.name}
        image={pokemon.image}
        types={pokemon.types}
      />
      <PokemonDetailAttributes
        height={pokemon.height}
        weight={pokemon.weight}
        baseExperience={pokemon.baseExperience}
      />
      <PokemonDetailAbilities abilities={pokemon.abilities} />
      <PokemonDetailStats stats={pokemon.stats} />
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
});

export default DetailScreen;
