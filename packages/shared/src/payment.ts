import type { ISODate, Money, Paginated } from "./common";

export type PaymentStatus = "pending" | "paid" | "failed";
export type PaymentMethod = "gateway" | "card_to_card";

export interface PaymentRecord {
  id: string;
  orderId: string;
  userId: string;
  amount: Money;
  status: PaymentStatus;
  method: PaymentMethod;
  authority: string | null;
  refId: string | null;
  gatewayUrl: string | null;
  description: string | null;
  /** کد رهگیری تراکنش بانکی — فقط کارت‌به‌کارت */
  trackingCode: string | null;
  /** شماره کارت مبدأ (کارت پرداخت‌کننده) — فقط کارت‌به‌کارت */
  sourceCardNumber: string | null;
  /** زمان انجام تراکنش طبق اعلام کاربر — فقط کارت‌به‌کارت */
  transferredAt: ISODate | null;
  /** لینک تصویر رسید — فقط کارت‌به‌کارت */
  receiptImageUrl: string | null;
  createdAt: ISODate;
  updatedAt: ISODate;
}

export interface InitiatePaymentResponse {
  paymentId: string;
  /** اگر سفارش کاملاً رایگان باشد null است — کاربر نیازی به رفتن به درگاه ندارد. */
  gatewayUrl: string | null;
  /** false یعنی سفارش رایگان بود و بلافاصله paid شد (بدون رفتن به درگاه). */
  requiresPayment: boolean;
}

export type PaginatedPayments = Paginated<PaymentRecord>;

export interface AdminPaymentRecord extends PaymentRecord {
  user: { id: string; fullName: string; email: string } | null;
  courses: { id: string; title: string }[];
}

export type PaginatedAdminPayments = Paginated<AdminPaymentRecord>;

export interface PaymentDestinationAccount {
  bankName: string;
  accountNumber: string;
  cardNumber: string;
  accountHolder: string;
}

export interface SubmitCardToCardPaymentRequest {
  orderId?: string;
  trackingCode: string;
  cardNumber: string;
  transferredAt?: string;
  receiptImageUrl?: string;
}

export interface UploadReceiptResponse {
  paymentId: string;
  url: string;
}
