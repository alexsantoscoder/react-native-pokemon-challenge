
import type { SQLiteDatabase } from "expo-sqlite";

import { runMigrations } from "@/db/migrations";

/**
 * Database Initialization - Prepares SQLite
 * before the application uses local storage.
 */
export async function initializeDatabase(
  db: SQLiteDatabase
): Promise<void> {

  // Enable Write-Ahead Logging for better performance.
  await db.execAsync("PRAGMA journal_mode = WAL;");

  // Apply any pending schema migrations.
  await runMigrations(db);
}
