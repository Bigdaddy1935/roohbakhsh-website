"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import type { InstructorRecord, CreateInstructorRequest, UpdateInstructorRequest } from "@roohbakhsh/shared";

export const instructorKeys = {
  list: () => ["instructors", "list"] as const,
  detail: (id: string) => ["instructors", "detail", id] as const,
};

export function useInstructors() {
  return useQuery<InstructorRecord[]>({
    queryKey: instructorKeys.list(),
    queryFn: () => api.get<InstructorRecord[]>("/instructors"),
  });
}

export function useInstructor(id: string) {
  return useQuery<InstructorRecord>({
    queryKey: instructorKeys.detail(id),
    queryFn: () => api.get<InstructorRecord>(`/instructors/${id}`),
    enabled: !!id,
  });
}

export function useCreateInstructor() {
  const qc = useQueryClient();
  return useMutation<InstructorRecord, Error, CreateInstructorRequest>({
    mutationFn: (body) => api.post<InstructorRecord>("/instructors", body),
    onSuccess: () => qc.invalidateQueries({ queryKey: instructorKeys.list() }),
  });
}

export function useUpdateInstructor(id: string) {
  const qc = useQueryClient();
  return useMutation<InstructorRecord, Error, UpdateInstructorRequest>({
    mutationFn: (body) => api.patch<InstructorRecord>(`/instructors/${id}`, body),
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
