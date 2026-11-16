/**
 * Fetches a Pokémon by ID and maps the PokéAPI response to the app's detail model.
 * Saves the result in SQLite as a fallback for failed requests for the same ID.
 */

// SQLite database type
import type { SQLiteDatabase } from "expo-sqlite";

// PokéAPI detail request
import { fetchPokemonDetail } from "@/features/pokemon/apis/detailApi";

// SQLite cache
import {
  savePokemonDetail,
  getCachedPokemonDetail,
} from "@/features/pokemon/storage/pokemonStorage";

// Pokémon detail model
import type { PokemonDetail } from "@/features/pokemon/models/PokemonDetail";

export async function getPokemonDetail(
  db: SQLiteDatabase,
  pokemonId: number,
  signal?: AbortSignal
): Promise<PokemonDetail> {

  try {

    const data = await fetchPokemonDetail(
      pokemonId,
      signal
    );

    const pokemon: PokemonDetail = {
      id: data.id,
      name: data.name,

      image:
        data.sprites.other["official-artwork"].front_default
        ?? data.sprites.front_default
        ?? "",

      // Convert decimeters to meters.
      height: data.height / 10,

      // Convert hectograms to kilograms.
      weight: data.weight / 10,

      baseExperience: data.base_experience ?? 0,

      types: [...data.types]
        .sort((a, b) => a.slot - b.slot)
        .map((item) => item.type.name),

      abilities: [...data.abilities]
        .sort((a, b) => a.slot - b.slot)
        .map((item) => item.ability.name),

      stats: data.stats.map((item) => ({
        name: item.stat.name,
        value: item.base_stat,
      })),
    };

    // Skip the cache write if the request was cancelled during the fetch.
    if (signal?.aborted) {
      throw new Error("Request cancelled");
    }

    // A cache write failure still allows the freshly fetched details to be returned.
    try {
      await savePokemonDetail(db, pokemon);
    } catch (cacheError) {
      console.warn("Unable to cache Pokémon details:", cacheError);
    }

    return pokemon;

  } catch (error) {

    // Cancellation should not trigger an offline fallback.
    if (signal?.aborted) {
      throw error;
    }

    const cachedPokemon = await getCachedPokemonDetail(
      db,
      pokemonId
    );

    if (cachedPokemon !== null) {
      return cachedPokemon;
    }

    throw error;
  }
}
