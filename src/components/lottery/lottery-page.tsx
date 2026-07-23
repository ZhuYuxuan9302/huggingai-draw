"use client";

import { useState, useCallback } from "react";
import { lotteryConfig, type LotteryTier } from "@/config/lottery.config";
import { cn, fmtUsd } from "@/lib/utils";

interface InitialUser {
  name: string;
  email: string;
  isAdmin: boolean;
  availableDraws: number;
  extraDraws: number;
  autoDraws: number;
  usedDraws: number;
  totalRolls: number;
  totalWonUsd: number;
  realRechargeUsd: number;
}

interface DrawResultItem {
  tierKey: string;
  tierLabel: string;
  color: string;
  amountUsd: number;
  amountRaw: string;
  isJackpot: boolean;
}

interface DrawResponse {
  batchId: string;
  source: "single" | "ten";
  count: number;
  results: DrawResultItem[];
  totalWonUsd: number;
  totalWonRaw: string;
}

const TIER_MAP = new Map<string, LotteryTier>(
  lotteryConfig.tiers.map((t) => [t.key, t]),
);

export function LotteryPage({
  initialUser,
  syncError,
}: {
  initialUser: InitialUser;
  syncError: string | null;
}) {
  const [user, setUser] = useState(initialUser);
  const [drawing, setDrawing] = useState(false);
  const [lastDraw, setLastDraw] = useState<DrawResponse | null>(null);
  const [error, setError] = useState<string | null>(syncError);

  const refreshMe = useCallback(async () => {
    const resp = await fetch("/api/lottery/me");
    if (resp.ok) {
      const j = await resp.json();
      setUser((prev) => ({ ...prev, ...j.data }));
    }
  }, []);

  const onSync = useCallback(async () => {
    setError(null);
    const resp = await fetch("/api/lottery/sync", { method: "POST" });
    if (!resp.ok) {
      const j = await resp.json().catch(() => ({}));
      setError(j.message || "同步失败");
      return;
    }
    await refreshMe();
  }, [refreshMe]);

  const onDraw = useCallback(
    async (source: "single" | "ten") => {
      setDrawing(true);
      setError(null);
      setLastDraw(null);
      try {
        const resp = await fetch("/api/lottery/draw", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ source }),
        });
        const j = await resp.json();
        if (!resp.ok) {
          setError(j.message || "抽奖失败");
          return;
        }
        setLastDraw(j.data as DrawResponse);
        await refreshMe();
      } catch (e) {
        setError((e as Error).message);
      } finally {
        setDrawing(false);
      }
    },
    [refreshMe],
  );

  return (
    <main className="mx-auto max-w-4xl p-4 md:p-6">
      {/* Top bar */}
      <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">🎰 抽奖</h1>
          <p className="text-sm text-slate-400">{user.name} · {user.email}</p>
        </div>
        <div className="flex gap-2">
          {user.isAdmin && (
            <a
              href="/admin"
              className="rounded-lg border border-slate-700 px-3 py-1.5 text-sm hover:bg-slate-800"
            >
              管理后台
            </a>
          )}
          <button
            onClick={onSync}
            className="rounded-lg border border-slate-700 px-3 py-1.5 text-sm hover:bg-slate-800"
          >
            🔄 同步充值
          </button>
          <a
            href="/api/auth/login?action=logout"
            className="rounded-lg border border-slate-700 px-3 py-1.5 text-sm hover:bg-slate-800"
          >
            退出
          </a>
        </div>
      </header>

      {/* Status card */}
      <section className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard label="可抽次数" value={user.availableDraws.toString()} accent />
        <StatCard label="管理员赠送" value={user.extraDraws.toString()} />
        <StatCard label="充值赠送" value={user.autoDraws.toString()} />
        <StatCard label="累计中奖" value={fmtUsd(user.totalWonUsd)} />
      </section>

      {/* Draw area */}
      <section className="mb-6 rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
        <div className="flex flex-col items-center gap-6">
          <div className="flex gap-4">
            <button
              onClick={() => onDraw("single")}
              disabled={drawing || user.availableDraws < lotteryConfig.singleCost}
              className="rounded-xl bg-gradient-to-r from-brand-600 to-purple-600 px-6 py-3 font-semibold shadow-lg transition hover:from-brand-500 hover:to-purple-500 disabled:opacity-40"
            >
              {drawing ? "抽奖中..." : "单抽"}
            </button>
            <button
              onClick={() => onDraw("ten")}
              disabled={drawing || user.availableDraws < lotteryConfig.tenRollCost}
              className="rounded-xl bg-gradient-to-r from-amber-500 to-pink-600 px-6 py-3 font-semibold shadow-lg transition hover:from-amber-400 hover:to-pink-500 disabled:opacity-40"
            >
              {drawing ? "抽奖中..." : "十连抽"}
            </button>
          </div>

          {error && (
            <div className="w-full rounded-lg border border-red-800 bg-red-950/50 p-3 text-sm text-red-300">
              ⚠️ {error}
            </div>
          )}

          {lastDraw && <DrawResults result={lastDraw} />}
        </div>
      </section>

      <div className="text-center text-xs text-slate-500">
        累计已抽 {user.totalRolls} 次 · 累计充值 {fmtUsd(user.realRechargeUsd)}
        · <a href="/rules" className="underline">查看规则</a>
      </div>
    </main>
  );
}

function StatCard({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className={cn(
      "rounded-xl border p-4 text-center",
      accent
        ? "border-amber-700/50 bg-amber-950/20"
        : "border-slate-800 bg-slate-900/40",
    )}>
      <div className="text-xs text-slate-400">{label}</div>
      <div className={cn("mt-1 text-2xl font-bold", accent && "text-amber-300")}>
        {value}
      </div>
    </div>
  );
}

function DrawResults({ result }: { result: DrawResponse }) {
  return (
    <div className="w-full">
      <div className="mb-3 text-center text-sm text-slate-400">
        本次获得 <span className="font-bold text-amber-300">{fmtUsd(result.totalWonUsd)}</span>
        {" "}（共 {result.count} 抽）
      </div>
      <div className={cn(
        "grid gap-2",
        result.count === 1 ? "grid-cols-1" : "grid-cols-5",
      )}>
        {result.results.map((r, i) => (
          <div
            key={i}
            className={cn(
              "animate-pop rounded-lg bg-gradient-to-br p-3 text-center",
              r.color,
            )}
          >
            <div className="text-xs font-bold">{r.tierLabel}</div>
            <div className="mt-1 text-sm font-mono">
              +{fmtUsd(r.amountUsd)}
            </div>
            {r.isJackpot && <div className="mt-1">🏆</div>}
          </div>
        ))}
      </div>
    </div>
  );
}
