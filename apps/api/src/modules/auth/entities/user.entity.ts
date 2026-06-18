import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import type { UserRole } from "@roohbakhsh/shared";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ unique: true })
  email!: string;

  @Column({ name: "password_hash" })
  passwordHash!: string;

  @Column({ name: "full_name" })
  fullName!: string;

  @Column({ type: "varchar", nullable: true, default: null })
  phone!: string | null;

  @Column({
    name: "preferred_locale",
    type: "enum",
    enum: ["ar", "ur"],
    default: "ar",
  })
  preferredLocale!: "ar" | "ur";

  @Column({
    type: "enum",
    enum: ["user", "instructor", "admin"],
    default: "user",
  })
  role!: UserRole;

  @Column({ name: "avatar_url", type: "varchar", nullable: true, default: null })
  avatarUrl!: string | null;

  @Column({ name: "is_active", default: true })
  isActive!: boolean;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;
}
