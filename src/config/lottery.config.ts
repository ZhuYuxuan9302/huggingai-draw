/**
 * 抽奖配置文件
 * ──────────────────────────────────────────────────
 * 修改后重启应用生效。
 *
 * 余额单位：amount 字段单位为「美元」，写入 newapi.quota 时 × 500000 转 raw
 *
 * 概率：tiers 数组，weight 为权重（非百分比），所有 tier weight 之和归一化
 * amount 可以是固定值或 [min, max] 区间随机
 */

export interface LotteryTier {
  /** 等级 key，例："ssr" */
  key: string;
  /** 显示名称 */
  label: string;
  /** 颜色 class（tailwind） */
  color: string;
  /** 权重 */
  weight: number;
  /** 中奖金额（美元）[min, max] 区间随机；min === max 时为固定 */
  amount: [number, number];
  /** 是否为「超大奖」标记，用于 UI 特效 */
  isJackpot?: boolean;
}

export interface LotteryConfig {
  /** 单抽：消耗抽奖次数 */
  singleCost: number;
  /** 十连：消耗抽奖次数（通常为 10，可做折扣如 9） */
  tenRollCost: number;
  /** 十连保底：十连中至少出一个此 key 的 tier */
  tenRollGuarantee?: string;
  /** 概率分布 */
  tiers: LotteryTier[];
  /** 充值赠送规则 */
  rechargeGift: {
    /** 每累计 1 美元赠送次数（按累计美元数向下取整） */
    perUsd: number;
    /** 赠送上限：最多累计赠送次数，防止富豪刷爆 */
    maxGifted?: number;
  };
}

export const lotteryConfig: LotteryConfig = {
  singleCost: 1,
  tenRollCost: 10,
  // 十连保底：至少出一个 "r" 以上
  tenRollGuarantee: "r",
  tiers: [
    {
      key: "ssr",
      label: "SSR 大奖",
      color: "from-amber-400 to-yellow-500 text-amber-50",
      weight: 1,
      amount: [5, 10],
      isJackpot: true,
    },
    {
      key: "sr",
      label: "SR",
      color: "from-purple-400 to-fuchsia-500 text-purple-50",
      weight: 9,
      amount: [1, 3],
    },
    {
      key: "r",
      label: "R",
      color: "from-sky-400 to-blue-500 text-sky-50",
      weight: 40,
      amount: [0.2, 0.5],
    },
    {
      key: "n",
      label: "N",
      color: "from-slate-300 to-slate-400 text-slate-50",
      weight: 150,
      amount: [0.02, 0.1],
    },
  ],
  rechargeGift: {
    // 每充值 1 美元送 1 抽
    perUsd: 1,
    // 最多累计赠送 200 抽，超过即不再增加
    maxGifted: 200,
  },
};

/** raw → usd 转换 */
export const RAW_PER_USD = 500000n;

export function rawToUsd(raw: bigint | number): number {
  const rawBig = typeof raw === "number" ? BigInt(raw) : raw;
  return Number(rawBig) / Number(RAW_PER_USD);
}

export function usdToRaw(usd: number): bigint {
  // 美元可能是小数，raw 是整数，用 round 避免一直向下
  const raw = Math.round(usd * Number(RAW_PER_USD));
  return BigInt(raw);
}

/** 随机选中一个 tier（按 weight 加权） */
export function pickTier(cfg: LotteryConfig): LotteryTier {
  const total = cfg.tiers.reduce((s, t) => s + t.weight, 0);
  let r = Math.random() * total;
  for (const t of cfg.tiers) {
    r -= t.weight;
    if (r < 0) return t;
  }
  // 兜底（数值边界），返回最后一个
  return cfg.tiers[cfg.tiers.length - 1];
}

/** tier → 实际美元金额（区间内随机） */
export function rollTierAmount(tier: LotteryTier): number {
  const [min, max] = tier.amount;
  if (min === max) return min;
  // 保留两位小数
  return Math.round((Math.random() * (max - min) + min) * 100) / 100;
}
