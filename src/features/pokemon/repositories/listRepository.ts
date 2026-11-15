
import type { SQLiteDatabase } from "expo-sqlite";

import { fetchPokemonList } from "@/features/pokemon/apis/listApi";

import {
  savePokemonList,
  getCachedPokemonList,
} from "@/features/pokemon/storage/pokemonStorage";

import type { Pokemon } from "@/features/pokemon/models/Pokemon";

/**
 * ListRepository - Retrieves Pokémon from PokéAPI
 * and provides a SQLite fallback when offline.
 */
export async function getPokemonList(
  db: SQLiteDatabase,
  signal?: AbortSignal
): Promise<Pokemon[]> {

  try {

    // Fetch fresh Pokémon data.
    const data = await fetchPokemonList(signal);

    const pokemon = data.results.map((item): Pokemon => {

      const match = item.url.match(/\/pokemon\/(\d+)\/?$/);

      if (!match) {
        throw new Error(`Invalid Pokémon URL: ${item.url}`);
      }

      const id = Number(match[1]);

      return {
        id,
        name: item.name,
        image:`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`,
      };
    });

    // Do not cache data from a cancelled request.
    if (signal?.aborted) {
      throw new Error("Request cancelled");
    }

    // Cache successful responses without blocking display.
    try {
      await savePokemonList(db, pokemon);
    } catch (cacheError) {
      console.warn("Unable to cache Pokémon list:", cacheError);
    }

    return pokemon;

  } catch (error) {

    // Cancellation should not trigger an offline fallback.
    if (signal?.aborted) {
      throw error;
    }

    // Try cached data when the network or response fails.
    const cachedPokemon = await getCachedPokemonList(db);

    if (cachedPokemon !== null) {
      return cachedPokemon;
    }

    throw error;
  }
}
