import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";
import type { MediaCategory } from "@roohbakhsh/shared";

@Entity("media_items")
export class MediaItem {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar" })
  url!: string;

  @Column({ type: "varchar" })
  filename!: string;

  @Column({ name: "original_name", type: "varchar" })
  originalName!: string;

  @Column({ type: "enum", enum: ["courses", "articles", "staff", "categories", "other"], default: "other" })
  category!: MediaCategory;

  @Column({ type: "enum", enum: ["ar", "ur"], default: "ar" })
  locale!: "ar" | "ur";

  @Column({ type: "int", default: 0 })
  size!: number;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;
}
