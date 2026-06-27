"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import type { ArticleRecord, PaginatedArticles } from "@roohbakhsh/shared";

export const articleKeys = {
  list: (params?: Record<string, unknown>) => ["articles", "list", params] as const,
  detail: (slug: string) => ["articles", "detail", slug] as const,
};

export function useArticles(params?: { page?: number; limit?: number }) {
  const qs = new URLSearchParams();
  if (params?.page) qs.set("page", String(params.page));
  if (params?.limit) qs.set("limit", String(params.limit));
  const query = qs.toString() ? `?${qs}` : "";

  return useQuery<PaginatedArticles>({
    queryKey: articleKeys.list(params),
    queryFn: () => api.get<PaginatedArticles>(`/articles${query}`),
  });
}

export function useArticle(slug: string) {
  return useQuery<ArticleRecord>({
    queryKey: articleKeys.detail(slug),
    queryFn: () => api.get<ArticleRecord>(`/articles/${slug}`),
    enabled: !!slug,
  });
}
