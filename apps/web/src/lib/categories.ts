import { type Category, CATEGORY_KINDS, type CategoryKind } from "@matiq/contracts";

export interface CategoryGroup {
  kind: CategoryKind;
  categories: Category[];
}

/**
 * Groups categories by kind in the fixed order of CATEGORY_KINDS
 * (positions, techniques, training). Empty groups are dropped;
 * order inside a group follows the input (API sorts by sortOrder).
 */
export function groupCategoriesByKind(categories: readonly Category[]): CategoryGroup[] {
  return CATEGORY_KINDS.map((kind) => ({
    kind,
    categories: categories.filter((category) => category.kind === kind),
  })).filter((group) => group.categories.length > 0);
}
