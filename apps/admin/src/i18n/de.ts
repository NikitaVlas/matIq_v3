// All UI text of the admin app. German only; edit copy here, not in components.
import type { CategoryKind, CategoryLinkKind, ErrorCode } from "@matiq/contracts";

export const de = {
  app: {
    name: "MatIQ Admin",
    navLabel: "Admin-Navigation",
  },
  nav: {
    categories: "Kategorien",
    links: "Verknüpfungen",
  },
  common: {
    loading: "Wird geladen …",
    retry: "Erneut versuchen",
    loadFailed: "Daten konnten nicht geladen werden.",
    readOnlyHint: "Nur Ansicht – Bearbeiten folgt in Phase 3.",
    total: (n: number) => `${n} gesamt`,
  },
  categories: {
    title: "Kategorien",
    columns: {
      name: "Name",
      slug: "Slug",
      kind: "Art",
      sortOrder: "Reihenfolge",
      links: "Verknüpfungen",
      description: "Beschreibung",
    },
    linkCounts: (outgoing: number, incoming: number) =>
      `${outgoing} ausgehend · ${incoming} eingehend`,
    kinds: {
      position: "Position",
      technique_type: "Technik",
      training: "Training",
    } satisfies Record<CategoryKind, string>,
  },
  links: {
    title: "Verknüpfungen",
    filterLabel: "Art der Verknüpfung",
    all: "Alle",
    columns: {
      from: "Von",
      kind: "Art",
      to: "Nach",
    },
    kinds: {
      learn_before: "Vorher lernen",
      leads_to: "Führt zu",
    } satisfies Record<CategoryLinkKind, string>,
    kindHints: {
      learn_before: "Reihenfolge im Lernweg – darf keinen Kreis bilden.",
      leads_to: "Was im Kampf typischerweise folgt – Kreise erlaubt.",
    } satisfies Record<CategoryLinkKind, string>,
    empty: "Keine Verknüpfungen für diesen Filter.",
  },
  errors: {
    codes: {
      BAD_REQUEST: "Ungültige Anfrage.",
      VALIDATION_ERROR: "Eingaben sind ungültig.",
      UNAUTHORIZED: "Bitte anmelden.",
      FORBIDDEN: "Keine Berechtigung.",
      NOT_FOUND: "Nicht gefunden.",
      CONFLICT: "Existiert bereits.",
      RATE_LIMITED: "Zu viele Anfragen.",
      SERVICE_UNAVAILABLE: "Dienst nicht erreichbar.",
      INTERNAL_ERROR: "Interner Fehler.",
    } satisfies Record<ErrorCode, string>,
    network: "API nicht erreichbar. Läuft der Server?",
    notFoundPage: "Seite nicht gefunden.",
  },
};
