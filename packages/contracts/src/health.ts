import { z } from "zod";

/** GET /health — 200 when everything is up, 503 when a dependency is down. */
export const HealthResponseSchema = z.object({
  status: z.enum(["ok", "degraded"]),
  checks: z.object({
    database: z.enum(["ok", "down"]),
  }),
});
export type HealthResponse = z.infer<typeof HealthResponseSchema>;
