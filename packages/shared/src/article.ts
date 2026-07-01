import type { ISODate, Localized, Paginated } from "./common";
import type { InstructorSummary } from "./instructor";

export type ArticleStatus = "draft" | "published";

export interface ArticleRecord {
  id: string;
  title: Localized;
  slug: string;
  summary: Localized;
  body: Localized;
  thumbnailUrl: Localized<string | null>;
  instructorId: string;
  instructor: InstructorSummary;
  categoryId: string | null;
  /** میانگین امتیاز نظرات (۱ تا ۵) — null یعنی هنوز نظری ثبت نشده. */
  averageRating: number | null;
  /** تعداد کل نظرات ثبت‌شده روی این مقاله. */
  reviewCount: number;
  status: ArticleStatus;
  publishedAt: ISODate | null;
  createdAt: ISODate;
  updatedAt: ISODate;
}

export type PaginatedArticles = Paginated<ArticleRecord>;

export interface CreateArticleRequest {
  title: Localized;
  slug: string;
  summary: Localized;
  body: Localized;
  thumbnailUrl?: Localized<string | null>;
  instructorId: string;
  categoryId?: string | null;
  status?: ArticleStatus;
}

export interface UpdateArticleRequest {
  title?: Localized;
  slug?: string;
  summary?: Localized;
  body?: Localized;
  thumbnailUrl?: Localized<string | null>;
  instructorId?: string;
  categoryId?: string | null;
  status?: ArticleStatus;
}
