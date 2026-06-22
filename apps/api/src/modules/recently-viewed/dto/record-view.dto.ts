import { IsIn, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import type { RecordViewRequest, RecentViewType } from "@roohbakhsh/shared";

export class RecordViewDto implements RecordViewRequest {
  @ApiProperty({ enum: ["course", "lesson"], example: "course", description: "نوع آیتم بازدیدشده" })
  @IsIn(["course", "lesson"])
  type!: RecentViewType;

  @ApiProperty({ description: "UUID دوره یا درس" })
  @IsString()
  id!: string;
}
