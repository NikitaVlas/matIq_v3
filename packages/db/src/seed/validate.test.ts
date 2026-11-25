import { describe, expect, it } from "vitest";
import {
  CATEGORY_LINK_SEED,
  CATEGORY_SEED,
  type CategoryLinkSeed,
  type CategorySeed,
} from "./data/categories.ts";
import { validateCategorySeed } from "./validate.ts";

const category = (slug: string): CategorySeed => ({
  slug,
  nameDe: slug,
  nameEn: slug,
  kind: "position",
  descriptionDe: "Beschreibung",
});

describe("category seed data", () => {
  it("is valid", () => {
    expect(() => validateCategorySeed(CATEGORY_SEED, CATEGORY_LINK_SEED)).not.toThrow();
  });

  it("contains the 35 agreed categories", () => {
    expect(CATEGORY_SEED).toHaveLength(35);
  });

  it("uses German UI names only for conditioning and strength training", () => {
    const translated = CATEGORY_SEED.filter((c) => c.nameDe !== c.nameEn).map((c) => c.slug);
    expect(translated.sort()).toEqual(["conditioning", "strength-training"]);
  });

  it("does not contain removed categories", () => {
    const slugs = CATEGORY_SEED.map((c) => c.slug);
    for (const removed of ["breakdowns", "judo", "mma", "sambo", "self-defense", "women"]) {
      expect(slugs).not.toContain(removed);
    }
  });
});

describe("validateCategorySeed", () => {
  const cats = [category("a"), category("b"), category("c")];
  const link = (from: string, to: string, kind: CategoryLinkSeed["kind"]): CategoryLinkSeed => ({
    from,
    to,
    kind,
  });

  it("rejects duplicate slugs", () => {
    expect(() => validateCategorySeed([...cats, category("a")], [])).toThrow(/Duplicate category/);
  });

  it("rejects badly formatted slugs", () => {
    expect(() => validateCategorySeed([category("Half Guard")], [])).toThrow(/Invalid slug/);
  });

  it("rejects links to unknown categories", () => {
    expect(() => validateCategorySeed(cats, [link("a", "zzz", "leads_to")])).toThrow(/Unknown/);
  });

  it("rejects self links and duplicate links", () => {
    expect(() => validateCategorySeed(cats, [link("a", "a", "leads_to")])).toThrow(/Self link/);
    expect(() =>
      validateCategorySeed(cats, [link("a", "b", "leads_to"), link("a", "b", "leads_to")]),
    ).toThrow(/Duplicate link/);
  });

  it("rejects learn_before cycles", () => {
    const links = [link("a", "b", "learn_before"), link("b", "a", "learn_before")];
    expect(() => validateCategorySeed(cats, links)).toThrow(/cycle/);
  });

  it("allows leads_to cycles", () => {
    const links = [link("a", "b", "leads_to"), link("b", "a", "leads_to")];
    expect(() => validateCategorySeed(cats, links)).not.toThrow();
  });

  it("rejects cycles formed together with links already in the database", () => {
    const links = [link("a", "b", "learn_before")];
    expect(() => validateCategorySeed(cats, links, [{ from: "b", to: "a" }])).toThrow(/cycle/);
  });
});
