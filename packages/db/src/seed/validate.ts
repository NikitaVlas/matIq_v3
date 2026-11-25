import { CycleError, findCycle, type Edge } from "@matiq/roadmap";
import type { CategoryLinkSeed, CategorySeed } from "./data/categories.ts";

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
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(category.slug)) {
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
