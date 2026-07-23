# AI 抽奖系统（接 newapi）

大模型 API 中转站余额抽奖系统。
- 后端：Next.js 14 (App Router) + Prisma + 双 PostgreSQL（本系统库 + newapi 库）
- 前端：Tailwind UI，含抽奖、管理员后台
- 登录：外置 OIDC（Authentik / 通用），自动同步用户信息
- 部署：Docker Compose 一键起

## 业务逻辑

### 余额换算

newapi users 表里 `quota` 单位是 int8 raw，**500000 raw = 1 美元**。

> **累计实际充值美元** = `(newapi.quota - 本系统授予的累计抽奖 raw) / 500000`
>
> 因为中奖的余额会直接加到 newapi.users.quota，所以必须减去「本系统累计赠送」才能算出用户真实充值的余额。
> 用户消费 API（quota 下降）不影响结果，因为 quota 减去系统授予的 raw 才是真实充值。

### 抽奖次数来源

每次登录或手动「同步」时：
1. 读取 newapi.users.quota
2. 用上面公式算累计实际充值美元
3. 按规则 `每 1 美元 = N 抽` 换算 `autoDraws`，缓存到本系统 users 表
4. 管理员可手动增减 `extraDraws`

**可用抽奖次数** = `extraDraws + autoDraws - usedDraws`

### 抽奖流程

抽奖时：
1. 校验可用次数 ≥ 本次消耗
2. 按 tier 概率分布随机抽 N 次
3. 把中奖金额（raw 单位）写回 newapi.users.quota（增量更新）
4. 本系统：`usedDraws += N`、`totalWonRaw += 中奖总和`、`grantedBalanceRaw += 中奖总和`
5. 写入 DrawRecord（每抽 1 条，十连 10 条）

跨库事务：因 newapi 与本系统是两个独立 Postgres 实例，无法用 2PC。采用**补偿回滚**策略：若写 newapi 失败则反向操作本系统数据，并删除已插入的 DrawRecord。

## 文件结构

```
src/
├── app/
│   ├── api/
│   │   ├── auth/{login,callback,logout}/   OIDC 三件套
│   │   ├── me/                              当前用户信息
│   │   ├── lottery/{draw,sync,me,history}/ 抽奖相关
│   │   └── admin/{users,users/[oidcId],stats}/  管理端
│   ├── admin/page.tsx                       管理后台（管理员可访问）
│   ├── lottery/page.tsx                     用户抽奖页
│   ├── login/page.tsx                       登录页
│   └── rules/page.tsx                       规则公示
├── components/
│   ├── lottery/lottery-page.tsx             抽奖客户端组件
│   └── admin/admin-page.tsx                 管理端客户端组件
├── lib/
│   ├── db.ts                                两个 prisma clients
│   ├── oidc.ts                              OIDC discovery + token + userinfo
│   ├── session.ts                           iron-session 封装
│   ├── auth.ts                              upsert + 管理员判定
│   ├── sync.ts                              同步逻辑（核心公式）
│   ├── lottery.ts                           抽奖核心
│   ├── guard.ts                             requireAdmin 守卫
│   ├── api.ts                               前端 api 封装
│   └── utils.ts                             cn / 格式化
├── config/lottery.config.ts                 抽奖规则配置
└── generated/newapi-client/                 newapi prisma client 生成

prisma/
├── schema.prisma                            本系统 schema（运行迁移）
├── schema.newapi.prisma                     newapi schema（仅生成 client）
└── seed.ts                                  占位 seed 脚本
```

## 部署

### Docker Compose 部署（推荐）

1. 复制 `.env.example` 到 `.env`，填写所有参数
2. 在 newapi 的 OIDC 提供方（Authentik 等）注册客户端，回调地址写：
   `<APP_BASE_URL>/api/auth/callback`
3. 启动：
   ```bash
   docker compose up -d --build
   ```
4. 第一次启动时容器会自动执行 `prisma migrate deploy` 建表。

### 本地开发

```bash
pnpm install
cp .env.example .env   # 并填写
pnpm db:generate                       # 生成本系统 Prisma client
npx prisma generate --schema=prisma/schema.newapi.prisma
pnpm db:migrate:dev                    # 创建本地 migrations
pnpm dev
```

## 配置说明

### 环境变量

| 变量 | 必填 | 说明 |
|---|---|---|
| `APP_BASE_URL` | ✅ | 应用外部访问地址 |
| `SESSION_SECRET` | ✅ | iron-session 加密用密钥，≥32 字符 |
| `ADMIN_EMAILS` | ✅ | 管理员邮箱白名单，逗号分隔 |
| `DATABASE_URL` | ✅ | 本系统 Postgres |
| `NEWAPI_DATABASE_URL` | ✅ | newapi Postgres（读写 users 表） |
| `OIDC_ISSUER` | ✅ | OIDC 提供方 issuer |
| `OIDC_CLIENT_ID` | ✅ | OIDC 应用 client id |
| `OIDC_CLIENT_SECRET` | ✅ | OIDC 应用 client secret |
| `OIDC_SCOPES` |   | 默认 `openid email profile` |
| `OIDC_METADATA_URL` |   | 覆盖 discovery URL（非标准 issuer 时） |

### 抽奖规则（`src/config/lottery.config.ts`）

```ts
// 修改这里然后重启即可
export const lotteryConfig = {
  singleCost: 1,
  tenRollCost: 10,
  tenRollGuarantee: "r",  // 十连保底至少出一个 r
  tiers: [
    { key: "ssr", label: "SSR 大奖", weight: 1,   amount: [5, 10],  isJackpot: true },
    { key: "sr",  label: "SR",        weight: 9,   amount: [1, 3] },
    { key: "r",   label: "R",        weight: 40,  amount: [0.2, 0.5] },
    { key: "n",   label: "N",        weight: 150, amount: [0.02, 0.1] },
  ],
  rechargeGift: {
    perUsd: 1,         // 每充值 1 美元送 1 抽
    maxGifted: 200,    // 最多累计赠送 200 抽
  },
};
```

## API 速查

| Method | Path | 说明 | 权限 |
|---|---|---|---|
| GET  | `/api/auth/login` | 跳到 OIDC | - |
| GET  | `/api/auth/callback` | OIDC 回调 | - |
| POST | `/api/auth/logout` | 退出 | - |
| GET  | `/api/me` | 当前登录用户详细信息 | 登录 |
| POST | `/api/lottery/draw` `{source}` | 抽奖 | 登录 |
| POST | `/api/lottery/sync` | 手动同步 | 登录 |
| GET  | `/api/lottery/me` | 抽奖页状态 | 登录 |
| GET  | `/api/lottery/history` | 最近 50 条记录 | 登录 |
| GET  | `/api/admin/users?q=` | 用户列表 | 管理员 |
| POST | `/api/admin/users/[oidcId]` | adjust/sync 用户 | 管理员 |
| GET  | `/api/admin/users/[oidcId]/logs` | 操作日志 | 管理员 |
| GET  | `/api/admin/stats` | 全局统计 | 管理员 |

## 安全说明

- Session 使用 iron-session sealed cookie，不可伪造
- OIDC state 用 HMAC 签名 + 10 分钟有效期防 CSRF
- 所有写操作都校验 session + isAdmin
- 管理员权限仅判定自 `ADMIN_EMAILS` 环境变量
- 抽奖失败补偿回滚保证本系统数据稳定

## License

MIT
