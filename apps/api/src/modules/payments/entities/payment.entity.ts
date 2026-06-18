import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import type { Money, PaymentStatus } from "@roohbakhsh/shared";

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

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;
}
