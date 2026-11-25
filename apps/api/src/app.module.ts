import { Module } from "@nestjs/common";
import { CategoriesModule } from "./categories/categories.module.ts";
import { LoggerModule } from "./common/logger.module.ts";
import { ConfigModule } from "./config/config.module.ts";
import { DatabaseModule } from "./database/database.module.ts";
import { HealthModule } from "./health/health.module.ts";

@Module({
  imports: [ConfigModule, LoggerModule, DatabaseModule, HealthModule, CategoriesModule],
})
export class AppModule {}
