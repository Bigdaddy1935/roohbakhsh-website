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

@Entity("lessons")
export class Lesson {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "json" })
  title!: Localized;

  @Column({ type: "int", unsigned: true, default: 0 })
  order!: number;

  @Column({ name: "duration_minutes", type: "int", unsigned: true, default: 0 })
  durationMinutes!: number;

  @Column({ name: "is_free_preview", default: false })
  isFreePreview!: boolean;

  @ManyToOne(() => Course, (course) => course.lessons, { onDelete: "CASCADE", nullable: false })
  @JoinColumn({ name: "course_id" })
  course!: Course;

  @Column({ name: "course_id", type: "varchar" })
  courseId!: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;
}
