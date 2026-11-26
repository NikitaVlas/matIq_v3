# MatIQ

**MatIQ – Trainiere klüger, nicht nur härter.**

German-language video platform for BJJ and grappling. Its core feature is a personal roadmap:
users answer an assessment (belt, goals, strong and weak positions, known techniques) and get an
ordered sequence of videos that fits their level, with an explanation for every video.

- All UI text is **German**; code, comments and commit messages are **English**.
- Web only, **mobile-first** (people watch on their phone at the gym).
- **DSGVO**: data stays in the EU, no third-party trackers, only necessary cookies.

Development status and decisions: [docs/plan.md](docs/plan.md).

## Tech stack

| Area     | Choice                                                      |
| -------- | ----------------------------------------------------------- |
| Monorepo | pnpm workspaces + Turborepo, TypeScript 6 (strict), Node 26 |
| API      | NestJS 12 (ESM), zod, pino logging                          |
| User app | Next.js 16 (App Router), React 19, Tailwind CSS 4           |
| Admin    | Vite 8 + React 19, TanStack Router + Query, Tailwind CSS 4  |
| Database | PostgreSQL 18 + Drizzle ORM (migrations via drizzle-kit)    |
| Tests    | Vitest (unit + API end-to-end)                              |
| Later    | Better Auth, Bunny Stream, Brevo (mail), Stripe             |
| Hosting  | Docker images, Hetzner VPS + Coolify                        |

## Repository layout

```
apps/
  api/        NestJS API – the only app that talks to the database
  web/        Next.js user app (German routes: /kategorien, /impressum, ...)
  admin/      Vite + React admin SPA (only for the owner)
packages/
  config/     shared tsconfig, ESLint and Prettier presets
  contracts/  zod schemas, enum values and error codes shared by all apps
  db/         Drizzle schema, migrations (drizzle/), seed data
  roadmap/    pure roadmap engine and graph utilities (cycle check, topo sort)
docs/plan.md  development plan, decisions and step status
```

UI text lives in one file per app: `apps/web/src/i18n/de.ts` and `apps/admin/src/i18n/de.ts`.
Legal pages (Impressum, Datenschutz, AGB) are Markdown in `apps/web/content/legal/`.

## Getting started

### Prerequisites

- Node.js 26 (see `.nvmrc`)
- pnpm 10.11 (`npm install -g pnpm@10.11.0`)
- Docker Desktop (for Postgres and Mailpit)

### First run

```bash
pnpm install
cp .env.example .env          # PowerShell: Copy-Item .env.example .env
pnpm services:up              # Postgres + Mailpit in Docker
pnpm db:migrate               # create the tables
pnpm db:seed                  # 35 categories + links, 8 positions, 46 base techniques
pnpm dev                      # api, web and admin in watch mode
```

| What                  | URL                                              |
| --------------------- | ------------------------------------------------ |
| User app (web)        | http://localhost:3000                            |
| Admin                 | http://localhost:5173                            |
| API                   | http://localhost:4000 (`/health`, `/categories`) |
| Mailpit (local inbox) | http://localhost:8025                            |

To run a single app: `pnpm --filter @matiq/api dev` (or `@matiq/web`, `@matiq/admin`).

### Commands

| Command                                                | Does                                                                           |
| ------------------------------------------------------ | ------------------------------------------------------------------------------ |
| `pnpm dev`                                             | Start all apps in watch mode                                                   |
| `pnpm build`                                           | Build all packages and apps                                                    |
| `pnpm lint` / `pnpm typecheck`                         | ESLint / TypeScript across the monorepo                                        |
| `pnpm test`                                            | All unit tests (no database needed)                                            |
| `pnpm --filter @matiq/api test:e2e`                    | API end-to-end tests (needs `services:up`, `db:migrate`, `db:seed`)            |
| `pnpm format` / `pnpm format:check`                    | Prettier                                                                       |
| `pnpm services:up` / `services:down` / `services:logs` | Postgres + Mailpit                                                             |
| `pnpm db:generate --name <change>`                     | Create a migration after changing `packages/db/src/schema`                     |
| `pnpm db:migrate`                                      | Apply pending migrations                                                       |
| `pnpm db:seed`                                         | Insert missing base data: categories, positions, techniques (never overwrites) |
| `pnpm db:studio`                                       | Drizzle Studio (browse the database)                                           |
| `pnpm stack:up` / `stack:down`                         | Whole stack as production-like containers (see below)                          |

## Environment variables

One `.env` in the repository root is shared by Docker Compose and all apps in local development.
`.env.example` documents every variable; never commit `.env`.

| Variable                                                             | Used by         | Purpose                                                                              |
| -------------------------------------------------------------------- | --------------- | ------------------------------------------------------------------------------------ |
| `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`, `POSTGRES_PORT` | compose         | Local database                                                                       |
| `DATABASE_URL`                                                       | api, db scripts | Postgres connection string                                                           |
| `API_PORT`                                                           | api             | Port the API listens on                                                              |
| `WEB_URL`, `ADMIN_URL`                                               | api, web        | Allowed CORS origins; the web dev server also listens on the port of `WEB_URL`       |
| `LOG_LEVEL`                                                          | api             | `info` by default (`debug`, `warn`, ..., `silent`)                                   |
| `API_URL`                                                            | web             | API base URL for server-side requests                                                |
| `VITE_API_URL`                                                       | admin           | API base URL for the browser – **public**, baked into the admin bundle at build time |
| `MAIL_*`, `SMTP_*`, `MAILPIT_*`                                      | (phase 2)       | Mail: Mailpit locally, Brevo in production                                           |

Variables for later phases (Better Auth, Bunny Stream, Stripe) are listed commented out in
`.env.example`. The API validates its environment on start and exits with a readable message if
something is missing or malformed.

## Docker

Every app has a multi-stage Dockerfile; the build context is always the repository root.

```bash
docker build -f apps/api/Dockerfile -t matiq-api .
docker build -f apps/web/Dockerfile -t matiq-web .
docker build -f apps/admin/Dockerfile --build-arg VITE_API_URL=https://api.example.de -t matiq-admin .
```

The API image contains three entry points:

| Command                    | When                                                     |
| -------------------------- | -------------------------------------------------------- |
| `node dist/main.js`        | default: start the API                                   |
| `node dist/cli/migrate.js` | before every deploy (Coolify pre-deploy command)         |
| `node dist/cli/seed.js`    | once on a new database; safe to repeat, never overwrites |

`pnpm stack:up` builds these images and runs the whole stack with Compose profile `full`:
Postgres → migrate → seed → api → web + admin, on the same ports as in development.
Stop the `pnpm dev` servers first, the ports are the same.

### Deployment (Coolify) – outline

- Three applications from this repository: `apps/api/Dockerfile` (port 4000),
  `apps/web/Dockerfile` (port 3000), `apps/admin/Dockerfile` (port 8080), plus a managed
  PostgreSQL 18 with backups.
- Suggested domains: `app.<domain>`, `admin.<domain>`, `api.<domain>` (DNS at Strato → VPS).
- api: `DATABASE_URL`, `WEB_URL`, `ADMIN_URL`, `NODE_ENV=production`; pre-deploy command
  `node dist/cli/migrate.js`.
- web: `API_URL` (internal URL of the api service).
- admin: build argument `VITE_API_URL=https://api.<domain>`.

Production hardening (backups, rate limiting, security headers, error logging) is phase 6.

## Troubleshooting

- **`EADDRINUSE` on port 3000** – another app uses the port, and `pnpm dev` stops all apps.
  Set `WEB_URL=http://localhost:3100` in `.env`: the web app takes its dev port from `WEB_URL`,
  and the API uses the same value as CORS origin. For the container stack set
  `WEB_HOST_PORT=3100` as well.
- **`/health` returns 503 `database: down`** – Docker is not running. Start Docker Desktop and
  run `pnpm services:up`; the API reconnects by itself.
- **The web app shows "Die Inhalte konnten gerade nicht geladen werden"** – the API is not
  reachable from the web server. Check `API_URL` and that the API runs.

## Contributing

One development step = one commit, using
[Conventional Commits](https://www.conventionalcommits.org/) with the package or app as scope,
e.g. `feat(db): ...`, `fix(web): ...`. Before committing run `pnpm lint`, `pnpm typecheck`,
`pnpm build`, `pnpm test` and `pnpm format:check`.
