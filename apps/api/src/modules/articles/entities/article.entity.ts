import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import type { Localized, ArticleStatus } from "@roohbakhsh/shared";
import { Instructor } from "../../instructor/entities/instructor.entity";
import { Category } from "../../category/entities/category.entity";

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

  @Column({ name: "thumbnail_url", type: "json", nullable: true, default: null })
  thumbnailUrl!: Localized<string | null> | null;

  @ManyToOne(() => Instructor, { onDelete: "RESTRICT", eager: false, nullable: false })
  @JoinColumn({ name: "instructor_id" })
  instructor!: Instructor;

  @Column({ name: "instructor_id", type: "varchar" })
  instructorId!: string;

  @ManyToOne(() => Category, { onDelete: "SET NULL", eager: false, nullable: true })
  @JoinColumn({ name: "category_id" })
  category!: Category | null;

  @Column({ name: "category_id", type: "varchar", nullable: true, default: null })
  categoryId!: string | null;

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
