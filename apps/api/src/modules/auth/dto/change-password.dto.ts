import { IsString, MinLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class ChangePasswordDto {
  @ApiProperty({ example: "NewPass456!", description: "رمز عبور جدید (حداقل ۸ کاراکتر)" })
  @IsString()
  @MinLength(8)
  newPassword!: string;
}
