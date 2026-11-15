
import { useEffect, useState } from "react";
import { useSQLiteContext } from "expo-sqlite";

import { getPokemonList } from "@/features/pokemon/repositories/listRepository";

import type { Pokemon } from "@/features/pokemon/models/Pokemon";

/**
 * usePokemonList - Manages Pokémon list state.
 *
 * Handles:
 * 1. Fetching Pokémon through the repository.
 * 2. Loading and error states.
 * 3. Request cancellation.
 * 4. Manual retries.
 */
export function usePokemonList() {

  // Access the database provided by SQLiteProvider.
  const db = useSQLiteContext();

  const [pokemon, setPokemon] = useState<Pokemon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {

    const controller = new AbortController();

    async function loadPokemon() {

      setIsLoading(true);
      setError(null);

      try {

        const data = await getPokemonList(
          db,
          controller.signal
        );

        if (!controller.signal.aborted) {
          setPokemon(data);
        }

      } catch (error) {

        if (!controller.signal.aborted) {
          setError(
            "Unable to load Pokémon. Please try again."
          );
        }

      } finally {

        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    void loadPokemon();

    // Cancel requests when the component unmounts.
    return () => controller.abort();

  }, [db, retryCount]);

  /**
   * Triggers another Pokémon list request.
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
