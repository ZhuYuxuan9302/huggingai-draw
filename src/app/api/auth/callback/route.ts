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
import { appBaseUrl } from "@/lib/url";

/** GET /api/auth/callback */
export async function GET(req: Request) {
  // 不用 req.url 作为重定向基底（容器内 req.url 的 host 可能是 0.0.0.0），
  // 改用 env APP_BASE_URL 作为绝对基底，确保跳转去正确的外部访问地址。
  const base = appBaseUrl();
  const url = new URL(req.url);

  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");

  // 从 cookie 读取登录时下发的 state
  const cookieJar = cookies();
  const stateFromCookie = cookieJar.get("oidc_state")?.value;

  // 校验:state 必须存在、匹配 cookie、HMAC 签名有效、未过期
  if (
    !code ||
    !state ||
    !stateFromCookie ||
    state !== stateFromCookie ||
    !verifyAuthState(state)
  ) {
    // 失败跳回登录页带错误参数,避免在 API route 卡住或跳到 0.0.0.0
    return NextResponse.redirect(new URL("/login?error=invalid_state", base));
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
    // 2. 同步 newapi 数据(读 + 缓存 quota / autoDraws)
    try {
      await syncUser(identity.oidcId);
    } catch (e) {
      // newapi 没记录或错误不阻断登录,可稍后手动 sync
      console.warn("登录时 sync 失败:", (e as Error).message);
    }
    // 3. 写 session
    await setSession({
      ...identity,
      isAdmin: isAdminEmail(identity.email),
    });

    // 4. 清掉 oidc_state cookie,并跳转到抽奖页
    const res = NextResponse.redirect(new URL("/lottery", base));
    res.cookies.delete("oidc_state");
    return res;
  } catch (e) {
    console.error("登录失败:", (e as Error).message);
    return NextResponse.redirect(
      new URL(`/login?error=login_failed&message=${encodeURIComponent((e as Error).message)}`, base),
    );
  }
}
