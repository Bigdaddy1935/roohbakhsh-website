import {
  IsString, IsOptional, ValidateNested, IsObject,
  IsUrl, IsInt, Min, IsUUID, IsIn, IsISO8601,
} from "class-validator";
import { Type } from "class-transformer";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import type { CreateCourseRequest, Localized, Money, ISODate, CourseRunStatus, AccessType } from "@roohbakhsh/shared";

class LocalizedDto implements Localized {
  @ApiProperty({ example: "تفسير القرآن للمبتدئين" })
  @IsString()
  ar!: string;

  @ApiProperty({ example: "ابتدائی قرآن کی تفسیر" })
  @IsString()
  ur!: string;
}

class LocalizedNullableDto {
  @ApiPropertyOptional({ example: "https://cdn.roohbakhsh.com/ar/c01.webp", nullable: true })
  @IsOptional()
  @IsUrl()
  ar!: string | null;

  @ApiPropertyOptional({ example: "https://cdn.roohbakhsh.com/ur/c01.webp", nullable: true })
  @IsOptional()
  @IsUrl()
  ur!: string | null;
}

class LocalizedVideoUrlDto {
  @ApiPropertyOptional({ example: "https://cdn.roohbakhsh.com/videos/ar/intro.mp4", nullable: true })
  @IsOptional()
  @IsUrl()
  ar!: string | null;

  @ApiPropertyOptional({ example: "https://cdn.roohbakhsh.com/videos/ur/intro.mp4", nullable: true })
  @IsOptional()
  @IsUrl()
  ur!: string | null;
}

class MoneyDto implements Money {
  @ApiProperty({ example: 5000, description: "مبلغ به کوچک‌ترین واحد ارز — مثلاً 5000 یعنی 50.00" })
  @IsInt()
  @Min(0)
  amountMinor!: number;

  @ApiProperty({ example: "IRR", enum: ["USD", "EUR", "IRR"] })
  @IsIn(["USD", "EUR", "IRR"])
  currency!: "USD" | "EUR" | "IRR";
}

export class CreateCourseDto implements CreateCourseRequest {
  @ApiProperty({ type: LocalizedDto, description: "عنوان دوره به عربی و اردو" })
  @ValidateNested()
  @Type(() => LocalizedDto)
  @IsObject()
  title!: Localized;

  @ApiProperty({ example: "tafsir-quran-mobtadi", description: "شناسه‌ی URL-friendly — یکتا" })
  @IsString()
  slug!: string;

  @ApiProperty({ type: LocalizedDto, description: "توضیحات کامل دوره" })
  @ValidateNested()
  @Type(() => LocalizedDto)
  @IsObject()
  description!: Localized;

  @ApiPropertyOptional({
    type: LocalizedNullableDto,
    description: "تصویر شاخص دوره — می‌تواند per locale متفاوت باشد",
    example: { ar: "https://cdn.roohbakhsh.com/ar/c01.webp", ur: "https://cdn.roohbakhsh.com/ur/c01.webp" },
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => LocalizedNullableDto)
  @IsObject()
  thumbnailUrl?: Localized<string | null>;

  @ApiPropertyOptional({
    type: LocalizedVideoUrlDto,
    description: "ویدیوی معرفی دوره — می‌تواند per locale متفاوت باشد",
    example: { ar: "https://cdn.roohbakhsh.com/videos/ar/intro.mp4", ur: "https://cdn.roohbakhsh.com/videos/ur/intro.mp4" },
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => LocalizedVideoUrlDto)
  @IsObject()
  introVideoUrl?: Localized<string | null>;

  @ApiPropertyOptional({ type: MoneyDto, nullable: true, description: "قیمت دوره — null یعنی رایگان" })
  @IsOptional()
  @ValidateNested()
  @Type(() => MoneyDto)
  price?: Money | null;

  @ApiPropertyOptional({ example: "beginner", enum: ["beginner", "intermediate", "advanced"], description: "سطح دوره" })
  @IsOptional()
  @IsIn(["beginner", "intermediate", "advanced"])
  level?: "beginner" | "intermediate" | "advanced";

  @ApiPropertyOptional({
    example: "ongoing",
    enum: ["ongoing", "upcoming", "completed"],
    description: "وضعیت برگزاری: ongoing=در حال برگزاری، upcoming=به زودی، completed=پایان‌یافته",
  })
  @IsOptional()
  @IsIn(["ongoing", "upcoming", "completed"])
  runStatus?: CourseRunStatus;

  @ApiPropertyOptional({
    example: "online_only",
    enum: ["online_only", "downloadable"],
    description: "نحوه دسترسی: online_only=فقط آنلاین، downloadable=قابل دانلود",
  })
  @IsOptional()
  @IsIn(["online_only", "downloadable"])
  accessType?: AccessType;

  @ApiProperty({ example: "3fa85f64-5717-4562-b3fc-2c963f66afa6", description: "UUID استاد دوره" })
  @IsUUID()
  instructorId!: string;

  @ApiPropertyOptional({ example: "3fa85f64-5717-4562-b3fc-2c963f66afa6", nullable: true, description: "UUID دسته‌بندی — اختیاری" })
  @IsOptional()
  @IsUUID()
  categoryId?: string | null;

  @ApiPropertyOptional({
    type: MoneyDto,
    nullable: true,
    description: "قیمت تخفیف‌خورده هنگام ساخت دوره — null یعنی بدون تخفیف",
    example: { amountMinor: 2500, currency: "USD" },
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => MoneyDto)
  discountPrice?: Money | null;

  @ApiPropertyOptional({
    example: "2026-09-01T00:00:00.000Z",
    nullable: true,
    description: "تاریخ انقضای تخفیف (ISO 8601) — null یعنی تخفیف دائمی است",
  })
  @IsOptional()
  @IsISO8601()
  discountExpiresAt?: ISODate | null;
}
