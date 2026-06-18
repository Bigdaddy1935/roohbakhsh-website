import { IsEmail, IsIn, IsOptional, IsString, MinLength } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import type { RegisterRequest } from "@roohbakhsh/shared";

export class RegisterDto implements RegisterRequest {
  @ApiProperty({ example: "user@example.com", description: "ایمیل — باید یکتا باشد" })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: "Ahmad Ali", description: "نام کامل کاربر" })
  @IsString()
  fullName!: string;

  @ApiPropertyOptional({ example: "+923001234567", description: "شماره تلفن همراه (اختیاری)" })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ example: "MyPass1234", description: "رمز عبور — حداقل ۸ کاراکتر", minLength: 8 })
  @IsString()
  @MinLength(8)
  password!: string;

  @ApiProperty({
    enum: ["ar", "ur"],
    default: "ar",
    example: "ar",
    description: "زبان ترجیحی کاربر — بر اساس آن محتوا نمایش داده می‌شود",
  })
  @IsIn(["ar", "ur"], { message: "preferredLocale must be one of: ar, ur" })
  preferredLocale!: "ar" | "ur";
}
