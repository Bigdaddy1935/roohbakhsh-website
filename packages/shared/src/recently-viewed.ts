import type { ID, ISODate, Localized } from "./common";

export type RecentViewTargetType = "course" | "article" | "lesson";

export interface RecentViewItem {
  id: ID;
  type: RecentViewTargetType;
  title: Localized;
  slug: string;
  courseId: ID | undefined;
  thumbnailUrl: string | null;
  viewedAt: ISODate;
}

export interface RecordViewRequest {
  type: RecentViewTargetType;
  id: ID;
}
