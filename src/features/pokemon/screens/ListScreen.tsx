
import {
    View,
    Text,
    Pressable,
    FlatList,
    ActivityIndicator,
    StyleSheet,
} from "react-native";

import { useCallback } from "react";

// Navigation
import { ROUTES } from "@/navigation/routes";
import type { PokemonScreenProps } from "@/navigation/types";

// Pokémon feature
import PokemonCard from "@/features/pokemon/components/PokemonCard";
import { usePokemonList } from "@/features/pokemon/hooks/usePokemonList";

import type {
    Pokemon,
} from "@/features/pokemon/models/Pokemon";

type ScreenProps = PokemonScreenProps<typeof ROUTES.POKEMON.LIST>;

/**
 * ListScreen - Displays the first 20 Pokémon.
 *
 * Responsibilities:
 * 1. Displays the Pokémon list.
 * 2. Handles loading, error, and empty states.
 * 3. Navigates to the selected Pokémon's detail screen.
 */
const ListScreen = ({ navigation }: ScreenProps) => {

    const {
        pokemon,
        isLoading,
        error,
        refetch,
    } = usePokemonList();

    /**
     * Navigates to the selected Pokémon's detail screen.
     */

    const gotoDetail = useCallback((pokemonId: number) => {
        navigation.navigate(ROUTES.POKEMON.DETAIL, {
            pokemonId,
        });
    }, [navigation]);

    // Loading state
    if (isLoading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" />
                <Text>Loading Pokémon...</Text>
            </View>
        );
    }

    // Error state
    if (error) {
        return (
            <View style={styles.center}>
                <Text>{error}</Text>

                <Pressable
                    style={styles.retryButton}
                    onPress={refetch}
                    accessibilityRole="button"
                >
                    <Text style={styles.retryText}>
                        Try again
                    </Text>
                </Pressable>
            </View>
        );
    }


   

    // Pokémon list
    return (
        <View style={styles.container}>

            <FlatList

                data={pokemon}

                keyExtractor={(item) => item.id.toString()}

                renderItem={ ({ item }: { item: Pokemon }) => <PokemonCard pokemon={item} onPress={gotoDetail}/>}

                contentContainerStyle={styles.list}
                
                initialNumToRender={20}

                maxToRenderPerBatch={20}
                
                windowSize={2}

                ListEmptyComponent={
                    <Text>No Pokémon found.</Text>
                }
            />

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFFFFF",
    },
    center: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
        gap: 12,
    },
    list: {
        padding: 16,
        gap: 12,
        flexGrow: 1,
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

export default ListScreen;
