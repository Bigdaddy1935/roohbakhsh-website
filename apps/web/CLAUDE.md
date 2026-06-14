# قوانین سایت (apps/web — Next.js App Router)

> قوانین ریشه (`/CLAUDE.md`) را هم رعایت کن. این‌ها قوانین خاص سایت است.

## مسئولیت این اپ
سایت عمومی: لندینگ، صفحه‌ها، دوره‌ها، فرم‌ها، داشبورد کاربری.
محتوا را از **CMS** و کارهای کاربری را از **API ـ NestJS** می‌گیرد (هر دو از طریق `lib/api.ts`).

## چندزبانگی و RTL (مهم‌ترین قانون این اپ)
- مسیرها زباندار: `/ar/...` و `/ur/...` (با `middleware.ts`).
- هر دو زبان RTL. در CSS از خواص logical استفاده کن: `margin-inline`, `padding-inline-start`, `inset-inline`.
- متن ثابت UI → در `messages/ar.json` و `messages/ur.json`، با `useTranslations`.
- متن داده‌ای (عنوان دوره و...) → از `Localized` با `value[locale]`. هرگز hard-code نکن.

## استایل
- فقط از متغیرهای رنگ در `globals.css` استفاده کن (`--bg`, `--brand`, `--cta`, `--ink`). رنگ خام ننویس.
- کارت دوره و دکمه‌ها طبق قانون شماره ۳ ریشه.

## دیتا و API
- همه‌ی فراخوانی‌های API از `lib/api.ts` با تایپ `@roohbakhsh/shared`.
- آدرس بک‌اند از `NEXT_PUBLIC_API_BASE` (در `.env.local`). hard-code نکن.
- ترجیحاً Server Component و fetch سمت سرور؛ `"use client"` فقط وقتی لازم است.

## دستور اجرا
```
pnpm dev   # next dev  →  http://localhost:3000/ar
```
