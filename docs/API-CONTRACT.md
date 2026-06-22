# قرارداد API — آکادمی روح‌بخش

> این سند **قبل از کدزدن** در جلسه‌ی «قدم ۰» با حضور فرانت‌کار + بک‌اندکار + ناظر پر و تأیید می‌شود.
> بعد از تأیید، این سند **منبع حقیقت** است: بک‌اند طبق آن می‌سازد، فرانت طبق آن مصرف می‌کند.
> هر تغییری در API، اول اینجا و در `packages/shared` ثبت می‌شود، بعد در کد.

## قواعد عمومی

- **Base URL (لوکال):** `http://localhost:3001`
- **Base URL (سرور آلمان / Staging):** `https://api-dev.roohbakhsh.com`
- همه‌ی بدنه‌ها JSON اند.
- احراز هویت به **دو روش** (هر دو معتبر، اولویت با کوکی):
  - **کوکی (توصیه‌شده برای مرورگر):** سرور پس از login/register به‌صورت خودکار کوکی `access_token` (httpOnly, 7d) و `refresh_token` (httpOnly, 30d, فقط روی `/api/auth/refresh`) ست می‌کند. فرانت نیازی به ذخیره‌ی دستی ندارد.
  - **Bearer header (برای کلاینت‌های غیرمرورگر):** `Authorization: Bearer <accessToken>`
- زبان درخواست با هدر: `Accept-Language: ar` یا `ur` (پیش‌فرض `ar`).
- **پیام‌های خطا (`message` و `fields`) بر اساس `Accept-Language` به عربی یا اردو برگردانده می‌شوند.** فیلد `code` همیشه ثابت و ماشین‌خوان است و برای منطق frontend استفاده می‌شود.
- شکل خطا همیشه یکسان است (تایپ `ApiError` در `packages/shared`):
  ```json
  { "statusCode": 400, "code": "EMAIL_TAKEN", "message": "...", "fields": { "email": "..." } }
  ```
- لیست‌ها همیشه `Paginated<T>` برمی‌گردانند:
  ```json
  { "items": [...], "page": 1, "pageSize": 12, "total": 57, "totalPages": 5 }
  ```

## نقشه‌ی منابع: چه چیزی از کجا می‌آید؟

| دامنه | منبع | چرا |
|--------|------|-----|
| دوره‌ها، اساتید، بلاگ، صفحات، مدیا | **CMS** | محتوای قابل‌ویرایش توسط تیم محتوا |
| احراز هویت، حساب کاربری | **NestJS** | منطق امنیتی و کاربری |
| ثبت‌نام رویداد، فرم ایمیل/شماره (Lead) | **NestJS** | داده‌ی تراکنشی |
| تیکتینگ | **NestJS** | داده‌ی تراکنشی |
| پرداخت، LMS، گواهی (فاز ۳) | **NestJS** | منطق کسب‌وکار |

> سایت (Next.js) به **هر دو** وصل می‌شود: محتوا از CMS، کارهای کاربری از NestJS.

---

# بخش ۱ — محتوا (منبع: CMS)

### `GET /api/courses`
لیست دوره‌ها برای صفحه‌ی دوره‌ها.
- **Query:** `page, pageSize, level?, instructorId?, tag?, search?` (تایپ `CourseListQuery`)
- **پاسخ:** `Paginated<CourseListItem>`

### `GET /api/courses/:slug`
جزئیات یک دوره.
- **پاسخ:** `CourseDetail`
- **خطا:** `404 COURSE_NOT_FOUND`

### `GET /api/instructors/:slug`
صفحه‌ی معرفی استاد.
- **پاسخ:** `InstructorDetail`

---

# بخش ۲ — احراز هویت (منبع: NestJS)

### `POST /api/auth/register`
علاوه بر ساخت حساب، یک ایمیل تأیید (لینک با توکن یک‌بارمصرف، اعتبار ۲۴ ساعت) برای کاربر ارسال می‌شود. **ورود مسدود نمی‌شود اگر ایمیل تأیید نشود** — `User.isEmailVerified` فقط برای نمایش هشدار در فرانت است.
- **بدنه:** `RegisterRequest`
- **پاسخ:** `201 AuthResponse` — توکن‌ها هم در بدنه و هم در کوکی برمی‌گردند.
- **خطاها:** `409 EMAIL_TAKEN` | `400 VALIDATION_ERROR`

### `POST /api/auth/login`
- **بدنه:** `LoginRequest`
- **پاسخ:** `200 AuthResponse` — توکن‌ها هم در بدنه و هم در کوکی برمی‌گردند.
- **خطاها:** `401 INVALID_CREDENTIALS` | `400 VALIDATION_ERROR`

### `POST /api/auth/refresh`
توکن‌های جدید صادر می‌کند و refresh token قدیمی را باطل می‌کند (rotation).
- **بدنه:** `{ refreshToken: string }` — اگر کوکی در مرورگر موجود باشد و `Path=/api/auth/refresh` match کند، به‌صورت خودکار ارسال می‌شود.
- **پاسخ:** `200 AuthResponse` — کوکی‌های جدید ست می‌شوند.
- **خطا:** `401 INVALID_REFRESH_TOKEN`

### `DELETE /api/auth/logout`  🔒
- **بدنه:** `{ refreshToken: string }`
- **پاسخ:** `204 No Content` — کوکی‌ها پاک می‌شوند.

### `GET /api/auth/me`  🔒
کاربر فعلی برای داشبورد.
- **پاسخ:** `200 User`
- **خطا:** `401 Unauthorized`

### `POST /api/auth/forgot-password`
درخواست بازیابی رمز عبور. توکن یک‌بارمصرف با اعتبار ۱ ساعت ساخته و لینک بازیابی به ایمیل کاربر ارسال می‌شود (از طریق `MailService` — به‌ربط `docs/API-CONTRACT.md#راه‌اندازی-ایمیل-smtp`).
همیشه پاسخ یکسان برمی‌گرداند — حتی اگر ایمیل ثبت‌نام نشده باشد (جلوگیری از user enumeration).
- **بدنه:** `ForgotPasswordRequest { email }`
- **پاسخ:** `204 No Content`
- **خطا:** `400 VALIDATION_ERROR`

### `POST /api/auth/reset-password`
با توکن خامِ ارسال‌شده در لینک، رمز عبور جدید را ثبت می‌کند. توکن یک‌بارمصرف است و پس از موفقیت تمام refresh tokenهای کاربر باطل می‌شوند (خروج از همه‌ی نشست‌ها).
- **بدنه:** `ResetPasswordRequest { token, newPassword }`
- **پاسخ:** `204 No Content`
- **خطاها:** `401 INVALID_RESET_TOKEN` (توکن نامعتبر/منقضی/استفاده‌شده) | `400 VALIDATION_ERROR`

### `POST /api/auth/verify-email`
با توکن خامِ ارسال‌شده در لینک ایمیل تأیید (که هنگام `register` فرستاده می‌شود)، فیلد `isEmailVerified` کاربر را `true` می‌کند. توکن یک‌بارمصرف با اعتبار ۲۴ ساعت.
**ورود مسدود نمی‌شود اگر ایمیل تأیید نشده باشد** — این فقط برای نمایش وضعیت در فرانت است.
- **بدنه:** `VerifyEmailRequest { token }`
- **پاسخ:** `204 No Content`
- **خطاها:** `401 INVALID_VERIFICATION_TOKEN` | `400 VALIDATION_ERROR`

### `POST /api/auth/resend-verification`
اگر ایمیل وجود داشته باشد و هنوز تأیید نشده باشد، لینک تأیید جدید ارسال می‌شود. همیشه پاسخ یکسان برمی‌گرداند (جلوگیری از user enumeration).
- **بدنه:** `ResendVerificationRequest { email }`
- **پاسخ:** `204 No Content`
- **خطا:** `400 VALIDATION_ERROR`

---

## راه‌اندازی ایمیل (SMTP)

ارسال ایمیل (بازیابی رمز + تأیید ایمیل) از طریق `MailService` در `apps/api/src/modules/mail/mail.service.ts` با کتابخانه‌ی `nodemailer` انجام می‌شود.

- اگر `SMTP_HOST` در فایل env خالی باشد (مقدار پیش‌فرض توسعه)، هیچ ایمیلی واقعاً ارسال نمی‌شود — متن HTML ایمیل فقط در **لاگ سرور** چاپ می‌شود. این یعنی روی لوکال بدون نیاز به SMTP واقعی می‌توانید لینک بازیابی/تأیید را از لاگ کپی کنید.
- برای ارسال واقعی، این متغیرها را در `.env.developer` یا `.env.production` پر کنید:
  ```
  SMTP_HOST=smtp.example.com
  SMTP_PORT=587
  SMTP_SECURE=false
  SMTP_USER=...
  SMTP_PASSWORD=...
  MAIL_FROM=no-reply@roohbakhsh.ac
  FRONTEND_URL=https://roohbakhsh.com   # برای ساخت لینک‌های داخل ایمیل
  ```
- هر سرویس SMTP معتبری کار می‌کند (Mailtrap برای تست، یا یک حساب SMTP واقعی مثل Zoho/SendGrid/Mailgun/Gmail App Password برای production). فقط مقادیر بالا را با همان سرویس پر کنید — کد تغییری لازم ندارد.

---

# بخش ۳ — کاربران (منبع: NestJS)

> همه عملیات فقط برای `role: admin` مجاز است.

### `GET /api/users` 🔒 admin
لیست صفحه‌بندی‌شده کاربران سیستم.
- **Query:** `page` (پیش‌فرض ۱)، `limit` (پیش‌فرض ۱۲، حداکثر ۱۰۰)
- **پاسخ:** `200 Paginated<User>`
- **خطاها:** `401 Unauthorized` | `403 FORBIDDEN`

---

# بخش ۳-ب — دسته‌بندی (منبع: NestJS)

> عملیات نوشتن (POST / PATCH / DELETE) فقط برای `role: admin` مجاز است.
> خواندن (GET) برای همه (بدون توکن) آزاد است.
> `name` و `description` از نوع `Localized` هستند: `{ ar: string, ur: string }`.
> `thumbnailUrl` از نوع `Localized<string | null>` است — مثل دوره‌ها، می‌تواند تصویر متفاوتی برای ar/ur داشته باشد.
> `courseCount` همیشه در پاسخ هست و مستقیماً از تعداد دوره‌هایی که `categoryId` آن‌ها به این دسته اشاره می‌کند محاسبه می‌شود (ستون مجزا در دیتابیس ندارد).

### `GET /api/categories`
لیست مسطح همه دسته‌ها.
- **پاسخ:** `200 Category[]`

### `GET /api/categories/tree`
درخت کامل دسته‌ها با زیردسته‌های تو در تو (عمق نامحدود).
- **پاسخ:** `200 CategoryTree[]`

### `GET /api/categories/:id`
یک دسته با تمام زیردسته‌هایش.
- **پاسخ:** `200 CategoryTree`
- **خطا:** `404 CATEGORY_NOT_FOUND`

### `POST /api/categories` 🔒 admin
ساخت دسته جدید. اگر `parentId` نباشد → دسته ریشه.
- **بدنه:** `CreateCategoryRequest`
- **پاسخ:** `201 Category`
- **خطاها:** `409 SLUG_TAKEN` | `404 PARENT_CATEGORY_NOT_FOUND` | `400 VALIDATION_ERROR`

### `PATCH /api/categories/:id` 🔒 admin
ویرایش جزئی. `parentId: null` → دسته به ریشه تبدیل می‌شود.
- **بدنه:** `UpdateCategoryRequest` (همه فیلدها اختیاری)
- **پاسخ:** `200 Category`
- **خطاها:** `404 CATEGORY_NOT_FOUND / PARENT_CATEGORY_NOT_FOUND` | `409 SLUG_TAKEN` | `400 CIRCULAR_PARENT_REFERENCE / CANNOT_SET_SELF_AS_PARENT`

### `DELETE /api/categories/:id` 🔒 admin
حذف دسته. اگر زیردسته داشته باشد خطا برمی‌گردد.
- **پاسخ:** `204 No Content`
- **خطاها:** `404 CATEGORY_NOT_FOUND` | `400 CATEGORY_HAS_CHILDREN`

---

# بخش ۴ — اساتید (منبع: NestJS)

> عملیات نوشتن (POST / PATCH / DELETE) فقط برای `role: admin` مجاز است.
> خواندن (GET) برای همه (بدون توکن) آزاد است.
> `name` و `bio` از نوع `Localized` هستند: `{ ar: string, ur: string }`.

### `GET /api/instructors`
لیست همه اساتید.
- **پاسخ:** `200 InstructorRecord[]`

### `GET /api/instructors/:id`
مشخصات یک استاد.
- **پاسخ:** `200 InstructorRecord`
- **خطا:** `404 INSTRUCTOR_NOT_FOUND`

### `POST /api/instructors` 🔒 admin
ایجاد استاد جدید.
- **بدنه:** `CreateInstructorRequest`
- **پاسخ:** `201 InstructorRecord`
- **خطاها:** `409 INSTRUCTOR_SLUG_TAKEN` | `400 VALIDATION_ERROR`

### `PATCH /api/instructors/:id` 🔒 admin
ویرایش جزئی استاد.
- **بدنه:** `UpdateInstructorRequest` (همه فیلدها اختیاری)
- **پاسخ:** `200 InstructorRecord`
- **خطاها:** `404 INSTRUCTOR_NOT_FOUND` | `409 INSTRUCTOR_SLUG_TAKEN`

### `DELETE /api/instructors/:id` 🔒 admin
حذف استاد.
- **پاسخ:** `204 No Content`
- **خطا:** `404 INSTRUCTOR_NOT_FOUND`

---

# بخش ۵ — دوره‌ها (منبع: NestJS)

> عملیات نوشتن فقط برای `role: admin` مجاز است. خواندن برای همه آزاد است.
> `title`، `description` از نوع `Localized` هستند.
> `price` از نوع `Money`: `{ amountMinor: number, currency: "USD"|"EUR"|"IRR" }` — `null` یعنی رایگان.
> `level` یکی از: `"beginner" | "intermediate" | "advanced"`.
> `runStatus` یکی از: `"ongoing"` (در حال برگزاری) | `"upcoming"` (به زودی) | `"completed"` (پایان‌یافته). پیش‌فرض: `upcoming`.
> `accessType` یکی از: `"online_only"` (فقط آنلاین) | `"downloadable"` (قابل دانلود). پیش‌فرض: `online_only`.
> `participantCount` تعداد کاربران یکتایی است که این دوره را با سفارش `paid` خریده‌اند — مستقیماً از `order_items`+`orders` محاسبه می‌شود (denormalize نشده، مثل `lessonCount`).
> `introVideoUrl` ویدیوی معرفی دوره است — از نوع `Localized<string | null>`، دقیقاً مثل `thumbnailUrl` دو زبانه است و می‌تواند `null` باشد.

### `GET /api/courses`
لیست صفحه‌بندی‌شده دوره‌ها با اطلاعات خلاصه استاد.
- **Query:** `page` (پیش‌فرض ۱)، `limit` (پیش‌فرض ۱۲، حداکثر ۱۰۰)
- **پاسخ:** `200 Paginated<CourseRecord>`

### `GET /api/courses/:slug`
مشخصات یک دوره با slug آن.
- **پاسخ:** `200 CourseRecord`
- **خطا:** `404 COURSE_NOT_FOUND`

### `POST /api/courses` 🔒 admin
ایجاد دوره جدید. دوره در حالت پنهان (`isPublished: false`) ایجاد می‌شود.
- **بدنه:** `CreateCourseRequest`
- **پاسخ:** `201 CourseRecord`
- **خطاها:** `409 COURSE_SLUG_TAKEN` | `404 INSTRUCTOR_NOT_FOUND / CATEGORY_NOT_FOUND` | `400 VALIDATION_ERROR`

### `PATCH /api/courses/:id` 🔒 admin
ویرایش جزئی دوره. برای انتشار `isPublished: true` بفرست.

**تنظیم تخفیف:**
- `discountPrice: Money` — قیمت تخفیف‌خورده؛ `null` برای حذف تخفیف
- `discountExpiresAt: ISODate` — تاریخ انقضا؛ `null` یعنی تخفیف دائمی

- **بدنه:** `UpdateCourseRequest` (همه فیلدها اختیاری)
- **پاسخ:** `200 CourseRecord`
- **خطاها:** `404 COURSE_NOT_FOUND / INSTRUCTOR_NOT_FOUND` | `409 COURSE_SLUG_TAKEN`

**فیلدهای تخفیف در پاسخ دوره:**
```
discount: {
  discountedPrice: Money,   // قیمت تخفیف‌خورده
  expiresAt: ISODate|null,  // null = دائمی
  isActive: boolean         // true اگر انقضا نداشته باشد یا منقضی نشده باشد
}
effectivePrice: Money|null  // قیمت واقعی: discountedPrice (اگر isActive) وگرنه price
```

### `DELETE /api/courses/:id` 🔒 admin
حذف دوره و تمام درس‌های آن (cascade).
- **پاسخ:** `204 No Content`
- **خطا:** `404 COURSE_NOT_FOUND`

---

# بخش ۶ — سرفصل‌ها (منبع: NestJS)

> ساختار محتوا: **دوره → سرفصل → درس**
> هر دوره یک یا چند سرفصل دارد. هر سرفصل یک یا چند درس دارد.
> عملیات نوشتن فقط برای `role: admin` مجاز است. خواندن برای همه آزاد است.
> `title` از نوع `Localized` است: `{ ar: string, ur: string }`.

### `GET /api/courses/:courseSlug/sections`
تمام سرفصل‌های یک دوره به‌ترتیب `order`، همراه با درس‌هایشان.
- **پاسخ:** `200 SectionRecord[]`
- **خطا:** `404 COURSE_NOT_FOUND`

### `GET /api/courses/:courseSlug/sections/:sectionId`
یک سرفصل با تمام درس‌هایش.
- **پاسخ:** `200 SectionRecord`
- **خطاها:** `404 COURSE_NOT_FOUND / SECTION_NOT_FOUND`

### `POST /api/courses/:courseSlug/sections` 🔒 admin
ایجاد سرفصل جدید برای دوره.
- **بدنه:** `CreateSectionRequest` — `{ title: Localized, order?: number }`
- **پاسخ:** `201 SectionRecord`
- **خطاها:** `404 COURSE_NOT_FOUND` | `400 VALIDATION_ERROR`

### `PATCH /api/courses/:courseSlug/sections/:sectionId` 🔒 admin
ویرایش عنوان یا ترتیب سرفصل.
- **بدنه:** `UpdateSectionRequest` — `{ title?: Localized, order?: number }`
- **پاسخ:** `200 SectionRecord`
- **خطاها:** `404 COURSE_NOT_FOUND / SECTION_NOT_FOUND` | `400 VALIDATION_ERROR`

### `DELETE /api/courses/:courseSlug/sections/:sectionId` 🔒 admin
حذف سرفصل و تمام درس‌های آن (cascade).
- **پاسخ:** `204 No Content`
- **خطاها:** `404 COURSE_NOT_FOUND / SECTION_NOT_FOUND`

### SectionRecord
```json
{
  "id": "uuid",
  "courseId": "uuid",
  "title": { "ar": "مقدمة", "ur": "تعارف" },
  "order": 1,
  "lessons": [ /* Lesson[] — بدون pagination */ ],
  "createdAt": "...", "updatedAt": "..."
}
```

---

# بخش ۶-ب — درس‌ها (منبع: NestJS)

> درس‌ها زیر سرفصل قرار دارند. مسیر کامل: `/api/courses/:courseSlug/sections/:sectionId/lessons`
> پس از هر تغییر درس، `lessonCount` و `durationMinutes` دوره به‌صورت خودکار sync می‌شوند.
> `title` از نوع `Localized` است.

### `GET /api/courses/:courseSlug/sections/:sectionId/lessons`
لیست صفحه‌بندی‌شده درس‌های یک سرفصل به‌ترتیب `order`.
- **Query:** `page` (پیش‌فرض ۱)، `limit` (پیش‌فرض ۵۰، حداکثر ۱۰۰)
- **پاسخ:** `200 Paginated<Lesson>`
- **خطاها:** `404 COURSE_NOT_FOUND / SECTION_NOT_FOUND`

### `GET /api/courses/:courseSlug/sections/:sectionId/lessons/:lessonId`
مشخصات یک درس.
- **پاسخ:** `200 Lesson`
- **خطاها:** `404 COURSE_NOT_FOUND / SECTION_NOT_FOUND / LESSON_NOT_FOUND`

### `POST /api/courses/:courseSlug/sections/:sectionId/lessons` 🔒 admin
افزودن درس به سرفصل.
- **بدنه:** `CreateLessonRequest`
- **پاسخ:** `201 Lesson`
- **خطاها:** `404 COURSE_NOT_FOUND / SECTION_NOT_FOUND` | `400 VALIDATION_ERROR`

### `PATCH /api/courses/:courseSlug/sections/:sectionId/lessons/:lessonId` 🔒 admin
ویرایش جزئی درس.
- **بدنه:** `UpdateLessonRequest` (همه فیلدها اختیاری)
- **پاسخ:** `200 Lesson`
- **خطاها:** `404 COURSE_NOT_FOUND / SECTION_NOT_FOUND / LESSON_NOT_FOUND`

### `DELETE /api/courses/:courseSlug/sections/:sectionId/lessons/:lessonId` 🔒 admin
حذف درس.
- **پاسخ:** `204 No Content`
- **خطاها:** `404 COURSE_NOT_FOUND / SECTION_NOT_FOUND / LESSON_NOT_FOUND`

### Lesson object
```json
{
  "id": "uuid",
  "title": { "ar": "الدرس الأول", "ur": "پہلا سبق" },
  "videoUrl": { "ar": "https://cdn.roohbakhsh.com/videos/ar/lesson01.mp4", "ur": "https://cdn.roohbakhsh.com/videos/ur/lesson01.mp4" },
  "order": 1,
  "durationMinutes": 20,
  "isFreePreview": true,
  "sectionId": "uuid",
  "courseId": "uuid",
  "createdAt": "...", "updatedAt": "..."
}
```
`videoUrl` می‌تواند `null` باشد (هنوز ویدیو آپلود نشده) — مثل `thumbnailUrl` دوره دو زبانه است.

---

# بخش ۷ — سرنخ و رویداد (منبع: NestJS — فاز ۱)

### `POST /api/leads`
فرم جمع‌آوری ایمیل/شماره.
- **بدنه:** `LeadRequest`
- **پاسخ:** `Lead`

### `POST /api/events/:eventId/register`
ثبت‌نام در رویداد/کلاس.
- **بدنه:** `EventRegistrationRequest`
- **پاسخ:** `EventRegistration`

---

# بخش ۸ — تیکتینگ (منبع: NestJS — فاز ۱)

### `POST /api/tickets`
- **بدنه:** `CreateTicketRequest` (مهمان هم می‌تواند با `guestEmail`)
- **پاسخ:** `Ticket`

### `GET /api/tickets` 🔒
تیکت‌های کاربر فعلی.
- **پاسخ:** `Paginated<Ticket>`

### `POST /api/tickets/:ticketId/reply` 🔒
- **بدنه:** `ReplyTicketRequest`
- **پاسخ:** `Ticket`

---

## نمونه‌ی واقعی یک تبادل

درخواست فرانت برای لیست دوره‌ها:
```
GET /api/courses?page=1&pageSize=12&level=beginner
Accept-Language: ar
```
پاسخ بک‌اند:
```json
{
  "items": [
    {
      "id": "c_01",
      "slug": "tafsir-quran-mobtadi",
      "title": { "ar": "تفسير القرآن للمبتدئين", "ur": "ابتدائی قرآن کی تفسیر" },
      "excerpt": { "ar": "دورة تمهيدية...", "ur": "تعارفی کورس..." },
      "thumbnailUrl": "https://cdn.roohbakhsh.com/c01.webp",
      "level": "beginner",
      "price": { "amountMinor": 0, "currency": "USD" },
      "instructor": {
        "id": "i_01", "slug": "seyed-kazem",
        "name": { "ar": "السيد كاظم", "ur": "سید کاظم" },
        "avatarUrl": "https://cdn.roohbakhsh.com/i01.webp"
      },
      "hasFreePreview": true
    }
  ],
  "page": 1, "pageSize": 12, "total": 1, "totalPages": 1
}
```

---

## §7 — Coupons

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/coupons` | Admin | Paginated list of all coupons |
| GET | `/coupons/:id` | Admin | Get coupon by ID |
| POST | `/coupons` | Admin | Create a coupon |
| PATCH | `/coupons/:id` | Admin | Update maxUses / expiresAt / isActive |
| DELETE | `/coupons/:id` | Admin | Delete coupon |
| POST | `/coupons/validate` | Public | Validate a coupon code + compute discount |

### Coupon object
```json
{
  "id": "uuid",
  "code": "RAMADAN30",
  "discountType": "percentage",
  "discountValue": 30,
  "currency": null,
  "maxUses": 100,
  "usedCount": 12,
  "expiresAt": "2026-09-01T00:00:00.000Z",
  "isActive": true,
  "createdAt": "...", "updatedAt": "..."
}
```

### POST /coupons/validate — request
```json
{ "code": "RAMADAN30", "orderTotal": { "amountMinor": 500000, "currency": "IRR" } }
```
### POST /coupons/validate — response
```json
{
  "valid": true, "couponId": "uuid", "code": "RAMADAN30",
  "discountAmount": { "amountMinor": 150000, "currency": "IRR" },
  "finalTotal": { "amountMinor": 350000, "currency": "IRR" }
}
```

---

## §8 — Cart

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/cart` | User | Get current user cart |
| POST | `/cart/items` | User | Add course to cart |
| DELETE | `/cart/items/:courseId` | User | Remove course from cart |
| DELETE | `/cart` | User | Clear entire cart |

### Cart response
```json
{
  "items": [
    {
      "courseId": "uuid",
      "title": { "ar": "...", "ur": "..." },
      "thumbnailUrl": "https://...",
      "effectivePrice": { "amountMinor": 350000, "currency": "IRR" },
      "addedAt": "2026-06-18T10:00:00.000Z"
    }
  ],
  "total": { "amountMinor": 350000, "currency": "IRR" }
}
```

---

## §9 — Orders

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/orders` | User | Create order from cart (optional couponCode) |
| GET | `/orders/mine` | User | List current user orders (paginated) |
| GET | `/orders/mine/:id` | User | Get order detail |
| GET | `/orders` | Admin | List all orders (paginated) |

### POST /orders — request
```json
{ "couponCode": "RAMADAN30" }
```

### Order object
```json
{
  "id": "uuid", "userId": "uuid", "status": "pending",
  "items": [
    {
      "id": "uuid", "courseId": "uuid",
      "titleSnapshot": { "ar": "...", "ur": "..." },
      "priceSnapshot": { "amountMinor": 500000, "currency": "IRR" }
    }
  ],
  "subtotal":       { "amountMinor": 500000, "currency": "IRR" },
  "discountAmount": { "amountMinor": 150000, "currency": "IRR" },
  "total":          { "amountMinor": 350000, "currency": "IRR" },
  "couponId": "uuid", "couponCode": "RAMADAN30",
  "createdAt": "...", "updatedAt": "..."
}
```
**Order statuses:** `pending` → `paid` | `failed` | `cancelled` | `refunded`

---

## §10 — Payments (ZarinPal)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/payments/initiate/:orderId` | User | Start payment — returns ZarinPal gateway URL |
| GET | `/payments/verify` | Public | ZarinPal callback — verifies payment |
| GET | `/payments/logs` | Admin | All payment logs (paginated) |
| GET | `/payments/mine` | User | Current user payment history |

### POST /payments/initiate/:orderId — response
```json
{ "paymentId": "uuid", "gatewayUrl": "https://www.zarinpal.com/pg/StartPay/AUTHORITY", "requiresPayment": true }
```
→ Frontend redirects user to `gatewayUrl`.

**سفارش کاملاً رایگان** (مثلاً فقط دوره‌های رایگان در سبد — `price: null`، یعنی `order.total.amountMinor === 0`):
بدون رفتن به درگاه ZarinPal، فوراً تکمیل می‌شود:
```json
{ "paymentId": "uuid", "gatewayUrl": null, "requiresPayment": false }
```
سفارش بلافاصله `status: "paid"` می‌شود و فاکتور با `paymentRefId: "FREE"` ساخته می‌شود. فرانت اگر `requiresPayment: false` دید، نباید ریدایرکت کند — فقط پیام موفقیت نشان دهد.

### GET /payments/verify?Authority=...&Status=OK — response
```json
{ "message": "PAYMENT_SUCCESS", "refId": "123456789" }
```
ZarinPal posts `Authority` + `Status` (OK | NOK) to this URL.  
Amount must be in **Rials (IRR)**. Use `Money.amountMinor` with `currency: "IRR"` for course pricing.

### Payment log object
```json
{
  "id": "uuid", "orderId": "uuid", "userId": "uuid",
  "amount": { "amountMinor": 350000, "currency": "IRR" },
  "status": "paid",
  "authority": "A00000000000000000000000000000000000",
  "refId": "123456789",
  "gatewayUrl": "https://www.zarinpal.com/pg/StartPay/...",
  "description": "Order uuid",
  "createdAt": "...", "updatedAt": "..."
}
```

---

## ۸. Invoices (فاکتور)

فاکتور به‌صورت خودکار پس از تأیید موفق پرداخت ساخته می‌شود.  
شماره فاکتور: `INV-YYYYMMDD-XXXX`

| روت | Auth | توضیح |
|-----|------|-------|
| `GET /invoices/mine` | user | لیست فاکتورهای کاربر (paginated) |
| `GET /invoices/mine/:invoiceNumber` | user (owner) | جزئیات یک فاکتور |

### Invoice object
```json
{
  "id": "uuid",
  "invoiceNumber": "INV-20260620-0001",
  "orderId": "uuid",
  "userId": "uuid",
  "items": [
    {
      "courseId": "uuid",
      "titleSnapshot": { "ar": "...", "ur": "..." },
      "priceSnapshot": { "amountMinor": 1000000, "currency": "IRR" }
    }
  ],
  "subtotal":      { "amountMinor": 3000000, "currency": "IRR" },
  "discountAmount":{ "amountMinor":  600000, "currency": "IRR" },
  "total":         { "amountMinor": 2400000, "currency": "IRR" },
  "couponCode": "ROOH20",
  "paymentRefId": "123456789",
  "issuedAt": "2026-06-20T10:00:00.000Z"
}
```

---

## §11 — Articles (مقالات)

### روت‌ها

| Method | Path | Auth | توضیح |
|--------|------|------|-------|
| `GET` | `/articles` | Public | لیست مقالات published (صفحه‌بندی) |
| `GET` | `/articles/:slug` | Public | دریافت مقاله با slug (فقط published) |
| `GET` | `/articles/admin/all` | Admin | لیست همه مقالات (draft + published) |
| `POST` | `/articles` | Admin | ایجاد مقاله جدید |
| `PATCH` | `/articles/:id` | Admin | ویرایش مقاله |
| `DELETE` | `/articles/:id` | Admin | حذف مقاله |

### شیء ArticleRecord

```ts
interface ArticleRecord {
  id: string;            // UUID
  title: Localized;      // { ar, ur }
  slug: string;          // URL-friendly، یکتا
  summary: Localized;    // { ar, ur } — خلاصه کوتاه
  body: Localized;       // { ar, ur } — متن کامل
  thumbnailUrl: Localized<string | null>;
  instructorId: string;        // UUID استاد نویسنده — از همان جدول instructors که دوره‌ها استفاده می‌کنند
  instructor: InstructorSummary;
  categoryId: string | null;   // UUID دسته‌بندی — اختیاری، از همان جدول categories که دوره‌ها استفاده می‌کنند
  status: "draft" | "published";
  publishedAt: ISODate | null;  // null اگر هنوز draft باشد
  createdAt: ISODate;
  updatedAt: ISODate;
}
```

### نکات

- `instructorId` باید UUID یک استاد موجود در `/instructors` باشد؛ وگرنه `404 INSTRUCTOR_NOT_FOUND`
- `categoryId` اختیاری است؛ اگر ارسال شود باید UUID یک دسته موجود در `/categories` باشد، وگرنه `404 CATEGORY_NOT_FOUND`
- `GET /articles/:slug` فقط مقالات `published` را برمی‌گرداند؛ draft → 404
- در `POST /articles` اگر `status: "published"` باشد، `publishedAt` همان لحظه ست می‌شود
- `PATCH /articles/:id` می‌تواند slug را تغییر دهد؛ اگر slug تکراری باشد → 409 `SLUG_ALREADY_EXISTS`
- `publishedAt` فقط یک‌بار (اولین publish) ست می‌شود و با PATCH دستی تغییر نمی‌کند

---

## §12 — Reviews (نظر و امتیاز دوره و مقاله)

### روت‌ها

| Method | Path | Auth | توضیح |
|--------|------|------|-------|
| `GET` | `/courses/:courseSlug/reviews` | Public (auth اختیاری) | لیست نظرات تأییدشده‌ی دوره (صفحه‌بندی)؛ اگر کاربر لاگین باشد، نظرات تأییدنشده‌ی خودش هم در نتیجه می‌آید |
| `POST` | `/courses/:courseSlug/reviews` | کاربر لاگین‌شده | ثبت نظر — هیچ محدودیتی در تعداد نیست، کاربر می‌تواند چندبار نظر بدهد |
| `PATCH` | `/courses/:courseSlug/reviews/:reviewId` | صاحب نظر | ویرایش نظر خودم |
| `DELETE` | `/courses/:courseSlug/reviews/:reviewId` | صاحب نظر یا admin | حذف نظر |
| `POST` | `/courses/:courseSlug/reviews/:reviewId/reply` | فقط admin | ثبت/ویرایش پاسخ روی یک نظر (بازنویسی می‌شود اگر قبلاً پاسخی بوده) |
| `GET` | `/articles/:articleSlug/reviews` | Public | لیست نظرات مقاله (صفحه‌بندی) |
| `POST` | `/articles/:articleSlug/reviews` | کاربر لاگین‌شده | ثبت نظر — هیچ محدودیتی در تعداد نیست، کاربر می‌تواند چندبار نظر بدهد |
| `PATCH` | `/articles/:articleSlug/reviews/:reviewId` | صاحب نظر | ویرایش نظر خودم |
| `DELETE` | `/articles/:articleSlug/reviews/:reviewId` | صاحب نظر یا admin | حذف نظر |
| `GET` | `/reviews` | Public | همه‌ی نظرات **تأیید‌شده** دوره و مقاله با هم (صفحه‌بندی)، شامل اطلاعات هدف هر نظر |
| `GET` | `/reviews/pending` | فقط admin | صف نظرات در انتظار تأیید (`isApproved: false`)، قدیمی‌ترین اول |
| `POST` | `/reviews/:id/approve` | فقط admin | تأیید یک نظر — بعد از آن در لیست‌های عمومی نمایش داده می‌شود |

### شیء ReviewRecord

```ts
interface ReviewRecord {
  id: string;
  courseId: string | null;   // دقیقاً یکی از courseId/articleId مقدار دارد
  articleId: string | null;
  userId: string;
  user: { id: string; fullName: string; avatarUrl: string | null };
  rating: number;          // ۱ تا ۵
  comment: string | null;
  instructorReply: string | null;  // پاسخ admin — null یعنی هنوز پاسخی ثبت نشده
  repliedAt: ISODate | null;
  isApproved: boolean;     // تا admin تأیید نکند (true)، در لیست‌های عمومی نمایش داده نمی‌شود
  createdAt: ISODate;
  updatedAt: ISODate;
}
```

### شیء ReplyToReviewRequest (بدنه‌ی `POST .../reviews/:reviewId/reply`)

```ts
interface ReplyToReviewRequest {
  reply: string;
}
```

### شیء ReviewWithTarget (پاسخ `GET /reviews`)

```ts
interface ReviewWithTarget extends ReviewRecord {
  target: {
    type: "course" | "article";
    id: string;
    slug: string;
    title: Localized;
  };
}
```

### نکات

- هیچ محدودیتی روی تعداد نظرات یک کاربر برای یک دوره/مقاله نیست — می‌تواند چندبار نظر جدید ثبت کند (علاوه بر `PATCH` برای ویرایش نظرات قبلی خودش)
- `CourseRecord` و `ArticleRecord` هر دو دو فیلد `averageRating: number | null` و `reviewCount: number` دارند که مستقیماً از جدول `reviews` محاسبه می‌شوند (denormalize نشده، مثل `lessonCount`/`durationMinutes`) — **فقط نظرات تأیید‌شده در این محاسبه و در لیست‌های عمومی در نظر گرفته می‌شوند.**
- `averageRating` تا یک رقم اعشار رند می‌شود؛ اگر هیچ نظری نباشد `null` است
- نظرات دوره و مقاله مستقل از هم هستند — یک رکورد `Review` یا `courseId` دارد یا `articleId`، هرگز هر دو
- هر نظر تازه‌ثبت‌شده با `isApproved: false` ساخته می‌شود و در هیچ لیست عمومی (`GET /courses/:slug/reviews`, `GET /articles/:slug/reviews`, `GET /reviews`) نمایش داده نمی‌شود تا admin آن را با `POST /reviews/:id/approve` تأیید کند — به‌جز اینکه در `GET /courses/:slug/reviews`، اگر کاربر صاحب آن نظر لاگین باشد، نظر تأییدنشده‌ی خودش را هم در همان لیست (با `isApproved: false`) می‌بیند

---

## §13 — Tickets (تیکتینگ)

### روت‌ها

| Method | Path | Auth | توضیح |
|--------|------|------|-------|
| `POST` | `/tickets` | کاربر یا مهمان | ثبت تیکت جدید — مهمان باید `guestEmail` بفرستد |
| `GET` | `/tickets/mine` | کاربر لاگین‌شده | تیکت‌های من (صفحه‌بندی) |
| `GET` | `/tickets` | Admin | همه‌ی تیکت‌ها (صفحه‌بندی) |
| `GET` | `/tickets/:id` | صاحب تیکت یا admin | جزئیات یک تیکت با همه‌ی پیام‌ها |
| `POST` | `/tickets/:id/reply` | صاحب تیکت یا admin | پاسخ — پاسخ admin وضعیت را `answered` می‌کند |
| `POST` | `/tickets/:id/close` | صاحب تیکت یا admin | بستن تیکت |

### شیء Ticket

```ts
interface Ticket {
  id: string;
  userId: string | null;       // null یعنی تیکت مهمان است
  guestEmail: string | null;
  subject: string;
  status: "open" | "answered" | "closed";
  createdAt: ISODate;
  updatedAt: ISODate;
  messages: { id: string; body: string; authorType: "user" | "support"; createdAt: ISODate }[];
}
```

### نکات

- `POST /tickets` روی توکن نامعتبر/منقضی خطا نمی‌دهد — اگر کاربر معتبر نباشد و `guestEmail` هم نباشد، `400 GUEST_EMAIL_REQUIRED`
- روی تیکت `closed` نمی‌توان پاسخ داد → `400 TICKET_CLOSED`
- دسترسی غیرمجاز به تیکت دیگران → `403 NOT_TICKET_OWNER`

---

## §14 — User Dashboard (داشبورد پروفایل)

### `GET /users/me/dashboard` 🔒 کاربر لاگین‌شده

```ts
interface UserDashboard {
  totalSpent: Money | null;     // مجموع سفارش‌های paid — null یعنی هیچ خریدی نبوده
  myCoursesCount: number;       // تعداد دوره‌های متمایز خریداری‌شده
  ticketsCount: number;
  recentTickets: Ticket[];          // آخرین ۳ تیکت
  recentViews: RecentViewItem[];    // آخرین ۵ بازدید — دوره یا درس
  favorites: FavoriteItem[];        // همه‌ی علاقه‌مندی‌ها — دوره یا مقاله
  coursesProgress: CourseProgress[]; // پیشرفت برای دوره‌هایی که کاربر خریده
  unreadNotificationsCount: number; // تعداد اعلانات خوانده‌نشده
  recentNotifications: NotificationItem[]; // آخرین ۵ اعلان
}
```

---

## §15 — Recently Viewed (آخرین بازدیدها)

دوره یا درس — هر بار باز شدن صفحه‌ی دوره/درس در فرانت باید `POST /recently-viewed` صدا زده شود.

```ts
type RecentViewType = "course" | "lesson";

interface RecentViewItem {
  type: RecentViewType;
  id: ID;
  title: Localized;
  thumbnailUrl: Localized<string | null>; // برای lesson همان thumbnail دوره‌ی والد است
  courseId: ID;     // برای lesson دوره‌ی والد، برای course خودش
  courseSlug: string;
  viewedAt: ISODate;
}

interface RecordViewRequest {
  type: RecentViewType;
  id: ID; // UUID دوره یا درس
}
```

### `POST /recently-viewed` 🔒
بدنه: `RecordViewRequest`. idempotent — اگر قبلاً ثبت شده بود فقط `viewedAt` را جلو می‌برد.
خطا: `404 COURSE_NOT_FOUND` / `404 LESSON_NOT_FOUND`

### `GET /recently-viewed?limit=10` 🔒
خروجی: `RecentViewItem[]` — جدیدترین اول. بدون صفحه‌بندی، برای داشبورد.

### `GET /recently-viewed/paginated?page=1&limit=12` 🔒
همان لیست، اما صفحه‌بندی‌شده — برای صفحه‌ی کامل «بازدیدهای اخیر».
خروجی: `Paginated<RecentViewItem>`

---

## §16 — Favorites (علاقه‌مندی‌ها)

دوره یا مقاله.

```ts
type FavoriteType = "course" | "article";

interface FavoriteItem {
  type: FavoriteType;
  id: ID;
  slug: string;
  title: Localized;
  thumbnailUrl: Localized<string | null>;
  createdAt: ISODate;
}

interface ToggleFavoriteRequest {
  type: FavoriteType;
  id: ID;
}

interface FavoriteStatus {
  isFavorite: boolean;
}
```

### `POST /favorites/toggle` 🔒
بدنه: `ToggleFavoriteRequest`. اگر قبلاً علاقه‌مندی بود حذف می‌کند و `{isFavorite: false}` برمی‌گرداند، در غیر این صورت اضافه می‌کند و `{isFavorite: true}`.
خطا: `404 COURSE_NOT_FOUND` / `404 ARTICLE_NOT_FOUND`

### `GET /favorites/mine?limit=20` 🔒
خروجی: `FavoriteItem[]` — جدیدترین اول. بدون صفحه‌بندی، برای داشبورد.

### `GET /favorites?page=1&limit=12` 🔒
همان لیست، اما صفحه‌بندی‌شده — برای صفحه‌ی کامل «علاقه‌مندی‌های من».
خروجی: `Paginated<FavoriteItem>`

---

## §17 — Course Progress (درصد پیشرفت دوره)

درصد پیشرفت بر اساس مدت‌زمان درس‌هایی که کاربر **آنلاین دیده** محاسبه می‌شود (هیچ ستون denormalize نشده — مشابه `lessonCount`/`durationMinutes` دوره، روی هر درخواست از روی جدول `lesson_progress` و `lessons` محاسبه می‌شود).

```ts
interface CourseProgress {
  courseId: ID;
  courseSlug: string;
  watchedMinutes: number;  // مجموع مدت‌زمان درس‌های دیده‌شده
  totalMinutes: number;    // مدت‌زمان کل دوره
  progressPercent: number; // ۰ تا ۱۰۰ — totalMinutes صفر یعنی ۰
}
```

### `POST /lessons/:lessonId/watch` 🔒
درس را به‌عنوان دیده‌شده ثبت می‌کند — idempotent (هر درس فقط یک‌بار شمارش می‌شود).
خطا: `404 LESSON_NOT_FOUND`

### `GET /courses/:courseSlug/progress` 🔒
خروجی: `CourseProgress` برای کاربر لاگین‌شده.
خطا: `404 COURSE_NOT_FOUND`

---

## §18 — Notifications (اعلانات)

اعلان global است — یک رکورد برای همه‌ی کاربران مشترک، وضعیت خوانده‌شدن per-user در جدول جدا (`notification_reads`) نگه داشته می‌شود.
محتوای اعلان آزاد است — ادمین هر پیامی (عنوان + متن + لینک اختیاری) که بخواهد می‌سازد و برای همه‌ی کاربران ارسال می‌شود. هیچ trigger خودکاری روی انتشار دوره/مقاله/کوپن وجود ندارد.

```ts
interface NotificationItem {
  id: ID;
  title: Localized;
  body: Localized;
  link: string | null; // لینکی که با کلیک روی اعلان باز می‌شود — اختیاری
  createdAt: ISODate;
  isRead: boolean;
}

interface CreateNotificationRequest {
  title: Localized;
  body: Localized;
  link?: string | null;
}

interface NotificationsSummary {
  unreadCount: number;
}
```

### `POST /notifications` 🔒 admin
ادمین یک پیام دلخواه برای همه‌ی کاربران ارسال می‌کند.
- **بدنه:** `CreateNotificationRequest`
- **پاسخ:** `201 NotificationItem`
- **خطاها:** `400 VALIDATION_ERROR` | `403 FORBIDDEN`

### `GET /notifications?page=1&limit=12` 🔒
خروجی: `Paginated<NotificationItem>` — جدیدترین اول، برای صفحه‌ی کامل «اعلانات».

### `GET /notifications/unread-count` 🔒
خروجی: `NotificationsSummary`

### `POST /notifications/:id/read` 🔒
وضعیت خوانده‌شدن این اعلان را برای کاربر ثبت می‌کند. idempotent. پاسخ: `204`
خطا: `404 NOTIFICATION_NOT_FOUND`

### `POST /notifications/read-all` 🔒
همه‌ی اعلانات را برای کاربر خوانده‌شده علامت می‌زند. پاسخ: `204`

---

## فرایند تغییر قرارداد (مهم)

اگر وسط کار نیاز به تغییر یک API بود:
1. اول این فایل را آپدیت کن و تایپش را در `packages/shared` عوض کن.
2. در همان PR، بک‌اند را با تایپ جدید هماهنگ کن.
3. ادیتور فرانت خودکار قرمز می‌شود → فرانت‌کار می‌داند کجا را باید عوض کند.

این چرخه تضمین می‌کند فرانت و بک هیچ‌وقت از هم جدا نشوند.
