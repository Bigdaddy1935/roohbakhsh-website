import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
} from "typeorm";
import { Course } from "../../courses/entities/course.entity";
import { Article } from "../../articles/entities/article.entity";
import { User } from "../../auth/entities/user.entity";

/**
 * یک نظر می‌تواند روی دوره یا مقاله باشد — دقیقاً یکی از courseId/articleId مقدار دارد.
 * MySQL مقادیر NULL را در ایندکس یکتا متمایز در نظر می‌گیرد، پس دو Unique جدا
 * (courseId,userId) و (articleId,userId) با هم تداخلی ندارند.
 */
@Entity("reviews")
@Unique(["courseId", "userId"])
@Unique(["articleId", "userId"])
export class Review {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ name: "course_id", type: "varchar", nullable: true, default: null })
  courseId!: string | null;

  @ManyToOne(() => Course, { onDelete: "CASCADE", nullable: true })
  @JoinColumn({ name: "course_id" })
  course!: Course | null;

  @Column({ name: "article_id", type: "varchar", nullable: true, default: null })
  articleId!: string | null;

  @ManyToOne(() => Article, { onDelete: "CASCADE", nullable: true })
  @JoinColumn({ name: "article_id" })
  article!: Article | null;

  @Column({ name: "user_id", type: "varchar" })
  userId!: string;

  @ManyToOne(() => User, { onDelete: "CASCADE", nullable: false })
  @JoinColumn({ name: "user_id" })
  user!: User;

  @Column({ type: "tinyint", unsigned: true })
  rating!: number;

  @Column({ type: "text", nullable: true, default: null })
  comment!: string | null;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;
}
