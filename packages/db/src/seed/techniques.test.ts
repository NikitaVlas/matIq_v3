import { describe, expect, it } from "vitest";
import { CATEGORY_SEED } from "./data/categories.ts";
import { POSITION_SEED, type PositionSeed } from "./data/positions.ts";
import { TECHNIQUE_SEED, type TechniqueSeed } from "./data/techniques.ts";
import { validateTechniqueSeed } from "./validate.ts";

const categorySlugs = new Set(CATEGORY_SEED.map((c) => c.slug));

describe("technique seed data", () => {
  it("is valid against the category seed", () => {
    expect(() => validateTechniqueSeed(POSITION_SEED, TECHNIQUE_SEED, categorySlugs)).not.toThrow();
  });

  it("contains the 8 assessment positions in assessment order", () => {
    expect(POSITION_SEED.map((p) => p.slug)).toEqual([
      "standing",
      "closed-guard",
      "open-guard",
      "half-guard",
      "side-control",
      "mount",
      "back-control",
      "turtle",
    ]);
  });

  it("contains the 46 reviewed techniques", () => {
    expect(TECHNIQUE_SEED).toHaveLength(46);
  });

  it("has at least one technique for every assessment position", () => {
    for (const position of POSITION_SEED) {
      expect(
        TECHNIQUE_SEED.some((t) => t.position === position.slug),
        position.slug,
      ).toBe(true);
    }
  });

  it("offers 13 submissions for the favourite-submissions step", () => {
    const submissions = TECHNIQUE_SEED.filter((t) => t.type === "submission");
    expect(submissions).toHaveLength(13);
    for (const s of submissions) expect(s.categories).toContain("submissions");
  });

  it("marks gi-only and no-gi-only techniques", () => {
    const mode = (slug: string) => TECHNIQUE_SEED.find((t) => t.slug === slug)?.giMode ?? "both";
    expect(mode("cross-collar-choke-mount")).toBe("gi");
    expect(mode("bow-and-arrow-choke")).toBe("gi");
    expect(mode("osoto-gari")).toBe("gi");
    expect(mode("inside-heel-hook")).toBe("nogi");
    expect(mode("rear-naked-choke")).toBe("both");
  });

  it("only uses neutral perspective for standing techniques", () => {
    for (const t of TECHNIQUE_SEED) {
      expect(t.perspective === "neutral", t.slug).toBe(t.position === "standing");
    }
  });
});

describe("validateTechniqueSeed", () => {
  const positions: PositionSeed[] = [{ slug: "mount", nameDe: "Mount", nameEn: "Mount" }];
  const technique = (slug: string, extra: Partial<TechniqueSeed> = {}): TechniqueSeed => ({
    slug,
    nameDe: slug,
    nameEn: slug,
    position: "mount",
    perspective: "top",
    type: "submission",
    level: "beginner",
    categories: ["mount-attacks"],
    ...extra,
  });
  const run = (techniques: TechniqueSeed[], existing: { from: string; to: string }[] = []) =>
    validateTechniqueSeed(positions, techniques, categorySlugs, existing);

  it("rejects duplicate technique slugs", () => {
    expect(() => run([technique("a"), technique("a")])).toThrow(/Duplicate technique/);
  });

  it("rejects unknown positions, categories and prerequisites", () => {
    expect(() => run([technique("a", { position: "guard-x" })])).toThrow(/Unknown position/);
    expect(() => run([technique("a", { categories: ["nope"] })])).toThrow(/Unknown category/);
    expect(() => run([technique("a", { requires: ["ghost"] })])).toThrow(/Unknown prerequisite/);
  });

  it("rejects a technique without category or requiring itself", () => {
    expect(() => run([technique("a", { categories: [] })])).toThrow(/No category/);
    expect(() => run([technique("a", { requires: ["a"] })])).toThrow(/requires itself/);
  });

  it("rejects prerequisite cycles", () => {
    const techniques = [technique("a", { requires: ["b"] }), technique("b", { requires: ["a"] })];
    expect(() => run(techniques)).toThrow(/cycle/);
  });

  it("rejects cycles formed together with prerequisites already in the database", () => {
    // seed: b requires a (a -> b); DB already has: a requires b (b -> a)
    const techniques = [technique("a"), technique("b", { requires: ["a"] })];
    expect(() => run(techniques, [{ from: "b", to: "a" }])).toThrow(/cycle/);
  });
});
