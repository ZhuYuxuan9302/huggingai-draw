import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/db";
import { getAvailableDraws } from "@/lib/sync";
import { rawToUsd } from "@/config/lottery.config";
import { LotteryPage } from "@/components/lottery/lottery-page";

export const metadata = { title: "抽奖 - AI 抽奖" };

export default async function LotteryRoute() {
  const session = await getSession();
  if (!session) redirect("/login");

  // 落地时尝试同步一次（若 newapi 可达）
  let syncError: string | null = null;
  try {
    const { syncUser } = await import("@/lib/sync");
    await syncUser(session.oidcId);
  } catch (e) {
    syncError = (e as Error).message;
  }

  const user = await prisma.user.findUnique({
    where: { oidcId: session.oidcId },
  });
  if (!user) redirect("/login");

  const realRechargeRaw =
    (user.lastQuotaRaw || 0n) - user.grantedBalanceRaw;

  return (
    <LotteryPage
      initialUser={{
        name: user.name,
        email: user.email,
        isAdmin: session.isAdmin,
        availableDraws: getAvailableDraws(user),
        extraDraws: user.extraDraws,
        autoDraws: user.autoDraws,
        usedDraws: user.usedDraws,
        totalRolls: user.totalRolls,
        totalWonUsd: rawToUsd(user.totalWonRaw),
        realRechargeUsd: rawToUsd(realRechargeRaw > 0n ? realRechargeRaw : 0n),
      }}
      syncError={syncError}
    />
  );
}
