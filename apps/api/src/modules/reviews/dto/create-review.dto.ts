import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsInt, Min, Max, IsOptional, IsString, MaxLength } from "class-validator";
import type { CreateReviewRequest } from "@roohbakhsh/shared";

export class CreateReviewDto implements CreateReviewRequest {
  @ApiProperty({ example: 5, minimum: 1, maximum: 5, description: "امتیاز از ۱ تا ۵" })
  @IsInt()
  @Min(1)
  @Max(5)
  rating!: number;

  @ApiPropertyOptional({ example: "دوره بسیار مفید و کاربردی بود.", nullable: true, maxLength: 2000 })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  comment?: string | null;
}
