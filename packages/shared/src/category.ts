import type { ID, ISODate, Localized } from "./common";

// ── مدل پایه ────────────────────────────────────────────────────────────────

export interface Category {
  id: ID;
  name: Localized;
  slug: string;
  description: Localized | null;
  thumbnailUrl: Localized<string | null>;
  parentId: ID | null;
  /** ترتیب نمایش در میان هم‌رده‌ها */
  order: number;
  /** تعداد دوره‌هایی که categoryId آن‌ها به این دسته اشاره می‌کند. */
  courseCount: number;
  createdAt: ISODate;
  updatedAt: ISODate;
}

/** دسته‌بندی با زیردسته‌های تو در تو — برای رندر درخت */
export interface CategoryTree extends Category {
  children: CategoryTree[];
}

// ── ورودی‌های API ─────────────────────────────────────────────────────────────

export interface CreateCategoryRequest {
  name: Localized;
  slug: string;
  description?: Localized;
  thumbnailUrl?: Localized<string | null>;
  /** id دسته‌ی والد — اگر null باشد دسته ریشه است */
  parentId?: ID | null;
  order?: number;
}

export interface UpdateCategoryRequest {
  name?: Localized;
  slug?: string;
  description?: Localized;
  thumbnailUrl?: Localized<string | null>;
  parentId?: ID | null;
  order?: number;
}
