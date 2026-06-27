"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import type { InstructorRecord } from "@roohbakhsh/shared";

export const instructorKeys = {
  list: ["instructors", "list"] as const,
  detail: (id: string) => ["instructors", "detail", id] as const,
  bySlug: (slug: string) => ["instructors", "slug", slug] as const,
};

export function useInstructors() {
  return useQuery<InstructorRecord[]>({
    queryKey: instructorKeys.list,
    queryFn: () => api.get<InstructorRecord[]>("/instructors"),
    staleTime: 1000 * 60 * 10,
  });
}

export function useInstructor(id: string) {
  return useQuery<InstructorRecord>({
    queryKey: instructorKeys.detail(id),
    queryFn: () => api.get<InstructorRecord>(`/instructors/${id}`),
    enabled: !!id,
  });
}

export function useInstructorBySlug(slug: string) {
  const { data: list, ...rest } = useInstructors();
  return {
    ...rest,
    data: list?.find((i) => i.slug === slug),
  };
}
