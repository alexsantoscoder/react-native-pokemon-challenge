import { useCallback } from "react";

import PokemonCarousel from "@/features/pokemon/components/PokemonCarousel";
import PokemonListScreen from "@/features/pokemon/components/PokemonListScreen";
import PokemonScreenState from "@/features/pokemon/components/PokemonScreenState";
import { usePokemonList } from "@/features/pokemon/hooks/usePokemonList";
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
