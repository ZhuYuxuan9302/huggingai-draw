import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** tailwind 类名合并工具 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** 格式化美元 */
export function fmtUsd(n: number): string {
  if (n >= 1) {
    return `\$${n.toFixed(2)}`;
  }
  // 小数额时显示分
  return `\$${n.toFixed(3)}`;
}

/** 格式化 raw → usd 显示 */
export function fmtRaw(raw: bigint | number): string {
  const usd = Number(BigInt(raw)) / 500000;
  return fmtUsd(usd);
}
