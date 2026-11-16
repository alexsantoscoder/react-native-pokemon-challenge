/**
 * Shows the artwork, attributes, abilities, and base stats for the Pokémon
 * selected by the route. Uses cached details as a fallback and lets users
 * retry a failed load.
 */

// Pokémon layout and UI components
import PokemonDetailAbilities from "@/features/pokemon/components/detail/PokemonDetailAbilities";
import PokemonDetailAttributes from "@/features/pokemon/components/detail/PokemonDetailAttributes";
import PokemonDetailHero from "@/features/pokemon/components/detail/PokemonDetailHero";
import PokemonDetailScreen from "@/features/pokemon/components/detail/PokemonDetailScreen";
import PokemonDetailStats from "@/features/pokemon/components/detail/PokemonDetailStats";
import PokemonScreenState from "@/features/pokemon/components/PokemonScreenState";

// Pokémon detail data
import { usePokemonDetail } from "@/features/pokemon/hooks/usePokemonDetail";

// Navigation
import { ROUTES } from "@/navigation/routes";
import type { PokemonScreenProps } from "@/navigation/types";

type ScreenProps = PokemonScreenProps<typeof ROUTES.POKEMON.DETAIL>;

const DetailScreen = ({ route }: ScreenProps) => {
  
  const { pokemon, isLoading, error, refetch } = usePokemonDetail(route.params.pokemonId);

  // Each request clears the details, so loading and errors take precedence over the empty state.
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
    <PokemonDetailScreen>
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
    </PokemonDetailScreen>
  );
};

export default DetailScreen;
