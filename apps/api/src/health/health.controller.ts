import type { HealthResponse } from "@matiq/contracts";
import { Controller, Get, HttpStatus, Res } from "@nestjs/common";
import type { Response } from "express";
import { DatabaseService } from "../database/database.service.ts";

/** Liveness/readiness check for Coolify and uptime monitoring. */
@Controller("health")
export class HealthController {
  constructor(private readonly database: DatabaseService) {}

  @Get()
  async check(@Res({ passthrough: true }) res: Response): Promise<HealthResponse> {
    const databaseUp = await this.database.ping();
    if (!databaseUp) res.status(HttpStatus.SERVICE_UNAVAILABLE);
    return {
      status: databaseUp ? "ok" : "degraded",
      checks: { database: databaseUp ? "ok" : "down" },
    };
  }
}
