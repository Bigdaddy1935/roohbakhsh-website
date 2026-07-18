import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString, IsEnum } from "class-validator";

export class UpdateUserDto {
  @ApiPropertyOptional({ example: "محمد احمدی" })
  @IsOptional()
  @IsString()
  fullName?: string;

  @ApiPropertyOptional({ example: "+966500000000" })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ example: "https://example.com/avatar.jpg" })
  @IsOptional()
  @IsString()
  avatarUrl?: string;

  @ApiPropertyOptional({ enum: ["ar", "ur"], example: "ar" })
  @IsOptional()
  @IsEnum(["ar", "ur"])
  preferredLocale?: "ar" | "ur";
}
