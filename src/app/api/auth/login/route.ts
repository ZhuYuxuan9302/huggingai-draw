import { NextResponse } from "next/server";
import {
  buildAuthState,
  getAuthorizationUrl,
  verifyAuthState,
} from "@/lib/oidc";
import { setSession, clearSession } from "@/lib/session";
import { upsertUserFromOidc } from "@/lib/auth";

/** GET /api/auth/login → 跳到 OIDC */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const action = url.searchParams.get("action");

  if (action === "logout") {
    await clearSession();
    return NextResponse.redirect(new URL("/", url));
  }

  const state = buildAuthState();
  const authUrl = await getAuthorizationUrl(state);
  // state 放 cookie，回调时验证（简单方案，不依赖额外 session 存储）
  const res = NextResponse.redirect(authUrl);
  res.cookies.set("oidc_state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 600,
  });
  return res;
}
