
/**
 * ListApi - Retrieves Pokémon list data from PokéAPI.
 */

import { API_BASE_URL } from "@/config/api";

/**
 * Represents a Pokémon entry returned by PokéAPI.
 */
export interface PokemonListItemResponse {
  name: string;
  url: string;
}

/**
 * Represents the paginated Pokémon list response.
 */
export interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: PokemonListItemResponse[];
}

/**
 * Fetches the first 20 Pokémon.
 *
 * Supports request cancellation through AbortSignal.
 */
export async function fetchPokemonList(
  signal?: AbortSignal
): Promise<PokemonListResponse> {

  const response = await fetch(
    `${API_BASE_URL}/pokemon?limit=20&offset=0`,
    { signal }
  );

  if (!response.ok) {
    throw new Error(
      `Failed to fetch Pokémon: ${response.status}`
    );
  }

  return (await response.json()) as PokemonListResponse;
}
