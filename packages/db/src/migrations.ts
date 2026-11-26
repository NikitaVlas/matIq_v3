import { fileURLToPath } from "node:url";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import type { Database } from "./client.ts";

/**
 * SQL migrations folder. Resolves the same from src/ (local scripts) and dist/ (built
 * package), since both sit next to drizzle/. The package ships drizzle/ via "files".
 */
export const MIGRATIONS_FOLDER = fileURLToPath(new URL("../drizzle", import.meta.url));

/** Applies all pending migrations. Safe to run repeatedly. */
export async function runMigrations(db: Database): Promise<void> {
  await migrate(db, { migrationsFolder: MIGRATIONS_FOLDER });
}
