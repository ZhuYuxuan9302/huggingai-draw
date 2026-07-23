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

# standalone 产物
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
# prisma cli 二进制（for migrate deploy）
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/prisma ./node_modules/prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/@prisma/engines ./node_modules/@prisma/engines

USER nextjs
EXPOSE 3000

# 启动前先跑 prisma migrate deploy 建表，再起 Next 服务
CMD ["sh", "-c", "npx prisma migrate deploy --schema=prisma/schema.prisma && node server.js"]
