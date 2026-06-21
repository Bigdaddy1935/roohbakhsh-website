import type { ISODate, Money, Paginated } from "./common";

export type PaymentStatus = "pending" | "paid" | "failed";

export interface PaymentRecord {
  id: string;
  orderId: string;
  userId: string;
  amount: Money;
  status: PaymentStatus;
  authority: string | null;
  refId: string | null;
  gatewayUrl: string | null;
  description: string | null;
  createdAt: ISODate;
  updatedAt: ISODate;
}

export interface InitiatePaymentResponse {
  paymentId: string;
  gatewayUrl: string;
}

export type PaginatedPayments = Paginated<PaymentRecord>;
