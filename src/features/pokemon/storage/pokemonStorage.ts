
import type { SQLiteDatabase } from "expo-sqlite";

import type { Pokemon } from "@/features/pokemon/models/Pokemon";
import type { PokemonDetail } from "@/features/pokemon/models/PokemonDetail";

const LIST_CACHE_KEY = "first_20";

/**
 * Pokemon Storage - Local SQLite operations.
 *
 * Stores and retrieves Pokémon list and detail data
 * for partial offline availability.
 */

/**
 * Saves the Pokémon list to SQLite.
 */
export async function savePokemonList(
  db: SQLiteDatabase,
  pokemon: Pokemon[]
): Promise<void> {

  await db.runAsync(
    `INSERT INTO pokemon_list_cache
      (cache_key, payload, updated_at)
     VALUES (?, ?, ?)
     ON CONFLICT(cache_key)
     DO UPDATE SET
       payload = excluded.payload,
       updated_at = excluded.updated_at`,
    LIST_CACHE_KEY,
    JSON.stringify(pokemon),
    new Date().toISOString()
  );
}

/**
 * Retrieves the cached Pokémon list.
 *
 * Returns null when no cache exists.
 */
export async function getCachedPokemonList(
  db: SQLiteDatabase
): Promise<Pokemon[] | null> {

  const row = await db.getFirstAsync<{
    payload: string;
  }>(
    `SELECT payload
     FROM pokemon_list_cache
     WHERE cache_key = ?`,
    LIST_CACHE_KEY
  );

  if (!row) {
    return null;
  }

  return JSON.parse(row.payload) as Pokemon[];
}

/**
 * Saves an individual Pokémon's details.
 */
export async function savePokemonDetail(
  db: SQLiteDatabase,
  pokemon: PokemonDetail
): Promise<void> {

  await db.runAsync(
    `INSERT INTO pokemon_detail_cache
      (pokemon_id, payload, updated_at)
     VALUES (?, ?, ?)
     ON CONFLICT(pokemon_id)
     DO UPDATE SET
       payload = excluded.payload,
       updated_at = excluded.updated_at`,
    pokemon.id,
    JSON.stringify(pokemon),
    new Date().toISOString()
  );
}

/**
 * Retrieves cached Pokémon details by ID.
 *
 * Returns null when the Pokémon has not been cached.
 */
export async function getCachedPokemonDetail(
  db: SQLiteDatabase,
  pokemonId: number
): Promise<PokemonDetail | null> {

  const row = await db.getFirstAsync<{
    payload: string;
  }>(
    `SELECT payload
     FROM pokemon_detail_cache
     WHERE pokemon_id = ?`,
    pokemonId
  );

  if (!row) {
    return null;
  }

  return JSON.parse(row.payload) as PokemonDetail;
}
