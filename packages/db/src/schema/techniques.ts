import { sql } from "drizzle-orm";
import {
  type AnyPgColumn,
  boolean,
  check,
  index,
  integer,
  pgTable,
  primaryKey,
  text,
  uuid,
} from "drizzle-orm/pg-core";
import { categories } from "./categories.ts";
import { createdAt, id, timestamps } from "./columns.ts";
import {
  giMode,
  skillLevel,
  techniqueLinkKind,
  techniquePerspective,
  techniqueType,
} from "./enums.ts";

/**
 * Internal position model for the roadmap engine and the assessment
 * (Mount, Side Control, Knee on Belly, ...). Not shown as navigation.
 */
export const positions = pgTable(
  "positions",
  {
    id: id(),
    slug: text().notNull().unique(),
    nameDe: text().notNull(),
    nameEn: text().notNull(),
    parentId: uuid().references((): AnyPgColumn => positions.id, { onDelete: "set null" }),
    sortOrder: integer().notNull().default(0),
    ...timestamps,
  },
  (t) => [index("positions_parent_idx").on(t.parentId)],
);

export const techniques = pgTable(
  "techniques",
  {
    id: id(),
    slug: text().notNull().unique(),
    nameDe: text().notNull(),
    nameEn: text().notNull(),
    positionId: uuid()
      .notNull()
      .references(() => positions.id, { onDelete: "restrict" }),
    perspective: techniquePerspective().notNull(),
    type: techniqueType().notNull(),
    level: skillLevel().notNull(),
    giMode: giMode().notNull().default("both"),
    /** Scores points under IBJJF rules (relevant for the "competition" goal). */
    isScoring: boolean().notNull().default(false),
    descriptionDe: text(),
    ...timestamps,
  },
  (t) => [index("techniques_position_idx").on(t.positionId)],
);

/**
 * "technique requires requiresTechnique". Must stay acyclic;
 * enforced in application code (packages/roadmap graph utils).
 */
export const techniquePrerequisites = pgTable(
  "technique_prerequisites",
  {
    techniqueId: uuid()
      .notNull()
      .references(() => techniques.id, { onDelete: "cascade" }),
    requiresTechniqueId: uuid()
      .notNull()
      .references(() => techniques.id, { onDelete: "cascade" }),
    createdAt: createdAt(),
  },
  (t) => [
    primaryKey({ columns: [t.techniqueId, t.requiresTechniqueId] }),
    check("technique_prerequisites_no_self", sql`${t.techniqueId} <> ${t.requiresTechniqueId}`),
    index("technique_prerequisites_requires_idx").on(t.requiresTechniqueId),
  ],
);

/** Setups, chains and counters between techniques (cycles allowed). */
export const techniqueLinks = pgTable(
  "technique_links",
  {
    fromTechniqueId: uuid()
      .notNull()
      .references(() => techniques.id, { onDelete: "cascade" }),
    toTechniqueId: uuid()
      .notNull()
      .references(() => techniques.id, { onDelete: "cascade" }),
    kind: techniqueLinkKind().notNull(),
    createdAt: createdAt(),
  },
  (t) => [
    primaryKey({ columns: [t.fromTechniqueId, t.toTechniqueId, t.kind] }),
    check("technique_links_no_self", sql`${t.fromTechniqueId} <> ${t.toTechniqueId}`),
    index("technique_links_to_idx").on(t.toTechniqueId),
  ],
);

/** Which navigation categories a technique belongs to (used to pre-fill video categories). */
export const techniqueCategories = pgTable(
  "technique_categories",
  {
    techniqueId: uuid()
      .notNull()
      .references(() => techniques.id, { onDelete: "cascade" }),
    categoryId: uuid()
      .notNull()
      .references(() => categories.id, { onDelete: "cascade" }),
    createdAt: createdAt(),
  },
  (t) => [
    primaryKey({ columns: [t.techniqueId, t.categoryId] }),
    index("technique_categories_category_idx").on(t.categoryId),
  ],
);
