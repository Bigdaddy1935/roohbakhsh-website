import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, Matches } from "class-validator";

export class UpdatePaymentDestinationDto {
  @ApiProperty({ description: "شماره کارت مقصد", example: "6037-XXXX-XXXX-XXXX" })
  @IsString()
  @IsNotEmpty()
  cardNumber!: string;

  @ApiProperty({ description: "نام صاحب حساب", example: "آکادمی بین‌المللی اسلامی روح‌بخش" })
  @IsString()
  @IsNotEmpty()
  accountHolder!: string;

  @ApiProperty({ description: "نام بانک", example: "بانک ملی" })
  @IsString()
  @IsNotEmpty()
  bankName!: string;

  @ApiProperty({ description: "شماره حساب", example: "1234567890", required: false })
  @IsString()
  accountNumber?: string;
}
