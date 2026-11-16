/**
 * Displays the Pokédex carousel and opens the details for the selected Pokémon.
 * Falls back to cached entries when fetching fails and lets users retry a failed load.
 */

// React
import { useCallback } from "react";

// Pokémon layout and UI components
import PokemonCarousel from "@/features/pokemon/components/list/PokemonCarousel";
import PokemonListScreen from "@/features/pokemon/components/list/PokemonListScreen";
import PokemonScreenState from "@/features/pokemon/components/PokemonScreenState";

// Pokémon list data
import { usePokemonList } from "@/features/pokemon/hooks/usePokemonList";

// Navigation
import { ROUTES } from "@/navigation/routes";
import type { PokemonScreenProps } from "@/navigation/types";

type ScreenProps = PokemonScreenProps<typeof ROUTES.POKEMON.LIST>;

const ListScreen = ({ navigation }: ScreenProps) => {
  const { pokemon, isLoading, error, refetch } = usePokemonList();

  const gotoDetail = useCallback((pokemonId: number) => {

    navigation.navigate(ROUTES.POKEMON.DETAIL, { pokemonId });
    
  }, [navigation]);

  return (
    <PokemonListScreen>
      {/* The list starts empty, so loading and errors take precedence. */}
      {isLoading ? (
        <PokemonScreenState kind="loading" message="Loading Pokémon..." />
      ) : error ? (
        <PokemonScreenState kind="error" message={error} onRetry={refetch} />
      ) : pokemon.length === 0 ? (
        <PokemonScreenState kind="empty" message="No Pokémon found." />
      ) : (
        <PokemonCarousel pokemon={pokemon} onPokemonPress={gotoDetail} />
      )}
    </PokemonListScreen>
  );
};

export default ListScreen;
