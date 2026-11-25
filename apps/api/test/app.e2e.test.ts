import "reflect-metadata";
import {
  CategoriesResponseSchema,
  ErrorResponseSchema,
  HealthResponseSchema,
} from "@matiq/contracts";
import type { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { AppModule } from "../src/app.module.ts";
import { configureApp } from "../src/app.setup.ts";
import { loadEnv, loadRootEnvFile } from "../src/config/env.ts";

// Requires: pnpm services:up && pnpm db:migrate && pnpm db:seed
let app: INestApplication;
// supertest's App type is not exported under NodeNext resolution; derive it.
type App = Parameters<typeof request>[0];
/** Nest types the HTTP server as `any`. */
const server = (): App => app.getHttpServer() as App;

beforeAll(async () => {
  process.env.LOG_LEVEL ??= "silent";
  loadRootEnvFile();
  const env = loadEnv();

  const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
  app = moduleRef.createNestApplication();
  configureApp(app, env);
  await app.init();
});

afterAll(async () => {
  await app?.close();
});

describe("GET /health", () => {
  it("reports the database as up", async () => {
    const res = await request(server()).get("/health").expect(200);
    expect(HealthResponseSchema.parse(res.body)).toEqual({
      status: "ok",
      checks: { database: "ok" },
    });
  });
});

describe("GET /categories", () => {
  it("returns the seeded categories and links in the shared contract shape", async () => {
    const res = await request(server()).get("/categories").expect(200);
    const body = CategoriesResponseSchema.parse(res.body);

    expect(body.categories).toHaveLength(35);
    const sortOrders = body.categories.map((c) => c.sortOrder);
    expect(sortOrders).toEqual([...sortOrders].sort((a, b) => a - b));
    expect(body.categories.find((c) => c.slug === "conditioning")?.nameDe).toBe("Kondition");

    expect(body.links).toContainEqual({
      from: "fundamentals",
      to: "closed-guard",
      kind: "learn_before",
    });
    expect(body.links).toContainEqual({
      from: "takedowns",
      to: "guard-passing",
      kind: "leads_to",
    });
  });

  it("allows the web app origin via CORS", async () => {
    const res = await request(server())
      .get("/categories")
      .set("Origin", loadEnv().WEB_URL)
      .expect(200);
    expect(res.headers["access-control-allow-origin"]).toBe(loadEnv().WEB_URL);
  });
});

describe("errors", () => {
  it("returns the shared error shape with a request id for unknown routes", async () => {
    const res = await request(server()).get("/does-not-exist").expect(404);
    const body = ErrorResponseSchema.parse(res.body);
    expect(body.error.code).toBe("NOT_FOUND");
    expect(body.error.requestId).toBe(res.headers["x-request-id"]);
  });

  it("echoes an incoming x-request-id", async () => {
    const res = await request(server())
      .get("/does-not-exist")
      .set("x-request-id", "test-req-42")
      .expect(404);
    expect(res.headers["x-request-id"]).toBe("test-req-42");
    expect(ErrorResponseSchema.parse(res.body).error.requestId).toBe("test-req-42");
  });
});
