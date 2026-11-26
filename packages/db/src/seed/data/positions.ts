// Base positions: the internal position model of the roadmap engine and the 8 positions rated
// in the assessment (step 4). Order = order in the assessment.

export interface PositionSeed {
  slug: string;
  nameDe: string;
  nameEn: string;
}

export const POSITION_SEED: readonly PositionSeed[] = [
  { slug: "standing", nameDe: "Stand", nameEn: "Standing" },
  { slug: "closed-guard", nameDe: "Closed Guard", nameEn: "Closed Guard" },
  { slug: "open-guard", nameDe: "Open Guard", nameEn: "Open Guard" },
  { slug: "half-guard", nameDe: "Half Guard", nameEn: "Half Guard" },
  { slug: "side-control", nameDe: "Side Control", nameEn: "Side Control" },
  { slug: "mount", nameDe: "Mount", nameEn: "Mount" },
  { slug: "back-control", nameDe: "Back", nameEn: "Back Control" },
  { slug: "turtle", nameDe: "Turtle", nameEn: "Turtle" },
];
