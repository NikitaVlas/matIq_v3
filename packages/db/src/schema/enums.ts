// Postgres enums. Values come from @matiq/contracts (single source of truth).
import {
  CATEGORY_KINDS,
  CATEGORY_LINK_KINDS,
  GI_MODES,
  SKILL_LEVELS,
  TECHNIQUE_LINK_KINDS,
  TECHNIQUE_PERSPECTIVES,
  TECHNIQUE_TYPES,
} from "@matiq/contracts";
import { pgEnum } from "drizzle-orm/pg-core";

export const categoryKind = pgEnum("category_kind", CATEGORY_KINDS);
export const categoryLinkKind = pgEnum("category_link_kind", CATEGORY_LINK_KINDS);
export const techniquePerspective = pgEnum("technique_perspective", TECHNIQUE_PERSPECTIVES);
export const techniqueType = pgEnum("technique_type", TECHNIQUE_TYPES);
export const skillLevel = pgEnum("skill_level", SKILL_LEVELS);
export const giMode = pgEnum("gi_mode", GI_MODES);
export const techniqueLinkKind = pgEnum("technique_link_kind", TECHNIQUE_LINK_KINDS);
