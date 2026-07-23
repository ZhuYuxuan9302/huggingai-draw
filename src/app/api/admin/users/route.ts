import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAvailableDraws } from "@/lib/sync";
import { rawToUsd } from "@/config/lottery.config";
import { requireAdmin } from "@/lib/guard";
import { safeJson } from "@/lib/serializer";

/** GET /api/admin/users — 列表（支持搜索 + 分页） */
export async function GET(req: Request) {
  const { session, response } = await requireAdmin();
  if (response || !session) return response;

  const url = new URL(req.url);
  const q = url.searchParams.get("q") || "";
  const limit = Math.min(100, parseInt(url.searchParams.get("limit") || "20"));
  const offset = parseInt(url.searchParams.get("offset") || "0");

  const where = q
    ? {
        OR: [
          { name: { contains: q, mode: "insensitive" as const } },
          { email: { contains: q, mode: "insensitive" as const } },
          { oidcId: { contains: q, mode: "insensitive" as const } },
        ],
      }
    : {};

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: offset,
    }),
    prisma.user.count({ where }),
  ]);

  return NextResponse.json(
    safeJson({
      data: users.map((u) => ({
        oidcId: u.oidcId,
        name: u.name,
        email: u.email,
        extraDraws: u.extraDraws,
        autoDraws: u.autoDraws,
        usedDraws: u.usedDraws,
        availableDraws: getAvailableDraws(u),
        totalRolls: u.totalRolls,
        totalWonUsd: rawToUsd(u.totalWonRaw),
        grantedBalanceRaw: u.grantedBalanceRaw.toString(),
        lastQuotaRaw: u.lastQuotaRaw?.toString() || null,
        lastSyncedAt: u.lastSyncedAt,
        createdAt: u.createdAt,
      })),
      total,
      limit,
      offset,
    }),
  );
}

