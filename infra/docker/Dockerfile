# ============================================================
# NexoraField AI — Dockerfile Multi-Stage (Enterprise Grade)
# ============================================================
# Stage 1: Build dependencies
FROM node:20-alpine AS deps
WORKDIR /app
RUN apk add --no-cache libc6-compat
COPY package.json package-lock.json ./
RUN npm ci --frozen-lockfile

# Stage 2: Build frontend + backend
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Stage 3: Production runtime (minimal)
FROM node:20-alpine AS runner
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nexora

ENV NODE_ENV=production
ENV PORT=5000

COPY --from=builder --chown=nexora:nodejs /app/dist ./dist
COPY --from=builder --chown=nexora:nodejs /app/package.json ./
COPY --from=builder --chown=nexora:nodejs /app/node_modules ./node_modules

USER nexora

EXPOSE 5000

HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
  CMD wget -qO- http://localhost:5000/api/health || exit 1

CMD ["node", "dist/server.cjs"]
