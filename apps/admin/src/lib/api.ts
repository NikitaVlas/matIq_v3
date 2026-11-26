// Browser API client. Every response is validated against @matiq/contracts.
import { CategoriesResponseSchema, type ErrorCode, ErrorResponseSchema } from "@matiq/contracts";
import { queryOptions } from "@tanstack/react-query";
import { env } from "@/env";

export class ApiError extends Error {
  /** null = the API could not be reached at all. */
  readonly code: ErrorCode | null;

  constructor(code: ErrorCode | null, message: string) {
    super(message);
    this.name = "ApiError";
    this.code = code;
  }
}

async function apiGet(path: string): Promise<unknown> {
  let response: Response;
  try {
    response = await fetch(new URL(path, env.VITE_API_URL), {
      headers: { accept: "application/json" },
      credentials: "include",
    });
  } catch {
    throw new ApiError(null, `GET ${path}: network error`);
  }

  const body: unknown = await response.json().catch(() => null);
  if (!response.ok) {
    const parsed = ErrorResponseSchema.safeParse(body);
    throw new ApiError(
      parsed.success ? parsed.data.error.code : "INTERNAL_ERROR",
      `GET ${path} failed with ${response.status}`,
    );
  }
  return body;
}

export const categoriesQuery = queryOptions({
  queryKey: ["categories"],
  queryFn: async () => CategoriesResponseSchema.parse(await apiGet("/categories")),
});
