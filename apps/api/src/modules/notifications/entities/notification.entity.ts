import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";
import type { Localized } from "@roohbakhsh/shared";

/** اعلان global — برای همه‌ی کاربران یکسان. وضعیت خوانده‌شدن در NotificationRead است. */
@Entity("notifications")
export class Notification {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "json" })
  title!: Localized;

  @Column({ type: "json" })
  body!: Localized;

  @Column({ type: "varchar", nullable: true, default: null })
  link!: string | null;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;
}
