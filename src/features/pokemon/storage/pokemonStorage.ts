/**
 * Stores the Pokémon list and individual details as JSON in SQLite so they
 * can be shown when a network request fails.
 */

// SQLite database type
import type { SQLiteDatabase } from "expo-sqlite";

// Pokémon models
import type { Pokemon } from "@/features/pokemon/models/Pokemon";
import type { PokemonDetail } from "@/features/pokemon/models/PokemonDetail";

// The app fetches a single page containing the first 20 Pokémon.
const LIST_CACHE_KEY = "first_20";

/**
 * Writes the list and its timestamp, replacing any existing entry.
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
 * Returns the cached list, or null when there is no cache entry.
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
 * Writes the details and timestamp for this Pokémon ID.
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
 * Returns cached details by Pokémon ID, or null when that ID has no cache entry.
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
