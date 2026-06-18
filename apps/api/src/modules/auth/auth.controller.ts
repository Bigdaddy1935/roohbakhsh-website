import {
  Controller,
  Post,
  Body,
  Get,
  Delete,
  UseGuards,
  Request,
  Res,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import {
  ApiTags,
  ApiBearerAuth,
  ApiCookieAuth,
  ApiOperation,
  ApiResponse,
  ApiHeader,
  ApiBody,
} from "@nestjs/swagger";
import type { Response } from "express";
import { AuthService } from "./auth.service";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import { RefreshDto } from "./dto/refresh.dto";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { Public } from "./decorators/public.decorator";
import { User } from "./entities/user.entity";
import { AuthResponseSchema, UserSchema } from "../../common/swagger/auth-response.schema";
import { ApiErrorSchema } from "../../common/swagger/api-error.schema";
import { LANG_HEADER } from "../../common/swagger/lang-header";

@ApiTags("auth")
@ApiCookieAuth("access_token")
@ApiBearerAuth()
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // ── Register ────────────────────────────────────────────────────────────

  @Public()
  @Post("register")
  @ApiOperation({
    summary: "ثبت‌نام کاربر جدید",
    description:
      "حساب کاربری جدید می‌سازد و یک جفت توکن (access + refresh) برمی‌گرداند. " +
      "توکن‌ها هم در بدنه‌ی JSON و هم در کوکی `httpOnly` ست می‌شوند. " +
      "مرورگر کوکی را خودکار برای درخواست‌های بعدی می‌فرستد.",
  })
  @ApiHeader(LANG_HEADER)
  @ApiResponse({ status: 201, description: "ثبت‌نام موفق", type: AuthResponseSchema })
  @ApiResponse({ status: 409, description: "ایمیل قبلاً ثبت شده — کد: EMAIL_TAKEN", type: ApiErrorSchema })
  @ApiResponse({ status: 400, description: "خطای اعتبارسنجی فیلدها — کد: VALIDATION_ERROR", type: ApiErrorSchema })
  register(
    @Body() dto: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.register(dto, res);
  }

  // ── Login ────────────────────────────────────────────────────────────────

  @Public()
  @Post("login")
  @ApiOperation({
    summary: "ورود کاربر",
    description:
      "با ایمیل و رمز عبور وارد می‌شود. " +
      "در صورت موفقیت، توکن‌ها هم در JSON و هم در کوکی `httpOnly` ست می‌شوند.",
  })
  @ApiHeader(LANG_HEADER)
  @ApiResponse({ status: 200, description: "ورود موفق", type: AuthResponseSchema })
  @ApiResponse({ status: 401, description: "ایمیل یا رمز اشتباه — کد: INVALID_CREDENTIALS", type: ApiErrorSchema })
  @ApiResponse({ status: 400, description: "خطای اعتبارسنجی — کد: VALIDATION_ERROR", type: ApiErrorSchema })
  login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
    return this.authService.login(dto, res);
  }

  // ── Refresh ──────────────────────────────────────────────────────────────

  @Public()
  @Post("refresh")
  @ApiOperation({
    summary: "تمدید توکن (Rotation)",
    description:
      "با ارسال `refreshToken` (از بدنه یا کوکی)، یک جفت توکن جدید دریافت می‌کند. " +
      "refresh token قدیمی فوری باطل می‌شود (single-use). " +
      "اگر کوکی `refresh_token` در مرورگر موجود باشد، به‌صورت خودکار با `path=/api/auth/refresh` ارسال می‌شود.",
  })
  @ApiHeader(LANG_HEADER)
  @ApiBody({ type: RefreshDto })
  @ApiResponse({ status: 200, description: "توکن‌های جدید", type: AuthResponseSchema })
  @ApiResponse({ status: 401, description: "refresh token نامعتبر یا منقضی — کد: INVALID_REFRESH_TOKEN", type: ApiErrorSchema })
  refresh(
    @Body() dto: RefreshDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.refresh(dto.refreshToken, res);
  }

  // ── Logout ───────────────────────────────────────────────────────────────

  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete("logout")
  @ApiOperation({
    summary: "خروج از حساب",
    description:
      "refresh token را باطل می‌کند و کوکی‌های `access_token` و `refresh_token` را پاک می‌کند. " +
      "برای خروج از همه دستگاه‌ها باید تمام refresh token‌ها را جداگانه باطل کرد.",
  })
  @ApiHeader(LANG_HEADER)
  @ApiBody({ type: RefreshDto })
  @ApiResponse({ status: 204, description: "خروج موفق — بدنه‌ای برنمی‌گردد" })
  @ApiResponse({ status: 401, description: "توکن دسترسی نامعتبر", type: ApiErrorSchema })
  logout(
    @Body() dto: RefreshDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.logout(dto.refreshToken, res);
  }

  // ── Me ───────────────────────────────────────────────────────────────────

  @UseGuards(JwtAuthGuard)
  @Get("me")
  @ApiOperation({
    summary: "اطلاعات کاربر فعلی",
    description:
      "اطلاعات کاربر لاگین‌شده را برمی‌گرداند. " +
      "توکن از کوکی `access_token` یا هدر `Authorization: Bearer` خوانده می‌شود.",
  })
  @ApiHeader(LANG_HEADER)
  @ApiResponse({ status: 200, description: "اطلاعات کاربر", type: UserSchema })
  @ApiResponse({ status: 401, description: "توکن موجود نیست یا منقضی شده", type: ApiErrorSchema })
  me(@Request() req: { user: User }) {
    const { passwordHash: _p, isActive: _a, updatedAt: _u, ...user } = req.user;
    return user;
  }
}
