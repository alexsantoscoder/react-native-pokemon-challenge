
import type { SQLiteDatabase } from "expo-sqlite";

/**
 * Database Migrations - Manages SQLite schema versions.
 *
 * Each migration runs only when the database
 * version is lower than the required version.
 */

const DATABASE_VERSION = 1;

export async function runMigrations(
  db: SQLiteDatabase
): Promise<void> {

  const result = await db.getFirstAsync<{
    user_version: number;
  }>("PRAGMA user_version");

  if (!result) {
    throw new Error("Unable to read database version");
  }

  const currentVersion = result.user_version;

  if (currentVersion > DATABASE_VERSION) {
    throw new Error("Unsupported database version");
  }

  if (currentVersion === DATABASE_VERSION) {
    return;
  }

  // Execute schema changes in a transaction.
  await db.withTransactionAsync(async () => {

    if (currentVersion < 1) {

      await db.execAsync(`
        CREATE TABLE IF NOT EXISTS pokemon_list_cache (
          cache_key TEXT PRIMARY KEY NOT NULL,
          payload TEXT NOT NULL,
          updated_at TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS pokemon_detail_cache (
          pokemon_id INTEGER PRIMARY KEY NOT NULL,
          payload TEXT NOT NULL,
          updated_at TEXT NOT NULL
        );
      `);
    }

    // Update schema version after successful migrations.
    await db.execAsync(
      `PRAGMA user_version = ${DATABASE_VERSION}`
    );
  });
}
