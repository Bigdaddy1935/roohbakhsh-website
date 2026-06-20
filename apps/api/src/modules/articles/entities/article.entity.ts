import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import type { Localized, ArticleStatus } from "@roohbakhsh/shared";

@Entity("articles")
export class Article {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "json" })
  title!: Localized;

  @Column({ unique: true })
  slug!: string;

  @Column({ type: "json" })
  summary!: Localized;

  @Column({ type: "longtext", name: "body_ar" })
  bodyAr!: string;

  @Column({ type: "longtext", name: "body_ur" })
  bodyUr!: string;

  @Column({ name: "thumbnail_url", type: "varchar", nullable: true, default: null })
  thumbnailUrl!: string | null;

  @Column({ name: "author_id" })
  authorId!: string;

  @Column({
    type: "enum",
    enum: ["draft", "published"],
    default: "draft",
  })
  status!: ArticleStatus;

  @Column({ name: "published_at", type: "datetime", nullable: true, default: null })
  publishedAt!: Date | null;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;
}
