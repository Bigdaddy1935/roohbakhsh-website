import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class CreateOrderDto {
  @ApiPropertyOptional({ example: "RAMADAN30", description: "کد تخفیف (اختیاری)" })
  @IsOptional()
  @IsString()
  couponCode?: string;
}
