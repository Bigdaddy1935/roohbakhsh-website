import { ApiProperty } from "@nestjs/swagger";

export class ApiErrorSchema {
  @ApiProperty({ example: 400 })
  statusCode!: number;

  @ApiProperty({ example: "EMAIL_TAKEN", description: "کد ماشین‌خوان — برای منطق فرانت استفاده می‌شود، همیشه انگلیسی است" })
  code!: string;

  @ApiProperty({ example: "هذا البريد الإلكتروني مسجّل مسبقاً", description: "پیام قابل‌نمایش — بر اساس Accept-Language به عربی یا اردو" })
  message!: string;

  @ApiProperty({
    required: false,
    example: { email: "يجب أن يكون email بريداً إلكترونياً صحيحاً" },
    description: "خطاهای اعتبارسنجی فیلدها — فقط در VALIDATION_ERROR",
  })
  fields?: Record<string, string>;
}
