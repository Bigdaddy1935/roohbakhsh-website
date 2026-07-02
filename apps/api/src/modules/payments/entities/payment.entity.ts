import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import type { Money, PaymentStatus } from "@roohbakhsh/shared";

export type PaymentMethod = "gateway" | "card_to_card";

@Entity("payments")
export class Payment {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ name: "order_id", type: "varchar" })
  orderId!: string;

  @Column({ name: "user_id", type: "varchar" })
  userId!: string;

  @Column({ type: "json" })
  amount!: Money;

  @Column({ type: "enum", enum: ["pending", "paid", "failed"], default: "pending" })
  status!: PaymentStatus;

  /** ZarinPal authority code — set after initiation */
  @Column({ type: "varchar", nullable: true, default: null })
  authority!: string | null;

  /** ZarinPal RefID — set after successful verification */
  @Column({ name: "ref_id", type: "varchar", nullable: true, default: null })
  refId!: string | null;

  /** Full ZarinPal payment page URL — set after initiation */
  @Column({ name: "gateway_url", type: "varchar", length: 512, nullable: true, default: null })
  gatewayUrl!: string | null;

  @Column({ type: "varchar", length: 512, nullable: true, default: null })
  description!: string | null;

  @Column({ type: "enum", enum: ["gateway", "card_to_card"], default: "gateway" })
  method!: PaymentMethod;

  /** کد رهگیری تراکنش بانکی — فقط کارت‌به‌کارت */
  @Column({ name: "tracking_code", type: "varchar", length: 64, nullable: true, default: null })
  trackingCode!: string | null;

  /** شماره کارت مبدأ (کارت پرداخت‌کننده) — فقط کارت‌به‌کارت */
  @Column({ name: "source_card_number", type: "varchar", length: 32, nullable: true, default: null })
  sourceCardNumber!: string | null;

  /** زمان انجام تراکنش طبق اعلام کاربر — فقط کارت‌به‌کارت */
  @Column({ name: "transferred_at", type: "datetime", nullable: true, default: null })
  transferredAt!: Date | null;

  /** لینک تصویر رسید — فقط کارت‌به‌کارت */
  @Column({ name: "receipt_image_url", type: "varchar", length: 512, nullable: true, default: null })
  receiptImageUrl!: string | null;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;
}
