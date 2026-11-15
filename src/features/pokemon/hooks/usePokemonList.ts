
import { useEffect, useState } from "react";

import { getPokemonList } from "@/features/pokemon/repositories/listRepository";

import type { Pokemon } from "@/features/pokemon/models/Pokemon";

/**
 * usePokemonList - Manages Pokémon list state.
 *
 * Handles loading, errors, request cancellation,
 * and manual retries.
 */
export function usePokemonList() {

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

        const data = await getPokemonList(controller.signal);

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

    // Cancel the request when the effect is cleaned up.
    return () => controller.abort();

  }, [retryCount]);

  /**
   * Triggers another request for the Pokémon list.
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
