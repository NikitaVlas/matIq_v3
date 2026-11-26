import { existsSync } from "node:fs";
import { resolve } from "node:path";
import type { NextConfig } from "next";

// Local dev: one shared .env in the monorepo root. In Docker, vars come from the runtime.
const rootEnv = resolve(process.cwd(), "../../.env");
if (existsSync(rootEnv)) {
  process.loadEnvFile(rootEnv);
}

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  // Self-contained server for the Docker image (only the files it actually needs).
  output: "standalone",
  // Monorepo: trace dependencies from the repo root, not just apps/web.
  outputFileTracingRoot: resolve(process.cwd(), "../.."),
  // Legal Markdown is read from disk; make sure it ships with the server.
  outputFileTracingIncludes: { "/*": ["./content/**/*"] },
};

export default nextConfig;
