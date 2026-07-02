import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsString, IsNotEmpty, IsOptional, IsISO8601, MaxLength } from "class-validator";
import type { SubmitCardToCardPaymentRequest } from "@roohbakhsh/shared";

export class SubmitCardToCardDto implements Omit<SubmitCardToCardPaymentRequest, "orderId"> {
  @ApiProperty({ example: "123456789012", description: "کد رهگیری تراکنش بانکی", maxLength: 64 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(64)
  trackingCode!: string;

  @ApiProperty({ example: "6219-8619-1234-5678", description: "شماره کارت مبدأ (کارت پرداخت‌کننده)", maxLength: 32 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(32)
  cardNumber!: string;

  @ApiPropertyOptional({ example: "2026-07-01T10:00:00.000Z", description: "زمان انجام تراکنش" })
  @IsOptional()
  @IsISO8601()
  transferredAt?: string;

  @ApiPropertyOptional({ example: "https://cdn.roohbakhsh.ac/receipts/abc.jpg", description: "لینک تصویر رسید — اگر mode=receipt" })
  @IsOptional()
  @IsString()
  @MaxLength(512)
  receiptImageUrl?: string;
}
