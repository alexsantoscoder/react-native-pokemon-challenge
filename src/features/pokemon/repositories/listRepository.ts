/**
 * Fetches the Pokémon list from PokéAPI and maps it to the app's list model.
 * Saves successful results in SQLite for use when a later request fails.
 */

// SQLite database type
import type { SQLiteDatabase } from "expo-sqlite";

// PokéAPI list request
import { fetchPokemonList } from "@/features/pokemon/apis/listApi";

// SQLite cache
import {
  savePokemonList,
  getCachedPokemonList,
} from "@/features/pokemon/storage/pokemonStorage";

// Pokémon list model
import type { Pokemon } from "@/features/pokemon/models/Pokemon";

export async function getPokemonList(
  db: SQLiteDatabase,
  signal?: AbortSignal
): Promise<Pokemon[]> {

  try {

    const data = await fetchPokemonList(signal);

    const pokemon = data.results.map((item): Pokemon => {

      // The list response provides the Pokémon ID in its URL.
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

    // Skip the cache write if the request was cancelled during the fetch.
    if (signal?.aborted) {
      throw new Error("Request cancelled");
    }

    // A cache write failure still allows the freshly fetched list to be returned.
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

    const cachedPokemon = await getCachedPokemonList(db);

    if (cachedPokemon !== null) {
      return cachedPokemon;
    }

    throw error;
  }
}
