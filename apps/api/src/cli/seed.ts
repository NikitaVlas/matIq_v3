// Production entry: insert missing base data (categories, links, positions, techniques).
// Never overwrites existing rows. Run in the API image: node dist/cli/seed.js
import { createDb, formatSeedResult, seedBase } from "@matiq/db";
import { loadEnv, loadRootEnvFile } from "../config/env.ts";

loadRootEnvFile();
const { db, client } = createDb(loadEnv().DATABASE_URL, { max: 1 });

try {
  const result = await seedBase(db);
  process.stdout.write(`${formatSeedResult(result)}\n`);
} finally {
  await client.end();
}
