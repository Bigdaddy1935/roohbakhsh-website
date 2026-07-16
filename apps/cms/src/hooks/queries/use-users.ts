"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import type { User, Paginated } from "@roohbakhsh/shared";

export const userKeys = {
  list: (params?: Record<string, unknown>) => ["users", "list", params] as const,
};

export function useUser(id: string) {
  return useQuery<User>({
    queryKey: ["users", id],
    queryFn: () => api.get<User>(`/users/${id}`),
    enabled: !!id,
  });
}

export function useUpdateUser(id: string) {
  const qc = useQueryClient();
  return useMutation<User, Error, Partial<{ fullName: string; phone: string; avatarUrl: string; preferredLocale: "ar" | "ur" }>>({
    mutationFn: (dto) => api.patch<User>(`/users/${id}`, dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["users"] });
    },
  });
}

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
