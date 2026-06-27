"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import type { CourseRecord, CourseStatsSummary, SectionRecord, Lesson, Paginated } from "@roohbakhsh/shared";

export const courseKeys = {
  list: (params?: Record<string, unknown>) => ["courses", "list", params] as const,
  detail: (slug: string) => ["courses", "detail", slug] as const,
  sections: (slug: string) => ["courses", "sections", slug] as const,
  lesson: (courseSlug: string, sectionId: string, lessonId: string) =>
    ["courses", "lesson", courseSlug, sectionId, lessonId] as const,
  stats: () => ["courses", "stats"] as const,
};

export function useCourseStats() {
  return useQuery<CourseStatsSummary>({
    queryKey: courseKeys.stats(),
    queryFn: () => api.get<CourseStatsSummary>("/courses/stats"),
  });
}

export function useCourses(params?: { page?: number; limit?: number; q?: string }) {
  const qs = new URLSearchParams();
  if (params?.page) qs.set("page", String(params.page));
  if (params?.limit) qs.set("limit", String(params.limit));
  if (params?.q) qs.set("q", params.q);
  const query = qs.toString() ? `?${qs}` : "";

  return useQuery<Paginated<CourseRecord>>({
    queryKey: courseKeys.list(params),
    queryFn: () => api.get<Paginated<CourseRecord>>(`/courses${query}`),
    enabled: !params?.q || params.q.trim().length >= 3,
  });
}

export function useCourse(slug: string) {
  return useQuery<CourseRecord>({
    queryKey: courseKeys.detail(slug),
    queryFn: () => api.get<CourseRecord>(`/courses/${slug}`),
    enabled: !!slug,
  });
}

export function useCourseSections(courseSlug: string) {
  return useQuery<SectionRecord[]>({
    queryKey: courseKeys.sections(courseSlug),
    queryFn: () => api.get<SectionRecord[]>(`/courses/${courseSlug}/sections`),
    enabled: !!courseSlug,
  });
}

export function useLesson(courseSlug: string, sectionId: string, lessonId: string) {
  return useQuery<Lesson>({
    queryKey: courseKeys.lesson(courseSlug, sectionId, lessonId),
    queryFn: () =>
      api.get<Lesson>(`/courses/${courseSlug}/sections/${sectionId}/lessons/${lessonId}`),
    enabled: !!courseSlug && !!sectionId && !!lessonId,
  });
}
