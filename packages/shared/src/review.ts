import type { ID, ISODate, Localized, Paginated } from "./common";

export type ReviewTargetType = "course" | "article" | "lesson";

export interface ReviewUser {
  id: ID;
  fullName: string;
  avatarUrl: string | null;
}

export interface ReviewTarget {
  id: ID;
  type: ReviewTargetType;
  title: Localized;
  slug: string;
}

export interface ReviewRecord {
  id: ID;
  userId: ID;
  user: ReviewUser;
  targetType: ReviewTargetType;
  targetId: ID;
  rating: number;
  comment: string | null;
  isApproved: boolean;
  isStudent: boolean;
  instructorReply: string | null;
  repliedAt: ISODate | null;
  createdAt: ISODate;
  updatedAt: ISODate;
}

export interface ReviewWithTarget extends ReviewRecord {
  target: ReviewTarget;
}

export interface CreateReviewRequest {
  rating?: number;
  comment?: string | null;
}

export interface ReplyToReviewRequest {
  reply: string;
}

export type PaginatedReviews = Paginated<ReviewRecord>;
export type PaginatedReviewsWithTarget = Paginated<ReviewWithTarget>;
