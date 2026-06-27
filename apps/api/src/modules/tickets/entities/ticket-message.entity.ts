import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from "typeorm";
import type { TicketMessageAuthorType } from "@roohbakhsh/shared";
import { Ticket } from "./ticket.entity";

@Entity("ticket_messages")
export class TicketMessage {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ name: "ticket_id", type: "varchar" })
  ticketId!: string;

  @ManyToOne(() => Ticket, (t) => t.messages, { onDelete: "CASCADE", nullable: false })
  @JoinColumn({ name: "ticket_id" })
  ticket!: Ticket;

  @Column({ type: "text" })
  body!: string;

  @Column({ name: "author_type", type: "enum", enum: ["user", "support"] })
  authorType!: TicketMessageAuthorType;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;
}
