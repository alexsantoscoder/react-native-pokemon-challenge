
/**
 * DetailApi - Retrieves individual Pokémon data
 * from PokéAPI.
 */
import { API_BASE_URL } from "@/config/api";

interface NamedResource {
  name: string;
  url: string;
}

/**
 * Raw Pokémon detail response from PokéAPI.
 */
export interface PokemonDetailResponse {
  id: number;
  name: string;
  height: number;
  weight: number;
  base_experience: number | null;

  sprites: {
    other: {
      "official-artwork": {
        front_default: string | null;
      };
    };
    front_default: string | null;
  };

  types: {
    slot: number;
    type: NamedResource;
  }[];

  abilities: {
    ability: NamedResource;
    is_hidden: boolean;
    slot: number;
  }[];

  stats: {
    base_stat: number;
    effort: number;
    stat: NamedResource;
  }[];
}

/**
 * Fetches Pokémon details using the selected ID.
 */
export async function fetchPokemonDetail(
  pokemonId: number,
  signal?: AbortSignal
): Promise<PokemonDetailResponse> {

  if (!Number.isSafeInteger(pokemonId) || pokemonId <= 0) {
    throw new Error("Invalid Pokémon ID");
  }

  const response = await fetch(
    `${API_BASE_URL}/pokemon/${pokemonId}`,
    { signal }
  );

  if (!response.ok) {
    throw new Error(
      `Failed to fetch Pokémon details: ${response.status}`
    );
  }

  return (await response.json()) as PokemonDetailResponse;
}
