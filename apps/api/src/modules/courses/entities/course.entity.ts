import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import type { Localized, Money } from "@roohbakhsh/shared";
import type { CourseLevel } from "@roohbakhsh/shared";
import { Instructor } from "../../instructor/entities/instructor.entity";
import { Category } from "../../category/entities/category.entity";
import { Lesson } from "./lesson.entity";
import { Section } from "./section.entity";

@Entity("courses")
export class Course {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "json" })
  title!: Localized;

  @Column({ unique: true })
  slug!: string;

  @Column({ type: "json" })
  description!: Localized;

  @Column({ name: "thumbnail_url", type: "varchar", nullable: true, default: null })
  thumbnailUrl!: string | null;

  @Column({ type: "json", nullable: true, default: null })
  price!: Money | null;

  @Column({ name: "duration_minutes", type: "int", unsigned: true, default: 0 })
  durationMinutes!: number;

  @Column({ name: "lesson_count", type: "int", unsigned: true, default: 0 })
  lessonCount!: number;

  @Column({
    type: "enum",
    enum: ["beginner", "intermediate", "advanced"],
    default: "beginner",
  })
  level!: CourseLevel;

  @Column({ name: "is_published", default: false })
  isPublished!: boolean;

  @Column({ name: "discount_price", type: "json", nullable: true, default: null })
  discountPrice!: Money | null;

  @Column({ name: "discount_expires_at", type: "datetime", nullable: true, default: null })
  discountExpiresAt!: Date | null;

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

  @OneToMany(() => Section, (section) => section.course, { cascade: ["insert", "update"] })
  sections!: Section[];

  @OneToMany(() => Lesson, (lesson) => lesson.course, { cascade: ["insert", "update"] })
  lessons!: Lesson[];

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;
}
