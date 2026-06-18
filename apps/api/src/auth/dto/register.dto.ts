import { IsEmail, IsEnum, IsOptional, IsString, MinLength } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import type { RegisterRequest } from "@roohbakhsh/shared";

export class RegisterDto implements RegisterRequest {
  @ApiProperty({ example: "user@example.com" })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: "Ahmad Ali" })
  @IsString()
  fullName!: string;

  @ApiPropertyOptional({ example: "+923001234567" })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ minLength: 8 })
  @IsString()
  @MinLength(8)
  password!: string;

  @ApiProperty({ enum: ["ar", "ur"], default: "ar" })
  @IsEnum(["ar", "ur"])
  preferredLocale!: "ar" | "ur";
}
