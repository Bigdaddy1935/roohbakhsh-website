"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import type { Category, CategoryTree, CreateCategoryRequest, UpdateCategoryRequest } from "@roohbakhsh/shared";

export const categoryKeys = {
  list: () => ["categories", "list"] as const,
  tree: () => ["categories", "tree"] as const,
  detail: (id: string) => ["categories", "detail", id] as const,
};

export function useCategories() {
  return useQuery<Category[]>({
    queryKey: categoryKeys.list(),
    queryFn: () => api.get<Category[]>("/categories"),
  });
}

export function useCategoryTree() {
  return useQuery<CategoryTree[]>({
    queryKey: categoryKeys.tree(),
    queryFn: () => api.get<CategoryTree[]>("/categories/tree"),
  });
}

export function useCategory(id: string) {
  return useQuery<CategoryTree>({
    queryKey: categoryKeys.detail(id),
    queryFn: () => api.get<CategoryTree>(`/categories/${id}`),
    enabled: !!id,
  });
}

export function useCreateCategory() {
  const qc = useQueryClient();
  return useMutation<Category, Error, CreateCategoryRequest>({
    mutationFn: (body) => api.post<Category>("/categories", body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: categoryKeys.list() });
      qc.invalidateQueries({ queryKey: categoryKeys.tree() });
    },
  });
}

export function useUpdateCategory(id: string) {
  const qc = useQueryClient();
  return useMutation<Category, Error, UpdateCategoryRequest>({
    mutationFn: (body) => api.patch<Category>(`/categories/${id}`, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: categoryKeys.list() });
      qc.invalidateQueries({ queryKey: categoryKeys.tree() });
      qc.invalidateQueries({ queryKey: categoryKeys.detail(id) });
    },
  });
}

export function useDeleteCategory() {
  const qc = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: (id) => api.delete<void>(`/categories/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: categoryKeys.list() });
      qc.invalidateQueries({ queryKey: categoryKeys.tree() });
    },
  });
}
