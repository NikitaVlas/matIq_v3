import { CycleError, findCycle, type Edge } from "@matiq/roadmap";
import type { CategoryLinkSeed, CategorySeed } from "./data/categories.ts";
import type { PositionSeed } from "./data/positions.ts";
import type { TechniqueSeed } from "./data/techniques.ts";

const SLUG_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;

/**
 * Checks seed data before anything touches the database. Collects all problems
 * and throws once, so a broken seed file is fixed in one go.
 *
 * `existingLearnBefore` are learn_before links already in the DB (by slug, e.g. added
 * via the admin): the union with the seed links must stay acyclic too.
 */
export function validateCategorySeed(
  categories: readonly CategorySeed[],
  links: readonly CategoryLinkSeed[],
  existingLearnBefore: readonly Edge<string>[] = [],
): void {
  const problems: string[] = [];
  const slugs = new Set<string>();

  for (const category of categories) {
    if (slugs.has(category.slug)) problems.push(`Duplicate category slug: ${category.slug}`);
    slugs.add(category.slug);
    if (!SLUG_PATTERN.test(category.slug)) {
      problems.push(`Invalid slug format: ${category.slug}`);
    }
    for (const field of ["nameDe", "nameEn", "descriptionDe"] as const) {
      if (!category[field].trim()) problems.push(`Empty ${field} for ${category.slug}`);
    }
  }

  const linkKeys = new Set<string>();
  for (const link of links) {
    const label = `${link.kind} ${link.from} -> ${link.to}`;
    if (!slugs.has(link.from)) problems.push(`Unknown category in link: ${label}`);
    if (!slugs.has(link.to)) problems.push(`Unknown category in link: ${label}`);
    if (link.from === link.to) problems.push(`Self link: ${label}`);
    if (linkKeys.has(label)) problems.push(`Duplicate link: ${label}`);
    linkKeys.add(label);
  }

  // Only check cycles on a structurally valid graph; otherwise the errors above explain it.
  if (problems.length === 0) {
    const edges = [
      ...links.filter((link) => link.kind === "learn_before"),
      ...existingLearnBefore,
    ].map(({ from, to }) => ({ from, to }));
    const nodes = new Set([...slugs, ...edges.flatMap(({ from, to }) => [from, to])]);
    const cycle = findCycle(nodes, edges);
    if (cycle) problems.push(new CycleError(cycle).message + " (learn_before)");
  }

  if (problems.length > 0) {
    throw new Error(`Invalid category seed:\n- ${problems.join("\n- ")}`);
  }
}

/**
 * Checks positions and techniques before seeding. `categorySlugs` are all known category
 * slugs; `existingPrerequisites` are prerequisite edges already in the DB (by slug,
 * `from` = required technique, `to` = technique) — the union must stay acyclic.
 */
export function validateTechniqueSeed(
  positions: readonly PositionSeed[],
  techniques: readonly TechniqueSeed[],
  categorySlugs: ReadonlySet<string>,
  existingPrerequisites: readonly Edge<string>[] = [],
): void {
  const problems: string[] = [];

  const positionSlugs = new Set<string>();
  for (const position of positions) {
    if (positionSlugs.has(position.slug))
      problems.push(`Duplicate position slug: ${position.slug}`);
    positionSlugs.add(position.slug);
    if (!SLUG_PATTERN.test(position.slug)) problems.push(`Invalid slug format: ${position.slug}`);
  }

  const techniqueSlugs = new Set<string>();
  for (const technique of techniques) {
    if (techniqueSlugs.has(technique.slug)) {
      problems.push(`Duplicate technique slug: ${technique.slug}`);
    }
    techniqueSlugs.add(technique.slug);
  }

  for (const technique of techniques) {
    const { slug } = technique;
    if (!SLUG_PATTERN.test(slug)) problems.push(`Invalid slug format: ${slug}`);
    if (!technique.nameDe.trim() || !technique.nameEn.trim()) problems.push(`Empty name: ${slug}`);
    if (!positionSlugs.has(technique.position)) {
      problems.push(`Unknown position "${technique.position}" in ${slug}`);
    }
    if (technique.categories.length === 0) problems.push(`No category for ${slug}`);
    for (const category of technique.categories) {
      if (!categorySlugs.has(category)) problems.push(`Unknown category "${category}" in ${slug}`);
    }
    for (const required of technique.requires ?? []) {
      if (required === slug) problems.push(`Technique requires itself: ${slug}`);
      else if (!techniqueSlugs.has(required)) {
        problems.push(`Unknown prerequisite "${required}" in ${slug}`);
      }
    }
  }

  if (problems.length === 0) {
    const edges = [
      ...techniques.flatMap((t) => (t.requires ?? []).map((from) => ({ from, to: t.slug }))),
      ...existingPrerequisites,
    ];
    const nodes = new Set([...techniqueSlugs, ...edges.flatMap(({ from, to }) => [from, to])]);
    const cycle = findCycle(nodes, edges);
    if (cycle) problems.push(new CycleError(cycle).message + " (prerequisites)");
  }

  if (problems.length > 0) {
    throw new Error(`Invalid technique seed:\n- ${problems.join("\n- ")}`);
  }
}
