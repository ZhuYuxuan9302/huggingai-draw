/**
 * Seed：可选，初始化时插入无管理员账号占位
 * 跑：pnpm db:seed
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Nothing to seed — 用户记录由 OIDC 登录自动 upsert。");
  console.log("如需指定管理员，在 .env 中配置 ADMIN_EMAILS=邮箱1,邮箱2");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
