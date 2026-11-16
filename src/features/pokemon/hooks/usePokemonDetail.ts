/**
 * Loads details for a Pokémon ID through the repository, which can fall back
 * to SQLite. Exposes loading and error state plus a manual retry.
 */

// React state and effects
import { useEffect, useState } from "react";

// Shared SQLite database
import { useSQLiteContext } from "expo-sqlite";

// Pokémon detail repository
import { getPokemonDetail } from "@/features/pokemon/repositories/detailRepository";

// Pokémon detail model
import type { PokemonDetail } from "@/features/pokemon/models/PokemonDetail";

export function usePokemonDetail(pokemonId: number) {

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
      // Clear stale details when a new load starts, including when the Pokémon ID changes.
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
            "Unable to load Pokémon details. Verify you have internet connection and try again."
          );
        }

      } finally {

        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    void loadPokemonDetail();

    // Cancel the previous request when the effect restarts or the screen unmounts.
    return () => controller.abort();

  }, [db, pokemonId, retryCount]);

  /**
   * Schedules a fresh request for the current Pokémon ID by restarting the effect.
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
