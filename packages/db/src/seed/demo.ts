// Development-only demo seed: positions, techniques, prerequisites, technique categories.
// Run after the base seed: pnpm db:seed:demo. Idempotent, never runs in production.
import { assertAcyclic } from "@matiq/roadmap";
import { createDb } from "../client.ts";
import { loadRootEnv, requireEnv } from "../env.ts";
import {
  categories,
  positions,
  techniqueCategories,
  techniquePrerequisites,
  techniques,
} from "../schema/index.ts";
import { DEMO_POSITIONS, DEMO_TECHNIQUES } from "./data/demo.ts";

loadRootEnv();

if (process.env.NODE_ENV === "production") {
  throw new Error("Demo seed must not run in production.");
}

const prerequisiteEdges = DEMO_TECHNIQUES.flatMap((t) =>
  (t.requires ?? []).map((required) => ({ from: required, to: t.slug })),
);
assertAcyclic(
  DEMO_TECHNIQUES.map((t) => t.slug),
  prerequisiteEdges,
);

const { db, client } = createDb(requireEnv("DATABASE_URL"), { max: 1 });

try {
  await db.transaction(async (tx) => {
    const categoryRows = await tx
      .select({ id: categories.id, slug: categories.slug })
      .from(categories);
    const categoryIdBySlug = new Map(categoryRows.map((c) => [c.slug, c.id]));
    const missing = [...new Set(DEMO_TECHNIQUES.flatMap((t) => t.categories))].filter(
      (slug) => !categoryIdBySlug.has(slug),
    );
    if (missing.length > 0) {
      throw new Error(`Run "pnpm db:seed" first. Missing categories: ${missing.join(", ")}`);
    }

    await tx
      .insert(positions)
      .values(DEMO_POSITIONS.map((p, index) => ({ ...p, sortOrder: index * 10 })))
      .onConflictDoNothing({ target: positions.slug });
    const positionRows = await tx
      .select({ id: positions.id, slug: positions.slug })
      .from(positions);
    const positionIdBySlug = new Map(positionRows.map((p) => [p.slug, p.id]));

    await tx
      .insert(techniques)
      .values(
        DEMO_TECHNIQUES.map(({ position, requires: _r, categories: _c, ...technique }) => ({
          ...technique,
          positionId: positionIdBySlug.get(position)!,
        })),
      )
      .onConflictDoNothing({ target: techniques.slug });
    const techniqueRows = await tx
      .select({ id: techniques.id, slug: techniques.slug })
      .from(techniques);
    const techniqueIdBySlug = new Map(techniqueRows.map((t) => [t.slug, t.id]));

    await tx
      .insert(techniquePrerequisites)
      .values(
        prerequisiteEdges.map(({ from, to }) => ({
          techniqueId: techniqueIdBySlug.get(to)!,
          requiresTechniqueId: techniqueIdBySlug.get(from)!,
        })),
      )
      .onConflictDoNothing();

    await tx
      .insert(techniqueCategories)
      .values(
        DEMO_TECHNIQUES.flatMap((t) =>
          t.categories.map((slug) => ({
            techniqueId: techniqueIdBySlug.get(t.slug)!,
            categoryId: categoryIdBySlug.get(slug)!,
          })),
        ),
      )
      .onConflictDoNothing();
  });

  process.stdout.write(
    `Demo seed done: ${DEMO_POSITIONS.length} positions, ${DEMO_TECHNIQUES.length} techniques.\n`,
  );
} finally {
  await client.end();
}
