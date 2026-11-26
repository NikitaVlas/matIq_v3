# syntax=docker/dockerfile:1
# MatIQ API (NestJS). Build from the repo root:
#   docker build -f apps/api/Dockerfile -t matiq-api .
# Commands in the image:
#   node dist/main.js          start the API (default)
#   node dist/cli/migrate.js   apply DB migrations (run before each deploy)
#   node dist/cli/seed.js      insert missing base data: categories, positions, techniques (never overwrites)

FROM node:26-alpine AS base
RUN npm install -g pnpm@10.11.0 turbo@2.11.13

# 1. Prune the monorepo to what @matiq/api needs (better layer caching).
FROM base AS pruner
WORKDIR /repo
COPY . .
RUN turbo prune @matiq/api --docker

# 2. Install, build, and assemble a production-only node_modules.
FROM base AS builder
WORKDIR /repo
COPY --from=pruner /repo/out/json/ .
RUN pnpm install --frozen-lockfile
COPY --from=pruner /repo/out/full/ .
RUN turbo run build --filter=@matiq/api
RUN pnpm --filter @matiq/api deploy --prod --legacy /prod/api

# 3. Minimal runtime image, non-root.
FROM node:26-alpine AS runner
ENV NODE_ENV=production
WORKDIR /app
COPY --from=builder --chown=node:node /prod/api .
USER node
EXPOSE 4000
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD wget -qO- http://127.0.0.1:4000/health > /dev/null || exit 1
CMD ["node", "dist/main.js"]
