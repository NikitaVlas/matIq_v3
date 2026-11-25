import { pgEnum } from "drizzle-orm/pg-core";

/** What a navigation category represents. */
export const categoryKind = pgEnum("category_kind", ["position", "technique_type", "training"]);

/**
 * learn_before: strict ordering for the roadmap (must stay acyclic).
 * leads_to: what typically follows in a match (cycles allowed).
 */
export const categoryLinkKind = pgEnum("category_link_kind", ["learn_before", "leads_to"]);

export const techniquePerspective = pgEnum("technique_perspective", ["top", "bottom", "neutral"]);

export const techniqueType = pgEnum("technique_type", [
  "submission",
  "sweep",
  "pass",
  "escape",
  "takedown",
  "transition",
  "retention",
  "control",
  "concept",
]);

export const skillLevel = pgEnum("skill_level", ["beginner", "intermediate", "advanced"]);

export const giMode = pgEnum("gi_mode", ["gi", "nogi", "both"]);

/** Non-prerequisite relations between techniques (cycles allowed). */
export const techniqueLinkKind = pgEnum("technique_link_kind", ["setup_for", "chain", "counter"]);
