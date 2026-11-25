import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { Logger } from "nestjs-pino";
import { AppModule } from "./app.module.ts";
import { configureApp } from "./app.setup.ts";
import { loadEnv, loadRootEnvFile } from "./config/env.ts";

loadRootEnvFile();
// Fail fast with a readable message before Nest starts.
const env = loadEnv();

const app = await NestFactory.create(AppModule, { bufferLogs: true });
app.useLogger(app.get(Logger));
configureApp(app, env);

await app.listen(env.API_PORT);
app.get(Logger).log(`API listening on http://localhost:${env.API_PORT}`, "Bootstrap");
