// Server-side API client. Every response is validated against @matiq/contracts.
import {
  type CategoriesResponse,
  CategoriesResponseSchema,
  type ErrorCode,
  ErrorResponseSchema,
} from "@matiq/contracts";
import { serverEnv } from "@/env";

export class ApiError extends Error {
  readonly code: ErrorCode;
  readonly status: number;

  constructor(code: ErrorCode, status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.code = code;
    this.status = status;
  }
}

async function apiGet(path: string, revalidateSeconds: number): Promise<unknown> {
  const response = await fetch(new URL(path, serverEnv().API_URL), {
    headers: { accept: "application/json" },
    next: { revalidate: revalidateSeconds },
  });
  const body: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    const parsed = ErrorResponseSchema.safeParse(body);
    const code = parsed.success ? parsed.data.error.code : "INTERNAL_ERROR";
    throw new ApiError(code, response.status, `GET ${path} failed with ${response.status}`);
  }
  return body;
}

export async function getCategories(): Promise<CategoriesResponse> {
  return CategoriesResponseSchema.parse(await apiGet("/categories", 60));
}
