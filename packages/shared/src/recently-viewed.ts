// ──────────────────────────────────────────────────────────────
// اخیراً مشاهده‌شده — NestJS API
// ──────────────────────────────────────────────────────────────

import type { ID, ISODate, Paginated } from "./common";
import type { CourseRecord } from "./course";

export interface RecentlyViewed {
  id: ID;
  courseId: ID;
  course: CourseRecord;
  viewedAt: ISODate;
}

export interface RecordViewRequest {
  courseId: ID;
}

export type PaginatedRecentlyViewed = Paginated<RecentlyViewed>;
