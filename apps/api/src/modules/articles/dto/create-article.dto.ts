import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsString, IsNotEmpty, IsOptional, IsEnum, IsObject, ValidateNested, IsUrl } from "class-validator";
import { Type } from "class-transformer";
import type { ArticleStatus, Localized } from "@roohbakhsh/shared";

class LocalizedNullableDto {
  @ApiPropertyOptional({ example: "https://cdn.example.com/ar/img.jpg", nullable: true })
  @IsOptional()
  @IsUrl()
  ar!: string | null;

  @ApiPropertyOptional({ example: "https://cdn.example.com/ur/img.jpg", nullable: true })
  @IsOptional()
  @IsUrl()
  ur!: string | null;
}

class LocalizedDto {
  @ApiProperty({ example: "العنوان" })
  @IsString()
  @IsNotEmpty()
  ar!: string;

  @ApiProperty({ example: "عنوان" })
  @IsString()
  @IsNotEmpty()
  ur!: string;
}

export class CreateArticleDto {
  @ApiProperty({ type: LocalizedDto, description: "عنوان مقاله" })
  @IsObject()
  @ValidateNested()
  @Type(() => LocalizedDto)
  title!: Localized;

  @ApiProperty({ description: "اسلاگ یکتا (URL-friendly)", example: "intro-to-fiqh" })
  @IsString()
  @IsNotEmpty()
  slug!: string;

  @ApiProperty({ type: LocalizedDto, description: "خلاصه کوتاه مقاله" })
  @IsObject()
  @ValidateNested()
  @Type(() => LocalizedDto)
  summary!: Localized;

  @ApiProperty({ type: LocalizedDto, description: "متن کامل مقاله" })
  @IsObject()
  @ValidateNested()
  @Type(() => LocalizedDto)
  body!: Localized;

  @ApiPropertyOptional({
    type: LocalizedNullableDto,
    description: "تصویر شاخص مقاله — می‌تواند per locale متفاوت باشد",
    example: { ar: "https://cdn.example.com/ar/img.jpg", ur: "https://cdn.example.com/ur/img.jpg" },
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => LocalizedNullableDto)
  @IsObject()
  thumbnailUrl?: Localized<string | null>;

  @ApiPropertyOptional({ enum: ["draft", "published"], default: "draft" })
  @IsOptional()
  @IsEnum(["draft", "published"])
  status?: ArticleStatus;
}
