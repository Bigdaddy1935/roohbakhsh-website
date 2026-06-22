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
import { User } from "../../auth/entities/user.entity";

@Entity("reviews")
@Unique(["courseId", "userId"])
export class Review {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ name: "course_id", type: "varchar" })
  courseId!: string;

  @ManyToOne(() => Course, { onDelete: "CASCADE", nullable: false })
  @JoinColumn({ name: "course_id" })
  course!: Course;

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
