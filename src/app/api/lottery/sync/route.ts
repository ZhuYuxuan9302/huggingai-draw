import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { syncUser } from "@/lib/sync";

/** POST /api/lottery/sync — 用户主动刷新同步 */
export async function POST() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json(
      { error: "unauthorized", message: "未登录" },
      { status: 401 },
    );
  }
  try {
    const r = await syncUser(session.oidcId);
    return NextResponse.json({
      data: r,
    });
  } catch (e) {
    return NextResponse.json(
      { error: "sync_failed", message: (e as Error).message },
      { status: 500 },
    );
  }
}
