import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/guard";
import { safeJson } from "@/lib/serializer";

/** GET /api/admin/users/[oidcId]/logs */
export async function GET(
  _req: Request,
  { params }: { params: { oidcId: string } },
) {
  const { response } = await requireAdmin();
  if (response) return response;

  const logs = await prisma.adminLog.findMany({
    where: { targetId: params.oidcId },
    orderBy: { createdAt: "desc" },
    take: 100,
  });
  return NextResponse.json(safeJson({ data: logs }));
}
