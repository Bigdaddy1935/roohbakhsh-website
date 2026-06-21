import type { ISODate, Money, Localized, Paginated } from "./common";

export interface InvoiceItemRecord {
  courseId: string;
  titleSnapshot: Localized;
  priceSnapshot: Money | null;
}

export interface InvoiceRecord {
  id: string;
  invoiceNumber: string;
  orderId: string;
  userId: string;
  items: InvoiceItemRecord[];
  subtotal: Money;
  discountAmount: Money;
  total: Money;
  couponCode: string | null;
  paymentRefId: string | null;
  issuedAt: ISODate;
}

export type PaginatedInvoices = Paginated<InvoiceRecord>;
