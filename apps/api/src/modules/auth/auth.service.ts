import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { randomBytes, createHash } from "crypto";
import * as bcrypt from "bcrypt";
import type { Response } from "express";
import type { AuthResponse, User as UserContract } from "@roohbakhsh/shared";
import { User } from "./entities/user.entity";
import { RefreshToken } from "./entities/refresh-token.entity";
import { PasswordResetToken } from "./entities/password-reset-token.entity";
import { EmailVerificationToken } from "./entities/email-verification-token.entity";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import { ForgotPasswordDto } from "./dto/forgot-password.dto";
import { ResetPasswordDto } from "./dto/reset-password.dto";
import { VerifyEmailDto } from "./dto/verify-email.dto";
import { ResendVerificationDto } from "./dto/resend-verification.dto";
import { MailService } from "../mail/mail.service";

const REFRESH_TTL_DAYS = 30;
const PASSWORD_RESET_TTL_HOURS = 1;
const EMAIL_VERIFICATION_TTL_HOURS = 24;
const COOKIE_ACCESS = "access_token";
const COOKIE_REFRESH = "refresh_token";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(RefreshToken)
    private readonly refreshRepo: Repository<RefreshToken>,
    @InjectRepository(PasswordResetToken)
    private readonly passwordResetRepo: Repository<PasswordResetToken>,
    @InjectRepository(EmailVerificationToken)
    private readonly emailVerificationRepo: Repository<EmailVerificationToken>,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
    private readonly mailService: MailService,
  ) {}

  async register(dto: RegisterDto, res: Response): Promise<AuthResponse> {
    const exists = await this.userRepo.findOne({ where: { email: dto.email } });
    if (exists) throw new ConflictException("EMAIL_TAKEN");

    const passwordHash = await bcrypt.hash(dto.password, 12);
    const user = this.userRepo.create({
      email: dto.email,
      fullName: dto.fullName,
      phone: dto.phone ?? null,
      preferredLocale: dto.preferredLocale,
      passwordHash,
    });
    await this.userRepo.save(user);
    await this.sendVerificationEmail(user);
    return this.buildAuthResponse(user, res);
  }

  async login(dto: LoginDto, res: Response): Promise<AuthResponse> {
    const user = await this.userRepo.findOne({
      where: { email: dto.email, isActive: true },
    });
    if (!user) throw new UnauthorizedException("INVALID_CREDENTIALS");

    const valid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!valid) throw new UnauthorizedException("INVALID_CREDENTIALS");

    return this.buildAuthResponse(user, res);
  }

  async refresh(rawToken: string, res: Response): Promise<AuthResponse> {
    const hash = this.hashToken(rawToken);
    const stored = await this.refreshRepo.findOne({
      where: { tokenHash: hash },
      relations: { user: true },
    });

    if (!stored || stored.expiresAt < new Date()) {
      throw new UnauthorizedException("INVALID_REFRESH_TOKEN");
    }

    await this.refreshRepo.delete(stored.id);
    return this.buildAuthResponse(stored.user, res);
  }

  async logout(rawToken: string, res: Response): Promise<void> {
    const hash = this.hashToken(rawToken);
    await this.refreshRepo.delete({ tokenHash: hash });
    this.clearCookies(res);
  }

  /** همیشه بدون افشای وجود/عدم‌وجود ایمیل پاسخ می‌دهد (جلوگیری از user enumeration). */
  async forgotPassword(dto: ForgotPasswordDto): Promise<void> {
    const user = await this.userRepo.findOne({ where: { email: dto.email, isActive: true } });
    if (!user) return;

    const rawToken = randomBytes(32).toString("hex");
    const tokenHash = this.hashToken(rawToken);
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + PASSWORD_RESET_TTL_HOURS);

    await this.passwordResetRepo.delete({ userId: user.id });
    await this.passwordResetRepo.save(
      this.passwordResetRepo.create({ tokenHash, user, expiresAt }),
    );

    const frontendUrl = this.config.get<string>("FRONTEND_URL");
    await this.mailService.send({
      to: user.email,
      subject: "بازیابی رمز عبور — آکادمی روح‌بخش",
      html: `<p>برای تعیین رمز عبور جدید روی لینک زیر بزنید (اعتبار ${PASSWORD_RESET_TTL_HOURS} ساعت):</p>
        <p><a href="${frontendUrl}/reset-password?token=${rawToken}">${frontendUrl}/reset-password?token=${rawToken}</a></p>`,
    });
  }

  async resetPassword(dto: ResetPasswordDto): Promise<void> {
    const hash = this.hashToken(dto.token);
    const stored = await this.passwordResetRepo.findOne({
      where: { tokenHash: hash },
      relations: { user: true },
    });

    if (!stored || stored.expiresAt < new Date()) {
      throw new UnauthorizedException("INVALID_RESET_TOKEN");
    }

    stored.user.passwordHash = await bcrypt.hash(dto.newPassword, 12);
    await this.userRepo.save(stored.user);

    await this.passwordResetRepo.delete({ userId: stored.userId });
    // امنیتی: همه‌ی نشست‌های فعال این کاربر باطل می‌شوند چون رمز عوض شده.
    await this.refreshRepo.delete({ userId: stored.userId });
  }

  async verifyEmail(dto: VerifyEmailDto): Promise<void> {
    const hash = this.hashToken(dto.token);
    const stored = await this.emailVerificationRepo.findOne({
      where: { tokenHash: hash },
      relations: { user: true },
    });

    if (!stored || stored.expiresAt < new Date()) {
      throw new UnauthorizedException("INVALID_VERIFICATION_TOKEN");
    }

    stored.user.isEmailVerified = true;
    await this.userRepo.save(stored.user);
    await this.emailVerificationRepo.delete({ userId: stored.userId });
  }

  /** همیشه بدون افشای وجود/عدم‌وجود ایمیل پاسخ می‌دهد (جلوگیری از user enumeration). */
  async resendVerification(dto: ResendVerificationDto): Promise<void> {
    const user = await this.userRepo.findOne({ where: { email: dto.email, isActive: true } });
    if (!user || user.isEmailVerified) return;

    await this.sendVerificationEmail(user);
  }

  // ── helpers ──────────────────────────────────────────────────────────────

  private async sendVerificationEmail(user: User): Promise<void> {
    const rawToken = randomBytes(32).toString("hex");
    const tokenHash = this.hashToken(rawToken);
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + EMAIL_VERIFICATION_TTL_HOURS);

    await this.emailVerificationRepo.delete({ userId: user.id });
    await this.emailVerificationRepo.save(
      this.emailVerificationRepo.create({ tokenHash, user, expiresAt }),
    );

    const frontendUrl = this.config.get<string>("FRONTEND_URL");
    await this.mailService.send({
      to: user.email,
      subject: "تأیید ایمیل — آکادمی روح‌بخش",
      html: `<p>برای تأیید ایمیل خود روی لینک زیر بزنید (اعتبار ${EMAIL_VERIFICATION_TTL_HOURS} ساعت):</p>
        <p><a href="${frontendUrl}/verify-email?token=${rawToken}">${frontendUrl}/verify-email?token=${rawToken}</a></p>`,
    });
  }

  private async buildAuthResponse(user: User, res: Response): Promise<AuthResponse> {
    const accessToken = this.jwtService.sign({ sub: user.id, email: user.email });
    const rawRefresh = randomBytes(40).toString("hex");
    const tokenHash = this.hashToken(rawRefresh);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + REFRESH_TTL_DAYS);

    await this.refreshRepo.save(
      this.refreshRepo.create({ tokenHash, user, expiresAt }),
    );

    this.setCookies(res, accessToken, rawRefresh, expiresAt);

    return {
      accessToken,
      refreshToken: rawRefresh,
      user: this.toContract(user),
    };
  }

  private setCookies(
    res: Response,
    accessToken: string,
    refreshToken: string,
    refreshExpiry: Date,
  ): void {
    const isProd = this.config.get("NODE_ENV") === "production";
    const secure = isProd;

    res.cookie(COOKIE_ACCESS, accessToken, {
      httpOnly: true,
      secure,
      sameSite: "lax",
      // access_token منقضی میشه با JWT خودش — مرورگر را هم هماهنگ می‌کنیم
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7d
    });

    res.cookie(COOKIE_REFRESH, refreshToken, {
      httpOnly: true,
      secure,
      sameSite: "lax",
      maxAge: Math.max(refreshExpiry.getTime() - Date.now(), 0),
      path: "/api/auth/refresh", // فقط برای endpoint تمدید ارسال می‌شود
    });
  }

  private clearCookies(res: Response): void {
    res.clearCookie(COOKIE_ACCESS);
    res.clearCookie(COOKIE_REFRESH, { path: "/api/auth/refresh" });
  }

  private toContract(user: User): UserContract {
    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      phone: user.phone,
      role: user.role,
      preferredLocale: user.preferredLocale,
      avatarUrl: user.avatarUrl,
      isActive: user.isActive,
      isEmailVerified: user.isEmailVerified,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };
  }

  private hashToken(raw: string): string {
    return createHash("sha256").update(raw).digest("hex");
  }
}
