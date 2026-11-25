import { randomUUID } from "node:crypto";
import { Module } from "@nestjs/common";
import { LoggerModule as PinoLoggerModule } from "nestjs-pino";
import { ENV } from "../config/config.module.ts";
import type { Env } from "../config/env.ts";

const REQUEST_ID_HEADER = "x-request-id";

/** Structured JSON logs (pino); pretty single-line output in development. */
@Module({
  imports: [
    PinoLoggerModule.forRootAsync({
      inject: [ENV],
      useFactory: (env: Env) => ({
        pinoHttp: {
          level: env.LOG_LEVEL,
          transport:
            env.NODE_ENV === "development"
              ? { target: "pino-pretty", options: { singleLine: true } }
              : undefined,
          // Reuse an incoming request id (e.g. from the proxy) or create one,
          // and echo it back so clients can quote it in bug reports.
          genReqId: (req, res) => {
            const incoming = req.headers[REQUEST_ID_HEADER];
            const id = typeof incoming === "string" && incoming ? incoming : randomUUID();
            res.setHeader(REQUEST_ID_HEADER, id);
            return id;
          },
          redact: ["req.headers.authorization", "req.headers.cookie"],
          autoLogging: { ignore: (req) => req.url === "/health" },
        },
      }),
    }),
  ],
})
export class LoggerModule {}
