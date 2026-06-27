import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import type { RecentViewType } from "@roohbakhsh/shared";

@Entity("recent_views")
@Index(["userId", "type", "targetId"], { unique: true })
export class RecentView {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ name: "user_id", type: "varchar" })
  userId!: string;

  @Column({ type: "enum", enum: ["course", "lesson"] })
  type!: RecentViewType;

  @Column({ name: "target_id", type: "varchar" })
  targetId!: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  /** هر بار که دوباره بازدید می‌شود، آپدیت می‌شود — برای مرتب‌سازی «آخرین بازدیدها». */
  @UpdateDateColumn({ name: "viewed_at" })
  viewedAt!: Date;
}
