import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";
import type { NotificationType } from "@roohbakhsh/shared";

/** اعلان global — برای همه‌ی کاربران یکسان. وضعیت خوانده‌شدن در NotificationRead است. */
@Entity("notifications")
export class Notification {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "enum", enum: ["course", "article", "coupon"] })
  type!: NotificationType;

  @Column({ name: "target_id", type: "varchar" })
  targetId!: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;
}
