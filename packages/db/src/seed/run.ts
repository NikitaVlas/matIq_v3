// Base seed for local development (categories, links, positions, techniques). Run: pnpm db:seed
import { createDb } from "../client.ts";
import { loadRootEnv, requireEnv } from "../env.ts";
import { formatSeedResult, seedBase } from "./seed-base.ts";

loadRootEnv();
const { db, client } = createDb(requireEnv("DATABASE_URL"), { max: 1 });

try {
  const result = await seedBase(db);
  process.stdout.write(`${formatSeedResult(result)}\n`);
} finally {
  await client.end();
}
