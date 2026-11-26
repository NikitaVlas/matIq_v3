import { defineConfig } from "tsup";

// Builds ESM + CJS so the package works for any consumer.
export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  dts: true,
  sourcemap: true,
  clean: true,
  target: "node24",
  // import.meta.url (used to locate drizzle/ migrations) also works in the CJS build.
  shims: true,
});
