# syntax=docker/dockerfile:1

# ============== builder ==============
FROM node:20-alpine AS builder
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# 仅复制依赖相关，加速缓存
COPY package.json pnpm-lock.yaml* package-lock.json* ./
COPY prisma ./prisma

# 用 npm 或 pnpm 都行（CI 中已 approve-scripts）
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
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# 非 root 用户
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# standalone 产物（含 next server.js + 依赖）
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Prisma schema + 生成 client（运行 migrate deploy 需要 schema）
# standalone 没带 prisma client，我们单独拷一份 node_modules 的 prisma client
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder --chown=nextjs:nodejs /app/src/generated ./src/generated
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json
# prisma cli 完整包（含 .bin 入口脚本）
# 用 standalone + COPY 整个 prisma 包，不依赖系统的 npx/.bin PATH
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/prisma ./node_modules/prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/@prisma/engines ./node_modules/@prisma/engines

USER nextjs
EXPOSE 3000

# 用 node 直接调 prisma CLI 入口脚本，绕开对 PATH / node_modules/.bin 的依赖
# 标准入口：node_modules/prisma/build/index.js
CMD ["sh", "-c", "node ./node_modules/prisma/build/index.js migrate deploy --schema=prisma/schema.prisma && node server.js"]
