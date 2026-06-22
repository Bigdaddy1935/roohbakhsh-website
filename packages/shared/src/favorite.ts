// ──────────────────────────────────────────────────────────────
// علاقه‌مندی‌های کاربر — دوره یا مقاله
// ──────────────────────────────────────────────────────────────

import type { ID, ISODate, Localized } from "./common";

export type FavoriteType = "course" | "article";

/** یک آیتم در لیست «علاقه‌مندی‌های من». */
export interface FavoriteItem {
  type: FavoriteType;
  id: ID;
  slug: string;
  title: Localized;
  thumbnailUrl: Localized<string | null>;
  createdAt: ISODate;
}

export interface ToggleFavoriteRequest {
  type: FavoriteType;
  id: ID;
}

export interface FavoriteStatus {
  isFavorite: boolean;
}
