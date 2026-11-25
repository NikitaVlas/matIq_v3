import { sql } from "drizzle-orm";
import {
  boolean,
  check,
  index,
  integer,
  pgTable,
  primaryKey,
  text,
  uuid,
} from "drizzle-orm/pg-core";
import { createdAt, id, timestamps } from "./columns.ts";
import { categoryKind, categoryLinkKind } from "./enums.ts";

/**
 * Navigation sections shown to users ("Kategorien"): Half Guard, Chokes, Conditioning, ...
 * A category is only visible in the app once it has published videos.
 */
export const categories = pgTable("categories", {
  id: id(),
  slug: text().notNull().unique(),
  nameDe: text().notNull(),
  nameEn: text().notNull(),
  descriptionDe: text(),
  kind: categoryKind().notNull(),
  sortOrder: integer().notNull().default(0),
  isHidden: boolean().notNull().default(false),
  ...timestamps,
});

/** Directed relations between categories, used to order and score the roadmap. */
export const categoryLinks = pgTable(
  "category_links",
  {
    fromCategoryId: uuid()
      .notNull()
      .references(() => categories.id, { onDelete: "cascade" }),
    toCategoryId: uuid()
      .notNull()
      .references(() => categories.id, { onDelete: "cascade" }),
    kind: categoryLinkKind().notNull(),
    createdAt: createdAt(),
  },
  (t) => [
    primaryKey({ columns: [t.fromCategoryId, t.toCategoryId, t.kind] }),
    check("category_links_no_self_link", sql`${t.fromCategoryId} <> ${t.toCategoryId}`),
    index("category_links_to_idx").on(t.toCategoryId),
  ],
);
