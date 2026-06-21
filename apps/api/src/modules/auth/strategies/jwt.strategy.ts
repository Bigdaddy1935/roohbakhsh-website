import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import type { Request } from "express";
import { User } from "../entities/user.entity";

interface JwtPayload {
  sub: string;
  email: string;
}

// توکن را اول از کوکی می‌خواند، اگر نبود از هدر Authorization
function extractFromCookieOrBearer(req: Request): string | null {
  const fromCookie = req.cookies?.["access_token"] as string | undefined;
  if (fromCookie) return fromCookie;
  const auth = req.headers.authorization;
  if (auth?.startsWith("Bearer ")) return auth.slice(7);
  return null;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    config: ConfigService,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {
    super({
      jwtFromRequest: extractFromCookieOrBearer,
      secretOrKey: config.getOrThrow<string>("JWT_SECRET"),
      passReqToCallback: false,
    });
  }

  async validate(payload: JwtPayload): Promise<User> {
    const user = await this.userRepo.findOne({
      where: { id: payload.sub, isActive: true },
    });
    if (!user) throw new UnauthorizedException();
    return user;
  }
}
