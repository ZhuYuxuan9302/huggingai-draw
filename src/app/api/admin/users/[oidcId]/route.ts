import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/guard";

interface Body {
  action: "add_extra" | "set_extra" | "sync";
  value?: number;
  note?: string;
}

/** POST /api/admin/users/[oidcId] */
export async function POST(
  req: Request,
  { params }: { params: { oidcId: string } },
) {
  const { session, response } = await requireAdmin();
  if (response || !session) return response;

  const body = (await req.json().catch(() => ({}))) as Body;
  const { action } = body;
  if (action !== "add_extra" && action !== "set_extra" && action !== "sync") {
    return NextResponse.json(
      { error: "bad_request", message: "action 非法" },
      { status: 400 },
    );
  }

  const target = await prisma.user.findUnique({
    where: { oidcId: params.oidcId },
  });
  if (!target) {
    return NextResponse.json(
      { error: "not_found", message: "目标用户不存在" },
      { status: 404 },
    );
  }

  if (action === "sync") {
    // 管理员触发同步
    const { syncUser } = await import("@/lib/sync");
    const r = await syncUser(params.oidcId);
    await prisma.adminLog.create({
      data: {
        actorId: session.oidcId,
        targetId: params.oidcId,
        action: "sync",
        beforeValue: target.extraDraws.toString(),
        afterValue: target.extraDraws.toString(),
        note: body.note || "",
      },
    });
    return NextResponse.json({ data: r });
  }

  // add_extra / set_extra
  const value = body.value;
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return NextResponse.json(
      { error: "bad_request", message: "value 必须为数字" },
      { status: 400 },
    );
  }
  const before = target.extraDraws;
  const after =
    action === "add_extra" ? before + value : Math.max(0, value);

  await prisma.$transaction([
    prisma.user.update({
      where: { oidcId: params.oidcId },
      data: { extraDraws: after },
    }),
    prisma.adminLog.create({
      data: {
        actorId: session.oidcId,
        targetId: params.oidcId,
        action,
        beforeValue: before.toString(),
        afterValue: after.toString(),
        note: body.note || "",
      },
    }),
  ]);

  return NextResponse.json({
    data: { before, after, diff: after - before },
  });
}
