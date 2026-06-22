import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from "typeorm";
import { Course } from "../../courses/entities/course.entity";
import { Article } from "../../articles/entities/article.entity";
import { User } from "../../auth/entities/user.entity";

/** یک نظر می‌تواند روی دوره یا مقاله باشد — دقیقاً یکی از courseId/articleId مقدار دارد. هر کاربر می‌تواند چندبار نظر بدهد. */
@Entity("reviews")
export class Review {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Index("idx_reviews_course_id")
  @Column({ name: "course_id", type: "varchar", nullable: true, default: null })
  courseId!: string | null;

  @ManyToOne(() => Course, { onDelete: "CASCADE", nullable: true })
  @JoinColumn({ name: "course_id" })
  course!: Course | null;

  @Index("idx_reviews_article_id")
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

  @Column({ name: "instructor_reply", type: "text", nullable: true, default: null })
  instructorReply!: string | null;

  @Column({ name: "replied_at", type: "datetime", nullable: true, default: null })
  repliedAt!: Date | null;

  /** تا admin تأیید نکند (true)، نظر در لیست‌های عمومی نمایش داده نمی‌شود. */
  @Column({ name: "is_approved", default: false })
  isApproved!: boolean;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;
}
