# syntax=docker/dockerfile:1
# MatIQ web app (Next.js standalone). Build from the repo root:
#   docker build -f apps/web/Dockerfile -t matiq-web .
# Runtime env: API_URL (internal URL of the API, e.g. http://api:4000).

FROM node:26-alpine AS base
RUN npm install -g pnpm@10.11.0 turbo@2.11.13

FROM base AS pruner
WORKDIR /repo
COPY . .
RUN turbo prune @matiq/web --docker

FROM base AS builder
WORKDIR /repo
COPY --from=pruner /repo/out/json/ .
RUN pnpm install --frozen-lockfile
COPY --from=pruner /repo/out/full/ .
ENV NEXT_TELEMETRY_DISABLED=1
RUN turbo run build --filter=@matiq/web

FROM node:26-alpine AS runner
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0
WORKDIR /app
# Standalone output mirrors the monorepo layout: the server lives in apps/web/.
COPY --from=builder --chown=node:node /repo/apps/web/.next/standalone ./
COPY --from=builder --chown=node:node /repo/apps/web/.next/static ./apps/web/.next/static
USER node
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD wget -qO- http://127.0.0.1:3000/ > /dev/null || exit 1
CMD ["node", "apps/web/server.js"]
