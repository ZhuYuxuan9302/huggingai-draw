/**
 * 客户端 api 调用封装
 */
export interface ApiError {
  error: string;
  message: string;
}

async function request<T>(
  url: string,
  init?: RequestInit,
): Promise<T> {
  const resp = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
  });
  const data = await resp.json().catch(() => ({}));
  if (!resp.ok) {
    const err = data as ApiError;
    throw new Error(err.message || `HTTP ${resp.status}`);
  }
  return data as T;
}

export const api = {
  drawSingle: () => request<{ data: ReturnType<typeof import("@/lib/lottery").performDraw> }>("/api/lottery/draw", {
    method: "POST",
    body: JSON.stringify({ source: "single" }),
  }),
  drawTen: () => request<{ data: ReturnType<typeof import("@/lib/lottery").performDraw> }>("/api/lottery/draw", {
    method: "POST",
    body: JSON.stringify({ source: "ten" }),
  }),
  sync: () => request<{ data: unknown }>("/api/lottery/sync", { method: "POST" }),
  me: () => request<{ data: any }>("/api/me"),
  adminList: () => request<{ data: any[] }>("/api/admin/users"),
  adminUpdate: (oidcId: string, action: string, value: number, note?: string) =>
    request<{ data: any }>(`/api/admin/users/${oidcId}`, {
      method: "POST",
      body: JSON.stringify({ action, value, note }),
    }),
  adminLogs: (oidcId: string) =>
    request<{ data: any[] }>(`/api/admin/users/${oidcId}/logs`),
};
