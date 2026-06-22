// ──────────────────────────────────────────────────────────────
// نظرات / امتیازدهی — NestJS API
// ──────────────────────────────────────────────────────────────

import type { ID, ISODate, Paginated } from "./common";

export interface Review {
  id: ID;
  authorId: ID;
  authorName: string;
  rating: number;
  body: string;
  createdAt: ISODate;
  updatedAt: ISODate;
}

export interface CreateReviewRequest {
  rating: number;
  body: string;
}

export type PaginatedReviews = Paginated<Review>;
