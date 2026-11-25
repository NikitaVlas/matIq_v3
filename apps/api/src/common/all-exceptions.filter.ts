import { type ArgumentsHost, Catch, type ExceptionFilter, Logger } from "@nestjs/common";
import type { Request, Response } from "express";
import { toErrorResponse } from "./errors.ts";

/** Sends every error in the shared `{ error: { code, message, ... } }` shape. */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const http = host.switchToHttp();
    const request = http.getRequest<Request & { id?: string | number }>();
    const response = http.getResponse<Response>();

    const requestId = request.id === undefined ? undefined : String(request.id);
    const { status, body } = toErrorResponse(exception, requestId);

    if (status >= 500) {
      this.logger.error(
        { err: exception, requestId },
        `Unhandled error on ${request.method} ${request.url}`,
      );
    }

    response.status(status).json(body);
  }
}
