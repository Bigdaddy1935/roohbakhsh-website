import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, MaxLength } from "class-validator";
import type { ReplyToReviewRequest } from "@roohbakhsh/shared";

export class ReplyReviewDto implements ReplyToReviewRequest {
  @ApiProperty({ example: "ممنون از نظرتون، خوشحالیم که دوره برات مفید بوده.", maxLength: 2000 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  reply!: string;
}
