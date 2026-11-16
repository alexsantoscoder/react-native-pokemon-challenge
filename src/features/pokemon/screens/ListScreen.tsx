import { useCallback } from "react";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { COLORS } from "@/config/theme";
import PokemonCarousel from "@/features/pokemon/components/PokemonCarousel";
import PokemonListHeader from "@/features/pokemon/components/PokemonListHeader";
import PokemonScreenState from "@/features/pokemon/components/PokemonScreenState";
import { usePokemonList } from "@/features/pokemon/hooks/usePokemonList";
import { ROUTES } from "@/navigation/routes";
import type { PokemonScreenProps } from "@/navigation/types";

type ScreenProps = PokemonScreenProps<typeof ROUTES.POKEMON.LIST>;

const ListScreen = ({ navigation }: ScreenProps) => {
  const { pokemon, isLoading, error, refetch } = usePokemonList();
  const { top, bottom, left, right } = useSafeAreaInsets();

  const gotoDetail = useCallback((pokemonId: number) => {
    navigation.navigate(ROUTES.POKEMON.DETAIL, { pokemonId });
  }, [navigation]);

  return (
    <View style={[
      styles.container,
      { paddingTop: top, paddingBottom: bottom, paddingLeft: left, paddingRight: right },
    ]}>
      <PokemonListHeader />

      {isLoading ? (
        <PokemonScreenState kind="loading" message="Loading Pokémon..." />
      ) : error ? (
        <PokemonScreenState kind="error" message={error} onRetry={refetch} />
      ) : pokemon.length === 0 ? (
        <PokemonScreenState kind="empty" message="No Pokémon found." />
      ) : (
        <PokemonCarousel pokemon={pokemon} onPokemonPress={gotoDetail} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
});

export default ListScreen;
