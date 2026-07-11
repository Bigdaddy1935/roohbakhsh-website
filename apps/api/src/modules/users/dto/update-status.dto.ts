import { IsBoolean } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateStatusDto {
  @ApiProperty({ example: false, description: "true = فعال، false = غیرفعال (کاربر دیگر نمی‌تواند وارد شود و توکن‌های فعلی او بلافاصله باطل می‌شوند)" })
  @IsBoolean()
  isActive!: boolean;
}
