import type { ID, ISODate, Localized } from "./common";

export type FavoriteTargetType = "course" | "article" | "lesson";

export interface FavoriteItem {
  id: ID;
  type: FavoriteTargetType;
  title: Localized;
  slug: string;
  /** فقط برای درس — slug دوره مربوطه */
  courseSlug?: string;
  createdAt: ISODate;
}

export interface ToggleFavoriteRequest {
  type: FavoriteTargetType;
  id: ID;
}

export interface FavoriteStatus {
  isFavorite: boolean;
}
