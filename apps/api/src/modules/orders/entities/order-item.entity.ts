import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
} from "typeorm";
import type { Money, Localized } from "@roohbakhsh/shared";
import { Order } from "./order.entity";

@Entity("order_items")
export class OrderItem {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => Order, (order) => order.items, { onDelete: "CASCADE" })
  order!: Order;

  @Column({ name: "course_id", type: "varchar" })
  courseId!: string;

  @Column({ name: "title_snapshot", type: "json" })
  titleSnapshot!: Localized;

  @Column({ name: "price_snapshot", type: "json", nullable: true, default: null })
  priceSnapshot!: Money | null;
}
