# syntax=docker/dockerfile:1
# MatIQ admin (static Vite build served by nginx). Build from the repo root:
#   docker build -f apps/admin/Dockerfile --build-arg VITE_API_URL=https://api.example.de -t matiq-admin .
# VITE_API_URL is baked into the bundle at build time and is public.

FROM node:26-alpine AS base
RUN npm install -g pnpm@10.11.0 turbo@2.11.13

FROM base AS pruner
WORKDIR /repo
COPY . .
RUN turbo prune @matiq/admin --docker

FROM base AS builder
WORKDIR /repo
COPY --from=pruner /repo/out/json/ .
RUN pnpm install --frozen-lockfile
COPY --from=pruner /repo/out/full/ .
ARG VITE_API_URL
RUN test -n "$VITE_API_URL" || (echo "Build arg VITE_API_URL is required" && exit 1)
ENV VITE_API_URL=$VITE_API_URL
RUN turbo run build --filter=@matiq/admin

FROM nginxinc/nginx-unprivileged:1.29-alpine AS runner
COPY apps/admin/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /repo/apps/admin/dist /usr/share/nginx/html
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD wget -qO- http://127.0.0.1:8080/healthz > /dev/null || exit 1
