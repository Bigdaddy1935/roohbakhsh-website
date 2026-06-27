import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty } from "class-validator";

export class ReplyTicketDto {
  @ApiProperty({ example: "متشکرم، الان بررسی می‌کنم.", description: "متن پاسخ" })
  @IsString()
  @IsNotEmpty()
  body!: string;
}
