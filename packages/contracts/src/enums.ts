// Single source of truth for domain enum values.
// Used by the DB schema (pgEnum), the API and the frontends.

export const CATEGORY_KINDS = ["position", "technique_type", "training"] as const;
export type CategoryKind = (typeof CATEGORY_KINDS)[number];

/**
 * learn_before: strict ordering for the roadmap (must stay acyclic).
 * leads_to: what typically follows in a match (cycles allowed).
 */
export const CATEGORY_LINK_KINDS = ["learn_before", "leads_to"] as const;
export type CategoryLinkKind = (typeof CATEGORY_LINK_KINDS)[number];

export const TECHNIQUE_PERSPECTIVES = ["top", "bottom", "neutral"] as const;
export type TechniquePerspective = (typeof TECHNIQUE_PERSPECTIVES)[number];

export const TECHNIQUE_TYPES = [
  "submission",
  "sweep",
  "pass",
  "escape",
  "takedown",
  "transition",
  "retention",
  "control",
  "concept",
] as const;
export type TechniqueType = (typeof TECHNIQUE_TYPES)[number];

export const SKILL_LEVELS = ["beginner", "intermediate", "advanced"] as const;
export type SkillLevel = (typeof SKILL_LEVELS)[number];

export const GI_MODES = ["gi", "nogi", "both"] as const;
export type GiMode = (typeof GI_MODES)[number];

/** Non-prerequisite relations between techniques (cycles allowed). */
export const TECHNIQUE_LINK_KINDS = ["setup_for", "chain", "counter"] as const;
export type TechniqueLinkKind = (typeof TECHNIQUE_LINK_KINDS)[number];
