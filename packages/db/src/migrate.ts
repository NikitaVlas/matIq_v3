// Applies pending SQL migrations from ./drizzle. Run: pnpm db:migrate
import { createDb } from "./client.ts";
import { loadRootEnv, requireEnv } from "./env.ts";
import { runMigrations } from "./migrations.ts";

loadRootEnv();

const { db, client } = createDb(requireEnv("DATABASE_URL"), { max: 1 });

try {
  await runMigrations(db);
  process.stdout.write("Migrations applied.\n");
} finally {
  await client.end();
}
