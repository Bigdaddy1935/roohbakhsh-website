import { IsObject, IsOptional, IsString, IsUrl, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import type { CreateNotificationRequest, Localized } from "@roohbakhsh/shared";

class LocalizedDto implements Localized {
  @ApiProperty({ example: "تخفیف ویژه‌ی نوروزی" })
  @IsString()
  ar!: string;

  @ApiProperty({ example: "نوروزی خاص رعایت" })
  @IsString()
  ur!: string;
}

export class CreateNotificationDto implements CreateNotificationRequest {
  @ApiProperty({ type: LocalizedDto, description: "عنوان اعلان به عربی و اردو" })
  @ValidateNested()
  @Type(() => LocalizedDto)
  @IsObject()
  title!: Localized;

  @ApiProperty({ type: LocalizedDto, description: "متن کامل اعلان به عربی و اردو" })
  @ValidateNested()
  @Type(() => LocalizedDto)
  @IsObject()
  body!: Localized;

  @ApiPropertyOptional({
    example: "https://roohbakhsh.com/courses/intro-to-fiqh-course",
    description: "لینکی که با کلیک روی اعلان باز می‌شود (اختیاری)",
  })
  @IsOptional()
  @IsUrl()
  link?: string | null;
}
