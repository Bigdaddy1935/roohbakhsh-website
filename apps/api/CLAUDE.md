# قوانین بک‌اند (apps/api — NestJS)

> قوانین ریشه (`/CLAUDE.md`) را هم رعایت کن. این‌ها قوانین خاص بک‌اند است.

## مسئولیت این اپ
احراز هویت، حساب کاربری، ثبت‌نام رویداد، Lead، تیکتینگ، و در فاز ۳: پرداخت ارزی، LMS، گواهی، نوتیفیکیشن.
**محتوای دوره/استاد/بلاگ کار این اپ نیست — آن مال CMS است.**

## ساختار
- هر دامنه یک ماژول: `src/<domain>/` شامل `*.controller.ts`, `*.service.ts`, `dto/`, `entities/`.
- منطق در service، نه در controller.

```
src/
  auth/
    entities/       ← user.entity.ts, refresh-token.entity.ts
    dto/            ← register.dto.ts, login.dto.ts, refresh.dto.ts
    guards/         ← jwt-auth.guard.ts
    strategies/     ← jwt.strategy.ts
    auth.controller.ts
    auth.service.ts
    auth.module.ts
  common/
    filters/        ← http-exception.filter.ts (خطاها را به شکل ApiError برمی‌گرداند)
  config/
    env.ts          ← validation متغیرهای محیطی — از اینجا بخوان، نه از process.env مستقیم
  db/
    database.module.ts  ← TypeOrmModule async config
    data-source.ts      ← DataSource برای CLI migration
    migrations/     ← فایل‌های migration اینجا قرار می‌گیرند
```

## Stack دیتابیس
- ORM: **TypeORM** + دیتابیس: **MySQL**
- PK همه‌ی entity‌ها: `uuid` (نه auto-increment integer)
- نام جداول و ستون‌ها: snake_case
- Migration اجباری. هرگز `synchronize: true` در production.

## قواعد API
- خروجی endpoint باید از تایپ `@roohbakhsh/shared` باشد. تایپ محلی نساز.
- ورودی‌ها با DTO و `class-validator` اعتبارسنجی شوند.
- خطاها به شکل `ApiError` (از shared) برگردند — فیلتر سراسری این را handle می‌کند.
- هر controller با `@ApiTags` برچسب بخورد.

## احراز هویت
- توکن JWT در هدر `Authorization: Bearer <accessToken>`.
- جریان: `register/login` → `{accessToken, refreshToken, user}` → `POST /auth/refresh` با refreshToken → توکن جدید.
- Refresh token به‌صورت hash در جدول `refresh_tokens` ذخیره می‌شود (نه plain text).
- مسیرهای محافظت‌شده از `@UseGuards(JwtAuthGuard)` استفاده می‌کنند.

## دستورها
```
pnpm dev                                         # nest start --watch → http://localhost:3001/api
pnpm migration:generate src/db/migrations/<Name> # ساخت migration جدید
pnpm migration:run                               # اجرای migration‌های pending
pnpm migration:revert                            # برگشت آخرین migration
```
