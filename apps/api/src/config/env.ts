import { plainToInstance } from "class-transformer";
import {
  IsEnum,
  IsInt,
  IsString,
  IsBoolean,
  IsOptional,
  Min,
  validateSync,
} from "class-validator";

enum Environment {
  Development = "development",
  Production = "production",
}

class EnvConfig {
  @IsEnum(Environment)
  NODE_ENV: Environment = Environment.Development;

  @IsInt()
  @Min(1)
  PORT: number = 3001;

  @IsString()
  DB_HOST!: string;

  @IsInt()
  @Min(1)
  DB_PORT: number = 3306;

  @IsString()
  DB_DATABASE!: string;

  @IsString()
  DB_USERNAME!: string;

  @IsString()
  DB_PASSWORD!: string;

  @IsBoolean()
  DB_SYNCHRONIZE: boolean = false;

  @IsString()
  JWT_SECRET!: string;

  @IsString()
  JWT_EXPIRES_IN: string = "7d";

  @IsString()
  ZARINPAL_MERCHANT_ID!: string;

  @IsBoolean()
  ZARINPAL_SANDBOX: boolean = true;

  @IsString()
  PAYMENT_CALLBACK_BASE_URL!: string;

  // ── Mail (SMTP) ──────────────────────────────────────────
  // اختیاری — اگر تنظیم نشود، ایمیل‌ها فقط لاگ می‌شوند (حالت توسعه).

  @IsOptional()
  @IsString()
  SMTP_HOST?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  SMTP_PORT?: number;

  @IsOptional()
  @IsBoolean()
  SMTP_SECURE?: boolean;

  @IsOptional()
  @IsString()
  SMTP_USER?: string;

  @IsOptional()
  @IsString()
  SMTP_PASSWORD?: string;

  @IsOptional()
  @IsString()
  MAIL_FROM?: string;

  @IsString()
  FRONTEND_URL: string = "http://localhost:3000";
}

function validate(config: Record<string, unknown>): EnvConfig {
  const parsed = plainToInstance(EnvConfig, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(parsed, { skipMissingProperties: false });
  if (errors.length > 0) {
    throw new Error(`Config validation error:\n${errors.toString()}`);
  }
  return parsed;
}

export { validate, EnvConfig };
