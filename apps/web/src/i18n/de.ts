// All user-facing text of the web app. German only; edit copy here, not in components.
import type { CategoryKind, ErrorCode } from "@matiq/contracts";

export const de = {
  meta: {
    title: "MatIQ",
    titleTemplate: "%s · MatIQ",
    description:
      "Trainiere klüger, nicht nur härter. Dein persönlicher Lernweg für BJJ und Grappling – mit Videos, die zu deinem Level passen.",
  },
  brand: {
    name: "MatIQ",
    slogan: "Trainiere klüger, nicht nur härter.",
  },
  nav: {
    label: "Hauptnavigation",
    skipToContent: "Zum Inhalt springen",
    home: "Start",
    categories: "Kategorien",
  },
  footer: {
    legalLabel: "Rechtliches",
    impressum: "Impressum",
    datenschutz: "Datenschutz",
    agb: "AGB",
    copyright: (year: number) => `© ${year} MatIQ`,
  },
  home: {
    intro:
      "MatIQ ist deine Videoplattform für BJJ und Grappling auf Deutsch. Statt endlos zu suchen, bekommst du einen Lernweg, der zu deinem Gürtel, deinen Zielen und deinen Schwachstellen passt.",
    ctaCategories: "Kategorien entdecken",
    roadmapTitle: "Dein persönlicher Lernweg",
    roadmapText:
      "Bald: Beantworte ein paar Fragen zu deinem Training – MatIQ stellt dir daraus eine Reihenfolge passender Videos zusammen und erklärt, warum jedes Video dran ist.",
  },
  categories: {
    title: "Kategorien",
    intro: "Alle Themen auf einen Blick – von Closed Guard bis Mindset.",
    empty: "Noch keine Kategorien vorhanden.",
    count: (n: number) => (n === 1 ? "1 Kategorie" : `${n} Kategorien`),
    kinds: {
      position: "Positionen",
      technique_type: "Techniken",
      training: "Training",
    } satisfies Record<CategoryKind, string>,
  },
  legal: {
    impressum: "Impressum",
    datenschutz: "Datenschutzerklärung",
    agb: "Allgemeine Geschäftsbedingungen",
  },
  notFound: {
    title: "Seite nicht gefunden",
    text: "Diese Seite gibt es nicht (mehr). Vielleicht hilft dir der Weg zurück zum Start.",
    back: "Zur Startseite",
  },
  errors: {
    loadFailed:
      "Die Inhalte konnten gerade nicht geladen werden. Bitte versuche es in einem Moment noch einmal.",
    codes: {
      BAD_REQUEST: "Die Anfrage war ungültig.",
      VALIDATION_ERROR: "Bitte überprüfe deine Eingaben.",
      UNAUTHORIZED: "Bitte melde dich an.",
      FORBIDDEN: "Dafür fehlt dir die Berechtigung.",
      NOT_FOUND: "Nicht gefunden.",
      CONFLICT: "Das gibt es bereits.",
      RATE_LIMITED: "Zu viele Anfragen. Bitte warte kurz.",
      SERVICE_UNAVAILABLE: "Der Dienst ist gerade nicht erreichbar.",
      INTERNAL_ERROR: "Etwas ist schiefgelaufen. Bitte versuche es später erneut.",
    } satisfies Record<ErrorCode, string>,
  },
};
