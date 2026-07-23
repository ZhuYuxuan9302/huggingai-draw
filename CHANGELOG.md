# Changelog

本文件记录可读、面向部署者的版本说明。格式参考 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.1.0/)。

## [Unreleased]

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
