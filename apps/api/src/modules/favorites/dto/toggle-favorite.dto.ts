import { IsIn, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import type { ToggleFavoriteRequest, FavoriteType } from "@roohbakhsh/shared";

export class ToggleFavoriteDto implements ToggleFavoriteRequest {
  @ApiProperty({ enum: ["course", "article"], example: "course", description: "نوع آیتم" })
  @IsIn(["course", "article"])
  type!: FavoriteType;

  @ApiProperty({ description: "UUID دوره یا مقاله" })
  @IsString()
  id!: string;
}
