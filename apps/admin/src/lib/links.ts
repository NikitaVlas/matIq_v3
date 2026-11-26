import type { Category, CategoryLink, CategoryLinkKind } from "@matiq/contracts";

export interface LinkCounts {
  outgoing: number;
  incoming: number;
}

/** Number of outgoing / incoming links per category slug (all kinds). */
export function countLinks(links: readonly CategoryLink[]): Map<string, LinkCounts> {
  const counts = new Map<string, LinkCounts>();
  const get = (slug: string) => {
    let entry = counts.get(slug);
    if (!entry) {
      entry = { outgoing: 0, incoming: 0 };
      counts.set(slug, entry);
    }
    return entry;
  };
  for (const link of links) {
    get(link.from).outgoing += 1;
    get(link.to).incoming += 1;
  }
  return counts;
}

export type LinkFilter = CategoryLinkKind | "all";

export interface LinkRow {
  key: string;
  kind: CategoryLinkKind;
  from: { slug: string; name: string };
  to: { slug: string; name: string };
}

/**
 * Links with display names, filtered by kind. Unknown slugs fall back to the slug
 * itself so a broken reference is visible instead of silently dropped.
 */
export function toLinkRows(
  links: readonly CategoryLink[],
  categories: readonly Category[],
  filter: LinkFilter,
): LinkRow[] {
  const nameBySlug = new Map(categories.map((c) => [c.slug, c.nameDe]));
  return links
    .filter((link) => filter === "all" || link.kind === filter)
    .map((link) => ({
      key: `${link.kind}:${link.from}:${link.to}`,
      kind: link.kind,
      from: { slug: link.from, name: nameBySlug.get(link.from) ?? link.from },
      to: { slug: link.to, name: nameBySlug.get(link.to) ?? link.to },
    }));
}
