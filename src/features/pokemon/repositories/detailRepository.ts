
import type { SQLiteDatabase } from "expo-sqlite";

import { fetchPokemonDetail } from "@/features/pokemon/apis/detailApi";

import {
  savePokemonDetail,
  getCachedPokemonDetail,
} from "@/features/pokemon/storage/pokemonStorage";

import type { PokemonDetail } from "@/features/pokemon/models/PokemonDetail";

/**
 * DetailRepository - Retrieves Pokémon details
 * using PokéAPI with SQLite offline fallback.
 */
export async function getPokemonDetail(
  db: SQLiteDatabase,
  pokemonId: number,
  signal?: AbortSignal
): Promise<PokemonDetail> {

  try {

    // Fetch fresh Pokémon details.
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

    // Avoid caching a cancelled request.
    if (signal?.aborted) {
      throw new Error("Request cancelled");
    }

    // Cache successful details.
    try {
      await savePokemonDetail(db, pokemon);
    } catch (cacheError) {
      console.warn("Unable to cache Pokémon details:", cacheError);
    }

    return pokemon;

  } catch (error) {

    if (signal?.aborted) {
      throw error;
    }

    // Read previously cached details.
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
