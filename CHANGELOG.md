# Changelog

本文件记录可读、面向部署者的版本说明。格式参考 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.1.0/)。

## [Unreleased]

### Fixed
- **OIDC 回调 sync 报 "users.updated_at does not exist in the current database"**：newapi（one-api fork）的 users 表实际没有 `updated_at` 列（GORM User 结构体只有 created_at），之前 schema 偷懒加的 `updatedAt` 让 Prisma 强行 SELECT，newapi 库里不存在这列就报错。改成只映射 `id / oidc_id / quota / used_quota` 4 个字段，不碰任何时间戳、username、status 等，避免误碰 newapi 自管理字段。
- **OIDC 回调错误跳到 `https://0.0.0.0:3000`**：Docker 容器里 Next.js server 监听 `HOSTNAME=0.0.0.0`，所有 incoming request 的 Host 头被解析成 `0.0.0.0:port`，`new URL(req.url)` 拿到 0.0.0.0 host 导致 NextResponse.redirect 跳到无法访问的地址。新增 `src/lib/url.ts` 的 `appBaseUrl()` 工具，从 `APP_BASE_URL` env 取绝对基底；所有面向客户端的重定向都用 appBaseUrl()，禁止用 req.url 作基底。
- OIDC 回调报 `{"error":"invalid_state","message":"State 校验失败"}`：原因是代码按 `NODE_ENV === "production"` 硬编码 cookie 的 Secure 标记，HTTP 部署时浏览器会默默丢弃 Secure cookie，导致 `oidc_state` cookie 不存在，回调时 state 校验失败。抽取统一 cookie 工具 `src/lib/cookies.ts`，按 `APP_BASE_URL` 协议自动判断 secure（http→false，https→true），并支持 `COOKIE_SECURE=true|false` env 覆盖用于反代终止 TLS 场景。同时修了 session cookie 的同样的 Secure 判定问题。
- 新增初始 Prisma 迁移文件 `prisma/migrations/0_init/migration.sql`：之前用户的容器启动日志报 `No migration found in prisma/migrations` / `No pending migrations to apply`，就是项目里从未生成过任何迁移，`prisma migrate deploy` 无 SQL 可应用。现在把 `init` 迁移提交进 git，容器启动直接建表。
- Dockerfile 基础镜像从 `node:20-alpine` 改为 `node:20-slim`：Alpine 缺 libssl 库，Prisma 5.x 引擎无法加载，报 "Could not parse schema engine response"。
- 在 Dockerfile 的 builder 和 runner 两个阶段都显式 `apt-get install openssl ca-certificates`：`node:20-slim` 默认不带 openssl 命令行工具和 libssl3，Prisma 检测不到 OpenSSL 版本会报警告且 `migrate deploy` 失败。builder 装是为了让 `prisma generate` 能正确下载 openssl-3.0.x 引擎，runner 装是为了运行时能加载引擎，两个阶段缺一不可。
- 容器启动命令从 `npx prisma migrate deploy` 改为 `node ./node_modules/prisma/build/index.js migrate deploy`：Next.js standalone 模式不拷 `node_modules/.bin` 符号链接，且 `nextjs` 用户 PATH 不含工作目录的 `.bin`，导致 `npx prisma` 报 `sh: prisma: not found`。
- 把 Dockerfile 的 `addgroup/adduser` 从 Alpine BusyBox 语法改成 Debian `groupadd/useradd` 语法，和 slim 基础镜像匹配。

## [0.1.0] - 2026-07-23

### Added
- 初始版本：基于 Next.js 14 + TS + Prisma 的 AI 抽奖系统
- 接入 newapi PostgreSQL，直接读写 `users.quota`
- 外置 OIDC 登录（Authentik / 通用 OIDC，自动 discovery）
- 双 Prisma schema：本系统库执行迁移，newapi 库仅生成 client 不迁移
- 抽奖核心：
  - 单抽、十连抽、十连保底
  - 抽奖规则、金额、概率可配置（`src/config/lottery.config.ts`）
  - 跨库补偿回滚保证账面一致
- 充值自动赠送次数：`(newapi.quota - 系统授予累计) / 500000`
  - 用户消费 quota 不影响计算，因为只看 quota 减去已赠送
- 管理员后台：
  - 用户列表 + 搜索 + 分页
  - 增减 / 设定 额外抽奖次数，记录日志
  - 手动触发单个用户同步
  - 全局统计（总用户 / 总抽奖 / 总派奖 / 今日指标）
- 邮箱白名单判定管理员身份
- Docker Compose 一键部署
- GitHub Actions：CI（typecheck / prisma generate）、Docker 构建 + 多架构推送、Release 自动生成

### Notes
- 中奖余额直接写入 `newapi.users.quota`，使用 Prisma `increment` 原子更新
- 跨库写若失败：自动反向补偿本系统 `usedDraws / totalWonRaw / grantedBalanceRaw / DrawRecord`
- Session 用 iron-session sealed cookie，不可伪造
- OIDC state 用 HMAC 签名 + 10 分钟有效期防 CSRF
