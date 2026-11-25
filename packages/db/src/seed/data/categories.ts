// Base navigation categories. UI names stay English (common in German BJJ),
// except Kondition and Krafttraining. Descriptions are German UI text.
import type { categoryKind, categoryLinkKind } from "../../schema/enums.ts";

export type CategoryKind = (typeof categoryKind.enumValues)[number];
export type CategoryLinkKind = (typeof categoryLinkKind.enumValues)[number];

export interface CategorySeed {
  slug: string;
  nameDe: string;
  nameEn: string;
  kind: CategoryKind;
  descriptionDe: string;
}

export interface CategoryLinkSeed {
  from: string;
  to: string;
  kind: CategoryLinkKind;
}

export const CATEGORY_SEED: readonly CategorySeed[] = [
  {
    slug: "50-50",
    nameDe: "50/50",
    nameEn: "50/50",
    kind: "position",
    descriptionDe: "Symmetrische Beinverschränkung – Sweeps, Rückenaufnahmen und Fußhebel.",
  },
  {
    slug: "arm-attacks",
    nameDe: "Arm Attacks",
    nameEn: "Arm Attacks",
    kind: "technique_type",
    descriptionDe: "Arm- und Schulterhebel: Armbar, Kimura, Americana, Omoplata und ihre Setups.",
  },
  {
    slug: "back-attacks",
    nameDe: "Back Attacks",
    nameEn: "Back Attacks",
    kind: "position",
    descriptionDe:
      "Angriffe aus der Rückenkontrolle: Seatbelt, Hooks, Rear Naked Choke, Bow-and-Arrow.",
  },
  {
    slug: "berimbolo-guard",
    nameDe: "Berimbolo Guard",
    nameEn: "Berimbolo Guard",
    kind: "position",
    descriptionDe:
      "Inversions-System aus der De-La-Riva: Berimbolo, Kiss of the Dragon, Rückenaufnahmen.",
  },
  {
    slug: "butterfly-guard",
    nameDe: "Butterfly Guard",
    nameEn: "Butterfly Guard",
    kind: "position",
    descriptionDe: "Sitzende Guard mit beiden Haken – Elevations, Sweeps, Übergänge zur X-Guard.",
  },
  {
    slug: "chokes",
    nameDe: "Chokes",
    nameEn: "Chokes",
    kind: "technique_type",
    descriptionDe:
      "Würgetechniken: Rear Naked, Guillotine, Triangle, Arm-Triangle, D'Arce, Kragenwürger.",
  },
  {
    slug: "closed-guard",
    nameDe: "Closed Guard",
    nameEn: "Closed Guard",
    kind: "position",
    descriptionDe: "Geschlossene Guard: Haltung brechen, Sweeps, Submissions, Kontrolle von unten.",
  },
  {
    slug: "conditioning",
    nameDe: "Kondition",
    nameEn: "Conditioning",
    kind: "training",
    descriptionDe: "BJJ-spezifische Ausdauer: Intervalle, Zirkel, Belastbarkeit für lange Runden.",
  },
  {
    slug: "de-la-riva-guard",
    nameDe: "De La Riva Guard",
    nameEn: "De La Riva Guard",
    kind: "position",
    descriptionDe: "Offene Guard mit Außenhaken – Sweeps, Rückenaufnahmen, Berimbolo-Einstiege.",
  },
  {
    slug: "drills",
    nameDe: "Drills",
    nameEn: "Drills",
    kind: "training",
    descriptionDe: "Solo- und Partnerdrills, die Bewegungen automatisieren – ideal zum Aufwärmen.",
  },
  {
    slug: "escapes",
    nameDe: "Escapes",
    nameEn: "Escapes",
    kind: "technique_type",
    descriptionDe:
      "Aus schlechten Positionen entkommen: Mount, Side Control, Rücken, Knee on Belly.",
  },
  {
    slug: "fundamentals",
    nameDe: "Fundamentals",
    nameEn: "Fundamentals",
    kind: "training",
    descriptionDe: "Grundbewegungen und Prinzipien: Shrimp, Bridge, Base, Posture, Griffe.",
  },
  {
    slug: "gi-takedowns",
    nameDe: "Gi Takedowns",
    nameEn: "Gi Takedowns",
    kind: "technique_type",
    descriptionDe: "Würfe und Takedowns mit Revers- und Ärmelgriffen, inkl. Judo-Würfe.",
  },
  {
    slug: "guard",
    nameDe: "Guard",
    nameEn: "Guard",
    kind: "position",
    descriptionDe:
      "Allgemeine Guard-Prinzipien: Distanz, Griffe, Hüftbewegung – für alle Varianten.",
  },
  {
    slug: "guard-passing",
    nameDe: "Guard Passing",
    nameEn: "Guard Passing",
    kind: "technique_type",
    descriptionDe: "Die Guard passieren: Druck- und Speed-Passes, Knee Cut, Leg Drag, Torreando.",
  },
  {
    slug: "guard-retention",
    nameDe: "Guard Retention",
    nameEn: "Guard Retention",
    kind: "technique_type",
    descriptionDe: "Die eigene Guard behalten: Frames, Hüftbewegung, Beine zurückholen.",
  },
  {
    slug: "half-guard",
    nameDe: "Half Guard",
    nameEn: "Half Guard",
    kind: "position",
    descriptionDe: "Halbe Guard oben und unten: Underhook, Knee Shield, Deep Half, Sweeps, Passes.",
  },
  {
    slug: "lapel-guard",
    nameDe: "Lapel Guard",
    nameEn: "Lapel Guard",
    kind: "position",
    descriptionDe: "Guard-Systeme mit dem Revers (nur Gi): Worm Guard, Squid Guard, Lapel-Sweeps.",
  },
  {
    slug: "lasso-guard",
    nameDe: "Lasso Guard",
    nameEn: "Lasso Guard",
    kind: "position",
    descriptionDe: "Bein um den Arm des Gegners – stabile Kontrolle, Sweeps, Triangle-Setups.",
  },
  {
    slug: "leg-locks-foot-locks",
    nameDe: "Leg Locks & Foot Locks",
    nameEn: "Leg Locks & Foot Locks",
    kind: "technique_type",
    descriptionDe: "Beinhebel: Straight Ankle Lock, Heel Hook, Kneebar, Toe Hold, Ashi Garami.",
  },
  {
    slug: "mindset",
    nameDe: "Mindset",
    nameEn: "Mindset",
    kind: "training",
    descriptionDe: "Mentale Seite: Wettkampfvorbereitung, Umgang mit Druck, Lernstrategien.",
  },
  {
    slug: "mount-attacks",
    nameDe: "Mount Attacks",
    nameEn: "Mount Attacks",
    kind: "position",
    descriptionDe: "Angriffe aus dem Mount: Kontrolle halten, Armbar, Kragenwürger, S-Mount.",
  },
  {
    slug: "no-gi-takedowns",
    nameDe: "No-Gi Takedowns",
    nameEn: "No-Gi Takedowns",
    kind: "technique_type",
    descriptionDe:
      "Takedowns ohne Gi: Single Leg, Double Leg, Snap Down, Front Headlock, Body Lock.",
  },
  {
    slug: "reverse-de-la-riva-guard",
    nameDe: "Reverse De La Riva Guard",
    nameEn: "Reverse De La Riva Guard",
    kind: "position",
    descriptionDe: "Guard mit Innenhaken – stark gegen Knee Cut, Kiss of the Dragon, Sweeps.",
  },
  {
    slug: "rubber-guard",
    nameDe: "Rubber Guard",
    nameEn: "Rubber Guard",
    kind: "position",
    descriptionDe: "Hohe Guard mit Beinkontrolle – Omoplata, Gogoplata, Triangle.",
  },
  {
    slug: "side-control-attacks",
    nameDe: "Side Control Attacks",
    nameEn: "Side Control Attacks",
    kind: "position",
    descriptionDe:
      "Angriffe aus der Seitenkontrolle: Kimura, Americana, Arm-Triangle, Übergang zum Mount.",
  },
  {
    slug: "single-leg-x-guard",
    nameDe: "Single Leg X Guard",
    nameEn: "Single Leg X Guard",
    kind: "position",
    descriptionDe: "Beinverschränkung von unten – Sweeps und Übergänge zu Beinhebeln.",
  },
  {
    slug: "spider-guard",
    nameDe: "Spider Guard",
    nameEn: "Spider Guard",
    kind: "position",
    descriptionDe:
      "Gi-Guard mit Ärmelgriffen und Füßen im Bizeps – Distanzkontrolle, Sweeps, Triangle.",
  },
  {
    slug: "strength-training",
    nameDe: "Krafttraining",
    nameEn: "Strength Training",
    kind: "training",
    descriptionDe: "Krafttraining für Grappler: Griffkraft, Rumpf, Verletzungsprävention.",
  },
  {
    slug: "submissions",
    nameDe: "Submissions",
    nameEn: "Submissions",
    kind: "technique_type",
    descriptionDe: "Übersicht aller Aufgabegriffe und Finish-Prinzipien.",
  },
  {
    slug: "takedowns",
    nameDe: "Takedowns",
    nameEn: "Takedowns",
    kind: "technique_type",
    descriptionDe: "Takedown-Grundlagen: Stand, Griffkampf, Level Change – Gi und No-Gi.",
  },
  {
    slug: "turtle",
    nameDe: "Turtle",
    nameEn: "Turtle",
    kind: "position",
    descriptionDe: "Turtle oben und unten: angreifen, Rücken nehmen, sich befreien.",
  },
  {
    slug: "wrestling",
    nameDe: "Wrestling",
    nameEn: "Wrestling",
    kind: "technique_type",
    descriptionDe: "Ringen für BJJ: Shots, Sprawl, Scrambles, Top-Kontrolle.",
  },
  {
    slug: "x-guard",
    nameDe: "X Guard",
    nameEn: "X Guard",
    kind: "position",
    descriptionDe: "Guard unter dem Gegner mit X-Haken – starke Sweeps gegen stehende Gegner.",
  },
  {
    slug: "z-guard",
    nameDe: "Z Guard",
    nameEn: "Z Guard",
    kind: "position",
    descriptionDe: "Half Guard mit Knee Shield – Distanz halten, Underhook, Sweeps.",
  },
];

const learnBefore = (from: string, to: string): CategoryLinkSeed => ({
  from,
  to,
  kind: "learn_before",
});
const leadsTo = (from: string, to: string): CategoryLinkSeed => ({ from, to, kind: "leads_to" });

/**
 * learn_before: what should be learned first (acyclic, drives roadmap order).
 * leads_to: what typically follows in a match (cycles allowed, drives scoring and
 * "Was kommt danach?").
 */
export const CATEGORY_LINK_SEED: readonly CategoryLinkSeed[] = [
  // --- learn_before: basics first --------------------------------------
  learnBefore("fundamentals", "closed-guard"),
  learnBefore("fundamentals", "escapes"),
  learnBefore("fundamentals", "takedowns"),
  learnBefore("fundamentals", "submissions"),
  learnBefore("fundamentals", "guard-passing"),
  learnBefore("fundamentals", "guard-retention"),
  learnBefore("escapes", "turtle"),
  // takedowns
  learnBefore("takedowns", "gi-takedowns"),
  learnBefore("takedowns", "no-gi-takedowns"),
  learnBefore("takedowns", "wrestling"),
  // submissions
  learnBefore("submissions", "chokes"),
  learnBefore("submissions", "arm-attacks"),
  learnBefore("submissions", "leg-locks-foot-locks"),
  // guards: closed guard → open guard principles → specific open guards
  learnBefore("closed-guard", "guard"),
  learnBefore("closed-guard", "rubber-guard"),
  learnBefore("guard", "guard-retention"),
  learnBefore("guard", "butterfly-guard"),
  learnBefore("guard", "half-guard"),
  learnBefore("guard", "spider-guard"),
  learnBefore("guard", "de-la-riva-guard"),
  learnBefore("half-guard", "z-guard"),
  learnBefore("butterfly-guard", "x-guard"),
  learnBefore("x-guard", "single-leg-x-guard"),
  learnBefore("single-leg-x-guard", "50-50"),
  learnBefore("single-leg-x-guard", "leg-locks-foot-locks"),
  learnBefore("spider-guard", "lasso-guard"),
  learnBefore("de-la-riva-guard", "reverse-de-la-riva-guard"),
  learnBefore("de-la-riva-guard", "berimbolo-guard"),
  learnBefore("de-la-riva-guard", "lapel-guard"),
  // top game
  learnBefore("side-control-attacks", "mount-attacks"),

  // --- leads_to: match flow --------------------------------------------
  // standing → top
  leadsTo("takedowns", "guard-passing"),
  leadsTo("gi-takedowns", "guard-passing"),
  leadsTo("no-gi-takedowns", "guard-passing"),
  leadsTo("wrestling", "guard-passing"),
  leadsTo("wrestling", "turtle"),
  // passing → pins → back → finish
  leadsTo("guard-passing", "side-control-attacks"),
  leadsTo("side-control-attacks", "mount-attacks"),
  leadsTo("side-control-attacks", "arm-attacks"),
  leadsTo("mount-attacks", "back-attacks"),
  leadsTo("mount-attacks", "arm-attacks"),
  leadsTo("turtle", "back-attacks"),
  leadsTo("back-attacks", "chokes"),
  // bottom: escape / retain → guard → sweep or submit
  leadsTo("escapes", "half-guard"),
  leadsTo("escapes", "guard"),
  leadsTo("guard-retention", "guard"),
  leadsTo("closed-guard", "arm-attacks"),
  leadsTo("closed-guard", "chokes"),
  leadsTo("closed-guard", "mount-attacks"),
  leadsTo("spider-guard", "chokes"),
  leadsTo("butterfly-guard", "guard-passing"),
  leadsTo("x-guard", "guard-passing"),
  leadsTo("half-guard", "back-attacks"),
  leadsTo("half-guard", "guard-passing"),
  leadsTo("de-la-riva-guard", "back-attacks"),
  leadsTo("berimbolo-guard", "back-attacks"),
  leadsTo("single-leg-x-guard", "leg-locks-foot-locks"),
  leadsTo("50-50", "leg-locks-foot-locks"),
];
