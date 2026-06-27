import { IsString, IsOptional, IsUUID, IsInt, Min, ValidateNested, IsObject, IsUrl } from "class-validator";
import { Type } from "class-transformer";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import type { CreateCategoryRequest, Localized } from "@roohbakhsh/shared";

class LocalizedDto implements Localized {
  @ApiProperty({ example: "علوم القرآن" })
  @IsString()
  ar!: string;

  @ApiProperty({ example: "علوم قرآن" })
  @IsString()
  ur!: string;
}

class LocalizedNullableDto {
  @ApiPropertyOptional({ example: "https://cdn.roohbakhsh.ac/ar/category.webp", nullable: true })
  @IsOptional()
  @IsUrl()
  ar!: string | null;

  @ApiPropertyOptional({ example: "https://cdn.roohbakhsh.ac/ur/category.webp", nullable: true })
  @IsOptional()
  @IsUrl()
  ur!: string | null;
}

export class CreateCategoryDto implements CreateCategoryRequest {
  @ApiProperty({ type: LocalizedDto, description: "نام دسته به عربی و اردو" })
  @ValidateNested()
  @Type(() => LocalizedDto)
  @IsObject()
  name!: Localized;

  @ApiProperty({ example: "quran-sciences", description: "شناسه‌ی URL-friendly — یکتا" })
  @IsString()
  slug!: string;

  @ApiPropertyOptional({ type: LocalizedDto, description: "توضیح دسته (اختیاری)" })
  @IsOptional()
  @ValidateNested()
  @Type(() => LocalizedDto)
  @IsObject()
  description?: Localized;

  @ApiPropertyOptional({
    type: LocalizedNullableDto,
    description: "تصویر شاخص دسته — می‌تواند per locale متفاوت باشد",
    example: { ar: "https://cdn.roohbakhsh.ac/ar/category.webp", ur: "https://cdn.roohbakhsh.ac/ur/category.webp" },
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => LocalizedNullableDto)
  @IsObject()
  thumbnailUrl?: Localized<string | null>;

  @ApiPropertyOptional({
    example: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    description: "UUID دسته‌ی والد — اگر ارسال نشود، دسته ریشه خواهد بود",
  })
  @IsOptional()
  @IsUUID()
  parentId?: string | null;

  @ApiPropertyOptional({ example: 0, description: "ترتیب نمایش در میان هم‌رده‌ها (پیش‌فرض ۰)" })
  @IsOptional()
  @IsInt()
  @Min(0)
  order?: number;
}
