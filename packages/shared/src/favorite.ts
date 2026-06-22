// ──────────────────────────────────────────────────────────────
// علاقه‌مندی‌ها — NestJS API
// ──────────────────────────────────────────────────────────────

import type { ID, ISODate } from "./common";
import type { CourseRecord } from "./course";

export interface Favorite {
  id: ID;
  courseId: ID;
  course: CourseRecord;
  createdAt: ISODate;
}

export interface ToggleFavoriteRequest {
  courseId: ID;
}

export interface ToggleFavoriteResponse {
  isFavorite: boolean;
}
