import { IsEmail, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import type { LoginRequest } from "@roohbakhsh/shared";

export class LoginDto implements LoginRequest {
  @ApiProperty({ example: "user@example.com", description: "ایمیل ثبت‌شده" })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: "MyPass1234", description: "رمز عبور (حداقل ۸ کاراکتر)" })
  @IsString()
  password!: string;
}
