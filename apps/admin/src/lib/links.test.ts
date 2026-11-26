import type { Category, CategoryLink } from "@matiq/contracts";
import { describe, expect, it } from "vitest";
import { countLinks, toLinkRows } from "./links";

const category = (slug: string, nameDe: string): Category => ({
  id: "01a212aa-4640-7597-9a06-015995b0578a",
  slug,
  nameDe,
  nameEn: nameDe,
  descriptionDe: null,
  kind: "position",
  sortOrder: 0,
});

const links: CategoryLink[] = [
  { from: "fundamentals", to: "closed-guard", kind: "learn_before" },
  { from: "fundamentals", to: "escapes", kind: "learn_before" },
  { from: "closed-guard", to: "chokes", kind: "leads_to" },
];

const categories = [
  category("fundamentals", "Fundamentals"),
  category("closed-guard", "Closed Guard"),
  category("escapes", "Escapes"),
  category("chokes", "Chokes"),
];

describe("countLinks", () => {
  it("counts outgoing and incoming links per category", () => {
    const counts = countLinks(links);
    expect(counts.get("fundamentals")).toEqual({ outgoing: 2, incoming: 0 });
    expect(counts.get("closed-guard")).toEqual({ outgoing: 1, incoming: 1 });
    expect(counts.get("chokes")).toEqual({ outgoing: 0, incoming: 1 });
    expect(counts.get("mindset")).toBeUndefined();
  });
});

describe("toLinkRows", () => {
  it("returns all links with display names", () => {
    const rows = toLinkRows(links, categories, "all");
    expect(rows).toHaveLength(3);
    expect(rows[0]).toEqual({
      key: "learn_before:fundamentals:closed-guard",
      kind: "learn_before",
      from: { slug: "fundamentals", name: "Fundamentals" },
      to: { slug: "closed-guard", name: "Closed Guard" },
    });
  });

  it("filters by kind", () => {
    expect(toLinkRows(links, categories, "leads_to").map((r) => r.key)).toEqual([
      "leads_to:closed-guard:chokes",
    ]);
  });

  it("shows the slug when a category is unknown", () => {
    const rows = toLinkRows([{ from: "ghost", to: "chokes", kind: "leads_to" }], categories, "all");
    expect(rows[0]?.from.name).toBe("ghost");
  });
});
