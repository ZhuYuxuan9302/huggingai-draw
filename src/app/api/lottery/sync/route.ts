import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { syncUser } from "@/lib/sync";
import { safeJson } from "@/lib/serializer";

/** POST /api/lottery/sync — 用户手动刷新同步 */
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
    // r 含 BigInt 字段（quotaRaw / usedQuotaRaw / grantedRaw），必须用 safeJson 转成 string
    return NextResponse.json(safeJson({ data: r }));
  } catch (e) {
    return NextResponse.json(
      { error: "sync_failed", message: (e as Error).message },
      { status: 500 },
    );
  }
}
