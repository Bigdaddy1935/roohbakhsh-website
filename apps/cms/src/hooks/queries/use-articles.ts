"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import type { ArticleRecord, Paginated, CreateArticleRequest, UpdateArticleRequest } from "@roohbakhsh/shared";

export const articleKeys = {
  list: (params?: Record<string, unknown>) => ["articles", "list", params] as const,
  adminList: (params?: Record<string, unknown>) => ["articles", "admin-list", params] as const,
  detail: (slug: string) => ["articles", "detail", slug] as const,
};

export function useArticlesAdmin(params?: { page?: number; limit?: number }) {
  const qs = new URLSearchParams();
  if (params?.page) qs.set("page", String(params.page));
  if (params?.limit) qs.set("limit", String(params.limit));
  const query = qs.toString() ? `?${qs}` : "";

  return useQuery<Paginated<ArticleRecord>>({
    queryKey: articleKeys.adminList(params),
    queryFn: () => api.get<Paginated<ArticleRecord>>(`/articles/admin/all${query}`),
  });
}

export function useArticle(slug: string) {
  return useQuery<ArticleRecord>({
    queryKey: articleKeys.detail(slug),
    queryFn: () => api.get<ArticleRecord>(`/articles/${slug}`),
    enabled: !!slug,
  });
}

export function useArticleAdminById(id: string) {
  return useQuery<ArticleRecord | undefined>({
    queryKey: ["articles", "admin-detail", id],
    queryFn: async () => {
      const res = await api.get<Paginated<ArticleRecord>>(`/articles/admin/all?limit=1000`);
      return res.items.find((a) => a.id === id);
    },
    enabled: !!id,
  });
}

export function useCreateArticle() {
  const qc = useQueryClient();
  return useMutation<ArticleRecord, Error, CreateArticleRequest>({
    mutationFn: (body) => api.post<ArticleRecord>("/articles", body),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["articles"] }),
  });
}

export function useUpdateArticle(id: string) {
  const qc = useQueryClient();
  return useMutation<ArticleRecord, Error, UpdateArticleRequest>({
    mutationFn: (body) => api.patch<ArticleRecord>(`/articles/${id}`, body),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["articles"] }),
  });
}

export function useDeleteArticle() {
  const qc = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: (id) => api.delete<void>(`/articles/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["articles"] }),
  });
}
