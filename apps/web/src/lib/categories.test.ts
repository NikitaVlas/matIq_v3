import type { Category, CategoryKind } from "@matiq/contracts";
import { describe, expect, it } from "vitest";
import { groupCategoriesByKind } from "./categories";

const category = (slug: string, kind: CategoryKind, sortOrder: number): Category => ({
  id: `00000000-0000-7000-8000-${String(sortOrder).padStart(12, "0")}`,
  slug,
  nameDe: slug,
  nameEn: slug,
  descriptionDe: null,
  kind,
  sortOrder,
});

describe("groupCategoriesByKind", () => {
  it("groups in the fixed order positions, techniques, training", () => {
    const groups = groupCategoriesByKind([
      category("mindset", "training", 1),
      category("chokes", "technique_type", 2),
      category("half-guard", "position", 3),
    ]);
    expect(groups.map((g) => g.kind)).toEqual(["position", "technique_type", "training"]);
  });

  it("keeps the input order inside a group", () => {
    const groups = groupCategoriesByKind([
      category("50-50", "position", 0),
      category("x-guard", "position", 330),
      category("closed-guard", "position", 60),
    ]);
    expect(groups[0]?.categories.map((c) => c.slug)).toEqual(["50-50", "x-guard", "closed-guard"]);
  });

  it("drops empty groups", () => {
    const groups = groupCategoriesByKind([category("drills", "training", 0)]);
    expect(groups).toHaveLength(1);
    expect(groups[0]?.kind).toBe("training");
  });

  it("returns nothing for no categories", () => {
    expect(groupCategoriesByKind([])).toEqual([]);
  });
});
