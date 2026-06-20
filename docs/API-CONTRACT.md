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
  "order": 1,
  "durationMinutes": 20,
  "isFreePreview": true,
  "sectionId": "uuid",
  "courseId": "uuid",
  "createdAt": "...", "updatedAt": "..."
}
```

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
{ "paymentId": "uuid", "gatewayUrl": "https://www.zarinpal.com/pg/StartPay/AUTHORITY" }
```
→ Frontend redirects user to `gatewayUrl`.

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

## فرایند تغییر قرارداد (مهم)

اگر وسط کار نیاز به تغییر یک API بود:
1. اول این فایل را آپدیت کن و تایپش را در `packages/shared` عوض کن.
2. در همان PR، بک‌اند را با تایپ جدید هماهنگ کن.
3. ادیتور فرانت خودکار قرمز می‌شود → فرانت‌کار می‌داند کجا را باید عوض کند.

این چرخه تضمین می‌کند فرانت و بک هیچ‌وقت از هم جدا نشوند.
