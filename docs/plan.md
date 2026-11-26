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
- **Positions / techniques** are the internal model for the roadmap engine and assessment; they
  are created in the admin. Videos link to techniques and categories (many-to-many).
- A video belongs to at most one course; an instructor publishes single videos or courses.
- Roles: `admin` (only the owner, uses `apps/admin`), `instructor` (public page + own stats in
  `apps/web`), `user`.

## Phase 1 — foundation

| #   | Step                                                                                                                      | Status |
| --- | ------------------------------------------------------------------------------------------------------------------------- | ------ |
| 1   | Monorepo skeleton: pnpm workspaces, Turborepo, `@matiq/config`                                                            | done   |
| 2   | docker-compose (Postgres 18, Mailpit), `.env.example`                                                                     | done   |
| 3   | `packages/db`: schema (categories, links, positions, techniques, …) + first migration                                     | done   |
| 4   | `packages/roadmap/graph`: cycle detection, topological sort, tests                                                        | done   |
| 5   | Seed: 35 categories + links (validated acyclic), dev-only demo seed                                                       | done   |
| 6   | `apps/api` (NestJS): env validation, DB module, `/health`, logging, error format, `GET /categories`; `packages/contracts` | done   |
| 7   | `apps/web` (Next.js): `de.ts`, mobile-first layout, Impressum/Datenschutz/AGB from `content/legal/*.md`, categories page  | done   |
| 8   | `apps/admin` (Vite + React): layout, read-only categories and links table                                                 | done   |
| 9   | Dockerfiles for api/web/admin (multi-stage) + full-stack compose profile                                                  | done   |
| 10  | README: local setup, commands, structure                                                                                  | done   |

## Later phases

2. **Accounts + assessment** — Better Auth (email/password, Google, verification, reset), `packages/mail` with Brevo, multi-step assessment with saved progress.
3. **Content + admin** — CRUD for categories, links (cycle check), positions, techniques, instructors, courses, videos; Bunny Stream upload and player.
4. **Roadmap** — engine + tests, roadmap UI with phases and "Warum dieses Video?", video page with progress.
5. **Monetization** — Stripe subscription (Checkout, Customer Portal, webhooks), free previews, access checks, Widerrufsbelehrung.
6. **Production** — Coolify deploy, DB backups, rate limiting, security headers, error logging.
