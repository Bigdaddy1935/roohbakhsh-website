import { IsEmail } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import type { ResendVerificationRequest } from "@roohbakhsh/shared";

export class ResendVerificationDto implements ResendVerificationRequest {
  @ApiProperty({ example: "user@example.com", description: "ایمیل حساب کاربری" })
  @IsEmail()
  email!: string;
}
