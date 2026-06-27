import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import type { TicketStatus } from "@roohbakhsh/shared";
import { TicketMessage } from "./ticket-message.entity";

@Entity("tickets")
export class Ticket {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  /** null یعنی تیکت توسط کاربر مهمان (بدون لاگین) ثبت شده. */
  @Column({ name: "user_id", type: "varchar", nullable: true, default: null })
  userId!: string | null;

  @Column({ name: "guest_email", type: "varchar", nullable: true, default: null })
  guestEmail!: string | null;

  @Column()
  subject!: string;

  @Column({
    type: "enum",
    enum: ["open", "answered", "closed"],
    default: "open",
  })
  status!: TicketStatus;

  @OneToMany(() => TicketMessage, (m) => m.ticket, { cascade: ["insert"] })
  messages!: TicketMessage[];

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;
}
