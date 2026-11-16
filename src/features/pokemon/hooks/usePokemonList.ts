/**
 * Loads the Pokémon list through the repository, which can fall back to
 * SQLite. Exposes loading and error state plus a manual retry.
 */

// React state and effects
import { useEffect, useState } from "react";

// Shared SQLite database
import { useSQLiteContext } from "expo-sqlite";

// Pokémon list repository
import { getPokemonList } from "@/features/pokemon/repositories/listRepository";

// Pokémon list model
import type { Pokemon } from "@/features/pokemon/models/Pokemon";

export function usePokemonList() {

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
            "Unable to load Pokémon. Verify you have internet connection and try again."
          );
        }

      } finally {

        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    void loadPokemon();

    // Cancel the previous request when the effect restarts or the screen unmounts.
    return () => controller.abort();

  }, [db, retryCount]);

  /**
   * Schedules a fresh list request by restarting the effect.
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
