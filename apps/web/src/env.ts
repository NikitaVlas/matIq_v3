import { z } from "zod";

const ServerEnvSchema = z.object({
  /** Base URL of apps/api, used by Server Components. */
  API_URL: z.url(),
});

export type ServerEnv = z.infer<typeof ServerEnvSchema>;

let cached: ServerEnv | undefined;

/** Validated server-side env. Parsed lazily so `next build` works without a running API. */
export function serverEnv(): ServerEnv {
  if (!cached) {
    const result = ServerEnvSchema.safeParse(process.env);
    if (!result.success) {
      throw new Error(`Invalid environment variables:\n${z.prettifyError(result.error)}`);
    }
    cached = result.data;
  }
  return cached;
}
