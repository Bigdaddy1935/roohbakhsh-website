import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { JwtService } from "@nestjs/jwt";
import { randomBytes, createHash } from "crypto";
import * as bcrypt from "bcrypt";
import type { AuthResponse, User as UserContract } from "@roohbakhsh/shared";
import { User } from "./entities/user.entity";
import { RefreshToken } from "./entities/refresh-token.entity";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";

const REFRESH_TOKEN_TTL_DAYS = 30;

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(RefreshToken)
    private readonly refreshRepo: Repository<RefreshToken>,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto): Promise<AuthResponse> {
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
    return this.buildAuthResponse(user);
  }

  async login(dto: LoginDto): Promise<AuthResponse> {
    const user = await this.userRepo.findOne({ where: { email: dto.email, isActive: true } });
    if (!user) throw new UnauthorizedException("INVALID_CREDENTIALS");

    const valid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!valid) throw new UnauthorizedException("INVALID_CREDENTIALS");

    return this.buildAuthResponse(user);
  }

  async refresh(rawToken: string): Promise<AuthResponse> {
    const hash = this.hashToken(rawToken);
    const stored = await this.refreshRepo.findOne({
      where: { tokenHash: hash },
      relations: { user: true },
    });

    if (!stored || stored.expiresAt < new Date()) {
      throw new UnauthorizedException("INVALID_REFRESH_TOKEN");
    }

    await this.refreshRepo.delete(stored.id);
    return this.buildAuthResponse(stored.user);
  }

  async logout(rawToken: string): Promise<void> {
    const hash = this.hashToken(rawToken);
    await this.refreshRepo.delete({ tokenHash: hash });
  }

  private async buildAuthResponse(user: User): Promise<AuthResponse> {
    const accessToken = this.jwtService.sign({ sub: user.id, email: user.email });
    const rawRefresh = randomBytes(40).toString("hex");
    const tokenHash = this.hashToken(rawRefresh);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + REFRESH_TOKEN_TTL_DAYS);

    await this.refreshRepo.save(
      this.refreshRepo.create({ tokenHash, user, expiresAt }),
    );

    return {
      accessToken,
      refreshToken: rawRefresh,
      user: this.toUserContract(user),
    };
  }

  private toUserContract(user: User): UserContract {
    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      phone: user.phone,
      role: user.role,
      preferredLocale: user.preferredLocale,
      avatarUrl: user.avatarUrl,
      createdAt: user.createdAt.toISOString(),
    };
  }

  private hashToken(raw: string): string {
    return createHash("sha256").update(raw).digest("hex");
  }
}
