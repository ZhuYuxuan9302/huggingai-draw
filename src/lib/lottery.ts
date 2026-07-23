/**
 * 抽奖核心逻辑
 *
 * 流程：
 *  1. 校验用户可用次数 ≥ 本次消耗
 *  2. 抽 N 次（单抽/十连），生成记录
 *  3. 把中奖金额写到 newapi.users.quota（增量更新）
 *  4. 本系统：usedDraws += N，totalWonRaw += ∑amountRaw，grantedBalanceRaw += ∑amountRaw
 *  5. 插入 DrawRecord（每抽 1 条）
 *
 * 整个过程在一个 prisma 本地事务内写本系统数据；
 * 对 newapi 的写由于跨库无法事务，需做容错（见下面注释）。
 */

import { randomUUID } from "crypto";
import { prisma, newApiPrisma } from "@/lib/db";
import {
  lotteryConfig,
  pickTier,
  rollTierAmount,
  usdToRaw,
  rawToUsd,
  type LotteryTier,
} from "@/config/lottery.config";
import { getAvailableDraws } from "@/lib/sync";

export interface SingleDrawResult {
  tierKey: string;
  tierLabel: string;
  color: string;
  amountUsd: number;
  amountRaw: bigint;
  isJackpot: boolean;
}

export interface DrawOutput {
  batchId: string;
  source: "single" | "ten";
  count: number;
  results: SingleDrawResult[];
  totalWonUsd: number;
  totalWonRaw: bigint;
}

/**
 * 执行抽奖
 * @param oidcId 用户 oidcId
 * @param source "single" | "ten"
 */
export async function performDraw(
  oidcId: string,
  source: "single" | "ten",
): Promise<DrawOutput> {
  const cost = source === "single"
    ? lotteryConfig.singleCost
    : lotteryConfig.tenRollCost;
  const count = source === "single" ? 1 : 10;
  const batchId = randomUUID();

  // 1. 先拿本地用户 + 可用次数
  const localUser = await prisma.user.findUnique({ where: { oidcId } });
  if (!localUser) throw new Error("用户不存在");

  const avail = getAvailableDraws(localUser);
  if (avail < cost) {
    throw new Error(
      `可用抽奖次数不足：需要 ${cost}，当前 ${avail}`,
    );
  }

  // 2. 生成 N 次抽取
  const results: SingleDrawResult[] = [];
  for (let i = 0; i < count; i++) {
    let tier: LotteryTier = pickTier(lotteryConfig);

    // 十连保底：最后一次如果至今没中保底 tier，强制塞一个
    if (
      source === "ten" &&
      i === count - 1 &&
      lotteryConfig.tenRollGuarantee
    ) {
      const hitGuarantee = results.some(
        (r) => r.tierKey === lotteryConfig.tenRollGuarantee,
      );
      if (!hitGuarantee) {
        tier =
          lotteryConfig.tiers.find(
            (t) => t.key === lotteryConfig.tenRollGuarantee,
          ) || tier;
      }
    }

    const usd = rollTierAmount(tier);
    results.push({
      tierKey: tier.key,
      tierLabel: tier.label,
      color: tier.color,
      amountUsd: usd,
      amountRaw: usdToRaw(usd),
      isJackpot: !!tier.isJackpot,
    });
  }

  const totalWonRaw = results.reduce(
    (s, r) => s + r.amountRaw,
    0n,
  );

  // 3. 写本系统数据（事务）
  await prisma.$transaction([
    // 扣次数、累加赠送
    prisma.user.update({
      where: { oidcId },
      data: {
        usedDraws: { increment: cost },
        totalRolls: { increment: count },
        totalWonRaw: { increment: totalWonRaw },
        grantedBalanceRaw: { increment: totalWonRaw },
      },
    }),
    // 批量插入抽奖记录
    prisma.drawRecord.createMany({
      data: results.map((r) => ({
        userId: oidcId,
        batchId,
        tierKey: r.tierKey,
        amountRaw: r.amountRaw,
        source,
      })),
    }),
  ]);

  // 4. 写 newapi users.quota（增量，跨库）
  try {
    await newApiPrisma.newApiUser.update({
      where: { oidcId },
      data: {
        quota: { increment: totalWonRaw },
      },
    });
  } catch (e) {
    // 跨库写失败：回滚本系统刚做的 usedDraws/totalWon/granted/records 一致性
    // 这里采用「补偿回滚」策略，简单但能保证账面对齐
    await prisma.$transaction([
      prisma.user.update({
        where: { oidcId },
        data: {
          usedDraws: { decrement: cost },
          totalRolls: { decrement: count },
          totalWonRaw: { decrement: totalWonRaw },
          grantedBalanceRaw: { decrement: totalWonRaw },
        },
      }),
      prisma.drawRecord.deleteMany({
        where: { batchId },
      }),
    ]);
    throw new Error(
      `写入 newapi 失败，已回滚本系统数据: ${(e as Error).message}`,
    );
  }

  return {
    batchId,
    source,
    count,
    results,
    totalWonUsd: rawToUsd(totalWonRaw),
    totalWonRaw,
  };
}
