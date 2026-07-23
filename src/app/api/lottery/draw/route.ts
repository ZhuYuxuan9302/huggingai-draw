import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { performDraw, type DrawOutput } from "@/lib/lottery";

interface Body {
  source?: "single" | "ten";
}

/** POST /api/lottery/draw */
export async function POST(req: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json(
      { error: "unauthorized", message: "未登录" },
      { status: 401 },
    );
  }
  const body = (await req.json().catch(() => ({}))) as Body;
  if (body.source !== "single" && body.source !== "ten") {
    return NextResponse.json(
      { error: "bad_request", message: "source 必须为 single 或 ten" },
      { status: 400 },
    );
  }
  try {
    const result: DrawOutput = await performDraw(session.oidcId, body.source);
    return NextResponse.json({ data: result });
  } catch (e) {
    return NextResponse.json(
      { error: "draw_failed", message: (e as Error).message },
      { status: 400 },
    );
  }
}
