"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import type { User, Paginated } from "@roohbakhsh/shared";

export const userKeys = {
  list: (params?: Record<string, unknown>) => ["users", "list", params] as const,
};

export function useUsers(params?: { page?: number; limit?: number }) {
  const qs = new URLSearchParams();
  if (params?.page) qs.set("page", String(params.page));
  if (params?.limit) qs.set("limit", String(params.limit));
  const query = qs.toString() ? `?${qs}` : "";

  return useQuery<Paginated<User>>({
    queryKey: userKeys.list(params),
    queryFn: () => api.get<Paginated<User>>(`/users${query}`),
  });
}
