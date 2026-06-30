import type { ISODate, Money, Localized } from "./common";

export interface CartItemRecord {
  courseId: string;
  title: Localized;
  thumbnailUrl: Localized<string | null>;
  originalPrice?: Money | null;
  effectivePrice: Money | null;
  addedAt: ISODate;
}

export interface CartRecord {
  items: CartItemRecord[];
  total: Money | null;
}
