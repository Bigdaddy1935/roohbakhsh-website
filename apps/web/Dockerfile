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
# آدرس API در زمان build داخل باندل کلاینت inline می‌شود (متغیر NEXT_PUBLIC_*)
ARG NEXT_PUBLIC_API_BASE
ENV NEXT_PUBLIC_API_BASE=$NEXT_PUBLIC_API_BASE
ARG NEXT_PUBLIC_SITE_URL
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
RUN pnpm --filter @roohbakhsh/web build

# ─────────────── runner ───────────────
FROM node:20-alpine AS runner
RUN apk add --no-cache libc6-compat
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
WORKDIR /app
RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001
# خروجی standalone (trace از repo root): server.js زیر apps/web قرار می‌گیرد
COPY --from=build /app/apps/web/.next/standalone ./
COPY --from=build /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=build /app/apps/web/public ./apps/web/public
USER nextjs
EXPOSE 3000
CMD ["node", "apps/web/server.js"]
