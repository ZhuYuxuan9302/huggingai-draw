# CLAUDE.md

> 本文件是给后续接手者（人类或 AI 助手）快速进入项目状态用的实现导向说明。
> README.md 面向部署者，本文件聚焦「为什么这么写、哪里不能动、哪里可以扩展」。

---

## 1. 项目定位

**AI 大模型中转站余额抽奖系统**。外挂在一个已有 [new-api](https://github.com/songquanpeng/one-api) / newapi 服务之上的独立小应用：

- 不接管 newapi 的登录体系，自己外挂一套 OIDC（Authentik 等）登录；
- 不接管 newapi 的充值体系，直接读 newapi 的 `users.quota` 反推用户实际充了多少；
- 抽出来的余额直接加回 `newapi.users.quota`，用户在 newapi 侧即时可见。

**一句话**：newapi 管钱袋子，本系统管抽奖次数 + 概率 + 派奖流水。

## 2. 技术栈决策

| 决策 | 取值 | 理由 |
|---|---|---|
| 框架 | Next.js 14 App Router | 前后端一体，部署一个镜像 |
| 语言 | TypeScript strict | 跨库 BigInt、金额单位太多，没类型会出事 |
| ORM | Prisma 5 + 双 schema | 同时管两个 Postgres 库；BigInt 原生支持 |
| Session | iron-session (sealed cookie) | 无服务端状态，适合容器化 |
| OIDC | 手写三步 flow | 不依赖 SDK，metadata discovery 自动适配 |
| 管理员判定 | 邮箱白名单（env） | 自部署足够，简单可靠 |
| 镜像 | output=standalone + 多阶段 | 镜像 ~120MB |
| CI | GitHub Actions + buildx 多架构 | amd64 + arm64 |

## 3. 核心业务不变量（⚠️ 不能动）

### 3.1 余额单位转换

```
1 美元 (USD) = 500_000 raw   （newapi 表里 quota 的单位）
```

`src/config/lottery.config.ts` 导出 `RAW_PER_USD` 和 `rawToUsd / usdToRaw`，**所有跨库/跨层金额都要走这俩工具函数**，禁止手写 `* 500000`。

### 3.2 实际充值美元公式

```
累计实际充值美元 = (newapi.users.quota - 本系统.users.granted_balance_raw) / 500_000
```

**为什么是这个公式**：抽奖中奖的 raw 会同时加到 newapi.users.quota 和本系统 granted_balance_raw，二者同增，所以拿 `quota - granted` 才能剥离掉中奖部分，得到真实充值。

**为什么不会少**：用户在 newapi 用 API 消费 quota 时，`quota` 下降但 `granted_balance_raw` 不动，差值变小 ≠ 真实充值变少，差值仍然隐含"还剩多少没被花掉的真实充值"，但因为是按累计美元向下取整算 autoDraws，所以只要 diff 仍 ≥ 上一次算 autoDraws 时的累计美元门槛，次数不会倒退；门槛过了用户就拿到了那次的次数，永久保留。

**防御写法（`src/lib/sync.ts`）**：

```ts
const realRechargeRaw = quotaRaw > grantedRaw ? quotaRaw - grantedRaw : 0n;
```

兜底 0，避免管理员手动扣 quota 导致出现负值。

### 3.3 可用抽奖次数公式

```
available = extra_draws + auto_draws - used_draws
```

- `extra_draws`：管理员手动增减（可负）
- `auto_draws`：按累计实际充值美元 × `perUsd` 算，cache 在本系统表里，登录/sync 时刷新
- `used_draws`：每次抽奖累加

**禁止**在别处重新实现这套计算，统一走 `src/lib/sync.ts` 的 `getAvailableDraws()`。

### 3.4 抽奖写库顺序（补偿回滚机制）

```
1. 校验本系统用户存在 + 可用次数 ≥ cost
2. 在内存里抽 N 次（按 weight 加权 + 十连保底）
3. 本系统 Prisma 事务：
   - users.used_draws += cost
   - users.total_rolls += count
   - users.total_won_raw  += ΣamountRaw
   - users.granted_balance_raw += ΣamountRaw   ← 关键：和 newapi 同步加，保证 3.2 公式正确
   - DrawRecord.createMany 批量写流水
4. 写 newapi.users.quota += ΣamountRaw   ← 跨库，无法和 3 一起事务
5. 若第 4 步失败：反向补偿本系统（decrement + deleteMany DrawRecord），抛错
```

**为什么不能用 2PC**：newapi 和本系统是两个独立 Postgres 实例，Prisma 不支持跨 datasource 事务。补偿回滚是务实选择。

**关键约束**：写 newapi 失败时一定要**按相同金额反向 decrement `granted_balance_raw`**，否则 3.2 公式会被污染。

## 4. 文件 → 职责地图

```
src/
├── config/lottery.config.ts     ★ 抽奖规则、金额区间、概率 weight、保底、充值赠送规则
│                                  改这里就能调参，不用动其它代码
├── lib/
│   ├── db.ts                      两个 PrismaClient 单例
│   │                              - prisma       → 本系统
│   │                              - newApiPrisma → newapi（只读写 users 表）
│   ├── oidc.ts                    OIDC discovery（1h 缓存）+ state HMAC 签名
│   │                              + exchangeCode + getUserInfo
│   ├── session.ts                 iron-session get/set/clear + cookie helpers
│   ├── auth.ts                   upsertUserFromOidc + isAdminEmail（白名单）
│   ├── sync.ts ★                  同步逻辑（3.2 公式）、getAvailableDraws
│   ├── lottery.ts ★               performDraw（3.4 写库顺序 + 补偿回滚）
│   ├── guard.ts                   requireAdmin() — 返回 {session, response}
│   ├── api.ts                     前端 fetch 封装（仅用于 client 组件）
│   └── utils.ts                   cn（tailwind-merge）、fmtUsd、fmtRaw
├── app/
│   ├── page.tsx                   / → 已登录跳 /lottery，未登录跳 /login
│   ├── login/page.tsx             OIDC 登录入口
│   ├── rules/page.tsx             规则公示（读 lottery.config 渲染）
│   ├── lottery/page.tsx           server component：尝试 sync → 读 user → 传给 client
│   ├── admin/page.tsx             管理员 SSR gate
│   ├── api/
│   │   ├── auth/login/route.ts     GET，build state → 跳 OIDC authorize
│   │   ├── auth/callback/route.ts  GET，验 state → exchange → userinfo → upsert → sync → set session
│   │   ├── auth/logout/route.ts    POST，clearSession
│   │   ├── me/route.ts             GET 当前用户完整状态
│   │   ├── lottery/draw/route.ts   POST {source} → performDraw
│   │   ├── lottery/sync/route.ts   POST → syncUser
│   │   ├── lottery/me/route.ts    GET 紧凑状态（抽奖页轮询）
│   │   ├── lottery/history/route.ts GET 最近 50 条流水
│   │   ├── admin/users/route.ts   GET 列表 + 搜索 + 分页
│   │   ├── admin/users/[oidcId]/route.ts  POST {action, value, note} 三种 action
│   │   ├── admin/users/[oidcId]/logs/route.ts GET 操作日志
│   │   └── admin/stats/route.ts   GET 全局统计
├── components/
│   ├── lottery/lottery-page.tsx   'use client' 抽奖页 UI + 状态管理
│   └── admin/admin-page.tsx       'use client' 管理端 UI + Modal
└── generated/newapi-client/        Prisma 自动生成（不要手改）

prisma/
├── schema.prisma         ★ 本系统 schema，会生成 migrations，由 `prisma migrate deploy` 应用
├── schema.newapi.prisma  ★ newapi schema，**不会**生成 migrations（newapi 自己管迁移）
│                          两个 schema 用独立 generator output 防止类型冲突
└── seed.ts               占位 seed（无实际数据，OIDC 自动 upsert）
```

## 5. 数据库 schema 速查

### 5.1 本系统（`prisma/schema.prisma`）

| 表 | 字段 | 说明 |
|---|---|---|
| `users` | `oidc_id` (unique) | OIDC sub，主键层面的关联键 |
| | `name / email / picture` | OIDC 同步，每次登录覆盖 |
| | `granted_balance_raw` BigInt | 系统累计赠送，**核心字段**，参与 3.2 公式 |
| | `extra_draws` Int | 管理员手动增减的次数 |
| | `auto_draws` Int | 充值规则算出的次数（sync 时刷新） |
| | `used_draws` Int | 已用次数 |
| | `total_won_raw` BigInt | 累计中奖（统计用） |
| | `total_rolls` Int | 累计抽奖次数（含十连拆 10） |
| | `last_quota_raw` BigInt? | 上次 sync 读到的 newapi.quota（diff 用，目前 diff 没真在用，只是缓存） |
| | `last_synced_at` DateTime? | 上次 sync 时间 |
| `draw_records` | 每抽 1 条 | 单抽 1 条，十连 10 条；`batch_id` 标识同次十连 |
| `admin_logs` | 每次管理员操作 1 条 | actor + target + before/after + note |

### 5.2 newapi（`prisma/schema.newapi.prisma`）

只映射 `users` 表的以下字段，**禁止扩字段影响 newapi 自身迁移**：

| 字段 | 用途 |
|---|---|
| `id` (Int auto) | newapi 主键 |
| `oidc_id` (String? unique) | **本系统 join key**，OIDC sub |
| `username` | 展示用 |
| `quota` BigInt | 总余额 raw ← 抽奖写入目标 |
| `used_quota` BigInt | 已消费 raw（计算时备用） |
| `status` Int | 1=enable，本系统未做禁用过滤，可按需扩展 |
| `created_at / updated_at` | 时间戳 |

## 6. 环境变量

全部在 `.env.example` 有样本。关键点：

| 变量 | 必填 | 注意事项 |
|---|---|---|
| `APP_BASE_URL` | ✅ | OIDC 回调用，**结尾别带 /** |
| `SESSION_SECRET` | ✅ | iron-session 加密钥匙，≥32 字符，生产务必换 |
| `ADMIN_EMAILS` | ✅ | 逗号分隔，大小写不敏感 |
| `DATABASE_URL` | ✅ | 本系统 Postgres |
| `NEWAPI_DATABASE_URL` | ✅ | newapi Postgres，**用户至少要能 SELECT/UPDATE users 表** |
| `OIDC_ISSUER` | ✅ | 结尾带不带 `/` 都行，代码会拼 `/.well-known/openid-configuration` |
| `OIDC_CLIENT_ID` | ✅ | - |
| `OIDC_CLIENT_SECRET` | ✅ | - |
| `OIDC_SCOPES` |   | 默认 `openid email profile` |
| `OIDC_METADATA_URL` |   | 非 standard issuer 时手动指定 discovery URL |

## 7. 抽奖规则配置（`src/config/lottery.config.ts`）

修改后**重启应用**生效，无需改库。

```ts
{
  singleCost: 1,           // 单抽消耗次数
  tenRollCost: 10,         // 十连消耗次数（如要促销可改 9）
  tenRollGuarantee: "r",   // 十连最后一个保底 tier key，空字符串禁用保底
  tiers: [
    // weight 是权重，不是百分比，所有 tier weight 求和后归一化
    // amount: [min, max] 区间随机，min === max 为固定
    // isJackpot: true 时 UI 加 🏆 特效
    // color: tailwind 渐变 class，UI 用它渲染卡片
  ],
  rechargeGift: {
    perUsd: 1,         // 每累计 1 美元送 N 抽（向下取整到累计美元数）
    maxGifted: 200,    // 累计赠送上限，undefined = 不限
  },
}
```

## 8. API 路由速查

| Method | Path | 鉴权 | 说明 |
|---|---|---|---|
| GET | `/api/auth/login` | - | 跳 OIDC（带 state cookie） |
| GET | `/api/auth/callback` | - | OIDC 回调，state 校验 + token + userinfo + upsert + sync + setSession |
| POST | `/api/auth/logout` | - | 清 session |
| GET | `/api/me` | 登录 | 完整用户状态 |
| POST | `/api/lottery/draw` | 登录 | body `{source: "single"|"ten"}` → performDraw |
| POST | `/api/lottery/sync` | 登录 | 强制刷新 autoDraws |
| GET | `/api/lottery/me` | 登录 | 抽奖页紧凑状态 |
| GET | `/api/lottery/history` | 登录 | 最近 50 条流水 |
| GET | `/api/admin/users` | 管理员 | `?q=&limit=&offset=` |
| POST | `/api/admin/users/[oidcId]` | 管理员 | `action: add_extra/set_extra/sync` |
| GET | `/api/admin/users/[oidcId]/logs` | 管理员 | 操作日志（最近 100） |
| GET | `/api/admin/stats` | 管理员 | 全局统计 |

返回格式：成功 `{data: ...}`，失败 `{error, message}` + 非 2xx。

## 9. 鉴权链路

- **Session**：iron-session sealed cookie（`lottery_session`），TTL 7 天，httpOnly + sameSite=lax + production secure
- **OIDC state**：HMAC 签名 `timestamp|nonce`，存 state cookie，回调时和 cookie 对比 + 校验签名 + 10 分钟 TTL。无外部 session 存储
- **管理员**：`ADMIN_EMAILS` env 邮箱白名单，登录时解析写入 session.isAdmin。`requireAdmin()` 每次都走 session 校验

## 10. 部署

### 10.1 Docker Compose（推荐）

```bash
cp .env.example .env  # 填所有 ?? 的变量
docker compose up -d --build
```

容器启动 CMD：
```
node ./node_modules/prisma/build/index.js migrate deploy --schema=prisma/schema.prisma && node server.js
```

> 注意：standalone 模式下 `node_modules/.bin` 没拷进来、`nextjs` 用户 PATH 也不含它，
> 所以**不能**用 `npx prisma` 或 `prisma` 直接调，必须用 `node <prisma-build-path>` 直调 CLI 入口。
> 入口脚本由 prisma CLI 包提供，路径为 `node_modules/prisma/build/index.js`。

只对本系统 schema 跑 migrate，不动 newapi schema。

### 10.2 手动跑迁移

```bash
npx prisma migrate dev --schema=prisma/schema.prisma          # dev
npx prisma migrate deploy --schema=prisma/schema.prisma      # prod
# 注意：schema.newapi.prisma 不要 `migrate`，只能 `generate`
```

### 10.3 本地开发

```bash
npm install
npm approve-scripts @prisma/client @prisma/engines prisma esbuild unrs-resolver
npx prisma generate --schema=prisma/schema.prisma
npx prisma generate --schema=prisma/schema.newapi.prisma
npm run dev
```

## 11. CI / CD

`.github/workflows/` 下三个 workflow：

| 文件 | 触发 | 干什么 |
|---|---|---|
| `ci.yml` | PR / push main | install + prisma generate × 2 + `tsc --noEmit` + `next lint` |
| `docker-publish.yml` | push main / tag v* / PR | 多架构 (amd64+arm64) 构建，推 ghcr.io，GHA cache |
| `release.yml` | tag v* | 从 CHANGELOG.md 提取段落，发 GitHub Release |

镜像 tag 规则（`docker/metadata-action`）：

- 推 main → `main` + `sha-xxxxxx`
- 打 tag `v1.2.3` → `v1.2.3` + `1.2.3` + `1.2` + `1` + `latest`
- PR → `pr-<num>`

拉取：`docker pull ghcr.io/<owner>/huggingai-draw:latest`

## 12. 已知局限 / 待办

在迭代时优先考虑这些方向：

1. **保底（pity）机制**：目前只有十连保底（最后一次必出指定 tier）。如果要加"连续 N 抽未中 SSR 下次必中"，需要在 `users` 表加 `pity_counter`，在 `lottery.ts` 抽奖前后维护
2. **抽奖日志去重**：DrawRecord 现在每抽 1 条，量可能大，考虑按 batch 聚合 + 单独明细表
3. **newapi user soft delete**：`status != 1` 的 newapi 用户当前没拦截，syncUser 还会照常算。如果需要在 `syncUser` 加 `where: { status: 1 }`
4. **管理员批量操作**：当前 admin 只能单人操作，可加 CSV 批量增减
5. **OIDC group claim 判定管理员**：目前只认邮箱白名单，可扩展读 OIDC groups claim
6. **审计日志更细**：admin_logs 现在只记 extra_draws 增减，不记 sync 结果，可扩展
7. **rate limit**：抽奖接口没限流，恶意刷会压库。可加 next-safe-action + upstash rate limit
8. **多 OIDC 提供方**：当前只支持一个 issuer，多租户时可扩展 env 配置数组
9. **手机端 UI**：目前十连用 5 列 grid，4 寸屏会拥挤，可加断点
10. **国际化**：硬编码中文。可加 next-intl

## 13. 开发红线（不要踩）

- ❌ 不要在本系统 schema 里映射 newapi 的 `tokens` / `logs` / `channels` 等表，**只动 users**
- ❌ 不要在 `schema.newapi.prisma` 上跑 `prisma migrate`，会污染 newapi 自己的迁移历史
- ❌ 不要绕过 `rawToUsd / usdToRaw` 手算金额，单位容易错
- ❌ 不要绕过 `getAvailableDraws()` 用 `extra_draws + auto_draws - used_draws` 自己算
- ❌ 不要在写 newapi 失败时不做反向回滚，会破坏 3.2 公式
- ❌ 不要把 `granted_balance_raw` 用错单位（是 raw 不是 USD），它必须和 newapi.quota 同单位
- ❌ 不要在 client component 直接访问 prisma，必须走 API 路由
- ❌ 不要在前端直接判定 `isAdmin`，必须经 server-side session 校验（client 上的 isAdmin 只用于显示入口）

## 14. 调试技巧

### 14.1 在本地验证同步逻辑

启动 `npm run dev` 后访问 `/api/lottery/sync`，返回 JSON `data` 包含 `quotaRaw / grantedRaw / realRechargeUsd / autoDraws`，可直接验算 3.2 公式。

### 14.2 验证 unit conversion

```ts
// 在 prisma studio 或 psql 查
SELECT oidc_id, quota, used_quota FROM users WHERE oidc_id = 'xxxxx';
// quota ÷ 500000 = 当前美元余额
```

### 14.3 排查"次数对不上"

按顺序排查：
1. `/api/me` 的 `realRechargeUsd` 是否符合预期？→ 否则 sync 没跑或 newapi 不通
2. `autoDraws` 是否对？→ 检查 `perUsd` 配置和 `maxGifted` 上限
3. `usedDraws` 是否对？→ 查 `draw_records` 表 count by source
4. `extraDraws` 是否对？→ 查 `admin_logs` 看最近变更

### 14.4 排查"中奖余额没到账"

1. 首先查本系统 `draw_records` 是否有这条记录
2. 查 `users.granted_balance_raw` 是否对应增加
3. 到 newapi 库查 `users.quota` 是否对应增加
4. 如果本系统对但 newapi 不对 → 写库失败但补偿也失败（极少见），需要手动 UPDATE newapi.users SET quota = quota + X WHERE oidc_id = '...'

### 14.5 Prisma Studio

```bash
# 本系统
npx prisma studio --schema=prisma/schema.prisma
# newapi（只读心态，别乱改）
npx prisma studio --schema=prisma/schema.newapi.prisma
```

## 15. Git 提交约定（建议）

- `feat:` 新功能
- `fix:` bug 修复
- `chore:` 配置/构建
- `docs:` 文档
- `refactor:` 重构
- `test:` 测试
- `ci:` CI 配置

发版前在 `CHANGELOG.md` 写本版本变更段落，格式参考 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.1.0/)。

---

**最后更新**：2026-07-23
**项目状态**：v0.1.0 MVP 完成，CI/CD 就绪
**接手者指引**：先读 README.md 理解部署 → 再读本文件第 3、4 节理解核心不变量 → 跑 `npm install` + `npx prisma generate ×2` + `npm run dev` 调通本地 → 用 `/api/lottery/sync` 验证公式
