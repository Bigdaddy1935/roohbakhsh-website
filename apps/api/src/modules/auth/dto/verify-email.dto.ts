import { IsEmail, IsString, Length } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import type { VerifyEmailRequest } from "@roohbakhsh/shared";

export class VerifyEmailDto implements VerifyEmailRequest {
  @ApiProperty({ example: "user@example.com", description: "Account email" })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: "123456", description: "Six digit email verification code" })
  @IsString()
  @Length(6, 6)
  code!: string;
}
