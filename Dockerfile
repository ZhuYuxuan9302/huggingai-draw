# syntax=docker/dockerfile:1

# ============== builder ==============
# 用 slim (Debian bookworm) 而非 alpine：Prisma 5.x 引擎需要 openssl 1.1.x 兼容，
# Alpine 默认 openssl 3.x 会导致 "Could not parse schema engine response"
FROM node:20-slim AS builder
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# 仅复制依赖相关，加速缓存
COPY package.json pnpm-lock.yaml* package-lock.json* ./
COPY prisma ./prisma

# 用 npm 或 pnpm 都行
RUN if [ -f pnpm-lock.yaml ]; then \
      pnpm install --frozen-lockfile || pnpm install; \
    else \
      npm install; \
    fi

# 复制剩余源码
COPY . .

# 生成两个 prisma client
RUN npx prisma generate --schema=prisma/schema.prisma
RUN npx prisma generate --schema=prisma/schema.newapi.prisma

# 构建 next（output=standalone 会把依赖打到 .next/standalone）
ENV NEXT_TELEMETRY_DISABLED=1
RUN npx next build

# ============== runner ==============
FROM node:20-slim AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# 非 root 用户（Debian 方式）
RUN groupadd --system --gid 1001 nodejs && \
    useradd --system --uid 1001 --gid nodejs --create-home nextjs

# standalone 产物（含 next server.js + 依赖）
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Prisma schema + 生成 client（运行 migrate deploy 需要 schema）
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder --chown=nextjs:nodejs /app/src/generated ./src/generated
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json
# prisma cli 完整包（用 node 直调入站脚本，不依赖 .bin / PATH）
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/prisma ./node_modules/prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/@prisma/engines ./node_modules/@prisma/engines

USER nextjs
EXPOSE 3000

# 用 node 直接调 prisma CLI 入口脚本，绕开对 PATH / node_modules/.bin 的依赖
# 标准入口：node_modules/prisma/build/index.js
CMD ["sh", "-c", "node ./node_modules/prisma/build/index.js migrate deploy --schema=prisma/schema.prisma && node server.js"]
