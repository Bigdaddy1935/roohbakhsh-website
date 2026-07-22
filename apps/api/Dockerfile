# ─────────────── base ───────────────
FROM node:20-slim AS base
ENV PNPM_HOME=/pnpm
ENV PATH=$PNPM_HOME:$PATH
# puppeteer در MVP بدون Chromium (فقط فیچر PDF فاکتور غیرفعال می‌شود، سرویس بالا می‌آید)
ENV PUPPETEER_SKIP_DOWNLOAD=true
RUN corepack enable && corepack prepare pnpm@9.6.0 --activate
WORKDIR /app

# ─────────────── build ───────────────
FROM base AS build
COPY . .
RUN pnpm install --frozen-lockfile
RUN pnpm --filter @roohbakhsh/api build
# خروجی قابل‌دیپلوی و خوداتکا (node_modules بدون symlink + dist)
RUN pnpm --filter=@roohbakhsh/api deploy --prod /prod

# ─────────────── runner ───────────────
FROM node:20-slim AS runner
ENV NODE_ENV=production
ENV PORT=3001
WORKDIR /app
# کاربر غیر-root
RUN groupadd -r app && useradd -r -g app app
COPY --from=build /prod ./
RUN mkdir -p /app/uploads && chown -R app:app /app
USER app
EXPOSE 3001
CMD ["node", "dist/main.js"]
