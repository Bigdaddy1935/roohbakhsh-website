import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  Unique,
} from "typeorm";
import { Course } from "../../courses/entities/course.entity";

@Entity("cart_items")
@Unique(["userId", "courseId"])
export class CartItem {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ name: "user_id", type: "varchar" })
  userId!: string;

  @Column({ name: "course_id", type: "varchar" })
  courseId!: string;

  @ManyToOne(() => Course, { onDelete: "CASCADE", eager: true })
  course!: Course;

  @CreateDateColumn({ name: "added_at" })
  addedAt!: Date;
}
