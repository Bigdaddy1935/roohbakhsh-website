import { ApiProperty } from "@nestjs/swagger";

class LocalizedSchema {
  @ApiProperty({ example: "تفسير القرآن للمبتدئين" }) ar!: string;
  @ApiProperty({ example: "ابتدائی قرآن کی تفسیر" }) ur!: string;
}

class MoneySchema {
  @ApiProperty({ example: 5000 }) amountMinor!: number;
  @ApiProperty({ example: "USD" }) currency!: string;
}

class InstructorSummarySchema {
  @ApiProperty({ example: "3fa85f64-5717-4562-b3fc-2c963f66afa6" }) id!: string;
  @ApiProperty({ example: "sheikh-ahmad" }) slug!: string;
  @ApiProperty({ type: LocalizedSchema }) name!: LocalizedSchema;
  @ApiProperty({ example: "https://cdn.roohbakhsh.com/avatars/ahmad.webp" }) avatarUrl!: string;
}

class CourseDiscountSchema {
  @ApiProperty({ type: MoneySchema, description: "قیمت پس از تخفیف" }) discountedPrice!: MoneySchema;
  @ApiProperty({ example: "2026-09-01T00:00:00.000Z", nullable: true, description: "تاریخ انقضا — null یعنی دائمی" }) expiresAt!: string | null;
  @ApiProperty({ example: true, description: "آیا تخفیف الان فعال است؟" }) isActive!: boolean;
}

export class CourseSchema {
  @ApiProperty({ example: "3fa85f64-5717-4562-b3fc-2c963f66afa6" }) id!: string;
  @ApiProperty({ type: LocalizedSchema }) title!: LocalizedSchema;
  @ApiProperty({ example: "tafsir-quran-mobtadi" }) slug!: string;
  @ApiProperty({ type: LocalizedSchema }) description!: LocalizedSchema;
  @ApiProperty({ example: "https://cdn.roohbakhsh.com/courses/c01.webp", nullable: true }) thumbnailUrl!: string | null;
  @ApiProperty({ type: MoneySchema, nullable: true, description: "قیمت اصلی — null یعنی رایگان" }) price!: MoneySchema | null;
  @ApiProperty({ type: CourseDiscountSchema, nullable: true, description: "تخفیف فعال — null یعنی بدون تخفیف" }) discount!: CourseDiscountSchema | null;
  @ApiProperty({ type: MoneySchema, nullable: true, description: "قیمت واقعی پرداختی (با لحاظ تخفیف فعال)" }) effectivePrice!: MoneySchema | null;
  @ApiProperty({ example: 720 }) durationMinutes!: number;
  @ApiProperty({ example: 12 }) lessonCount!: number;
  @ApiProperty({ example: "beginner", enum: ["beginner", "intermediate", "advanced"] }) level!: string;
  @ApiProperty({ example: false }) isPublished!: boolean;
  @ApiProperty({ example: "3fa85f64-5717-4562-b3fc-2c963f66afa6" }) instructorId!: string;
  @ApiProperty({ type: InstructorSummarySchema }) instructor!: InstructorSummarySchema;
  @ApiProperty({ example: "3fa85f64-5717-4562-b3fc-2c963f66afa6", nullable: true }) categoryId!: string | null;
  @ApiProperty({ example: "2026-06-18T10:00:00.000Z" }) createdAt!: string;
  @ApiProperty({ example: "2026-06-18T10:00:00.000Z" }) updatedAt!: string;
}

export class LessonSchema {
  @ApiProperty({ example: "3fa85f64-5717-4562-b3fc-2c963f66afa6" }) id!: string;
  @ApiProperty({ type: LocalizedSchema }) title!: LocalizedSchema;
  @ApiProperty({ example: 1 }) order!: number;
  @ApiProperty({ example: 45 }) durationMinutes!: number;
  @ApiProperty({ example: false }) isFreePreview!: boolean;
  @ApiProperty({ example: "3fa85f64-5717-4562-b3fc-2c963f66afa6" }) courseId!: string;
  @ApiProperty({ example: "2026-06-18T10:00:00.000Z" }) createdAt!: string;
  @ApiProperty({ example: "2026-06-18T10:00:00.000Z" }) updatedAt!: string;
}
