import { defineConfig } from "drizzle-kit";
import { loadRootEnv, requireEnv } from "./src/env.ts";

loadRootEnv();

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/schema/index.ts",
  out: "./drizzle",
  casing: "snake_case",
  dbCredentials: { url: requireEnv("DATABASE_URL") },
  strict: true,
  verbose: true,
});
