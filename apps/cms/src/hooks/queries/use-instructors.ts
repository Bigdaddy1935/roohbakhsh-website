"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import type { InstructorDetail, CreateInstructorRequest, UpdateInstructorRequest } from "@roohbakhsh/shared";

export const instructorKeys = {
  list: () => ["instructors", "list"] as const,
  detail: (id: string) => ["instructors", "detail", id] as const,
};

export function useInstructors() {
  return useQuery<InstructorDetail[]>({
    queryKey: instructorKeys.list(),
    queryFn: () => api.get<InstructorDetail[]>("/instructors"),
  });
}

export function useInstructor(id: string) {
  return useQuery<InstructorDetail>({
    queryKey: instructorKeys.detail(id),
    queryFn: () => api.get<InstructorDetail>(`/instructors/${id}`),
    enabled: !!id,
  });
}

export function useCreateInstructor() {
  const qc = useQueryClient();
  return useMutation<InstructorDetail, Error, CreateInstructorRequest>({
    mutationFn: (body) => api.post<InstructorDetail>("/instructors", body),
    onSuccess: () => qc.invalidateQueries({ queryKey: instructorKeys.list() }),
  });
}

export function useUpdateInstructor(id: string) {
  const qc = useQueryClient();
  return useMutation<InstructorDetail, Error, UpdateInstructorRequest>({
    mutationFn: (body) => api.patch<InstructorDetail>(`/instructors/${id}`, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: instructorKeys.list() });
      qc.invalidateQueries({ queryKey: instructorKeys.detail(id) });
    },
  });
}

export function useDeleteInstructor() {
  const qc = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: (id) => api.delete<void>(`/instructors/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: instructorKeys.list() }),
  });
}
