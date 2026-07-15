import {
  Controller, Post, Get, Delete, Param, Query,
  UseGuards, UseInterceptors, UploadedFile,
  ParseFilePipe, MaxFileSizeValidator, FileTypeValidator, Body,
  HttpCode,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import {
  ApiTags, ApiBearerAuth, ApiOperation, ApiResponse,
  ApiConsumes, ApiBody, ApiHeader, ApiQuery,
} from "@nestjs/swagger";
import { RolesGuard, Roles } from "../../common/guards/roles.guard";
import { LANG_HEADER } from "../../common/swagger/lang-header";
import { MediaService } from "./media.service";
import { UploadMediaDto } from "./dto/upload-media.dto";
import type { MediaCategory } from "@roohbakhsh/shared";

@ApiTags("Media")
@ApiHeader(LANG_HEADER)
@ApiBearerAuth()
@UseGuards(RolesGuard)
@Roles("admin")
@Controller("media")
export class MediaController {
  constructor(private readonly service: MediaService) {}

  @Post("upload")
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        file: { type: "string", format: "binary" },
        category: { type: "string", enum: ["courses", "articles", "staff", "categories", "other"] },
        locale: { type: "string", enum: ["ar", "ur"] },
      },
    },
  })
  @ApiOperation({ summary: "[Admin] آپلود تصویر به گالری" })
  @ApiResponse({ status: 201, description: "تصویر آپلود و ذخیره شد" })
  @UseInterceptors(FileInterceptor("file"))
  upload(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }),
          new FileTypeValidator({ fileType: /(jpg|jpeg|png|webp)$/ }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Body() dto: UploadMediaDto,
  ) {
    return this.service.upload(file, dto);
  }

  @Get()
  @ApiOperation({ summary: "[Admin] لیست تصاویر گالری" })
  @ApiQuery({ name: "category", required: false, enum: ["courses", "articles", "staff", "categories", "other"] })
  @ApiQuery({ name: "locale", required: false, enum: ["ar", "ur"] })
  @ApiResponse({ status: 200, description: "لیست تصاویر" })
  findAll(
    @Query("category") category?: MediaCategory,
    @Query("locale") locale?: "ar" | "ur",
  ) {
    return this.service.findAll(category, locale);
  }

  @Delete(":id")
  @HttpCode(204)
  @ApiOperation({ summary: "[Admin] حذف تصویر از گالری" })
  @ApiResponse({ status: 204, description: "تصویر حذف شد" })
  remove(@Param("id") id: string) {
    return this.service.remove(id);
  }
}
