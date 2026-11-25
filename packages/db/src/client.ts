import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema/index.ts";

export interface CreateDbOptions {
  /** Max pool connections. Use 1 for one-off scripts. */
  max?: number;
}

/** Creates a Drizzle client. Callers own the lifecycle and must call `client.end()`. */
export function createDb(databaseUrl: string, options: CreateDbOptions = {}) {
  const client = postgres(databaseUrl, { max: options.max ?? 10 });
  const db = drizzle({ client, schema, casing: "snake_case" });
  return { db, client };
}

export type Database = ReturnType<typeof createDb>["db"];
