/**
 * OIDC（Authentik / 通用）轻量实现
 * ──────────────────────────────────────────────────
 * - 不依赖任何第三方 SDK，手写三步：metadata → token → userinfo
 * - 采用 server-side fetch（Node 内置 fetch）
 * - state/nonce 用 HMAC 签名一个时间戳防 CSRF
 */

import { createHmac, randomBytes } from "crypto";

const OIDC_ISSUER = process.env.OIDC_ISSUER || "";
const CLIENT_ID = process.env.OIDC_CLIENT_ID || "";
const CLIENT_SECRET = process.env.OIDC_CLIENT_SECRET || "";
const SCOPES = process.env.OIDC_SCOPES || "openid email profile";
const APP_BASE_URL = process.env.APP_BASE_URL || "http://localhost:3000";
const SESSION_SECRET =
  process.env.SESSION_SECRET || "dev-secret-change-me-please-32+";

interface OIDCMetadata {
  issuer: string;
  authorization_endpoint: string;
  token_endpoint: string;
  userinfo_endpoint: string;
  end_session_endpoint?: string;
}

let cachedMetadata: OIDCMetadata | null = null;
let cachedAt = 0;
// 1 小时刷新一次
const METADATA_TTL = 60 * 60 * 1000;

export async function getMetadata(): Promise<OIDCMetadata> {
  if (cachedMetadata && Date.now() - cachedAt < METADATA_TTL) {
    return cachedMetadata;
  }
  const url =
    process.env.OIDC_METADATA_URL ||
    `${OIDC_ISSUER.replace(/\/$/, "")}/.well-known/openid-configuration`;

  const resp = await fetch(url, { headers: { Accept: "application/json" } });
  if (!resp.ok) {
    throw new Error(
      `无法获取 OIDC metadata: ${resp.status} ${await resp.text()}`,
    );
  }
  const md = (await resp.json()) as OIDCMetadata;
  cachedMetadata = md;
  cachedAt = Date.now();
  return md;
}

export function getRedirectUri(): string {
  return `${APP_BASE_URL.replace(/\/$/, "")}/api/auth/callback`;
}

function sign(payload: string): string {
  const sig = createHmac("sha256", SESSION_SECRET).update(payload).digest("hex");
  return `${payload}.${sig}`;
}

function verifyAndDecode(token: string, maxAgeSec: number): string | null {
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return null;
  const expected = createHmac("sha256", SESSION_SECRET)
    .update(payload)
    .digest("hex");
  if (sig !== expected) return null;
  // payload 形如 timestamp.randomHex
  const ts = parseInt(payload.split("|")[0], 10);
  if (Number.isNaN(ts)) return null;
  if (Date.now() - ts > maxAgeSec * 1000) return null;
  return payload;
}

export function buildAuthState(): string {
  const ts = Date.now().toString();
  const nonce = randomBytes(16).toString("hex");
  return sign(`${ts}|${nonce}`);
}

export function verifyAuthState(state: string): boolean {
  // state 最多有效 10 分钟
  return !!verifyAndDecode(state, 600);
}

export function getAuthorizationUrl(state: string): Promise<string> {
  return getMetadata().then((md) => {
    const params = new URLSearchParams({
      response_type: "code",
      client_id: CLIENT_ID,
      redirect_uri: getRedirectUri(),
      scope: SCOPES,
      state,
    });
    return `${md.authorization_endpoint}?${params.toString()}`;
  });
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in?: number;
  refresh_token?: string;
  id_token?: string;
}

export async function exchangeCode(code: string): Promise<TokenResponse> {
  const md = await getMetadata();
  const body = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    redirect_uri: getRedirectUri(),
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
  });
  const resp = await fetch(md.token_endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
    },
    body,
  });
  const text = await resp.text();
  if (!resp.ok) {
    throw new Error(`token exchange failed: ${resp.status} ${text}`);
  }
  return JSON.parse(text) as TokenResponse;
}

export interface UserInfo {
  sub: string;
  name?: string;
  email?: string;
  picture?: string;
  preferred_username?: string;
}

export async function getUserInfo(accessToken: string): Promise<UserInfo> {
  const md = await getMetadata();
  const resp = await fetch(md.userinfo_endpoint, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/json",
    },
  });
  if (!resp.ok) {
    throw new Error(
      `userinfo fetch failed: ${resp.status} ${await resp.text()}`,
    );
  }
  return (await resp.json()) as UserInfo;
}
