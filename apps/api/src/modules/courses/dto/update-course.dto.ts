import {
  IsString, IsOptional, ValidateNested, IsObject,
  IsUrl, IsInt, Min, IsUUID, IsIn, IsBoolean,
} from "class-validator";
import { Type } from "class-transformer";
import { ApiPropertyOptional } from "@nestjs/swagger";
import type { UpdateCourseRequest, Localized, Money } from "@roohbakhsh/shared";

class LocalizedDto implements Localized {
  @ApiPropertyOptional({ example: "تفسير القرآن للمبتدئين" })
  @IsString()
  ar!: string;

  @ApiPropertyOptional({ example: "ابتدائی قرآن کی تفسیر" })
  @IsString()
  ur!: string;
}

class MoneyDto implements Money {
  @ApiPropertyOptional({ example: 5000 })
  @IsInt()
  @Min(0)
  amountMinor!: number;

  @ApiPropertyOptional({ example: "USD", enum: ["USD", "EUR"] })
  @IsIn(["USD", "EUR"])
  currency!: "USD" | "EUR";
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

  @ApiPropertyOptional({ example: "https://cdn.roohbakhsh.com/courses/c01.webp", nullable: true })
  @IsOptional()
  @IsUrl()
  thumbnailUrl?: string | null;

  @ApiPropertyOptional({ type: MoneyDto, nullable: true })
  @IsOptional()
  @ValidateNested()
  @Type(() => MoneyDto)
  price?: Money | null;

  @ApiPropertyOptional({ example: 720 })
  @IsOptional()
  @IsInt()
  @Min(0)
  durationMinutes?: number;

  @ApiPropertyOptional({ example: "beginner", enum: ["beginner", "intermediate", "advanced"] })
  @IsOptional()
  @IsIn(["beginner", "intermediate", "advanced"])
  level?: "beginner" | "intermediate" | "advanced";

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
}
