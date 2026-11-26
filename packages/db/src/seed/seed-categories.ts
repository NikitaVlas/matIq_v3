import { eq } from "drizzle-orm";
import type { Database } from "../client.ts";
import { categories, categoryLinks } from "../schema/index.ts";
import { CATEGORY_LINK_SEED, CATEGORY_SEED } from "./data/categories.ts";
import { validateCategorySeed } from "./validate.ts";

export interface CategorySeedResult {
  categoriesInserted: number;
  categoriesTotal: number;
  linksInserted: number;
  linksTotal: number;
}

/**
 * Base seed: navigation categories and their links.
 *
 * Idempotent and non-destructive: only inserts what is missing (matched by slug / link key).
 * Existing rows are never overwritten, so edits made later in the admin survive a re-run.
 * Used by `pnpm db:seed` locally and by the API image (`node dist/cli/seed.js`) in production.
 */
export async function seedCategories(db: Database): Promise<CategorySeedResult> {
  return db.transaction(async (tx) => {
    // Validate against learn_before links that already exist (e.g. added via the admin).
    const existing = await tx.select({ id: categories.id, slug: categories.slug }).from(categories);
    const slugById = new Map(existing.map((c) => [c.id, c.slug]));
    const existingLearnBefore = await tx
      .select({ from: categoryLinks.fromCategoryId, to: categoryLinks.toCategoryId })
      .from(categoryLinks)
      .where(eq(categoryLinks.kind, "learn_before"));

    validateCategorySeed(
      CATEGORY_SEED,
      CATEGORY_LINK_SEED,
      existingLearnBefore.map(({ from, to }) => ({
        from: slugById.get(from)!,
        to: slugById.get(to)!,
      })),
    );

    const insertedCategories = await tx
      .insert(categories)
      .values(CATEGORY_SEED.map((category, index) => ({ ...category, sortOrder: index * 10 })))
      .onConflictDoNothing({ target: categories.slug })
      .returning({ slug: categories.slug });

    const all = await tx.select({ id: categories.id, slug: categories.slug }).from(categories);
    const idBySlug = new Map(all.map((c) => [c.slug, c.id]));

    const insertedLinks = await tx
      .insert(categoryLinks)
      .values(
        CATEGORY_LINK_SEED.map((link) => ({
          fromCategoryId: idBySlug.get(link.from)!,
          toCategoryId: idBySlug.get(link.to)!,
          kind: link.kind,
        })),
      )
      .onConflictDoNothing()
      .returning({ kind: categoryLinks.kind });

    return {
      categoriesInserted: insertedCategories.length,
      categoriesTotal: CATEGORY_SEED.length,
      linksInserted: insertedLinks.length,
      linksTotal: CATEGORY_LINK_SEED.length,
    };
  });
}

export function formatSeedResult(result: CategorySeedResult): string {
  return (
    `Seed done: ${result.categoriesInserted}/${result.categoriesTotal} categories and ` +
    `${result.linksInserted}/${result.linksTotal} links inserted (rest already existed).`
  );
}
