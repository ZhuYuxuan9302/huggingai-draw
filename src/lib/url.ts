/**
 * URL 工具函数
 *
 * 容器内 Next.js server 监听 0.0.0.0,所有 incoming request 的 Host 头
 * 都会被解析成 0.0.0.0:port。如果 route handler 用 `new URL(req.url)`
 * 作为重定向基底,就会跳到 http://0.0.0.0:3000/... 这种无法访问的地址。
 *
 * 所以凡是涉及"跳回客户端访问的 URL"的地方,都必须用 APP_BASE_URL env
 * 作为绝对基底,不能依赖 req.url。
 */

const FALLBACK = "http://localhost:3000";

export function appBaseUrl(): string {
  const url = (process.env.APP_BASE_URL || FALLBACK).trim().replace(/\/$/, "");
  return url;
}

/** 拼接 APP_BASE_URL + path,返回绝对 URL 字符串 */
export function absUrl(path: string): string {
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${appBaseUrl()}${p}`;
}
