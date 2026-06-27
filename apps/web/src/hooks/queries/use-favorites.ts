"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, tokenStore } from "@/lib/api-client";
import type { FavoriteItem, ToggleFavoriteRequest, FavoriteStatus, Paginated } from "@roohbakhsh/shared";

export const favoriteKeys = {
  mine: (params?: Record<string, unknown>) => ["favorites", "mine", params] as const,
  list: (params?: Record<string, unknown>) => ["favorites", "list", params] as const,
};

export function useMyFavorites(params?: { limit?: number }) {
  const qs = new URLSearchParams();
  if (params?.limit) qs.set("limit", String(params.limit));
  const query = qs.toString() ? `?${qs}` : "";

  return useQuery<FavoriteItem[]>({
    queryKey: favoriteKeys.mine(params),
    queryFn: () => api.get<FavoriteItem[]>(`/favorites/mine${query}`),
    enabled: typeof window !== "undefined" && !!tokenStore.getAccess(),
  });
}

export function useFavorites(params?: { page?: number; limit?: number }) {
  const qs = new URLSearchParams();
  if (params?.page) qs.set("page", String(params.page));
  if (params?.limit) qs.set("limit", String(params.limit));
  const query = qs.toString() ? `?${qs}` : "";

  return useQuery<Paginated<FavoriteItem>>({
    queryKey: favoriteKeys.list(params),
    queryFn: () => api.get<Paginated<FavoriteItem>>(`/favorites${query}`),
    enabled: typeof window !== "undefined" && !!tokenStore.getAccess(),
  });
}

export function useToggleFavorite() {
  const queryClient = useQueryClient();
  return useMutation<FavoriteStatus, Error, ToggleFavoriteRequest>({
    mutationFn: (body) => api.post<FavoriteStatus>("/favorites/toggle", body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
  });
}
