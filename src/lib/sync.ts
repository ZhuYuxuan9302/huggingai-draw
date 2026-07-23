/**
 * 同步逻辑：把 newapi 用户表读取到本系统
 *
 * 核心公式（由用户确认）：
 *   累计实际充值美元 = (newapi.quota - 本系统累计赠送) / 500000
 *   newapi.quota 单位是 int8 raw，500000 raw = 1 美元
 *
 * 每次同步职责：
 *  1. 读取 newapi.users 的 quota/used_quota
 *  2. 计算累计实际充值美元（上面公式）
 *  3. 根据充值规则算出应得赠送次数 autoDraws
 *  4. 更新本系统 users 的 lastQuotaRaw / lastSyncedAt / autoDraws
 *
 * 注意：实际加款（把中奖余额写入 newapi.quota）只在抽奖时发生
 *      本函数只负责读，不负责写 newapi
 */

import { prisma, newApiPrisma } from "@/lib/db";
import { lotteryConfig, rawToUsd, usdToRaw } from "@/config/lottery.config";

export interface SyncResult {
  /** newapi 当前 quota (raw) */
  quotaRaw: bigint;
  /** newapi 当前 used_quota (raw) */
  usedQuotaRaw: bigint;
  /** 本系统累计赠送（raw） */
  grantedRaw: bigint;
  /** 累计实际充值 (美元) */
  realRechargeUsd: number;
  /** 按规则应得 autoDraws */
  autoDraws: number;
  /** 本次是否改了 autoDraws */
  autoDrawsChanged: boolean;
}

export async function syncUser(oidcId: string): Promise<SyncResult> {
  // 1. 读 newapi
  const newApiUser = await newApiPrisma.newApiUser.findUnique({
    where: { oidcId },
  });
  if (!newApiUser) {
    throw new Error("在 newapi 中找不到对应 oidcId 的用户");
  }

  const quotaRaw = newApiUser.quota;

  // 2. 读本系统记录
  const localUser = await prisma.user.findUnique({ where: { oidcId } });
  if (!localUser) {
    throw new Error("本系统用户记录不存在，请先完成登录 upsert");
  }

  const grantedRaw = localUser.grantedBalanceRaw;
  // 防御性：newapi.quota 不应小于 grantedRaw，但若发生（手动扣款）则钳为 0
  const realRechargeRaw =
    quotaRaw > grantedRaw ? quotaRaw - grantedRaw : 0n;
  const realRechargeUsd = rawToUsd(realRechargeRaw);

  // 3. 根据充值算 autoDraws（按累计美元向下取整 * perUsd）
  const perUsd = lotteryConfig.rechargeGift.perUsd;
  const maxGifted = lotteryConfig.rechargeGift.maxGifted;
  let autoDraws = Math.floor(realRechargeUsd) * perUsd;
  if (maxGifted !== undefined && autoDraws > maxGifted) {
    autoDraws = maxGifted;
  }

  // 4. 更新本地
  const autoDrawsChanged = autoDraws !== localUser.autoDraws;
  if (
    autoDrawsChanged ||
    localUser.lastQuotaRaw !== quotaRaw ||
    !localUser.lastSyncedAt
  ) {
    await prisma.user.update({
      where: { oidcId },
      data: {
        lastQuotaRaw: quotaRaw,
        lastSyncedAt: new Date(),
        autoDraws,
      },
    });
  }

  return {
    quotaRaw,
    usedQuotaRaw: newApiUser.usedQuota,
    grantedRaw,
    realRechargeUsd,
    autoDraws,
    autoDrawsChanged,
  };
}

/**
 * 计算用户当前可用抽奖次数
 *   可用 = extraDraws + autoDraws - usedDraws
 * 不触发数据库写入
 */
export function getAvailableDraws(user: {
  extraDraws: number;
  autoDraws: number;
  usedDraws: number;
}): number {
  const avail = user.extraDraws + user.autoDraws - user.usedDraws;
  return avail < 0 ? 0 : avail;
}

export { usdToRaw, rawToUsd };
