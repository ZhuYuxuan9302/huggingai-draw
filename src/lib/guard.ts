import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";

/** 中间件：检查管理员，返回 session 或 401 */
export async function requireAdmin() {
  const session = await getSession();
  if (!session) {
    return {
      session: null,
      response: NextResponse.json(
        { error: "unauthorized", message: "未登录" },
        { status: 401 },
      ),
    };
  }
  if (!session.isAdmin) {
    return {
      session: null,
      response: NextResponse.json(
        { error: "forbidden", message: "需要管理员权限" },
        { status: 403 },
      ),
    };
  }
  return { session, response: null };
}
