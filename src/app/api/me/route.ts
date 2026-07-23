import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/db";
import { getAvailableDraws } from "@/lib/sync";
import { rawToUsd } from "@/config/lottery.config";
import { safeJson } from "@/lib/serializer";

/** GET /api/me — 当前登录用户信息 + 可用抽奖次数 */
export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json(
      { error: "unauthorized", message: "未登录" },
      { status: 401 },
    );
  }
  const user = await prisma.user.findUnique({
    where: { oidcId: session.oidcId },
  });
  if (!user) {
    return NextResponse.json(
      { error: "user_not_found", message: "用户记录不存在" },
      { status: 404 },
    );
  }
  return NextResponse.json(
    safeJson({
      data: {
        oidcId: user.oidcId,
        name: user.name,
        email: user.email,
        isAdmin: session.isAdmin,
        availableDraws: getAvailableDraws(user),
        extraDraws: user.extraDraws,
        autoDraws: user.autoDraws,
        usedDraws: user.usedDraws,
        totalRolls: user.totalRolls,
        totalWonUsd: rawToUsd(user.totalWonRaw),
        realRechargeUsd: rawToUsd(
          // 当 lastQuotaRaw 未同步过，显示 0
          (user.lastQuotaRaw || 0n) - user.grantedBalanceRaw,
        ),
        lastSyncedAt: user.lastSyncedAt,
      },
    }),
  );
}

