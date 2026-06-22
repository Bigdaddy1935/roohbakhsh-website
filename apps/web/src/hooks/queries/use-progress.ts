"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import type { CourseProgress } from "@roohbakhsh/shared";

export const progressKeys = {
  course: (courseSlug: string) => ["progress", "course", courseSlug] as const,
};

export function useCourseProgress(courseSlug: string) {
  return useQuery<CourseProgress>({
    queryKey: progressKeys.course(courseSlug),
    queryFn: () => api.get<CourseProgress>(`/courses/${courseSlug}/progress`),
    enabled: !!courseSlug,
  });
}

export function useWatchLesson() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, { lessonId: string; courseSlug?: string }>({
    mutationFn: ({ lessonId }) => api.post<void>(`/lessons/${lessonId}/watch`),
    onSuccess: (_data, { courseSlug }) => {
      if (courseSlug) {
        queryClient.invalidateQueries({ queryKey: progressKeys.course(courseSlug) });
      }
    },
  });
}
