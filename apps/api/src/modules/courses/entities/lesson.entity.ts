import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import type { Localized } from "@roohbakhsh/shared";
import { Course } from "./course.entity";
import { Section } from "./section.entity";

@Entity("lessons")
export class Lesson {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "json" })
  title!: Localized;

  @Column({ name: "video_url", type: "json", nullable: true })
  videoUrl!: Localized<string | null> | null;

  @Column({ type: "int", unsigned: true, default: 0 })
  order!: number;

  @Column({ name: "duration_minutes", type: "int", unsigned: true, default: 0 })
  durationMinutes!: number;

  @Column({ name: "is_free_preview", default: false })
  isFreePreview!: boolean;

  @Column({ name: "section_id", type: "varchar" })
  sectionId!: string;

  @ManyToOne(() => Section, (section) => section.lessons, { onDelete: "CASCADE", nullable: false })
  @JoinColumn({ name: "section_id" })
  section!: Section;

  /** denormalized — همیشه برابر section.courseId است؛ برای query راحت‌تر. */
  @Column({ name: "course_id", type: "varchar" })
  courseId!: string;

  @ManyToOne(() => Course, (course) => course.lessons, { onDelete: "CASCADE", nullable: false })
  @JoinColumn({ name: "course_id" })
  course!: Course;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;
}
