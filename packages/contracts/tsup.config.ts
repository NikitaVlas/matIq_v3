import { defineConfig } from "tsup";

// Builds ESM + CJS so the package works for NestJS (CJS) and bundlers (ESM).
export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  dts: true,
  sourcemap: true,
  clean: true,
  target: "node24",
});
