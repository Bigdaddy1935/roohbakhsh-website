import { Injectable, InternalServerErrorException, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Client } from "basic-ftp";
import { Readable } from "stream";
import { randomUUID } from "crypto";
import { EnvConfig } from "../../config/env";

@Injectable()
export class FtpUploaderService {
  private readonly logger = new Logger(FtpUploaderService.name);

  constructor(private readonly config: ConfigService<EnvConfig>) {}

  /** فایل را در پوشه‌ی مشخص‌شده روی FTP آپلود می‌کند و لینک عمومی آن را برمی‌گرداند. */
  async upload(buffer: Buffer, originalName: string, uploadDir: string): Promise<string> {
    const host = this.config.get("FTP_HOST", { infer: true })!;
    const port = this.config.get("FTP_PORT", { infer: true })!;
    const user = this.config.get("FTP_USER", { infer: true })!;
    const password = this.config.get("FTP_PASSWORD", { infer: true })!;
    const publicBaseUrl = this.config.get("FTP_PUBLIC_BASE_URL", { infer: true })!;
    const secure = this.config.get("FTP_SECURE", { infer: true })!;

    const ext = originalName.includes(".") ? originalName.split(".").pop() : "bin";
    const fileName = `${randomUUID()}.${ext}`;

    const client = new Client();
    try {
      await client.access({ host, port, user, password, secure });
      await client.ensureDir(uploadDir);
      await client.uploadFrom(Readable.from(buffer), fileName);
    } catch (err) {
      this.logger.error("FTP upload failed", err);
      throw new InternalServerErrorException("FILE_UPLOAD_FAILED");
    } finally {
      client.close();
    }

    return `${publicBaseUrl.replace(/\/$/, "")}/${uploadDir.replace(/^\//, "")}/${fileName}`;
  }
}
