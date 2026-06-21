import { ApiProperty } from "@nestjs/swagger";

class LocalizedSchema {
  @ApiProperty({ example: "الشيخ أحمد" }) ar!: string;
  @ApiProperty({ example: "شیخ احمد" }) ur!: string;
}

export class InstructorSchema {
  @ApiProperty({ example: "3fa85f64-5717-4562-b3fc-2c963f66afa6" }) id!: string;
  @ApiProperty({ type: LocalizedSchema }) name!: LocalizedSchema;
  @ApiProperty({ example: "sheikh-ahmad" }) slug!: string;
  @ApiProperty({ example: "https://cdn.roohbakhsh.com/avatars/ahmad.webp" }) avatarUrl!: string;
  @ApiProperty({ type: LocalizedSchema, nullable: true }) bio!: LocalizedSchema | null;
  @ApiProperty({ example: "2026-06-18T10:00:00.000Z" }) createdAt!: string;
  @ApiProperty({ example: "2026-06-18T10:00:00.000Z" }) updatedAt!: string;
}
