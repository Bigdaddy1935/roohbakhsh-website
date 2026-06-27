import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsString, IsNotEmpty, IsOptional, IsEmail } from "class-validator";
import type { CreateTicketRequest } from "@roohbakhsh/shared";

export class CreateTicketDto implements CreateTicketRequest {
  @ApiProperty({ example: "مشکل در پرداخت", description: "موضوع تیکت" })
  @IsString()
  @IsNotEmpty()
  subject!: string;

  @ApiProperty({ example: "هنگام پرداخت با خطای ۵۰۰ مواجه شدم.", description: "متن پیام اول" })
  @IsString()
  @IsNotEmpty()
  body!: string;

  @ApiPropertyOptional({ example: "guest@example.com", description: "ایمیل کاربر مهمان (بدون لاگین)" })
  @IsOptional()
  @IsEmail()
  guestEmail?: string;
}
