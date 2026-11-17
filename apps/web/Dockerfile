# syntax=docker/dockerfile:1
# Build from the monorepo root:
#   docker build -f apps/web/Dockerfile --build-arg API_URL=http://api:8080 .

FROM node:22-alpine AS base
RUN apk add --no-cache libc6-compat
WORKDIR /app

# ---- prune: minimal monorepo subset for @next-go-gin/web ----
FROM base AS prepare
ARG TURBO_VERSION=2.11.11
RUN npm install -g turbo@${TURBO_VERSION}
COPY . .
RUN turbo prune @next-go-gin/web --docker

# ---- build ----
FROM base AS builder
RUN corepack enable
# Install deps first (cached until package.json / lockfile change)
COPY --from=prepare /app/out/json/ .
RUN --mount=type=cache,id=pnpm,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile
# Then copy source and build
COPY --from=prepare /app/out/full/ .

# Rewrites in next.config.ts are resolved at build time.
ARG API_URL=http://api:8080
ENV API_URL=${API_URL} \
    NEXT_TELEMETRY_DISABLED=1
RUN pnpm turbo run build --filter=@next-go-gin/web

# ---- run ----
FROM base AS runner
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs
USER nextjs

COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/public ./apps/web/public

EXPOSE 3000
CMD ["node", "apps/web/server.js"]
