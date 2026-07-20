import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as nodemailer from "nodemailer";
import type { Transporter } from "nodemailer";
import { Resend } from "resend";

interface SendMailInput {
  to: string;
  subject: string;
  html: string;
}

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private readonly resend: Resend | null;
  private readonly transporter: Transporter | null;
  private readonly from: string;

  constructor(private readonly config: ConfigService) {
    const resendApiKey = this.config.get<string>("RESEND_API_KEY");
    const smtpHost = this.config.get<string>("SMTP_HOST");

    this.from =
      this.config.get<string>("MAIL_FROM") ??
      "Roohbakhsh Academy <onboarding@resend.dev>";

    this.resend = resendApiKey ? new Resend(resendApiKey) : null;

    if (!smtpHost || this.resend) {
      this.transporter = null;
      return;
    }

    this.transporter = nodemailer.createTransport({
      host: smtpHost,
      port: this.config.get<number>("SMTP_PORT") ?? 587,
      secure: this.config.get<boolean>("SMTP_SECURE") ?? false,
      auth: {
        user: this.config.get<string>("SMTP_USER"),
        pass: this.config.get<string>("SMTP_PASSWORD"),
      },
    });
  }

  async send(input: SendMailInput): Promise<void> {
    if (this.resend) {
      const { error } = await this.resend.emails.send({
        from: this.from,
        to: input.to,
        subject: input.subject,
        html: input.html,
      });

      if (error) {
        this.logger.error(`Resend email failed: ${error.message}`);
        throw new Error("EMAIL_SEND_FAILED");
      }

      return;
    }

    if (!this.transporter) {
      this.logger.log(
        `[Email log only] To: ${input.to} | Subject: ${input.subject}\n${input.html}`,
      );
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
