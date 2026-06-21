import { IsString, IsOptional, ValidateNested, IsObject, IsUrl } from "class-validator";
import { Type } from "class-transformer";
import { ApiPropertyOptional } from "@nestjs/swagger";
import type { UpdateInstructorRequest, Localized } from "@roohbakhsh/shared";

class LocalizedDto implements Localized {
  @ApiPropertyOptional({ example: "الشيخ أحمد" })
  @IsString()
  ar!: string;

  @ApiPropertyOptional({ example: "شیخ احمد" })
  @IsString()
  ur!: string;
}

export class UpdateInstructorDto implements UpdateInstructorRequest {
  @ApiPropertyOptional({ type: LocalizedDto, description: "نام استاد" })
  @IsOptional()
  @ValidateNested()
  @Type(() => LocalizedDto)
  @IsObject()
  name?: Localized;

  @ApiPropertyOptional({ example: "sheikh-ahmad" })
  @IsOptional()
  @IsString()
  slug?: string;

  @ApiPropertyOptional({ example: "https://cdn.roohbakhsh.com/avatars/ahmad.webp" })
  @IsOptional()
  @IsUrl()
  avatarUrl?: string;

  @ApiPropertyOptional({ type: LocalizedDto, description: "بیوگرافی استاد — null برای حذف" })
  @IsOptional()
  @ValidateNested()
  @Type(() => LocalizedDto)
  @IsObject()
  bio?: Localized | null;
}
