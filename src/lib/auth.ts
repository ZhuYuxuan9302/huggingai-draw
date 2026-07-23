/**
 * 身份与权限相关工具：管理员判定、session 装填
 */
import { prisma } from "@/lib/db";

const ADMIN_EMAILS_RAW = process.env.ADMIN_EMAILS || "";

const ADMIN_EMAILS = ADMIN_EMAILS_RAW
  .split(",")
  .map((s) => s.trim().toLowerCase())
  .filter(Boolean);

export function isAdminEmail(email: string): boolean {
  return ADMIN_EMAILS.includes(email.trim().toLowerCase());
}

export interface OidcIdentity {
  oidcId: string;
  name: string;
  email: string;
  picture?: string | null;
}

/**
 * 登录后或每次访问时同步用户到本系统 user 表
 * 返回本系统中的 User 记录
 */
export async function upsertUserFromOidc(identity: OidcIdentity) {
  const isAdmin = isAdminEmail(identity.email);
  return prisma.user.upsert({
    where: { oidcId: identity.oidcId },
    create: {
      oidcId: identity.oidcId,
      name: identity.name,
      email: identity.email,
      picture: identity.picture,
    },
    update: {
      name: identity.name,
      email: identity.email,
      picture: identity.picture,
    },
  });
}

/**
 * 是否管理员（基于 session 数据，避免每次查库）
 */
export function sessionIsAdmin(session: { email: string }): boolean {
  return isAdminEmail(session.email);
}
