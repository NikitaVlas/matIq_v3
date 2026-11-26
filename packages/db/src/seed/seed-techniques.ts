import type { Database } from "../client.ts";
import {
  categories,
  positions,
  techniqueCategories,
  techniquePrerequisites,
  techniques,
} from "../schema/index.ts";
import { POSITION_SEED } from "./data/positions.ts";
import { TECHNIQUE_SEED } from "./data/techniques.ts";
import { validateTechniqueSeed } from "./validate.ts";

export interface TechniqueSeedResult {
  positionsInserted: number;
  positionsTotal: number;
  techniquesInserted: number;
  techniquesTotal: number;
  prerequisitesInserted: number;
  categoryLinksInserted: number;
}

/**
 * Base positions and techniques (incl. prerequisites and categories).
 * Requires the categories to exist (run after seedCategories).
 * Idempotent and non-destructive, like the category seed.
 */
export async function seedTechniques(db: Database): Promise<TechniqueSeedResult> {
  return db.transaction(async (tx) => {
    const categoryRows = await tx
      .select({ id: categories.id, slug: categories.slug })
      .from(categories);
    const categoryIdBySlug = new Map(categoryRows.map((c) => [c.slug, c.id]));

    // Prerequisites already in the DB (e.g. added via the admin) must stay acyclic with ours.
    const existingTechniques = await tx
      .select({ id: techniques.id, slug: techniques.slug })
      .from(techniques);
    const techniqueSlugById = new Map(existingTechniques.map((t) => [t.id, t.slug]));
    const existingPrerequisites = await tx
      .select({
        technique: techniquePrerequisites.techniqueId,
        requires: techniquePrerequisites.requiresTechniqueId,
      })
      .from(techniquePrerequisites);

    validateTechniqueSeed(
      POSITION_SEED,
      TECHNIQUE_SEED,
      new Set(categoryIdBySlug.keys()),
      existingPrerequisites.map((p) => ({
        from: techniqueSlugById.get(p.requires)!,
        to: techniqueSlugById.get(p.technique)!,
      })),
    );

    const insertedPositions = await tx
      .insert(positions)
      .values(POSITION_SEED.map((position, index) => ({ ...position, sortOrder: index * 10 })))
      .onConflictDoNothing({ target: positions.slug })
      .returning({ id: positions.id });
    const positionRows = await tx
      .select({ id: positions.id, slug: positions.slug })
      .from(positions);
    const positionIdBySlug = new Map(positionRows.map((p) => [p.slug, p.id]));

    const insertedTechniques = await tx
      .insert(techniques)
      .values(
        TECHNIQUE_SEED.map(({ position, requires: _r, categories: _c, ...technique }) => ({
          ...technique,
          positionId: positionIdBySlug.get(position)!,
        })),
      )
      .onConflictDoNothing({ target: techniques.slug })
      .returning({ id: techniques.id });
    const techniqueRows = await tx
      .select({ id: techniques.id, slug: techniques.slug })
      .from(techniques);
    const techniqueIdBySlug = new Map(techniqueRows.map((t) => [t.slug, t.id]));

    const prerequisiteRows = TECHNIQUE_SEED.flatMap((t) =>
      (t.requires ?? []).map((required) => ({
        techniqueId: techniqueIdBySlug.get(t.slug)!,
        requiresTechniqueId: techniqueIdBySlug.get(required)!,
      })),
    );
    const insertedPrerequisites = await tx
      .insert(techniquePrerequisites)
      .values(prerequisiteRows)
      .onConflictDoNothing()
      .returning({ id: techniquePrerequisites.techniqueId });

    const categoryLinkRows = TECHNIQUE_SEED.flatMap((t) =>
      t.categories.map((slug) => ({
        techniqueId: techniqueIdBySlug.get(t.slug)!,
        categoryId: categoryIdBySlug.get(slug)!,
      })),
    );
    const insertedCategoryLinks = await tx
      .insert(techniqueCategories)
      .values(categoryLinkRows)
      .onConflictDoNothing()
      .returning({ id: techniqueCategories.techniqueId });

    return {
      positionsInserted: insertedPositions.length,
      positionsTotal: POSITION_SEED.length,
      techniquesInserted: insertedTechniques.length,
      techniquesTotal: TECHNIQUE_SEED.length,
      prerequisitesInserted: insertedPrerequisites.length,
      categoryLinksInserted: insertedCategoryLinks.length,
    };
  });
}
