import { IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import type { VerifyEmailRequest } from "@roohbakhsh/shared";

export class VerifyEmailDto implements VerifyEmailRequest {
  @ApiProperty({ description: "توکن خام ارسال‌شده در لینک ایمیل تأیید" })
  @IsString()
  token!: string;
}
