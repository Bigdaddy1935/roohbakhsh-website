import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";
import type { Money, OrderStatus } from "@roohbakhsh/shared";
import { OrderItem } from "./order-item.entity";

@Entity("orders")
export class Order {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ name: "user_id", type: "varchar" })
  userId!: string;

  @Column({ type: "enum", enum: ["pending", "paid", "failed", "cancelled", "refunded"], default: "pending" })
  status!: OrderStatus;

  @Column({ type: "json" })
  subtotal!: Money;

  @Column({ name: "discount_amount", type: "json" })
  discountAmount!: Money;

  @Column({ type: "json" })
  total!: Money;

  @Column({ name: "coupon_id", type: "varchar", nullable: true, default: null })
  couponId!: string | null;

  @Column({ name: "coupon_code", type: "varchar", nullable: true, default: null })
  couponCode!: string | null;

  @OneToMany(() => OrderItem, (item) => item.order, { cascade: true, eager: true })
  items!: OrderItem[];

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;
}
