# قوانین بک‌اند (apps/api — NestJS)

> قوانین ریشه (`/CLAUDE.md`) را هم رعایت کن. این‌ها قوانین خاص بک‌اند است.

## مسئولیت این اپ
احراز هویت، حساب کاربری، ثبت‌نام رویداد، Lead، تیکتینگ، و در فاز ۳: پرداخت ارزی، LMS، گواهی، نوتیفیکیشن.
**محتوای دوره/استاد/بلاگ کار این اپ نیست — آن مال CMS است.**

## ساختار
- هر دامنه یک ماژول: `src/<domain>/` شامل `*.controller.ts`, `*.service.ts`, `dto/`.
- منطق در service، نه در controller.

## قواعد API
- خروجی هر endpoint باید از تایپ `@roohbakhsh/shared` باشد (مثل `Paginated<CourseListItem>`). تایپ محلی نساز.
- ورودی‌ها با DTO و `class-validator` اعتبارسنجی شوند.
- خطاها به شکل استاندارد `ApiError` برگردند (statusCode + code + message).
- هر controller با `@ApiTags` برای ظاهر شدن در Swagger.
- مسیرها زیر prefix `api` هستند (در main.ts ست شده).

## دیتابیس
- (در جلسه‌ی قدم ۰ نهایی شود: Postgres + Prisma یا TypeORM.)
- migration برای هر تغییر اسکیما. دستکاری دستی دیتابیس ممنوع.

## امنیت
- توکن JWT در هدر `Authorization: Bearer`.
- هیچ راز/کلیدی در کد hard-code نشود؛ از `.env` بخوان.
- مسیرهای کاربری با guard محافظت شوند.

## دستور اجرا
```
pnpm dev   # nest start --watch  →  http://localhost:3001/api
```
