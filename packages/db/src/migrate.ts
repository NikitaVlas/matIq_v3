// Applies pending SQL migrations from ./drizzle. Run: pnpm db:migrate
import { fileURLToPath } from "node:url";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { createDb } from "./client.ts";
import { loadRootEnv, requireEnv } from "./env.ts";

loadRootEnv();

const migrationsFolder = fileURLToPath(new URL("../drizzle", import.meta.url));
const { db, client } = createDb(requireEnv("DATABASE_URL"), { max: 1 });

try {
  await migrate(db, { migrationsFolder });
  process.stdout.write("Migrations applied.\n");
} finally {
  await client.end();
}
