import { Entity, PrimaryColumn, Column, UpdateDateColumn } from "typeorm";

@Entity("settings")
export class Setting {
  @PrimaryColumn({ type: "varchar", length: 100 })
  key!: string;

  @Column({ type: "text" })
  value!: string;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;
}
