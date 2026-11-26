// Production entry: insert missing base categories and links (never overwrites).
// Run in the API image: node dist/cli/seed.js
import { createDb, formatSeedResult, seedCategories } from "@matiq/db";
import { loadEnv, loadRootEnvFile } from "../config/env.ts";

loadRootEnvFile();
const { db, client } = createDb(loadEnv().DATABASE_URL, { max: 1 });

try {
  const result = await seedCategories(db);
  process.stdout.write(`${formatSeedResult(result)}\n`);
} finally {
  await client.end();
}
