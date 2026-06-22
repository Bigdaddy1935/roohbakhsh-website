import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as nodemailer from "nodemailer";
import type { Transporter } from "nodemailer";

interface SendMailInput {
  to: string;
  subject: string;
  html: string;
}

/**
 * اگر SMTP_HOST تنظیم نشده باشد (مثلاً در توسعه)، ایمیل واقعی ارسال نمی‌شود
 * و فقط محتوای آن لاگ می‌شود — تا بدون نیاز به یک سرویس SMTP واقعی هم بتوان تست کرد.
 */
@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private readonly transporter: Transporter | null;
  private readonly from: string;

  constructor(private readonly config: ConfigService) {
    const host = this.config.get<string>("SMTP_HOST");
    this.from = this.config.get<string>("MAIL_FROM") ?? "no-reply@roohbakhsh.ac";

    if (!host) {
      this.transporter = null;
      return;
    }

    this.transporter = nodemailer.createTransport({
      host,
      port: this.config.get<number>("SMTP_PORT") ?? 587,
      secure: this.config.get<boolean>("SMTP_SECURE") ?? false,
      auth: {
        user: this.config.get<string>("SMTP_USER"),
        pass: this.config.get<string>("SMTP_PASSWORD"),
      },
    });
  }

  async send(input: SendMailInput): Promise<void> {
    if (!this.transporter) {
      this.logger.log(`[ایمیل بدون SMTP — فقط لاگ] به: ${input.to} | موضوع: ${input.subject}\n${input.html}`);
      return;
    }

    await this.transporter.sendMail({
      from: this.from,
      to: input.to,
      subject: input.subject,
      html: input.html,
    });
  }
}
