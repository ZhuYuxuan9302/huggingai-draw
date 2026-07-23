import { PrismaClient } from "@prisma/client";
import { PrismaClient as NewApiPrismaClient } from "@/generated/newapi-client";
import type { NewApiUser } from "@/generated/newapi-client";

// 本系统 db
const prisma = new PrismaClient();

// newapi db（用了独立 generator 输出目录，避免类型冲突）
const newApiPrisma = new NewApiPrismaClient();

export { prisma, newApiPrisma };
export type { NewApiUser };
