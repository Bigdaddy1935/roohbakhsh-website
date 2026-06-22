// ──────────────────────────────────────────────────────────────
// پیشرفت دوره — NestJS API
// ──────────────────────────────────────────────────────────────

import type { ID } from "./common";

export interface LessonProgress {
  lessonId: ID;
  watchedAt: string;
}

export interface CourseProgress {
  courseId: ID;
  completedLessons: number;
  totalLessons: number;
  percentComplete: number;
  lessons: LessonProgress[];
}

export interface WatchLessonRequest {
  lessonId: ID;
}
