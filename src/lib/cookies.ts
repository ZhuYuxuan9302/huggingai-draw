/**
 * 统一管理 cookie 选项，避免每个调用点重复设
 *
 * 关键坑：在 Docker / production 环境下，如果应用通过 HTTP 暴露
 * （如 http://localhost:3000 或自建反向代理不终止 TLS），
 * 浏览器不会保存 Secure cookie。这会导致：
 * - 登录时设的 oidc_state cookie 丢失 → 回调报 invalid_state
 * - 登录后 session cookie 设不上 → 永远进不去
 *
 * 所以这里用 APP_BASE_URL 的协议来决定 secure 标记：
 *   https://... → secure: true
 *   http://...  → secure: false
 *
 * 也支持通过 env `COOKIE_SECURE=true|false` 手动覆盖（适用于
 * 反代终止 TLS 但 APP_BASE_URL 仍写 http 的场景）。
 */

function detectSecure(): boolean {
  // 1. 显式 env 覆盖优先
  const envVal = process.env.COOKIE_SECURE;
  if (envVal === "true") return true;
  if (envVal === "false") return false;

  // 2. 看 APP_BASE_URL 协议
  const baseUrl = process.env.APP_BASE_URL || "http://localhost:3000";
  return baseUrl.startsWith("https://");
}

export interface CookieOpts {
  /** 这个 cookie 设了之后的最大年龄（秒） */
  maxAge: number;
  /** 通常都是 "/" */
  path?: string;
  /** HttpOnly 默认 true，session 和 state 都用，UI 不读 */
  httpOnly?: boolean;
  /** SameSite，默认 lax，跨站 OAuth 回调用 lax 够 */
  sameSite?: "lax" | "strict" | "none";
}

export function getCookieOptions(opts: CookieOpts) {
  return {
    httpOnly: opts.httpOnly ?? true,
    secure: detectSecure(),
    sameSite: opts.sameSite ?? "lax" as const,
    path: opts.path ?? "/",
    maxAge: opts.maxAge,
  };
}

export function isSecureCookie() {
  return detectSecure();
}
