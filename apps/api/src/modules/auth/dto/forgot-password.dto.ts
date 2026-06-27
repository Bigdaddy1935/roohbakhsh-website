import { IsEmail } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import type { ForgotPasswordRequest } from "@roohbakhsh/shared";

export class ForgotPasswordDto implements ForgotPasswordRequest {
  @ApiProperty({ example: "user@example.com", description: "ایمیل حساب کاربری" })
  @IsEmail()
  email!: string;
}
