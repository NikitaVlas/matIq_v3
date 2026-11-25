import swc from "unplugin-swc";
import { defineConfig } from "vitest/config";

// SWC instead of esbuild: NestJS DI needs emitted decorator metadata.
export default defineConfig({
  plugins: [swc.vite({ module: { type: "es6" } })],
  test: {
    include: ["src/**/*.test.ts"],
  },
});
