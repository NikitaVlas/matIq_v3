---
name: matiq-step
description: How to carry out one development step of the MatIQ project (German BJJ video platform, pnpm monorepo with NestJS api, Next.js web, Vite admin, Drizzle/Postgres). Use this skill for any implementation work in this repository, whenever the user says things like "шаг 5", "да, шаг 6", "продолжаем", "следующий шаг", "делаем Фазу 2", "add the categories endpoint", or asks to build, change or fix any part of MatIQ, even if they don't mention steps. It covers scoping the step, project conventions, verification, and the end-of-step report with a commit message the user commits themselves.
---

# One MatIQ development step

The user builds MatIQ step by step and **commits every step themselves**. Each step should be
small enough to be one logical commit, fully verified, and handed back with a clear report. The
user reviews each step before the next one starts, so finishing cleanly matters more than
finishing a lot.

## Language

- Talk to the user in **Russian**.
- Code, comments, identifiers, file names, commit messages: **English**.
- All UI text: **German**, kept in one place per app (`src/i18n/de.ts`), never inline in
  components. This lets the user edit copy without touching code.

## Workflow

### 1. Orient

- Find the next step: from the conversation, or from `docs/plan.md` if it exists. Do only that
  step; don't drift into the next one. If neither says what's next, ask.
- Run `git status --short` and `git log --oneline -3`. If previous steps are still uncommitted,
  that's fine — continue, but mention it in the report so the user can split commits.
- **Never run git commands that change state** (`add`, `commit`, `push`, `init`, `checkout`,
  `stash`, `reset`). The user owns git. Reading (`status`, `log`, `diff`) is fine.

### 2. Ask before hard-to-undo decisions

Stop and ask (briefly, with a recommendation) when a choice is expensive to reverse:
the shape of migrated tables, a new framework or major dependency, infrastructure, anything that
costs money or sends data to a third party (DSGVO: no paid services or trackers without the
user's OK). Small reversible choices: decide, and explain them in the report.

### 3. Implement following the conventions

See "Project conventions" below. Reuse what already exists (`packages/config` presets,
`packages/db/src/schema/columns.ts`, `packages/roadmap` graph utils) instead of re-creating it.

### 4. Verify for real

Run from the repo root and read the output:

```
pnpm lint
pnpm typecheck
pnpm build
pnpm test
pnpm format:check
```

Plus whatever proves _this_ step works: schema change → `pnpm db:generate --name <change>`,
read the SQL, `pnpm db:migrate`, check with `docker compose exec -T postgres psql -U matiq -d matiq`;
API → call the endpoint; UI → open it. If Docker isn't running, start Docker Desktop.
If something can't be verified, say so in the report rather than implying it works.

When a tool fails, fix the cause (e.g. a missing devDependency), don't work around it silently,
and mention the fix in the report.

### 5. Report and stop

End with a report in Russian, in this shape:

```
Шаг N готов: <one sentence: what now works>.

## Что сделано
<bullets with clickable file links; tables for APIs/functions if helpful>

## Решения по ходу
<only if there were any: what was decided and why — e.g. a version pin, a fixed tool error>

## Коммит
<note if earlier steps are uncommitted and how to split them>
```

plus the commit message in a fenced block:

```
<type>(<scope>): <summary in English, imperative, lowercase>

- <what changed, one line each>
```

Types: `feat`, `fix`, `chore`, `refactor`, `test`, `docs`. Scope = package or app (`db`,
`roadmap`, `api`, `web`, `admin`).

Then ask whether to go on to the next step (name it). Don't start it until the user says so.

## Project conventions

**Monorepo** — pnpm workspaces + Turborepo. `apps/api` (NestJS, the only thing that talks to the
DB), `apps/web` (Next.js, user app, mobile-first), `apps/admin` (Vite + React SPA, admin only),
`packages/{config,db,roadmap,contracts,mail}`.

**Dependencies** — add with `pnpm --filter <pkg> add ...`. Every package pins
`typescript@~6.0.3` (typescript-eslint doesn't support TS ≥ 6.1/7 yet) and has `eslint` in its
own devDependencies (pnpm doesn't expose another package's bin). After installing, check for
`unmet peer` warnings.

**Internal packages** (`packages/*`) follow the same template as `packages/db` and
`packages/roadmap`:

- `"type": "module"`, built by **tsup** to ESM + CJS + d.ts (NestJS consumes CJS), `exports` map
  with `import`/`require` conditions.
- `tsconfig.json` extends `@matiq/config/tsconfig/library.json` with `noEmit`,
  `allowImportingTsExtensions`, `erasableSyntaxOnly`, `verbatimModuleSyntax`.
- Relative imports use the `.ts` extension, so Node 26 runs scripts directly (`node src/x.ts`).
- `eslint.config.js` spreads `@matiq/config/eslint/base` and sets `tsconfigRootDir`.
- Tests: Vitest, `src/**/*.test.ts`.

**Database** — Drizzle with `casing: "snake_case"` (camelCase in TS), ids via `id()` (UUID v7),
`timestamps` / `createdAt()` helpers from `columns.ts`. Migrations are generated with a name and
committed. Acyclic relations (`technique_prerequisites`, `category_links` of kind
`learn_before`) are validated with `assertAcyclic` from `@matiq/roadmap` before saving.

**Roadmap engine** — pure, deterministic functions in `packages/roadmap`, no DB or I/O; data comes
in as arguments. Every rule gets tests.

**Env** — one root `.env` for local dev; every new variable goes into `.env.example` with a
comment. Scripts load it via `process.loadEnvFile`.

**Domain** — categories ("Kategorien") are flat, independent navigation sections; a category
is only shown in the app once it has published videos. A video belongs to at most one course.
Only the `admin` role uses `apps/admin`; instructors get a public page and their own stats inside
`apps/web`.
