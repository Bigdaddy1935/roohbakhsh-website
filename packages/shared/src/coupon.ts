import type { ISODate, Money } from "./common";

export type CouponDiscountType = "percentage" | "fixed";

export interface CouponRecord {
  id: string;
  code: string;
  discountType: CouponDiscountType;
  /** percentage: 1-100 | fixed: amountMinor in specified currency */
  discountValue: number;
  currency: "USD" | "EUR" | "IRR" | null;
  maxUses: number | null;
  usedCount: number;
  expiresAt: ISODate | null;
  isActive: boolean;
  createdAt: ISODate;
  updatedAt: ISODate;
}

export interface CreateCouponRequest {
  code: string;
  discountType: CouponDiscountType;
  discountValue: number;
  currency?: "USD" | "EUR" | "IRR";
  maxUses?: number;
  expiresAt?: ISODate;
  isActive?: boolean;
}

export interface UpdateCouponRequest {
  maxUses?: number | null;
  expiresAt?: ISODate | null;
  isActive?: boolean;
}

export interface ValidateCouponRequest {
  code: string;
  orderTotal: Money;
}

export interface ValidateCouponResponse {
  valid: boolean;
  couponId: string;
  code: string;
  discountAmount: Money;
  finalTotal: Money;
}
