import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/guard";
import { rawToUsd } from "@/config/lottery.config";
import { safeJson } from "@/lib/serializer";

/** GET /api/admin/stats — 全局统计 */
export async function GET() {
  const { response } = await requireAdmin();
  if (response) return response;

  const [userCount, totalRollsAgg, totalWonAgg] = await Promise.all([
    prisma.user.count(),
    prisma.user.aggregate({ _sum: { totalRolls: true } }),
    prisma.user.aggregate({ _sum: { totalWonRaw: true } }),
  ]);

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const [todayRecords, todayAgg] = await Promise.all([
    prisma.drawRecord.count({
      where: { createdAt: { gte: todayStart } },
    }),
    prisma.drawRecord.aggregate({
      where: { createdAt: { gte: todayStart } },
      _sum: { amountRaw: true },
    }),
  ]);

  return NextResponse.json(
    safeJson({
      data: {
        userCount,
        totalRolls: totalRollsAgg._sum.totalRolls || 0,
        totalWonUsd: rawToUsd(totalWonAgg._sum.totalWonRaw || 0n),
        todayRolls: todayRecords,
        todayWonUsd: rawToUsd(todayAgg._sum.amountRaw || 0n),
      },
    }),
  );
}
