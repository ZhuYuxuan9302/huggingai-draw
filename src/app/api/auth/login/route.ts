import { NextResponse } from "next/server";
import {
  buildAuthState,
  getAuthorizationUrl,
} from "@/lib/oidc";
import { getCookieOptions } from "@/lib/cookies";
import { appBaseUrl } from "@/lib/url";

/** GET /api/auth/login → 跳到 OIDC */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const action = url.searchParams.get("action");

  if (action === "logout") {
    const { clearSession } = await import("@/lib/session");
    await clearSession();
    return NextResponse.redirect(new URL("/", appBaseUrl()));
  }

  const state = buildAuthState();
  const authUrl = await getAuthorizationUrl(state);
  // state 放 cookie,回调时验证(简单方案,不依赖额外 session 存储)
  const res = NextResponse.redirect(authUrl);
  // oidc_state 用 10 分钟 TTL,与 state 自身有效期一致
  res.cookies.set("oidc_state", state, getCookieOptions({ maxAge: 600 }));
  return res;
}
