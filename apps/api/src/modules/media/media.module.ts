import { Module } from "@nestjs/common";
import { MediaController } from "./media.controller";
import { MediaService } from "./media.service";
import { FtpUploaderService } from "../../common/ftp/ftp-uploader.service";

@Module({
  controllers: [MediaController],
  providers: [MediaService, FtpUploaderService],
})
export class MediaModule {}
