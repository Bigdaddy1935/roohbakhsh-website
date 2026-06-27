"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import type { Category, CategoryTree } from "@roohbakhsh/shared";

export const categoryKeys = {
  list: ["categories", "list"] as const,
  tree: ["categories", "tree"] as const,
};

export function useCategories() {
  return useQuery<Category[]>({
    queryKey: categoryKeys.list,
    queryFn: () => api.get<Category[]>("/categories"),
    staleTime: 1000 * 60 * 10,
  });
}

export function useCategoryTree() {
  return useQuery<CategoryTree[]>({
    queryKey: categoryKeys.tree,
    queryFn: () => api.get<CategoryTree[]>("/categories/tree"),
    staleTime: 1000 * 60 * 10,
  });
}
