import { z } from "zod";

// Only VITE_* vars are available in the browser and they are public (baked into the bundle).
const ClientEnvSchema = z.object({
  VITE_API_URL: z.url(),
});

const result = ClientEnvSchema.safeParse(import.meta.env);
if (!result.success) {
  throw new Error(`Invalid admin environment:\n${z.prettifyError(result.error)}`);
}

export const env = result.data;
