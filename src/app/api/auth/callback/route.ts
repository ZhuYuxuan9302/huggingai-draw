import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  exchangeCode,
  getUserInfo,
  verifyAuthState,
} from "@/lib/oidc";
import { setSession } from "@/lib/session";
import { upsertUserFromOidc, isAdminEmail } from "@/lib/auth";
import { syncUser } from "@/lib/sync";

/** GET /api/auth/callback */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");

  // 从 cookie 读取登录时下发的 state
  const cookieJar = cookies();
  const stateFromCookie = cookieJar.get("oidc_state")?.value;

  // 校验：state 必须存在、匹配 cookie、HMAC 签名有效、未过期
  if (
    !code ||
    !state ||
    !stateFromCookie ||
    state !== stateFromCookie ||
    !verifyAuthState(state)
  ) {
    return NextResponse.json(
      {
        error: "invalid_state",
        message: "State 校验失败",
      },
      { status: 400 },
    );
  }

  try {
    const token = await exchangeCode(code);
    const userinfo = await getUserInfo(token.access_token);
    const identity = {
      oidcId: userinfo.sub,
      name: userinfo.preferred_username || userinfo.name || userinfo.email || "user",
      email: userinfo.email || "",
      picture: userinfo.picture || null,
    };
    // 1. upsert 本系统记录
    await upsertUserFromOidc(identity);
    // 2. 同步 newapi 数据（读 + 缓存 quota / autoDraws）
    try {
      await syncUser(identity.oidcId);
    } catch (e) {
      // newapi 没记录或错误不阻断登录，可稍后手动 sync
      console.warn("登录时 sync 失败:", (e as Error).message);
    }
    // 3. 写 session
    await setSession({
      ...identity,
      isAdmin: isAdminEmail(identity.email),
    });

    // 4. 清掉 oidc_state cookie，并跳转
    const res = NextResponse.redirect(new URL("/lottery", url));
    res.cookies.delete("oidc_state");
    return res;
  } catch (e) {
    return NextResponse.json(
      {
        error: "login_failed",
        message: (e as Error).message,
      },
      { status: 500 },
    );
  }
}
