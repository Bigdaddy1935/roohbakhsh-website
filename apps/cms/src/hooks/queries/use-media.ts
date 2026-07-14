"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, apiUpload } from "@/lib/api-client";
import type { MediaItem, MediaListResponse, MediaCategory } from "@roohbakhsh/shared";

export const mediaKeys = {
  list: (category?: MediaCategory, locale?: "ar" | "ur") =>
    ["media", "list", category ?? "all", locale ?? "all"] as const,
};

export function useMedia(category?: MediaCategory, locale?: "ar" | "ur") {
  return useQuery<MediaListResponse>({
    queryKey: mediaKeys.list(category, locale),
    queryFn: () => {
      const params = new URLSearchParams();
      if (category) params.set("category", category);
      if (locale) params.set("locale", locale);
      const qs = params.toString();
      return api.get<MediaListResponse>(`/media${qs ? `?${qs}` : ""}`);
    },
  });
}

export function useUploadMedia() {
  const qc = useQueryClient();
  return useMutation<MediaItem, Error, { file: File; category: MediaCategory; locale: "ar" | "ur" }>({
    mutationFn: ({ file, category, locale }) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("category", category);
      formData.append("locale", locale);
      return apiUpload<MediaItem>("/media/upload", formData);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["media"] }),
  });
}

export function useDeleteMedia() {
  const qc = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: (id) => api.delete<void>(`/media/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["media"] }),
  });
}
