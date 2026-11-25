import { createDb, type Database } from "@matiq/db";
import { Inject, Injectable, type OnApplicationShutdown } from "@nestjs/common";
import { ENV } from "../config/config.module.ts";
import type { Env } from "../config/env.ts";

/** Owns the single Postgres connection pool of the API. */
@Injectable()
export class DatabaseService implements OnApplicationShutdown {
  readonly db: Database;
  private readonly client: ReturnType<typeof createDb>["client"];

  constructor(@Inject(ENV) env: Env) {
    const { db, client } = createDb(env.DATABASE_URL);
    this.db = db;
    this.client = client;
  }

  /** Cheap connectivity check for /health. */
  async ping(): Promise<boolean> {
    try {
      await this.client`select 1`;
      return true;
    } catch {
      return false;
    }
  }

  async onApplicationShutdown(): Promise<void> {
    await this.client.end({ timeout: 5 });
  }
}
