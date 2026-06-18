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
> `price` از نوع `Money`: `{ amountMinor: number, currency: "USD"|"EUR" }` — `null` یعنی رایگان.
> `level` یکی از: `"beginner" | "intermediate" | "advanced"`.

### `GET /api/courses`
لیست صفحه‌بندی‌شده دوره‌ها با اطلاعات خلاصه استاد.
- **Query:** `page` (پیش‌فرض ۱)، `limit` (پیش‌فرض ۱۲، حداکثر ۱۰۰)
- **پاسخ:** `200 Paginated<CourseRecord>`

### `GET /api/courses/:id`
مشخصات یک دوره.
- **پاسخ:** `200 CourseRecord`
- **خطا:** `404 COURSE_NOT_FOUND`

### `POST /api/courses` 🔒 admin
ایجاد دوره جدید. دوره در حالت پنهان (`isPublished: false`) ایجاد می‌شود.
- **بدنه:** `CreateCourseRequest`
- **پاسخ:** `201 CourseRecord`
- **خطاها:** `409 COURSE_SLUG_TAKEN` | `404 INSTRUCTOR_NOT_FOUND / CATEGORY_NOT_FOUND` | `400 VALIDATION_ERROR`

### `PATCH /api/courses/:id` 🔒 admin
ویرایش جزئی دوره. برای انتشار `isPublished: true` بفرست.
- **بدنه:** `UpdateCourseRequest` (همه فیلدها اختیاری)
- **پاسخ:** `200 CourseRecord`
- **خطاها:** `404 COURSE_NOT_FOUND / INSTRUCTOR_NOT_FOUND` | `409 COURSE_SLUG_TAKEN`

### `DELETE /api/courses/:id` 🔒 admin
حذف دوره و تمام درس‌های آن (cascade).
- **پاسخ:** `204 No Content`
- **خطا:** `404 COURSE_NOT_FOUND`

---

# بخش ۶ — درس‌ها (منبع: NestJS)

> عملیات نوشتن فقط برای `role: admin` مجاز است. خواندن برای همه آزاد است.
> پس از هر تغییر درس، `lessonCount` و `durationMinutes` دوره به‌صورت خودکار sync می‌شوند.
> `title` از نوع `Localized` است.

### `GET /api/courses/:courseId/lessons`
لیست صفحه‌بندی‌شده درس‌های یک دوره به‌ترتیب `order`.
- **Query:** `page` (پیش‌فرض ۱)، `limit` (پیش‌فرض ۱۲، حداکثر ۱۰۰)
- **پاسخ:** `200 Paginated<Lesson>`
- **خطا:** `404 COURSE_NOT_FOUND`

### `GET /api/courses/:courseId/lessons/:lessonId`
مشخصات یک درس.
- **پاسخ:** `200 Lesson`
- **خطاها:** `404 COURSE_NOT_FOUND / LESSON_NOT_FOUND`

### `POST /api/courses/:courseId/lessons` 🔒 admin
افزودن درس به دوره.
- **بدنه:** `CreateLessonRequest`
- **پاسخ:** `201 Lesson`
- **خطاها:** `404 COURSE_NOT_FOUND` | `400 VALIDATION_ERROR`

### `PATCH /api/courses/:courseId/lessons/:lessonId` 🔒 admin
ویرایش جزئی درس.
- **بدنه:** `UpdateLessonRequest` (همه فیلدها اختیاری)
- **پاسخ:** `200 Lesson`
- **خطاها:** `404 COURSE_NOT_FOUND / LESSON_NOT_FOUND`

### `DELETE /api/courses/:courseId/lessons/:lessonId` 🔒 admin
حذف درس.
- **پاسخ:** `204 No Content`
- **خطاها:** `404 COURSE_NOT_FOUND / LESSON_NOT_FOUND`

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

## فرایند تغییر قرارداد (مهم)

اگر وسط کار نیاز به تغییر یک API بود:
1. اول این فایل را آپدیت کن و تایپش را در `packages/shared` عوض کن.
2. در همان PR، بک‌اند را با تایپ جدید هماهنگ کن.
3. ادیتور فرانت خودکار قرمز می‌شود → فرانت‌کار می‌داند کجا را باید عوض کند.

این چرخه تضمین می‌کند فرانت و بک هیچ‌وقت از هم جدا نشوند.
