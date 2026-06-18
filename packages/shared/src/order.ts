import type { ISODate, Money, Localized, Paginated } from "./common";

export type OrderStatus = "pending" | "paid" | "failed" | "cancelled" | "refunded";

export interface OrderItemRecord {
  id: string;
  courseId: string;
  titleSnapshot: Localized;
  priceSnapshot: Money | null;
}

export interface OrderRecord {
  id: string;
  userId: string;
  status: OrderStatus;
  items: OrderItemRecord[];
  subtotal: Money;
  discountAmount: Money;
  total: Money;
  couponId: string | null;
  couponCode: string | null;
  createdAt: ISODate;
  updatedAt: ISODate;
}

export interface CreateOrderRequest {
  couponCode?: string;
}

export type PaginatedOrders = Paginated<OrderRecord>;
