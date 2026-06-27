import { Entity, PrimaryGeneratedColumn, Column, Index, CreateDateColumn } from "typeorm";

@Entity("notification_reads")
@Index(["userId", "notificationId"], { unique: true })
export class NotificationRead {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ name: "user_id", type: "varchar" })
  userId!: string;

  @Column({ name: "notification_id", type: "varchar" })
  notificationId!: string;

  @CreateDateColumn({ name: "read_at" })
  readAt!: Date;
}
