FROM node:22-alpine AS base
ENV PNPM_HOME=/pnpm
ENV PATH=$PNPM_HOME:$PATH
RUN corepack enable

# --- DEPENDENCIES STAGE ---
FROM base AS deps
WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY client/package.json ./client/package.json
COPY server/package.json ./server/package.json
COPY server/prisma ./server/prisma

# Added Docker Cache Mount to drastically speed up install times
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# --- BUILD STAGE ---
FROM deps AS build
WORKDIR /app

COPY . .

RUN pnpm --filter server exec prisma generate

# 1. Build projects
RUN pnpm --filter client build && pnpm --filter server build

# 2. Isolate the server and production dependencies first
RUN pnpm --filter server --prod deploy --legacy /out

# 3. Explicitly copy your build output (bypasses potential .npmignore issues)
RUN cp -r server/dist /out/dist

# 4. Copy Vue build into the deployed server's public folder
RUN mkdir -p /out/dist/public && cp -r client/dist/. /out/dist/public/

# 5. Generate Prisma INSIDE the isolated output directory so it isn't wiped out
# We copy the schema over, then run generate in the /out folder
COPY server/prisma /out/prisma
WORKDIR /out
RUN pnpm exec prisma generate

# --- RUNNER STAGE ---
# Removed pnpm setup entirely. We only need basic Node.js here!
FROM node:22-alpine AS runner
ENV NODE_ENV=production

RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app
COPY --from=build --chown=appuser:appgroup /out/ ./

USER appuser

EXPOSE 3000
CMD ["node", "dist/index.js"]