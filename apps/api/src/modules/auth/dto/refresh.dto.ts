import { IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class RefreshDto {
  @ApiProperty({
    example: "b2e097b1c45c3da0313ca7346eb297e625fa83d0...",
    description:
      "Refresh token دریافت‌شده از login/register. " +
      "اگر کوکی httpOnly در مرورگر موجود باشد نیازی به ارسال دستی نیست.",
  })
  @IsString()
  refreshToken!: string;
}
