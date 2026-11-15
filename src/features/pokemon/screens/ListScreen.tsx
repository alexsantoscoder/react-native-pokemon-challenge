import { useCallback } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { COLORS, CONTENT_MAX_WIDTH } from "@/config/theme";
import PokemonCard from "@/features/pokemon/components/PokemonCard";
import PokemonScreenState from "@/features/pokemon/components/PokemonScreenState";
import { usePokemonList } from "@/features/pokemon/hooks/usePokemonList";
import { ROUTES } from "@/navigation/routes";
import type { PokemonScreenProps } from "@/navigation/types";

type ScreenProps = PokemonScreenProps<typeof ROUTES.POKEMON.LIST>;

const ListScreen = ({ navigation }: ScreenProps) => {
  const { pokemon, isLoading, error, refetch } = usePokemonList();
  const { top, left, right } = useSafeAreaInsets();

  const gotoDetail = useCallback((pokemonId: number) => {
    navigation.navigate(ROUTES.POKEMON.DETAIL, { pokemonId });
  }, [navigation]);

  return (
    <View style={[styles.container, { paddingTop: top, paddingLeft: left, paddingRight: right }]}>
      <View style={styles.header}>
        <Text accessibilityRole="header" style={styles.title}>Pokedex</Text>
        {!isLoading && !error && pokemon.length > 0 && (
          <Text style={styles.count}>
            {pokemon.length} {pokemon.length === 1 ? "entry" : "entries"}
          </Text>
        )}
      </View>

      {isLoading ? (
        <PokemonScreenState kind="loading" message="Loading Pokémon..." />
      ) : error ? (
        <PokemonScreenState kind="error" message={error} onRetry={refetch} />
      ) : pokemon.length === 0 ? (
        <PokemonScreenState kind="empty" message="No Pokémon found." />
      ) : (
        <FlatList
          data={pokemon}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <PokemonCard pokemon={item} onPress={gotoDetail} />}
          contentContainerStyle={styles.list}
          initialNumToRender={20}
          maxToRenderPerBatch={20}
          windowSize={2}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    alignSelf: "center",
    width: "100%",
    maxWidth: CONTENT_MAX_WIDTH,
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 16,
    gap: 4,
  },
  title: {
    color: COLORS.text,
    fontSize: 32,
    fontWeight: "800",
  },
  count: {
    color: COLORS.textSecondary,
    fontSize: 14,
  },
  list: {
    alignSelf: "center",
    width: "100%",
    maxWidth: CONTENT_MAX_WIDTH,
    paddingHorizontal: 16,
    paddingBottom: 24,
    gap: 12,
  },
});

export default ListScreen;
