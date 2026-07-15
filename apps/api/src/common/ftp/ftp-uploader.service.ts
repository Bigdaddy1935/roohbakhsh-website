import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Client } from "basic-ftp";
import { Readable } from "stream";
import { randomUUID } from "crypto";
import { promises as fs } from "fs";
import { join } from "path";
import { EnvConfig } from "../../config/env";

/** پوشه‌ی محلی برای ذخیره‌ی فایل وقتی FTP در دسترس نیست — سرو می‌شود از /uploads (main.ts). */
const LOCAL_UPLOADS_ROOT = join(process.cwd(), "uploads");

@Injectable()
export class FtpUploaderService {
  private readonly logger = new Logger(FtpUploaderService.name);

  constructor(private readonly config: ConfigService<EnvConfig>) {}

  /**
   * فایل را در پوشه‌ی مشخص‌شده روی FTP آپلود می‌کند و لینک عمومی آن را برمی‌گرداند.
   * اگر اتصال FTP ناموفق باشد (مثلاً هنوز اطلاعات واقعی FTP تنظیم نشده)، به‌صورت خودکار
   * روی دیسک لوکال سرور ذخیره می‌شود تا آپلود همیشه کار کند.
   */
  async upload(buffer: Buffer, originalName: string, uploadDir: string): Promise<string> {
    const ext = originalName.includes(".") ? originalName.split(".").pop() : "bin";
    const fileName = `${randomUUID()}.${ext}`;

    try {
      return await this.uploadToFtp(buffer, fileName, uploadDir);
    } catch (err) {
      this.logger.warn(`FTP upload failed, falling back to local disk: ${(err as Error).message}`);
      return this.saveLocally(buffer, fileName, uploadDir);
    }
  }

  private async uploadToFtp(buffer: Buffer, fileName: string, uploadDir: string): Promise<string> {
    const host = this.config.get("FTP_HOST", { infer: true })!;
    const port = this.config.get("FTP_PORT", { infer: true })!;
    const user = this.config.get("FTP_USER", { infer: true })!;
    const password = this.config.get("FTP_PASSWORD", { infer: true })!;
    const publicBaseUrl = this.config.get("FTP_PUBLIC_BASE_URL", { infer: true })!;
    const secure = this.config.get("FTP_SECURE", { infer: true })!;

    const client = new Client();
    client.ftp.verbose = false;
    try {
      await client.access({ host, port, user, password, secure });
      await client.ensureDir(uploadDir);
      await client.uploadFrom(Readable.from(buffer), fileName);
    } finally {
      client.close();
    }

    return `${publicBaseUrl.replace(/\/$/, "")}/${uploadDir.replace(/^\//, "")}/${fileName}`;
  }

  private async saveLocally(buffer: Buffer, fileName: string, uploadDir: string): Promise<string> {
    const apiPublicUrl = this.config.get("API_PUBLIC_URL", { infer: true })!;
    const dir = uploadDir.replace(/^\//, "");
    const targetDir = join(LOCAL_UPLOADS_ROOT, dir);

    await fs.mkdir(targetDir, { recursive: true });
    await fs.writeFile(join(targetDir, fileName), buffer);

    return `${apiPublicUrl.replace(/\/$/, "")}/uploads/${dir}/${fileName}`;
  }
}
