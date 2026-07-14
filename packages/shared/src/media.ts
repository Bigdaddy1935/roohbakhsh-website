import type { ISODate } from "./common";

export type MediaCategory = "courses" | "articles" | "staff" | "categories" | "other";

export const MEDIA_CATEGORIES: { value: MediaCategory; label: string }[] = [
  { value: "courses",    label: "دوره‌ها" },
  { value: "articles",   label: "مقالات" },
  { value: "staff",      label: "کارمندان" },
  { value: "categories", label: "دسته‌بندی‌ها" },
  { value: "other",      label: "دیگر" },
];

export interface MediaItem {
  id: string;
  url: string;
  filename: string;
  originalName: string;
  category: MediaCategory;
  locale: "ar" | "ur";
  size: number;
  createdAt: ISODate;
}

export interface MediaUploadResponse {
  url: string;
}

export interface MediaListResponse {
  items: MediaItem[];
  total: number;
}
