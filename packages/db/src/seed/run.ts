// Base seed for local development. Run: pnpm db:seed
import { createDb } from "../client.ts";
import { loadRootEnv, requireEnv } from "../env.ts";
import { formatSeedResult, seedCategories } from "./seed-categories.ts";

loadRootEnv();
const { db, client } = createDb(requireEnv("DATABASE_URL"), { max: 1 });

try {
  const result = await seedCategories(db);
  process.stdout.write(`${formatSeedResult(result)}\n`);
} finally {
  await client.end();
}
