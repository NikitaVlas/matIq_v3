import swc from "unplugin-swc";
import { defineConfig } from "vitest/config";

// End-to-end tests against the local Postgres (pnpm services:up, db:migrate, db:seed).
export default defineConfig({
  plugins: [swc.vite({ module: { type: "es6" } })],
  test: {
    include: ["test/**/*.e2e.test.ts"],
    testTimeout: 15_000,
  },
});
