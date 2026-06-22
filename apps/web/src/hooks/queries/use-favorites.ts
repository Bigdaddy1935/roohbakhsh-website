"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import type { FavoriteItem, ToggleFavoriteRequest, FavoriteStatus } from "@roohbakhsh/shared";

export const favoriteKeys = {
  mine: (params?: Record<string, unknown>) => ["favorites", "mine", params] as const,
};

export function useMyFavorites(params?: { limit?: number }) {
  const qs = new URLSearchParams();
  if (params?.limit) qs.set("limit", String(params.limit));
  const query = qs.toString() ? `?${qs}` : "";

  return useQuery<FavoriteItem[]>({
    queryKey: favoriteKeys.mine(params),
    queryFn: () => api.get<FavoriteItem[]>(`/favorites/mine${query}`),
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
