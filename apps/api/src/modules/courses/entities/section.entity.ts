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
import type { Localized } from "@roohbakhsh/shared";
import { Course } from "./course.entity";
import { Lesson } from "./lesson.entity";

@Entity("sections")
export class Section {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ name: "course_id", type: "varchar" })
  courseId!: string;

  @ManyToOne(() => Course, (course) => course.sections, { onDelete: "CASCADE", nullable: false })
  @JoinColumn({ name: "course_id" })
  course!: Course;

  @Column({ type: "json" })
  title!: Localized;

  @Column({ type: "int", unsigned: true, default: 0 })
  order!: number;

  @OneToMany(() => Lesson, (lesson) => lesson.section, { cascade: ["insert", "update"] })
  lessons!: Lesson[];

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;
}
