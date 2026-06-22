import {
  IsString, IsOptional, ValidateNested, IsObject,
  IsUrl, IsInt, Min, IsUUID, IsIn, IsBoolean, IsISO8601,
} from "class-validator";
import { Type } from "class-transformer";
import { ApiPropertyOptional } from "@nestjs/swagger";
import type { UpdateCourseRequest, Localized, Money, ISODate, CourseRunStatus, AccessType } from "@roohbakhsh/shared";

class LocalizedDto implements Localized {
  @ApiPropertyOptional({ example: "تفسير القرآن للمبتدئين" })
  @IsString()
  ar!: string;

  @ApiPropertyOptional({ example: "ابتدائی قرآن کی تفسیر" })
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
  @ApiPropertyOptional({ example: 5000 })
  @IsInt()
  @Min(0)
  amountMinor!: number;

  @ApiPropertyOptional({ example: "IRR", enum: ["USD", "EUR", "IRR"] })
  @IsIn(["USD", "EUR", "IRR"])
  currency!: "USD" | "EUR" | "IRR";
}

export class UpdateCourseDto implements UpdateCourseRequest {
  @ApiPropertyOptional({ type: LocalizedDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => LocalizedDto)
  @IsObject()
  title?: Localized;

  @ApiPropertyOptional({ example: "tafsir-quran-mobtadi" })
  @IsOptional()
  @IsString()
  slug?: string;

  @ApiPropertyOptional({ type: LocalizedDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => LocalizedDto)
  @IsObject()
  description?: Localized;

  @ApiPropertyOptional({
    type: LocalizedNullableDto,
    nullable: true,
    description: "تصویر شاخص دوره — می‌تواند per locale متفاوت باشد",
    example: { ar: "https://cdn.roohbakhsh.com/ar/c01.webp", ur: null },
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => LocalizedNullableDto)
  @IsObject()
  thumbnailUrl?: Localized<string | null>;

  @ApiPropertyOptional({
    type: LocalizedVideoUrlDto,
    nullable: true,
    description: "ویدیوی معرفی دوره — می‌تواند per locale متفاوت باشد",
    example: { ar: "https://cdn.roohbakhsh.com/videos/ar/intro.mp4", ur: null },
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => LocalizedVideoUrlDto)
  @IsObject()
  introVideoUrl?: Localized<string | null>;

  @ApiPropertyOptional({ type: MoneyDto, nullable: true })
  @IsOptional()
  @ValidateNested()
  @Type(() => MoneyDto)
  price?: Money | null;

  @ApiPropertyOptional({ example: "beginner", enum: ["beginner", "intermediate", "advanced"] })
  @IsOptional()
  @IsIn(["beginner", "intermediate", "advanced"])
  level?: "beginner" | "intermediate" | "advanced";

  @ApiPropertyOptional({
    example: "ongoing",
    enum: ["ongoing", "upcoming", "completed"],
    description: "وضعیت برگزاری دوره",
  })
  @IsOptional()
  @IsIn(["ongoing", "upcoming", "completed"])
  runStatus?: CourseRunStatus;

  @ApiPropertyOptional({
    example: "online_only",
    enum: ["online_only", "downloadable"],
    description: "نحوه دسترسی به محتوا",
  })
  @IsOptional()
  @IsIn(["online_only", "downloadable"])
  accessType?: AccessType;

  @ApiPropertyOptional({ example: true, description: "انتشار یا پنهان کردن دوره" })
  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;

  @ApiPropertyOptional({ example: "3fa85f64-5717-4562-b3fc-2c963f66afa6" })
  @IsOptional()
  @IsUUID()
  instructorId?: string;

  @ApiPropertyOptional({ example: "3fa85f64-5717-4562-b3fc-2c963f66afa6", nullable: true })
  @IsOptional()
  @IsUUID()
  categoryId?: string | null;

  @ApiPropertyOptional({
    type: MoneyDto,
    nullable: true,
    description: "قیمت تخفیف‌خورده — null برای حذف تخفیف. باید از قیمت اصلی کمتر باشد.",
    example: { amountMinor: 2500, currency: "USD" },
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => MoneyDto)
  discountPrice?: Money | null;

  @ApiPropertyOptional({
    example: "2026-09-01T00:00:00.000Z",
    nullable: true,
    description: "تاریخ انقضای تخفیف (ISO 8601) — null یعنی تخفیف دائمی است.",
  })
  @IsOptional()
  @IsISO8601()
  discountExpiresAt?: ISODate | null;
}
