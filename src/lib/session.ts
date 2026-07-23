import { sealData, unsealData } from "iron-session";
import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import { getCookieOptions } from "@/lib/cookies";

const COOKIE_NAME = "lottery_session";
const SESSION_SECRET =
  process.env.SESSION_SECRET || "dev-secret-change-me-please-32+";

export interface SessionData {
  oidcId: string;
  name: string;
  email: string;
  picture?: string | null;
  // 管理员预热缓存（登录时解析一次）
  isAdmin: boolean;
}

// 7 天
const TTL = 60 * 60 * 24 * 7;

export async function getSession(): Promise<SessionData | null> {
  const jar = cookies();
  const raw = jar.get(COOKIE_NAME)?.value;
  if (!raw) return null;
  try {
    const decoded = await unsealData(raw, {
      password: SESSION_SECRET,
      ttl: TTL,
    });
    return decoded as unknown as SessionData;
  } catch {
    return null;
  }
}

export async function setSession(data: SessionData): Promise<void> {
  const sealed = await sealData(data as unknown as Record<string, unknown>, {
    password: SESSION_SECRET,
    ttl: TTL,
  });
  cookies().set(COOKIE_NAME, sealed, getCookieOptions({ maxAge: TTL }));
}

export async function clearSession(): Promise<void> {
  cookies().delete(COOKIE_NAME);
}

// 仅用于 route handler（next/headers 的 cookies() 在 route handler 也可用，这里保留 compat）
export function getCookieFromReq(req: NextRequest): string | undefined {
  return req.cookies.get(COOKIE_NAME)?.value;
}

export async function getSessionFromReq(
  req: NextRequest,
): Promise<SessionData | null> {
  const raw = getCookieFromReq(req);
  if (!raw) return null;
  try {
    const decoded = await unsealData(raw, {
      password: SESSION_SECRET,
      ttl: TTL,
    });
    return decoded as unknown as SessionData;
  } catch {
    return null;
  }
}
