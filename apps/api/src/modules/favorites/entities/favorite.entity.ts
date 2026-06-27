import { Entity, PrimaryGeneratedColumn, Column, Index, CreateDateColumn } from "typeorm";
import type { FavoriteType } from "@roohbakhsh/shared";

@Entity("favorites")
@Index(["userId", "type", "targetId"], { unique: true })
export class Favorite {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ name: "user_id", type: "varchar" })
  userId!: string;

  @Column({ type: "enum", enum: ["course", "article"] })
  type!: FavoriteType;

  @Column({ name: "target_id", type: "varchar" })
  targetId!: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;
}
