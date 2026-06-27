import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Tree,
  TreeChildren,
  TreeParent,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import type { Localized } from "@roohbakhsh/shared";

@Entity("categories")
@Tree("closure-table")
export class Category {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "json" })
  name!: Localized;

  @Column({ unique: true })
  slug!: string;

  @Column({ type: "json", nullable: true, default: null })
  description!: Localized | null;

  @Column({ name: "thumbnail_url", type: "json", nullable: true, default: null })
  thumbnailUrl!: Localized<string | null> | null;

  @Column({ default: 0 })
  order!: number;

  @TreeChildren()
  children!: Category[];

  @TreeParent({ onDelete: "RESTRICT" })
  parent!: Category | null;

  // والد را در پاسخ‌های flat نگه می‌داریم
  @Column({ name: "parent_id", type: "varchar", nullable: true, default: null })
  parentId!: string | null;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;
}
