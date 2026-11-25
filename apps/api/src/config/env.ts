import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { z } from "zod";

export const EnvSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  API_PORT: z.coerce.number().int().positive().default(4000),
  DATABASE_URL: z.url(),
  /** Allowed CORS origins. */
  WEB_URL: z.url(),
  ADMIN_URL: z.url(),
  LOG_LEVEL: z.enum(["fatal", "error", "warn", "info", "debug", "trace", "silent"]).default("info"),
});

export type Env = z.infer<typeof EnvSchema>;

/** Parses and validates env vars; throws one readable error listing every problem. */
export function loadEnv(source: NodeJS.ProcessEnv = process.env): Env {
  const result = EnvSchema.safeParse(source);
  if (!result.success) {
    throw new Error(`Invalid environment variables:\n${z.prettifyError(result.error)}`);
  }
  return result.data;
}

/**
 * Loads the monorepo root .env in local development (cwd = apps/api).
 * In Docker the file is absent and variables come from the runtime.
 * Already-set variables are not overridden.
 */
export function loadRootEnvFile(): void {
  const rootEnv = resolve(process.cwd(), "../../.env");
  if (existsSync(rootEnv)) {
    process.loadEnvFile(rootEnv);
  }
}
