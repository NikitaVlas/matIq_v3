import { defineConfig } from "tsup";

// Builds ESM + CJS so the package works for any consumer.
export default defineConfig((options) => ({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  dts: true,
  sourcemap: true,
  // In watch mode (pnpm dev) never wipe dist: apps compiling in parallel need the types.
  clean: !options.watch,
  target: "node24",
}));
