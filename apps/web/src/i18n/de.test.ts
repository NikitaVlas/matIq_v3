import { CATEGORY_KINDS, ERROR_CODES } from "@matiq/contracts";
import { describe, expect, it } from "vitest";
import { de } from "./de";

/** Collects every string leaf so empty copy is caught. */
function strings(value: unknown): string[] {
  if (typeof value === "string") return [value];
  if (value && typeof value === "object") return Object.values(value).flatMap(strings);
  return [];
}

describe("de.ts", () => {
  it("has a German label for every category kind", () => {
    for (const kind of CATEGORY_KINDS) expect(de.categories.kinds[kind]).toBeTruthy();
  });

  it("has a German message for every API error code", () => {
    for (const code of ERROR_CODES) expect(de.errors.codes[code]).toBeTruthy();
  });

  it("contains no empty strings", () => {
    for (const text of strings(de)) expect(text.trim()).not.toBe("");
  });

  it("pluralises the category count", () => {
    expect(de.categories.count(1)).toBe("1 Kategorie");
    expect(de.categories.count(12)).toBe("12 Kategorien");
  });
});
