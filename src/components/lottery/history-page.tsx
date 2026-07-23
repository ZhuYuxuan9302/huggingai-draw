"use client";

import { useMemo } from "react";
import Link from "next/link";
import { lotteryConfig } from "@/config/lottery.config";
import { cn, fmtUsd } from "@/lib/utils";

interface HistoryGroup {
  batchId: string;
  source: string;
  createdAt: string;
  items: { tierKey: string; amountUsd: number }[];
  totalUsd: number;
}

const TIER_MAP = new Map(
  lotteryConfig.tiers.map((t) => [t.key, t]),
);

export function HistoryPage({
  groups,
  userName,
}: {
  groups: HistoryGroup[];
  userName: string;
}) {
  const totalWon = useMemo(
    () => groups.reduce((s, g) => s + g.totalUsd, 0),
    [groups],
  );
  const totalRolls = useMemo(
    () => groups.reduce((s, g) => s + g.items.length, 0),
    [groups],
  );

  return (
    <main className="mx-auto max-w-3xl p-4 md:p-6">
      {/* Top bar */}
      <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">📜 抽奖历史</h1>
          <p className="text-sm text-slate-400">{userName}</p>
        </div>
        <Link
          href="/lottery"
          className="rounded-lg border border-slate-700 px-3 py-1.5 text-sm hover:bg-slate-800"
        >
          ← 返回抽奖
        </Link>
      </header>

      {/* Summary */}
      <section className="mb-6 grid grid-cols-3 gap-3">
        <SummaryCard label="总批次" value={groups.length.toString()} />
        <SummaryCard label="总抽数" value={totalRolls.toString()} />
        <SummaryCard label="总中奖" value={fmtUsd(totalWon)} accent />
      </section>

      {/* Empty state */}
      {groups.length === 0 && (
        <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-12 text-center text-slate-400">
          <div className="mb-2 text-4xl">🎰</div>
          <p>还没有抽奖记录</p>
          <Link
            href="/lottery"
            className="mt-4 inline-block text-sm text-brand-400 hover:text-brand-300"
          >
            去抽奖 →
          </Link>
        </div>
      )}

      {/* History list */}
      <section className="space-y-4">
        {groups.map((g) => (
          <HistoryGroupCard key={g.batchId} group={g} />
        ))}
      </section>
    </main>
  );
}

function SummaryCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border p-4 text-center",
        accent
          ? "border-amber-700/50 bg-amber-950/20"
          : "border-slate-800 bg-slate-900/40",
      )}
    >
      <div className="text-xs text-slate-400">{label}</div>
      <div
        className={cn(
          "mt-1 text-xl font-bold",
          accent && "text-amber-300",
        )}
      >
        {value}
      </div>
    </div>
  );
}

function HistoryGroupCard({ group }: { group: HistoryGroup }) {
  const time = new Date(group.createdAt);
  const timeStr = time.toLocaleString("zh-CN", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
  const isTen = group.source === "ten" || group.items.length > 1;

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/40 overflow-hidden">
      {/* Header: time + total */}
      <div className="flex items-center justify-between border-b border-slate-800 px-4 py-2.5">
        <div className="flex items-center gap-2">
          <span className="rounded bg-slate-800 px-1.5 py-0.5 text-xs text-slate-400">
            {isTen ? "十连" : "单抽"}
          </span>
          <span className="text-xs text-slate-500">{timeStr}</span>
        </div>
        <div className="text-sm">
          <span className="text-slate-400">中奖 </span>
          <span className="font-bold text-amber-300">
            {fmtUsd(group.totalUsd)}
          </span>
        </div>
      </div>

      {/* Items grid */}
      <div
        className={cn(
          "grid gap-1.5 p-3",
          group.items.length > 1 ? "grid-cols-5" : "grid-cols-1",
        )}
      >
        {group.items.map((it, i) => {
          const tier = TIER_MAP.get(it.tierKey);
          return (
            <div
              key={i}
              className={cn(
                "rounded-lg bg-gradient-to-br p-2.5 text-center",
                tier?.color || "from-slate-700 to-slate-800 text-slate-200",
              )}
            >
              <div className="text-[10px] font-bold leading-tight">
                {tier?.label || it.tierKey}
              </div>
              <div className="mt-0.5 text-xs font-mono">
                +{fmtUsd(it.amountUsd)}
              </div>
              {tier?.isJackpot && <div className="mt-0.5 text-xs">🏆</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
