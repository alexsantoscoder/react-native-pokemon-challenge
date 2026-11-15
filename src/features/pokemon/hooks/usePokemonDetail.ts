
import { useEffect, useState } from "react";

import { getPokemonDetail } from "@/features/pokemon/repositories/detailRepository";

import type { PokemonDetail } from "@/features/pokemon/models/PokemonDetail";

/**
 * usePokemonDetail - Manages Pokémon detail state.
 *
 * Handles fetching by ID, loading, errors,
 * cancellation, and retry functionality.
 */
export function usePokemonDetail(pokemonId: number) {

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

    // Cancel stale requests when the ID changes or
    // the screen unmounts.
    return () => controller.abort();

  }, [pokemonId, retryCount]);

  /**
   * Triggers another request for Pokémon details.
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
