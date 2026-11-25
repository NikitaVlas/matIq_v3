import type { ErrorCode, ErrorResponse } from "@matiq/contracts";
import { HttpException, HttpStatus } from "@nestjs/common";
import { ZodError } from "zod";

/** Throw this when a specific error code matters to the client. */
export class AppException extends HttpException {
  readonly code: ErrorCode;

  constructor(code: ErrorCode, message: string, status: HttpStatus) {
    super(message, status);
    this.code = code;
  }
}

const CODE_BY_STATUS: Partial<Record<number, ErrorCode>> = {
  [HttpStatus.BAD_REQUEST]: "BAD_REQUEST",
  [HttpStatus.UNAUTHORIZED]: "UNAUTHORIZED",
  [HttpStatus.FORBIDDEN]: "FORBIDDEN",
  [HttpStatus.NOT_FOUND]: "NOT_FOUND",
  [HttpStatus.CONFLICT]: "CONFLICT",
  [HttpStatus.UNPROCESSABLE_ENTITY]: "VALIDATION_ERROR",
  [HttpStatus.TOO_MANY_REQUESTS]: "RATE_LIMITED",
  [HttpStatus.SERVICE_UNAVAILABLE]: "SERVICE_UNAVAILABLE",
};

function codeForStatus(status: number): ErrorCode {
  return CODE_BY_STATUS[status] ?? (status >= 500 ? "INTERNAL_ERROR" : "BAD_REQUEST");
}

/**
 * Maps any thrown value to the shared error shape from @matiq/contracts.
 * Internal details of unexpected errors never reach the client.
 */
export function toErrorResponse(
  exception: unknown,
  requestId?: string,
): { status: number; body: ErrorResponse } {
  const withRequestId = (error: ErrorResponse["error"]): ErrorResponse => ({
    error: requestId ? { ...error, requestId } : error,
  });

  if (exception instanceof ZodError) {
    return {
      status: HttpStatus.BAD_REQUEST,
      body: withRequestId({
        code: "VALIDATION_ERROR",
        message: "Request validation failed",
        details: exception.issues.map((issue) => ({
          path: issue.path.join("."),
          message: issue.message,
        })),
      }),
    };
  }

  if (exception instanceof HttpException) {
    const status = exception.getStatus();
    const code = exception instanceof AppException ? exception.code : codeForStatus(status);
    const message = status >= 500 ? "Internal server error" : exception.message;
    return { status, body: withRequestId({ code, message }) };
  }

  return {
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    body: withRequestId({ code: "INTERNAL_ERROR", message: "Internal server error" }),
  };
}
