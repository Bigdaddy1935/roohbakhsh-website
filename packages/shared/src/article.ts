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
  status: ArticleStatus;
  publishedAt: ISODate | null;
  createdAt: ISODate;
  updatedAt: ISODate;
}

export type PaginatedArticles = Paginated<ArticleRecord>;
