import { IsString, IsOptional, IsInt, Min, ValidateNested, IsObject } from "class-validator";
import { Type } from "class-transformer";
import { ApiPropertyOptional } from "@nestjs/swagger";
import type { UpdateSectionRequest, Localized } from "@roohbakhsh/shared";

class LocalizedDto implements Localized {
  @ApiPropertyOptional({ example: "مقدمات الفقه" })
  @IsString()
  ar!: string;

  @ApiPropertyOptional({ example: "فقہ کا تعارف" })
  @IsString()
  ur!: string;
}

export class UpdateSectionDto implements UpdateSectionRequest {
  @ApiPropertyOptional({ type: LocalizedDto })
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
}
