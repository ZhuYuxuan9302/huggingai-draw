import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/db";
import { rawToUsd } from "@/config/lottery.config";
import { safeJson } from "@/lib/serializer";
import { HistoryPage } from "@/components/lottery/history-page";

export const metadata = { title: "抽奖历史 - AI 抽奖" };

export default async function HistoryRoute() {
  const session = await getSession();
  if (!session) redirect("/login");

  const records = await prisma.drawRecord.findMany({
    where: { userId: session.oidcId },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  // 按 batchId 分组，十连的 10 条聚成一组显示
  const groups: {
    batchId: string;
    source: string;
    createdAt: string;
    items: { tierKey: string; amountUsd: number }[];
    totalUsd: number;
  }[] = [];

  for (const r of records) {
    let g = groups.find((g) => g.batchId === r.batchId);
    if (!g) {
      g = {
        batchId: r.batchId,
        source: r.source,
        createdAt: r.createdAt.toISOString(),
        items: [],
        totalUsd: 0,
      };
      groups.push(g);
    }
    const usd = rawToUsd(r.amountRaw);
    g.items.push({ tierKey: r.tierKey, amountUsd: usd });
    g.totalUsd += usd;
  }

  // safeJson 转换确保传到 client 不会有 BigInt/Date 序列化问题
  const serializableGroups = safeJson(groups) as typeof groups;

  return <HistoryPage groups={serializableGroups} userName={session.name} />;
}
