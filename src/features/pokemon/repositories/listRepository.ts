
import { fetchPokemonList } from "@/features/pokemon/apis/listApi";

import type { Pokemon } from "@/features/pokemon/models/Pokemon";

/**
 * ListRepository - Retrieves and transforms Pokémon
 * list data into application models.
 */
export async function getPokemonList(
  signal?: AbortSignal
): Promise<Pokemon[]> {

  const data = await fetchPokemonList(signal);

  return data.results.map((item): Pokemon => {

    // Extract the Pokémon ID from its API URL.
    const match = item.url.match(/\/pokemon\/(\d+)\/?$/);

    if (!match) {
      throw new Error(`Invalid Pokémon URL: ${item.url}`);
    }

    const id = Number(match[1]);

    return {
      id,
      name: item.name,
      image:
        `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`,
    };
  });
}
