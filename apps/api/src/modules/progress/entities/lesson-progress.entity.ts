import { Entity, PrimaryGeneratedColumn, Column, Index, CreateDateColumn } from "typeorm";

@Entity("lesson_progress")
@Index(["userId", "lessonId"], { unique: true })
export class LessonProgress {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ name: "user_id", type: "varchar" })
  userId!: string;

  @Column({ name: "lesson_id", type: "varchar" })
  lessonId!: string;

  /** denormalized — همیشه برابر lesson.courseId است؛ برای query راحت‌تر. */
  @Column({ name: "course_id", type: "varchar" })
  courseId!: string;

  @CreateDateColumn({ name: "watched_at" })
  watchedAt!: Date;
}
