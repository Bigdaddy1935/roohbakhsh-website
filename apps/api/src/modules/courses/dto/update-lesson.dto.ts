import { IsString, IsOptional, ValidateNested, IsObject, IsInt, Min, IsBoolean } from "class-validator";
import { Type } from "class-transformer";
import { ApiPropertyOptional } from "@nestjs/swagger";
import type { UpdateLessonRequest, Localized } from "@roohbakhsh/shared";

class LocalizedDto implements Localized {
  @ApiPropertyOptional({ example: "مقدمة في علوم القرآن" })
  @IsString()
  ar!: string;

  @ApiPropertyOptional({ example: "علوم قرآن کا تعارف" })
  @IsString()
  ur!: string;
}

export class UpdateLessonDto implements UpdateLessonRequest {
  @ApiPropertyOptional({ type: LocalizedDto, description: "عنوان درس" })
  @IsOptional()
  @ValidateNested()
  @Type(() => LocalizedDto)
  @IsObject()
  title?: Localized;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsInt()
  @Min(0)
  order?: number;

  @ApiPropertyOptional({ example: 45 })
  @IsOptional()
  @IsInt()
  @Min(0)
  durationMinutes?: number;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  isFreePreview?: boolean;
}
