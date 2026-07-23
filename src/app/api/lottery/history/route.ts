import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/db";
import { getAvailableDraws, rawToUsd } from "@/lib/sync";
import { rawToUsd as rawToUsd2 } from "@/config/lottery.config";
import { safeJson } from "@/lib/serializer";

/** GET /api/lottery/history — 最近 50 条抽奖记录 */
export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json(
      { error: "unauthorized", message: "未登录" },
      { status: 401 },
    );
  }
  const records = await prisma.drawRecord.findMany({
    where: { userId: session.oidcId },
    orderBy: { createdAt: "desc" },
    take: 50,
    include: { user: { select: { name: true } } },
  });
  return NextResponse.json(
    safeJson({
      data: records.map((r) => ({
        id: r.id.toString(),
        batchId: r.batchId,
        tierKey: r.tierKey,
        amountUsd: rawToUsd2(r.amountRaw),
        source: r.source,
        createdAt: r.createdAt,
      })),
    }),
  );
}

