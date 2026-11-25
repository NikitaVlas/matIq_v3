import { ErrorResponseSchema } from "@matiq/contracts";
import { HttpStatus, NotFoundException, ServiceUnavailableException } from "@nestjs/common";
import { describe, expect, it } from "vitest";
import { z } from "zod";
import { AppException, toErrorResponse } from "./errors.ts";

describe("toErrorResponse", () => {
  it("maps Nest HTTP exceptions to codes", () => {
    const { status, body } = toErrorResponse(new NotFoundException("Cannot GET /x"));
    expect(status).toBe(404);
    expect(body).toEqual({ error: { code: "NOT_FOUND", message: "Cannot GET /x" } });
  });

  it("uses the explicit code of an AppException", () => {
    const { status, body } = toErrorResponse(
      new AppException("CONFLICT", "Slug already exists", HttpStatus.CONFLICT),
    );
    expect(status).toBe(409);
    expect(body.error.code).toBe("CONFLICT");
  });

  it("turns zod errors into VALIDATION_ERROR with field details", () => {
    const result = z.object({ email: z.email() }).safeParse({ email: "nope" });
    const { status, body } = toErrorResponse(result.error);
    expect(status).toBe(400);
    expect(body.error.code).toBe("VALIDATION_ERROR");
    expect(body.error.details?.[0]?.path).toBe("email");
  });

  it("hides internals of unexpected errors", () => {
    const { status, body } = toErrorResponse(new Error("password=secret in stack"));
    expect(status).toBe(500);
    expect(body.error).toEqual({ code: "INTERNAL_ERROR", message: "Internal server error" });
  });

  it("hides messages of 5xx HTTP exceptions but keeps their code", () => {
    const { status, body } = toErrorResponse(new ServiceUnavailableException("db host 10.0.0.5"));
    expect(status).toBe(503);
    expect(body.error).toEqual({ code: "SERVICE_UNAVAILABLE", message: "Internal server error" });
  });

  it("adds the request id and always matches the shared contract", () => {
    const { body } = toErrorResponse(new NotFoundException(), "req-123");
    expect(body.error.requestId).toBe("req-123");
    expect(ErrorResponseSchema.safeParse(body).success).toBe(true);
  });
});
