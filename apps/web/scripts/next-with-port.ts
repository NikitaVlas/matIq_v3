// Runs `next dev` / `next start` on the port taken from WEB_URL in the root .env
// (default 3000). If port 3000 is busy, change WEB_URL in one place – this also keeps the
// API's CORS origin in sync. Usage: node scripts/next-with-port.ts <dev|start>
import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { resolve } from "node:path";

const rootEnv = resolve(import.meta.dirname, "../../../.env");
if (existsSync(rootEnv)) {
  process.loadEnvFile(rootEnv);
}

const DEFAULT_PORT = "3000";
const webUrl = process.env.WEB_URL;
const port = webUrl ? new URL(webUrl).port || DEFAULT_PORT : DEFAULT_PORT;
const command = process.argv[2] === "start" ? "start" : "dev";

// `next` is on PATH because pnpm runs package scripts with node_modules/.bin.
const child = spawn("next", [command, "--port", port], { stdio: "inherit", shell: true });
child.on("exit", (code) => process.exit(code ?? 0));
