import { CATEGORY_KINDS, CATEGORY_LINK_KINDS, ERROR_CODES } from "@matiq/contracts";
import { describe, expect, it } from "vitest";
import { de } from "./de";

function strings(value: unknown): string[] {
  if (typeof value === "string") return [value];
  if (value && typeof value === "object") return Object.values(value).flatMap(strings);
  return [];
}

describe("admin de.ts", () => {
  it("labels every category kind, link kind and error code", () => {
    for (const kind of CATEGORY_KINDS) expect(de.categories.kinds[kind]).toBeTruthy();
    for (const kind of CATEGORY_LINK_KINDS) {
      expect(de.links.kinds[kind]).toBeTruthy();
      expect(de.links.kindHints[kind]).toBeTruthy();
    }
    for (const code of ERROR_CODES) expect(de.errors.codes[code]).toBeTruthy();
  });

  it("contains no empty strings", () => {
    for (const text of strings(de)) expect(text.trim()).not.toBe("");
  });
});
