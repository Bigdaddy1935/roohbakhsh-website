import { IsEnum } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import type { UserRole } from "@roohbakhsh/shared";

export class UpdateRoleDto {
  @ApiProperty({ enum: ["user", "instructor", "admin"], example: "admin" })
  @IsEnum(["user", "instructor", "admin"])
  role!: UserRole;
}
