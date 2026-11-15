
import { useEffect, useState } from "react";
import { useSQLiteContext } from "expo-sqlite";

import { getPokemonDetail } from "@/features/pokemon/repositories/detailRepository";

import type { PokemonDetail } from "@/features/pokemon/models/PokemonDetail";

/**
 * usePokemonDetail - Manages Pokémon detail state.
 *
 * Handles:
 * 1. Fetching Pokémon details by ID.
 * 2. Loading and error states.
 * 3. Request cancellation.
 * 4. Manual retries.
 */
export function usePokemonDetail(pokemonId: number) {

  // Access the shared SQLite database.
  const db = useSQLiteContext();

  const [pokemon, setPokemon] = useState<PokemonDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {

    const controller = new AbortController();

    async function loadPokemonDetail() {

      setIsLoading(true);
      setError(null);
      setPokemon(null);

      try {

        const data = await getPokemonDetail(
          db,
          pokemonId,
          controller.signal
        );

        if (!controller.signal.aborted) {
          setPokemon(data);
        }

      } catch (error) {

        if (!controller.signal.aborted) {
          setError(
            "Unable to load Pokémon details. Please try again."
          );
        }

      } finally {

        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    void loadPokemonDetail();

    // Cancel pending requests when the Pokémon ID
    // changes or the screen unmounts.
    return () => controller.abort();

  }, [db, pokemonId, retryCount]);

  /**
   * Triggers another detail request.
   */
  function refetch() {
    setRetryCount((current) => current + 1);
  }

  return {
    pokemon,
    isLoading,
    error,
    refetch,
  };
}
