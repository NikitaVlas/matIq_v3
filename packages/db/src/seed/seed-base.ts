import type { Database } from "../client.ts";
import { type CategorySeedResult, seedCategories } from "./seed-categories.ts";
import { seedTechniques, type TechniqueSeedResult } from "./seed-techniques.ts";

export interface BaseSeedResult {
  categories: CategorySeedResult;
  techniques: TechniqueSeedResult;
}

/**
 * Full base seed: categories + links, then positions + techniques.
 * Used by `pnpm db:seed` locally and `node dist/cli/seed.js` in the API image.
 */
export async function seedBase(db: Database): Promise<BaseSeedResult> {
  const categories = await seedCategories(db);
  const techniques = await seedTechniques(db);
  return { categories, techniques };
}

/** Human-readable summary; "inserted/total", rows that already existed are left untouched. */
export function formatSeedResult({ categories: c, techniques: t }: BaseSeedResult): string {
  return [
    "Seed done (existing rows are never overwritten):",
    `  categories  ${c.categoriesInserted}/${c.categoriesTotal}, links ${c.linksInserted}/${c.linksTotal}`,
    `  positions   ${t.positionsInserted}/${t.positionsTotal}`,
    `  techniques  ${t.techniquesInserted}/${t.techniquesTotal}` +
      ` (+${t.prerequisitesInserted} prerequisites, +${t.categoryLinksInserted} category links)`,
  ].join("\n");
}
