"use client";

import type { ApiError } from "@roohbakhsh/shared";

const BASE = process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:3001/api";

const ACCESS_KEY = "rh_access";
const REFRESH_KEY = "rh_refresh";

// ── token helpers ────────────────────────────────────────────────
export const tokenStore = {
  getAccess: () => (typeof window !== "undefined" ? localStorage.getItem(ACCESS_KEY) : null),
  getRefresh: () => (typeof window !== "undefined" ? localStorage.getItem(REFRESH_KEY) : null),
  set: (access: string, refresh: string) => {
    localStorage.setItem(ACCESS_KEY, access);
    localStorage.setItem(REFRESH_KEY, refresh);
  },
  clear: () => {
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
  },
};

// ── refresh once flag — prevents infinite loops ──────────────────
let isRefreshing = false;

async function tryRefresh(): Promise<string | null> {
  const refresh = tokenStore.getRefresh();
  if (!refresh || isRefreshing) return null;
  isRefreshing = true;
  try {
    const res = await fetch(`${BASE}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken: refresh }),
    });
    if (!res.ok) {
      tokenStore.clear();
      return null;
    }
    const data = await res.json();
    tokenStore.set(data.accessToken, data.refreshToken);
    return data.accessToken as string;
  } catch {
    tokenStore.clear();
    return null;
  } finally {
    isRefreshing = false;
  }
}

// ── core fetch wrapper ───────────────────────────────────────────
export async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
  retry = true,
): Promise<T> {
  const access = tokenStore.getAccess();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (access) headers["Authorization"] = `Bearer ${access}`;

  const res = await fetch(`${BASE}${path}`, { ...options, headers });

  // token expired → refresh and retry once
  if (res.status === 401 && retry) {
    const newToken = await tryRefresh();
    if (newToken) return apiRequest<T>(path, options, false);
    tokenStore.clear();
  }

  if (!res.ok) {
    let err: ApiError;
    try {
      err = await res.json();
    } catch {
      err = { statusCode: res.status, code: "UNKNOWN", message: res.statusText };
    }
    throw err;
  }

  if (res.status === 204) return undefined as unknown as T;
  return res.json() as Promise<T>;
}

// ── convenience methods ──────────────────────────────────────────
export const api = {
  get: <T>(path: string) => apiRequest<T>(path, { method: "GET" }),
  post: <T>(path: string, body?: unknown) =>
    apiRequest<T>(path, { method: "POST", body: body !== undefined ? JSON.stringify(body) : undefined }),
  patch: <T>(path: string, body?: unknown) =>
    apiRequest<T>(path, { method: "PATCH", body: body !== undefined ? JSON.stringify(body) : undefined }),
  delete: <T>(path: string, body?: unknown) =>
    apiRequest<T>(path, { method: "DELETE", body: body !== undefined ? JSON.stringify(body) : undefined }),
};
