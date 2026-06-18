import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsBoolean, IsDateString, IsInt, IsOptional, Min } from "class-validator";

export class UpdateCouponDto {
  @ApiPropertyOptional({ example: 200 })
  @IsOptional()
  @IsInt()
  @Min(1)
  maxUses?: number | null;

  @ApiPropertyOptional({ example: "2026-12-31T00:00:00.000Z" })
  @IsOptional()
  @IsDateString()
  expiresAt?: string | null;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
