import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsObject, IsInt, IsEnum, Min } from "class-validator";
import { Type } from "class-transformer";

class MoneyDto {
  @ApiProperty({ example: 500000 })
  @IsInt()
  @Min(0)
  amountMinor!: number;

  @ApiProperty({ enum: ["USD", "EUR", "IRR"], example: "IRR" })
  @IsEnum(["USD", "EUR", "IRR"])
  currency!: "USD" | "EUR" | "IRR";
}

export class ValidateCouponDto {
  @ApiProperty({ example: "RAMADAN30" })
  @IsString()
  code!: string;

  @ApiProperty({ type: MoneyDto })
  @IsObject()
  @Type(() => MoneyDto)
  orderTotal!: MoneyDto;
}
