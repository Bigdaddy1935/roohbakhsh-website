"use client";

import { useCallback } from "react";
import { useRouter, usePathname } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";

export function useCourseFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const cats = params.get("cats")?.split(",").filter(Boolean) ?? [];
  const sort = params.get("sort") ?? "newest";
  const q = params.get("q") ?? "";

  const push = useCallback(
    (updates: Record<string, string | null>) => {
      const p = new URLSearchParams(params.toString());
      Object.entries(updates).forEach(([k, v]) => {
        if (v) p.set(k, v);
        else p.delete(k);
      });
      const qs = p.toString();
      router.replace((qs ? `${pathname}?${qs}` : pathname) as never, { scroll: false });
    },
    [params, pathname, router],
  );

  const toggleCategory = useCallback(
    (cat: string) => {
      const next = cats.includes(cat) ? cats.filter((c) => c !== cat) : [...cats, cat];
      push({ cats: next.join(",") || null });
    },
    [cats, push],
  );

  const setSort = useCallback((s: string) => push({ sort: s }), [push]);
  const setSearch = useCallback((v: string) => push({ q: v || null }), [push]);
  const clearAll = useCallback(() => {
    router.replace(pathname as never, { scroll: false });
  }, [router, pathname]);

  return { cats, sort, q, toggleCategory, setSort, setSearch, clearAll };
}
