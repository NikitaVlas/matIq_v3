import { describe, expect, it } from "vitest";
import { CategoriesResponseSchema, ErrorResponseSchema } from "./index.ts";

describe("CategoriesResponseSchema", () => {
  it("accepts a valid response with a UUID v7 id", () => {
    const response = {
      categories: [
        {
          id: "01a212aa-4640-7597-9a06-015995b0578a",
          slug: "half-guard",
          nameDe: "Half Guard",
          nameEn: "Half Guard",
          descriptionDe: null,
          kind: "position",
          sortOrder: 160,
        },
      ],
      links: [{ from: "half-guard", to: "z-guard", kind: "learn_before" }],
    };
    expect(CategoriesResponseSchema.parse(response)).toEqual(response);
  });

  it("rejects unknown enum values", () => {
    const result = CategoriesResponseSchema.safeParse({
      categories: [],
      links: [{ from: "a", to: "b", kind: "follows" }],
    });
    expect(result.success).toBe(false);
  });
});

describe("ErrorResponseSchema", () => {
  it("accepts a known error code and rejects an unknown one", () => {
    expect(
      ErrorResponseSchema.safeParse({ error: { code: "NOT_FOUND", message: "x" } }).success,
    ).toBe(true);
    expect(ErrorResponseSchema.safeParse({ error: { code: "OOPS", message: "x" } }).success).toBe(
      false,
    );
  });
});
