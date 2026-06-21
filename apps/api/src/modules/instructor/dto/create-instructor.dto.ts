import { IsString, IsOptional, ValidateNested, IsObject, IsUrl } from "class-validator";
import { Type } from "class-transformer";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import type { CreateInstructorRequest, Localized } from "@roohbakhsh/shared";

class LocalizedDto implements Localized {
  @ApiProperty({ example: "الشيخ أحمد" })
  @IsString()
  ar!: string;

  @ApiProperty({ example: "شیخ احمد" })
  @IsString()
  ur!: string;
}

export class CreateInstructorDto implements CreateInstructorRequest {
  @ApiProperty({ type: LocalizedDto, description: "نام استاد به عربی و اردو" })
  @ValidateNested()
  @Type(() => LocalizedDto)
  @IsObject()
  name!: Localized;

  @ApiProperty({ example: "sheikh-ahmad", description: "شناسه‌ی URL-friendly — یکتا" })
  @IsString()
  slug!: string;

  @ApiPropertyOptional({ example: "https://cdn.roohbakhsh.com/avatars/ahmad.webp", description: "لینک تصویر پروفایل استاد (اختیاری)" })
  @IsOptional()
  @IsUrl()
  avatarUrl?: string;

  @ApiPropertyOptional({ type: LocalizedDto, description: "بیوگرافی کوتاه استاد (اختیاری)" })
  @IsOptional()
  @ValidateNested()
  @Type(() => LocalizedDto)
  @IsObject()
  bio?: Localized;
}
