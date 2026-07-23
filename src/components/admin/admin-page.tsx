"use client";

import { useState, useEffect, useCallback } from "react";
import { cn, fmtUsd } from "@/lib/utils";

interface AdminUser {
  oidcId: string;
  name: string;
  email: string;
  extraDraws: number;
  autoDraws: number;
  usedDraws: number;
  availableDraws: number;
  totalRolls: number;
  totalWonUsd: number;
  grantedBalanceRaw: string;
  lastQuotaRaw: string | null;
  lastSyncedAt: string | null;
  createdAt: string;
}

interface Stats {
  userCount: number;
  totalRolls: number;
  totalWonUsd: number;
  todayRolls: number;
  todayWonUsd: number;
}

export function AdminPage({ adminName }: { adminName: string }) {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modalUser, setModalUser] = useState<AdminUser | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const url = q ? `/api/admin/users?q=${encodeURIComponent(q)}` : "/api/admin/users";
      const r = await fetch(url);
      const j = await r.json();
      if (!r.ok) throw new Error(j.message);
      setUsers(j.data);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, [q]);

  const fetchStats = useCallback(async () => {
    const r = await fetch("/api/admin/stats");
    if (r.ok) setStats((await r.json()).data);
  }, []);

  useEffect(() => {
    fetchUsers();
    fetchStats();
  }, [fetchUsers, fetchStats]);

  return (
    <main className="mx-auto max-w-6xl p-4 md:p-6">
      <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">🛠 管理后台</h1>
          <p className="text-sm text-slate-400">管理员：{adminName}</p>
        </div>
        <div className="flex gap-2">
          <a href="/lottery" className="rounded-lg border border-slate-700 px-3 py-1.5 text-sm hover:bg-slate-800">
            ← 返回抽奖
          </a>
        </div>
      </header>

      {stats && (
        <section className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-5">
          <Stat label="总用户" value={stats.userCount.toString()} />
          <Stat label="总抽次" value={stats.totalRolls.toString()} />
          <Stat label="总派奖" value={fmtUsd(stats.totalWonUsd)} accent />
          <Stat label="今日抽次" value={stats.todayRolls.toString()} />
          <Stat label="今日派奖" value={fmtUsd(stats.todayWonUsd)} accent />
        </section>
      )}

      <section className="mb-4 flex gap-2">
        <input
          type="text"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && fetchUsers()}
          placeholder="搜索 name / email / oidc"
          className="flex-1 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm"
        />
        <button
          onClick={fetchUsers}
          className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-500"
        >
          搜索
        </button>
      </section>

      {error && (
        <div className="mb-4 rounded-lg border border-red-800 bg-red-950/50 p-3 text-sm text-red-300">
          ⚠️ {error}
        </div>
      )}

      <section className="overflow-hidden rounded-xl border border-slate-800">
        <table className="w-full text-sm">
          <thead className="bg-slate-900/70 text-slate-400">
            <tr>
              <th className="px-3 py-2 text-left">用户</th>
              <th className="px-3 py-2 text-left">邮箱</th>
              <th className="px-3 py-2 text-right">可用</th>
              <th className="px-3 py-2 text-right">额外</th>
              <th className="px-3 py-2 text-right">累计中奖</th>
              <th className="px-3 py-2 text-right">操作</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td colSpan={6} className="px-3 py-6 text-center text-slate-500">加载中...</td></tr>
            )}
            {!loading && users.length === 0 && (
              <tr><td colSpan={6} className="px-3 py-6 text-center text-slate-500">无数据</td></tr>
            )}
            {users.map((u) => (
              <tr key={u.oidcId} className="border-t border-slate-800 hover:bg-slate-900/30">
                <td className="px-3 py-2">
                  <div className="font-medium">{u.name}</div>
                  <div className="text-xs text-slate-500">{u.oidcId.slice(0, 16)}...</div>
                </td>
                <td className="px-3 py-2 text-slate-300">{u.email}</td>
                <td className="px-3 py-2 text-right font-mono">{u.availableDraws}</td>
                <td className="px-3 py-2 text-right font-mono">{u.extraDraws}</td>
                <td className="px-3 py-2 text-right font-mono text-amber-300">{fmtUsd(u.totalWonUsd)}</td>
                <td className="px-3 py-2 text-right">
                  <button
                    onClick={() => setModalUser(u)}
                    className="rounded border border-slate-700 px-2 py-1 text-xs hover:bg-slate-800"
                  >
                    管理
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {modalUser && (
        <EditUserModal
          user={modalUser}
          onClose={() => setModalUser(null)}
          onChanged={() => { fetchUsers(); fetchStats(); }}
        />
      )}
    </main>
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className={cn(
      "rounded-xl border p-4 text-center",
      accent ? "border-amber-700/50 bg-amber-950/20" : "border-slate-800 bg-slate-900/40",
    )}>
      <div className="text-xs text-slate-400">{label}</div>
      <div className={cn("mt-1 text-xl font-bold", accent && "text-amber-300")}>{value}</div>
    </div>
  );
}

function EditUserModal({
  user,
  onClose,
  onChanged,
}: {
  user: AdminUser;
  onClose: () => void;
  onChanged: () => void;
}) {
  const [mode, setMode] = useState<"add" | "set">("add");
  const [value, setValue] = useState("1");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const submit = async (action: "add_extra" | "set_extra" | "sync") => {
    setBusy(true);
    setErr(null);
    try {
      const r = await fetch(`/api/admin/users/${encodeURIComponent(user.oidcId)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          value: action === "sync" ? undefined : parseInt(value, 10),
          note,
        }),
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j.message);
      if (action !== "sync") onChanged();
    } catch (e) {
      setErr((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={onClose}>
      <div
        className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="mb-4 text-lg font-bold">管理 - {user.name}</h2>
        <div className="mb-4 space-y-1 text-sm text-slate-400">
          <div>邮箱: {user.email}</div>
          <div>当前额外次数: <span className="text-white">{user.extraDraws}</span></div>
          <div>当前可用次数: <span className="text-white">{user.availableDraws}</span></div>
          <div>累计中奖: <span className="text-white">{fmtUsd(user.totalWonUsd)}</span></div>
          <div>累计抽奖次数: <span className="text-white">{user.totalRolls}</span></div>
          <div>已使用: <span className="text-white">{user.usedDraws}</span></div>
          <div>系统已赠送 raw: <span className="font-mono">{user.grantedBalanceRaw}</span></div>
          <div>newapi 当前 quota raw: <span className="font-mono">{user.lastQuotaRaw}</span></div>
        </div>

        <div className="mb-3 flex gap-2">
          <button
            onClick={() => setMode("add")}
            className={cn("flex-1 rounded-lg border px-3 py-2 text-sm", mode === "add" ? "border-brand-500 bg-brand-900/30" : "border-slate-700")}
          >
            增减
          </button>
          <button
            onClick={() => setMode("set")}
            className={cn("flex-1 rounded-lg border px-3 py-2 text-sm", mode === "set" ? "border-brand-500 bg-brand-900/30" : "border-slate-700")}
          >
            设定
          </button>
        </div>

        <div className="mb-3 flex items-center gap-2">
          <input
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-24 rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm"
          />
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="备注 (必填原因)"
            className="flex-1 rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm"
          />
        </div>

        {err && <div className="mb-3 text-sm text-red-400">⚠️ {err}</div>}

        <div className="flex gap-2">
          <button
            disabled={busy || !note}
            onClick={() => submit(mode === "add" ? "add_extra" : "set_extra")}
            className="flex-1 rounded-lg bg-brand-600 px-3 py-2 text-sm font-semibold text-white disabled:opacity-40"
          >
            确认
          </button>
          <button
            disabled={busy}
            onClick={() => submit("sync")}
            className="flex-1 rounded-lg border border-slate-700 px-3 py-2 text-sm hover:bg-slate-800 disabled:opacity-40"
          >
            立即同步
          </button>
          <button onClick={onClose} className="rounded-lg border border-slate-700 px-3 py-2 text-sm">
            关闭
          </button>
        </div>
      </div>
    </div>
  );
}
