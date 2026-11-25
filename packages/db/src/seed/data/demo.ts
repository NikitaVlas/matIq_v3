// Development-only demo content: a handful of positions and techniques so the UI and the
// roadmap engine have something to work with. Real content is created in the admin.
import type {
  giMode,
  skillLevel,
  techniquePerspective,
  techniqueType,
} from "../../schema/enums.ts";

type EnumValue<E extends { enumValues: readonly string[] }> = E["enumValues"][number];

export interface PositionSeed {
  slug: string;
  nameDe: string;
  nameEn: string;
}

export interface TechniqueSeed {
  slug: string;
  nameDe: string;
  nameEn: string;
  position: string;
  perspective: EnumValue<typeof techniquePerspective>;
  type: EnumValue<typeof techniqueType>;
  level: EnumValue<typeof skillLevel>;
  giMode?: EnumValue<typeof giMode>;
  isScoring?: boolean;
  /** Slugs of techniques that must be learned first. */
  requires?: string[];
  /** Category slugs (from the base seed). */
  categories: string[];
}

export const DEMO_POSITIONS: readonly PositionSeed[] = [
  { slug: "standing", nameDe: "Stand", nameEn: "Standing" },
  { slug: "closed-guard", nameDe: "Closed Guard", nameEn: "Closed Guard" },
  { slug: "half-guard", nameDe: "Half Guard", nameEn: "Half Guard" },
  { slug: "side-control", nameDe: "Side Control", nameEn: "Side Control" },
  { slug: "mount", nameDe: "Mount", nameEn: "Mount" },
  { slug: "back-control", nameDe: "Rückenkontrolle", nameEn: "Back Control" },
];

export const DEMO_TECHNIQUES: readonly TechniqueSeed[] = [
  {
    slug: "shrimp",
    nameDe: "Hüftflucht (Shrimp)",
    nameEn: "Shrimp",
    position: "side-control",
    perspective: "bottom",
    type: "concept",
    level: "beginner",
    categories: ["fundamentals", "escapes"],
  },
  {
    slug: "bridge",
    nameDe: "Brücke (Bridge)",
    nameEn: "Bridge",
    position: "mount",
    perspective: "bottom",
    type: "concept",
    level: "beginner",
    categories: ["fundamentals", "escapes"],
  },
  {
    slug: "elbow-knee-escape",
    nameDe: "Elbow-Knee-Escape",
    nameEn: "Elbow-Knee Escape",
    position: "mount",
    perspective: "bottom",
    type: "escape",
    level: "beginner",
    requires: ["shrimp"],
    categories: ["escapes"],
  },
  {
    slug: "upa-escape",
    nameDe: "Upa-Escape",
    nameEn: "Upa Escape",
    position: "mount",
    perspective: "bottom",
    type: "escape",
    level: "beginner",
    requires: ["bridge"],
    categories: ["escapes"],
  },
  {
    slug: "closed-guard-posture-break",
    nameDe: "Haltung brechen in der Closed Guard",
    nameEn: "Closed Guard Posture Break",
    position: "closed-guard",
    perspective: "bottom",
    type: "control",
    level: "beginner",
    categories: ["closed-guard"],
  },
  {
    slug: "scissor-sweep",
    nameDe: "Scissor Sweep",
    nameEn: "Scissor Sweep",
    position: "closed-guard",
    perspective: "bottom",
    type: "sweep",
    level: "beginner",
    isScoring: true,
    requires: ["closed-guard-posture-break"],
    categories: ["closed-guard"],
  },
  {
    slug: "armbar-from-guard",
    nameDe: "Armbar aus der Guard",
    nameEn: "Armbar from Guard",
    position: "closed-guard",
    perspective: "bottom",
    type: "submission",
    level: "beginner",
    requires: ["closed-guard-posture-break"],
    categories: ["closed-guard", "arm-attacks", "submissions"],
  },
  {
    slug: "triangle-from-guard",
    nameDe: "Triangle aus der Guard",
    nameEn: "Triangle from Guard",
    position: "closed-guard",
    perspective: "bottom",
    type: "submission",
    level: "intermediate",
    requires: ["armbar-from-guard"],
    categories: ["closed-guard", "chokes", "submissions"],
  },
  {
    slug: "double-leg-takedown",
    nameDe: "Double Leg Takedown",
    nameEn: "Double Leg Takedown",
    position: "standing",
    perspective: "neutral",
    type: "takedown",
    level: "beginner",
    isScoring: true,
    categories: ["takedowns", "no-gi-takedowns", "wrestling"],
  },
  {
    slug: "knee-cut-pass",
    nameDe: "Knee Cut Pass",
    nameEn: "Knee Cut Pass",
    position: "half-guard",
    perspective: "top",
    type: "pass",
    level: "intermediate",
    isScoring: true,
    categories: ["guard-passing", "half-guard"],
  },
  {
    slug: "rear-naked-choke",
    nameDe: "Rear Naked Choke",
    nameEn: "Rear Naked Choke",
    position: "back-control",
    perspective: "top",
    type: "submission",
    level: "beginner",
    categories: ["back-attacks", "chokes", "submissions"],
  },
];
