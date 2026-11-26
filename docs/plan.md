# MatIQ — development plan

German-language BJJ/grappling video platform with a personal roadmap. One step = one commit;
the owner commits every step. Status is updated at the end of each step.

## Architecture

- `apps/api` — NestJS 12 (ESM), the only app that talks to the database (Better Auth, Bunny, Stripe, mail)
- `apps/web` — Next.js 16, user app (mobile-first): assessment, roadmap, categories, courses, instructor pages.
  German routes (`/kategorien`, `/impressum`, …); all UI text in `src/i18n/de.ts`; legal texts in `content/legal/*.md`
- `apps/admin` — Vite + React SPA, admin only. TanStack Router (typed routes, filters in the URL) +
  TanStack Query; German routes (`/kategorien`, `/verknuepfungen`); UI text in `src/i18n/de.ts`;
  API base URL from public `VITE_API_URL`
- `packages/config` — shared tsconfig / eslint / prettier
- `packages/db` — Drizzle schema, migrations, seed
- `packages/roadmap` — pure roadmap engine and graph utils (Vitest)
- `packages/contracts` — zod schemas, error codes and enum values shared by db, api and frontends
- `packages/mail` — mail abstraction: Mailpit locally, Brevo in production (phase 2)

Infra: Postgres 18 + Mailpit via docker-compose locally; Hetzner VPS + Coolify in production.
Each app has a multi-stage Dockerfile (`apps/*/Dockerfile`, build context = repo root, `turbo prune`).
The API image also runs `node dist/cli/migrate.js` (before every deploy) and `node dist/cli/seed.js`.
`pnpm stack:up` runs the whole stack locally with the production images (compose profile `full`).

## Domain decisions

- **Categories** ("Kategorien") are 35 flat, independent navigation sections. Names stay English
  (common in German BJJ) except `Kondition` and `Krafttraining`. A category is visible in the app
  only once it has published videos (until videos exist in phase 3, `GET /categories` returns all
  non-hidden categories).
- **Category links**: `learn_before` (strict order for the roadmap, must stay acyclic) and
  `leads_to` (what follows in a match, cycles allowed).
- **Positions / techniques** are the internal model for the roadmap engine and assessment. The
  base seed has the 8 assessment positions and 46 owner-reviewed core techniques
  (`packages/db/src/seed/data/`); further techniques (narrow guards like Spider, Lasso, X, SLX,
  50/50, Z, Rubber, Lapel, RDLR) are created in the admin together with real videos. Videos link to
  techniques and categories (many-to-many).
- **Technique levels** are stored as `beginner` / `intermediate` / `advanced` and shown in the UI
  as "Stufe 1 / 2 / 3". "Voraussetzungen" (prerequisites) must stay acyclic.
- A video belongs to at most one course; an instructor publishes single videos or courses.
- Roles: `admin` (only the owner, uses `apps/admin`), `instructor` (public page + own stats in
  `apps/web`), `user`.

### Assessment ("Fragebogen")

- 7 short mobile steps, one topic per screen, step in the URL (`/fragebogen/<n>`), answers saved
  on every "Weiter": 1 belt / stripes / years, 2 sessions per week + Gi/No-Gi, 3 goals + optional
  focus note, 4 position ratings, 5 favourite submissions (max 5), 6 known techniques (skippable,
  filtered by level), 7 summary → "Lernweg erstellen".
- **Before registration**: guests fill it in; the draft lives in `localStorage` (technically
  necessary, no consent banner) and moves into the account after sign-up / sign-in at step 7.
- **Rated positions (step 4)**: Stand (one rating), Closed Guard, Open Guard, Half Guard,
  Side Control, Mount, Back, Turtle — each rated 1–5 for "Oben" and "Unten"; "Weiß nicht" allowed.
- **Not asked**: injuries, weight, age (injuries are health data, DSGVO Art. 9).
- A completed assessment is immutable; a new one produces a new roadmap, video progress is kept.
- Per-step zod schemas live in `@matiq/contracts` and validate both the form and the API.

## Phase 1 — foundation

| #   | Step                                                                                                                      | Status |
| --- | ------------------------------------------------------------------------------------------------------------------------- | ------ |
| 1   | Monorepo skeleton: pnpm workspaces, Turborepo, `@matiq/config`                                                            | done   |
| 2   | docker-compose (Postgres 18, Mailpit), `.env.example`                                                                     | done   |
| 3   | `packages/db`: schema (categories, links, positions, techniques, …) + first migration                                     | done   |
| 4   | `packages/roadmap/graph`: cycle detection, topological sort, tests                                                        | done   |
| 5   | Seed: 35 categories + links (validated acyclic); demo seed later replaced by the phase 2 base seed                        | done   |
| 6   | `apps/api` (NestJS): env validation, DB module, `/health`, logging, error format, `GET /categories`; `packages/contracts` | done   |
| 7   | `apps/web` (Next.js): `de.ts`, mobile-first layout, Impressum/Datenschutz/AGB from `content/legal/*.md`, categories page  | done   |
| 8   | `apps/admin` (Vite + React): layout, read-only categories and links table                                                 | done   |
| 9   | Dockerfiles for api/web/admin (multi-stage) + full-stack compose profile                                                  | done   |
| 10  | README: local setup, commands, structure                                                                                  | done   |

## Phase 2 — accounts + assessment

| #   | Step                                                                                                                                    | Status |
| --- | --------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| 1   | Base seed: the 8 assessment positions + 46 core techniques (DE/EN, prerequisites, categories), reviewed by the owner; demo seed removed | done   |
| 2   | `packages/mail`: provider interface, SMTP (Mailpit) + Brevo, German templates (verify email, reset password)                            |        |
| 3   | Better Auth in the API: auth tables + roles, email/password with verification and reset, Google (enabled once env is set), rate limits  |        |
| 4   | Web auth pages: `/registrieren`, `/anmelden`, `/passwort-vergessen`, `/passwort-zuruecksetzen`, session in the header                   |        |
| 5   | Admin protection: admin-only API guard, admin login, CLI to grant the first admin role                                                  |        |
| 6   | Assessment backend: tables + migration, step schemas in contracts, `GET/PUT/POST /assessments/current…`, tests                          |        |
| 7   | Assessment UI in web: 7 steps, guest draft in `localStorage`, sync after sign-in, summary                                               |        |

Needed from the owner: Google OAuth client ID/secret (Google Cloud Console, free) before Google
sign-in is switched on; a Brevo account before the first production deploy.

## Later phases

3. **Content + admin** — CRUD for categories, links (cycle check), positions, techniques, instructors, courses, videos; Bunny Stream upload and player.
4. **Roadmap** — engine + tests, roadmap UI with phases and "Warum dieses Video?", video page with progress.
5. **Monetization** — Stripe subscription (Checkout, Customer Portal, webhooks), free previews, access checks, Widerrufsbelehrung.
6. **Production** — Coolify deploy, DB backups, rate limiting, security headers, error logging.
