import type { ID, ISODate, Paginated } from "./common";

export interface ReviewUser {
  id: ID;
  fullName: string;
  avatarUrl: string | null;
}

export interface ReviewRecord {
  id: ID;
  courseId: ID;
  userId: ID;
  user: ReviewUser;
  rating: number; // 1 تا 5
  comment: string | null;
  createdAt: ISODate;
  updatedAt: ISODate;
}

export interface CreateReviewRequest {
  rating: number; // 1 تا 5
  comment?: string | null;
}

export interface UpdateReviewRequest {
  rating?: number;
  comment?: string | null;
}

export interface CourseRatingSummary {
  averageRating: number | null; // null یعنی هنوز نظری ثبت نشده
  reviewCount: number;
}

export type PaginatedReviews = Paginated<ReviewRecord>;
