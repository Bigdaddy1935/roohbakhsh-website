import { ApiProperty } from "@nestjs/swagger";

export class LocalizedSchema {
  @ApiProperty({ example: "علوم القرآن" }) ar!: string;
  @ApiProperty({ example: "علوم قرآن" }) ur!: string;
}

export class CategorySchema {
  @ApiProperty({ example: "3fa85f64-5717-4562-b3fc-2c963f66afa6" }) id!: string;
  @ApiProperty({ type: LocalizedSchema }) name!: LocalizedSchema;
  @ApiProperty({ example: "quran-sciences" }) slug!: string;
  @ApiProperty({ type: LocalizedSchema, nullable: true }) description!: LocalizedSchema | null;
  @ApiProperty({ example: null, nullable: true }) parentId!: string | null;
  @ApiProperty({ example: 0 }) order!: number;
  @ApiProperty({ example: "2026-06-18T10:00:00.000Z" }) createdAt!: string;
  @ApiProperty({ example: "2026-06-18T10:00:00.000Z" }) updatedAt!: string;
}

export class CategoryTreeSchema extends CategorySchema {
  @ApiProperty({ type: [CategoryTreeSchema], description: "زیردسته‌های تو در تو (بی‌نهایت سطح)" })
  children!: CategoryTreeSchema[];
}
