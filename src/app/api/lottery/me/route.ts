import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { syncUser, getAvailableDraws } from "@/lib/sync";
import { prisma } from "@/lib/db";
import { rawToUsd } from "@/config/lottery.config";

/** GET /api/lottery/me — 抽奖页专用，返回紧凑状态 */
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
  return NextResponse.json({
    data: {
      name: user.name,
      availableDraws: getAvailableDraws(user),
      extraDraws: user.extraDraws,
      autoDraws: user.autoDraws,
      usedDraws: user.usedDraws,
      totalRolls: user.totalRolls,
      totalWonUsd: rawToUsd(user.totalWonRaw),
    },
  });
}
