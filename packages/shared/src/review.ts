import type { ID, ISODate, Localized, Paginated } from "./common";

export interface ReviewUser {
  id: ID;
  fullName: string;
  avatarUrl: string | null;
}

export interface ReviewRecord {
  id: ID;
  /** دقیقاً یکی از courseId/articleId مقدار دارد. */
  courseId: ID | null;
  articleId: ID | null;
  userId: ID;
  user: ReviewUser;
  rating: number; // 1 تا 5
  comment: string | null;
  /** پاسخ مدیر/مدرس به این نظر — null یعنی هنوز پاسخی ثبت نشده. */
  instructorReply: string | null;
  /** تاریخ ثبت پاسخ — null یعنی هنوز پاسخی ثبت نشده. */
  repliedAt: ISODate | null;
  /** تأیید مدیر — تا true نشود در لیست‌های عمومی (GET) نمایش داده نمی‌شود. هنگام ساخت همیشه false است. */
  isApproved: boolean;
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

/** ثبت/ویرایش پاسخ مدیر روی یک نظر — فقط admin. */
export interface ReplyToReviewRequest {
  reply: string;
}

export interface CourseRatingSummary {
  averageRating: number | null; // null یعنی هنوز نظری ثبت نشده
  reviewCount: number;
}

export type PaginatedReviews = Paginated<ReviewRecord>;

/** دوره یا مقاله‌ای که این نظر متعلق به آن است — برای روت سراسری GET /reviews. */
export interface ReviewTarget {
  type: "course" | "article";
  id: ID;
  slug: string;
  title: Localized;
}

export interface ReviewWithTarget extends ReviewRecord {
  target: ReviewTarget;
}

export type PaginatedReviewsWithTarget = Paginated<ReviewWithTarget>;
