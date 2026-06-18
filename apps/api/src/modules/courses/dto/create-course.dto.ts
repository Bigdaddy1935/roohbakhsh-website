import {
  IsString, IsOptional, ValidateNested, IsObject,
  IsUrl, IsInt, Min, IsUUID, IsIn, IsISO8601, IsBoolean,
} from "class-validator";
import { Type } from "class-transformer";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import type { CreateCourseRequest, Localized, Money, ISODate } from "@roohbakhsh/shared";

class LocalizedDto implements Localized {
  @ApiProperty({ example: "تفسير القرآن للمبتدئين" })
  @IsString()
  ar!: string;

  @ApiProperty({ example: "ابتدائی قرآن کی تفسیر" })
  @IsString()
  ur!: string;
}

class MoneyDto implements Money {
  @ApiProperty({ example: 5000, description: "مبلغ به کوچک‌ترین واحد ارز — مثلاً 5000 یعنی 50.00" })
  @IsInt()
  @Min(0)
  amountMinor!: number;

  @ApiProperty({ example: "USD", enum: ["USD", "EUR"] })
  @IsIn(["USD", "EUR"])
  currency!: "USD" | "EUR";
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

  @ApiPropertyOptional({ example: "https://cdn.roohbakhsh.com/courses/c01.webp", description: "لینک تصویر شاخص دوره" })
  @IsOptional()
  @IsUrl()
  thumbnailUrl?: string;

  @ApiPropertyOptional({ type: MoneyDto, nullable: true, description: "قیمت دوره — null یعنی رایگان" })
  @IsOptional()
  @ValidateNested()
  @Type(() => MoneyDto)
  price?: Money | null;

  @ApiPropertyOptional({ example: "beginner", enum: ["beginner", "intermediate", "advanced"], description: "سطح دوره" })
  @IsOptional()
  @IsIn(["beginner", "intermediate", "advanced"])
  level?: "beginner" | "intermediate" | "advanced";

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
