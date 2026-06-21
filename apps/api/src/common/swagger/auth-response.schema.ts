import { ApiProperty } from "@nestjs/swagger";

export class UserSchema {
  @ApiProperty({ example: "3fa85f64-5717-4562-b3fc-2c963f66afa6" })
  id!: string;

  @ApiProperty({ example: "user@example.com" })
  email!: string;

  @ApiProperty({ example: "Ahmad Ali" })
  fullName!: string;

  @ApiProperty({ example: "+923001234567", nullable: true })
  phone!: string | null;

  @ApiProperty({ enum: ["user", "instructor", "admin"], example: "user" })
  role!: string;

  @ApiProperty({ enum: ["ar", "ur"], example: "ar" })
  preferredLocale!: string;

  @ApiProperty({ example: null, nullable: true })
  avatarUrl!: string | null;

  @ApiProperty({ example: "2026-06-18T10:00:00.000Z" })
  createdAt!: string;
}

export class AuthResponseSchema {
  @ApiProperty({ example: "eyJhbGciOiJIUzI1NiJ9...", description: "JWT — منقضی می‌شود در 7d. هم در بدنه و هم در کوکی httpOnly" })
  accessToken!: string;

  @ApiProperty({ example: "b2e097b1c45c3da0...", description: "Refresh token — منقضی می‌شود در 30d. هم در بدنه و هم در کوکی httpOnly" })
  refreshToken!: string;

  @ApiProperty({ type: UserSchema })
  user!: UserSchema;
}
