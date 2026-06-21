import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsDateString,
  IsBoolean,
  Min,
  Max,
  MinLength,
  MaxLength,
} from "class-validator";

export class CreateCouponDto {
  @ApiProperty({ example: "RAMADAN30", description: "کد تخفیف یکتا" })
  @IsString()
  @MinLength(3)
  @MaxLength(64)
  code!: string;

  @ApiProperty({ enum: ["percentage", "fixed"], example: "percentage" })
  @IsEnum(["percentage", "fixed"])
  discountType!: "percentage" | "fixed";

  @ApiProperty({ example: 30, description: "برای percentage: عدد 1-100 | برای fixed: مبلغ به کوچک‌ترین واحد" })
  @IsInt()
  @Min(1)
  discountValue!: number;

  @ApiPropertyOptional({ enum: ["USD", "EUR", "IRR"], description: "برای نوع fixed الزامی است" })
  @IsOptional()
  @IsEnum(["USD", "EUR", "IRR"])
  currency?: "USD" | "EUR" | "IRR";

  @ApiPropertyOptional({ example: 100, description: "حداکثر تعداد استفاده — null یعنی نامحدود" })
  @IsOptional()
  @IsInt()
  @Min(1)
  maxUses?: number;

  @ApiPropertyOptional({ example: "2026-09-01T00:00:00.000Z", description: "تاریخ انقضا — null یعنی دائمی" })
  @IsOptional()
  @IsDateString()
  expiresAt?: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
