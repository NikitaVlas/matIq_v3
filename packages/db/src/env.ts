import { existsSync } from "node:fs";
import { resolve } from "node:path";

/**
 * Loads the monorepo root .env for local scripts (drizzle-kit, migrate, seed).
 * Scripts run with cwd = packages/db. In Docker the file is absent and
 * variables come from the runtime environment. Existing vars are not overridden.
 */
export function loadRootEnv(): void {
  const rootEnv = resolve(process.cwd(), "../../.env");
  if (existsSync(rootEnv)) {
    process.loadEnvFile(rootEnv);
  }
}

export function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}
