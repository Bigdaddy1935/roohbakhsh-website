import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from "typeorm";
import type { Money, Localized } from "@roohbakhsh/shared";

export interface InvoiceItem {
  courseId: string;
  titleSnapshot: Localized;
  priceSnapshot: Money | null;
}

@Entity("invoices")
export class Invoice {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ name: "invoice_number", type: "varchar", unique: true })
  invoiceNumber!: string;

  @Column({ name: "order_id", type: "varchar" })
  orderId!: string;

  @Column({ name: "user_id", type: "varchar" })
  userId!: string;

  @Column({ type: "json" })
  items!: InvoiceItem[];

  @Column({ type: "json" })
  subtotal!: Money;

  @Column({ name: "discount_amount", type: "json" })
  discountAmount!: Money;

  @Column({ type: "json" })
  total!: Money;

  @Column({ name: "coupon_code", type: "varchar", nullable: true, default: null })
  couponCode!: string | null;

  @Column({ name: "payment_ref_id", type: "varchar", nullable: true, default: null })
  paymentRefId!: string | null;

  @CreateDateColumn({ name: "issued_at" })
  issuedAt!: Date;
}
