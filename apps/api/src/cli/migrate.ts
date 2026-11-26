// Production entry: apply pending DB migrations. Run in the API image: node dist/cli/migrate.js
// (Coolify pre-deploy command, or the `migrate` service in docker-compose --profile full).
import { createDb, runMigrations } from "@matiq/db";
import { loadEnv, loadRootEnvFile } from "../config/env.ts";

loadRootEnvFile();
const { db, client } = createDb(loadEnv().DATABASE_URL, { max: 1 });

try {
  await runMigrations(db);
  process.stdout.write("Migrations applied.\n");
} finally {
  await client.end();
}
