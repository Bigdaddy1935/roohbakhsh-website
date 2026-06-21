import { IsString, IsOptional, ValidateNested, IsObject, IsInt, Min, IsBoolean } from "class-validator";
import { Type } from "class-transformer";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import type { CreateLessonRequest, Localized } from "@roohbakhsh/shared";

class LocalizedDto implements Localized {
  @ApiProperty({ example: "مقدمة في علوم القرآن" })
  @IsString()
  ar!: string;

  @ApiProperty({ example: "علوم قرآن کا تعارف" })
  @IsString()
  ur!: string;
}

export class CreateLessonDto implements CreateLessonRequest {
  @ApiProperty({ type: LocalizedDto, description: "عنوان درس به عربی و اردو" })
  @ValidateNested()
  @Type(() => LocalizedDto)
  @IsObject()
  title!: Localized;

  @ApiPropertyOptional({ example: 1, description: "ترتیب نمایش درس در دوره (پیش‌فرض ۰)" })
  @IsOptional()
  @IsInt()
  @Min(0)
  order?: number;

  @ApiProperty({ example: 45, description: "مدت زمان درس به دقیقه" })
  @IsInt()
  @Min(0)
  durationMinutes!: number;

  @ApiPropertyOptional({ example: false, description: "آیا این درس برای پیش‌نمایش رایگان است؟ (پیش‌فرض false)" })
  @IsOptional()
  @IsBoolean()
  isFreePreview?: boolean;
}
