// Base seed: navigation categories and their links. Run: pnpm db:seed
//
// Idempotent and non-destructive: only inserts what is missing (matched by slug / link key).
// Existing rows are never overwritten, so edits made later in the admin survive a re-run.
import { eq } from "drizzle-orm";
import { createDb } from "../client.ts";
import { loadRootEnv, requireEnv } from "../env.ts";
import { categories, categoryLinks } from "../schema/index.ts";
import { CATEGORY_LINK_SEED, CATEGORY_SEED } from "./data/categories.ts";
import { validateCategorySeed } from "./validate.ts";

loadRootEnv();
const { db, client } = createDb(requireEnv("DATABASE_URL"), { max: 1 });

try {
  const result = await db.transaction(async (tx) => {
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

    return { categories: insertedCategories.length, links: insertedLinks.length };
  });

  process.stdout.write(
    `Seed done: ${result.categories}/${CATEGORY_SEED.length} categories and ` +
      `${result.links}/${CATEGORY_LINK_SEED.length} links inserted (rest already existed).\n`,
  );
} finally {
  await client.end();
}
