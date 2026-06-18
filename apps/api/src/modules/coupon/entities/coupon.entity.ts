import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import type { CouponDiscountType } from "@roohbakhsh/shared";

@Entity("coupons")
export class Coupon {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ unique: true, type: "varchar", length: 64 })
  code!: string;

  @Column({ name: "discount_type", type: "enum", enum: ["percentage", "fixed"] })
  discountType!: CouponDiscountType;

  @Column({ name: "discount_value", type: "int", unsigned: true })
  discountValue!: number;

  @Column({ type: "varchar", length: 8, nullable: true, default: null })
  currency!: "USD" | "EUR" | "IRR" | null;

  @Column({ name: "max_uses", type: "int", unsigned: true, nullable: true, default: null })
  maxUses!: number | null;

  @Column({ name: "used_count", type: "int", unsigned: true, default: 0 })
  usedCount!: number;

  @Column({ name: "expires_at", type: "datetime", nullable: true, default: null })
  expiresAt!: Date | null;

  @Column({ name: "is_active", default: true })
  isActive!: boolean;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;
}
