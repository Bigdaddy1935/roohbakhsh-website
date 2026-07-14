import { IsEnum, IsOptional } from "class-validator";
import { ApiPropertyOptional } from "@nestjs/swagger";
import type { MediaCategory } from "@roohbakhsh/shared";

export class UploadMediaDto {
  @ApiPropertyOptional({ enum: ["courses", "articles", "staff", "categories", "other"], default: "other" })
  @IsOptional()
  @IsEnum(["courses", "articles", "staff", "categories", "other"])
  category?: MediaCategory;

  @ApiPropertyOptional({ enum: ["ar", "ur"], default: "ar" })
  @IsOptional()
  @IsEnum(["ar", "ur"])
  locale?: "ar" | "ur";
}
