# ─────────────── base ───────────────
FROM node:20-alpine AS base
RUN apk add --no-cache libc6-compat
ENV PNPM_HOME=/pnpm
ENV PATH=$PNPM_HOME:$PATH
RUN corepack enable && corepack prepare pnpm@9.6.0 --activate
WORKDIR /app

# ─────────────── build ───────────────
FROM base AS build
COPY . .
RUN pnpm install --frozen-lockfile
ARG NEXT_PUBLIC_API_BASE
ENV NEXT_PUBLIC_API_BASE=$NEXT_PUBLIC_API_BASE
RUN pnpm --filter @roohbakhsh/cms build

# ─────────────── runner ───────────────
FROM node:20-alpine AS runner
RUN apk add --no-cache libc6-compat
ENV NODE_ENV=production
ENV PORT=3002
ENV HOSTNAME=0.0.0.0
WORKDIR /app
RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001
COPY --from=build /app/apps/cms/.next/standalone ./
COPY --from=build /app/apps/cms/.next/static ./apps/cms/.next/static
COPY --from=build /app/apps/cms/public ./apps/cms/public
USER nextjs
EXPOSE 3002
CMD ["node", "apps/cms/server.js"]
