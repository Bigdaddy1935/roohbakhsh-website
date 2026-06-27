import { IsString, MinLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import type { ResetPasswordRequest } from "@roohbakhsh/shared";

export class ResetPasswordDto implements ResetPasswordRequest {
  @ApiProperty({ description: "توکن خام ارسال‌شده در لینک ایمیل بازیابی" })
  @IsString()
  token!: string;

  @ApiProperty({ example: "NewPass1234", description: "رمز عبور جدید — حداقل ۸ کاراکتر", minLength: 8 })
  @IsString()
  @MinLength(8)
  newPassword!: string;
}
