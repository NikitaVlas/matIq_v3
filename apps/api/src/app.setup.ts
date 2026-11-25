import type { INestApplication } from "@nestjs/common";
import type { NestExpressApplication } from "@nestjs/platform-express";
import { AllExceptionsFilter } from "./common/all-exceptions.filter.ts";
import type { Env } from "./config/env.ts";

/** HTTP-level setup shared by main.ts and the e2e tests. */
export function configureApp(app: INestApplication, env: Env): void {
  (app as NestExpressApplication).disable("x-powered-by");
  app.enableCors({
    origin: [env.WEB_URL, env.ADMIN_URL],
    credentials: true,
  });
  app.useGlobalFilters(new AllExceptionsFilter());
  app.enableShutdownHooks();
}
