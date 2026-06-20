import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import type { Localized } from "@roohbakhsh/shared";

@Entity("instructors")
export class Instructor {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "json" })
  name!: Localized;

  @Column({ unique: true })
  slug!: string;

  @Column({ name: "avatar_url", type: "varchar", nullable: true, default: null })
  avatarUrl!: string | null;

  @Column({ type: "json", nullable: true, default: null })
  bio!: Localized | null;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;
}
