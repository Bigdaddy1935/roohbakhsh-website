import { IsString, IsOptional, IsInt, Min, ValidateNested, IsObject } from "class-validator";
import { Type } from "class-transformer";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import type { CreateSectionRequest, Localized } from "@roohbakhsh/shared";

class LocalizedDto implements Localized {
  @ApiProperty({ example: "مقدمات الفقه" })
  @IsString()
  ar!: string;

  @ApiProperty({ example: "فقہ کا تعارف" })
  @IsString()
  ur!: string;
}

export class CreateSectionDto implements CreateSectionRequest {
  @ApiProperty({ type: LocalizedDto, description: "عنوان سرفصل به عربی و اردو" })
  @ValidateNested()
  @Type(() => LocalizedDto)
  @IsObject()
  title!: Localized;

  @ApiPropertyOptional({ example: 1, description: "ترتیب نمایش سرفصل در دوره" })
  @IsOptional()
  @IsInt()
  @Min(0)
  order?: number;
}
