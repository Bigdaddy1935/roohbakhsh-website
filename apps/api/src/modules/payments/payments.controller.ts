import {
  Controller,
  Post,
  Get,
  Param,
  Query,
  Body,
  Request,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  Redirect,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { EnvConfig } from "../../config/env";
import { FileInterceptor } from "@nestjs/platform-express";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiHeader,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
} from "@nestjs/swagger";
import { LANG_HEADER } from "../../common/swagger/lang-header";
import { Public } from "../auth/decorators/public.decorator";
import { RolesGuard, Roles } from "../../common/guards/roles.guard";
import { PaginationDto } from "../../common/dto/pagination.dto";
import { PaymentsService } from "./payments.service";
import { SubmitCardToCardDto } from "./dto/submit-card-to-card.dto";

@ApiTags("Payments")
@ApiHeader(LANG_HEADER)
@Controller("payments")
export class PaymentsController {
  private readonly frontendUrl: string;

  constructor(
    private readonly service: PaymentsService,
    private readonly config: ConfigService<EnvConfig, true>,
  ) {
    this.frontendUrl = this.config.get("FRONTEND_URL", { infer: true });
  }

  @Post("initiate/:orderId")
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Initiate payment for an order",
    description: "Creates a payment record and returns the ZarinPal gateway URL. Redirect user to `gatewayUrl`.",
  })
  @ApiParam({ name: "orderId", description: "Order UUID" })
  @ApiResponse({ status: 201, description: "Payment initiated — { paymentId, gatewayUrl }" })
  @ApiResponse({ status: 400, description: "ORDER_ALREADY_PAID | ORDER_NOT_PAYABLE" })
  @ApiResponse({ status: 404, description: "ORDER_NOT_FOUND" })
  initiate(
    @Request() req: { user: { id: string } },
    @Param("orderId") orderId: string,
  ) {
    return this.service.initiate(orderId, req.user.id);
  }

  @Get("verify")
  @Public()
  @Redirect("", 302)
  @ApiOperation({
    summary: "ZarinPal callback — verify payment",
    description: "ZarinPal redirects here after payment. Verifies with ZarinPal API and redirects user to frontend success or failed page.",
  })
  @ApiQuery({ name: "Authority", required: true, description: "ZarinPal authority code" })
  @ApiQuery({ name: "Status", required: true, enum: ["OK", "NOK"], description: "Payment status from ZarinPal" })
  @ApiResponse({ status: 302, description: "Redirect to frontend payment/success or payment/failed" })
  async verify(
    @Query("Authority") authority: string,
    @Query("Status") status: string,
  ) {
    try {
      const result = await this.service.verify(authority, status);
      // موفقیت را بر اساس نتیجه‌ی واقعی تصمیم بگیر، نه صرفِ نبودِ throw:
      // لغو کاربر (PAYMENT_CANCELLED) یا پرداختِ failedِ قبلی resolve می‌شود ولی موفق نیست.
      if (result.success && result.refId) {
        return {
          url: `${this.frontendUrl}/${result.locale}/payment/success?refId=${result.refId}`,
        };
      }
      return { url: `${this.frontendUrl}/${result.locale}/payment/failed` };
    } catch {
      return { url: `${this.frontendUrl}/ar/payment/failed` };
    }
  }

  @Get("logs")
  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @Roles("admin")
  @ApiOperation({ summary: "Payment logs (admin)", description: "All payment records — admin only" })
  @ApiResponse({ status: 200, description: "Paginated payment logs" })
  @ApiResponse({ status: 403, description: "Forbidden" })
  findLogs(@Query() query: PaginationDto) {
    return this.service.findLogs(query.page ?? 1, query.limit ?? 20);
  }

  @Get("mine")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Current user payment history" })
  @ApiResponse({ status: 200, description: "Paginated payment records" })
  findMine(@Request() req: { user: { id: string } }, @Query() query: PaginationDto) {
    return this.service.findMyPayments(req.user.id, query.page ?? 1, query.limit ?? 12);
  }

  // ────────────────────────── کارت‌به‌کارت ──────────────────────────

  @Get("manual/destination-info")
  @ApiBearerAuth()
  @ApiOperation({
    summary: "اطلاعات حساب مقصد پرداخت کارت‌به‌کارت",
    description: "شماره کارت، شماره حساب، نام صاحب حساب و بانک مقصد آکادمی را برمی‌گرداند.",
  })
  @ApiResponse({ status: 200, description: "اطلاعات حساب مقصد" })
  getDestinationInfo() {
    return this.service.getDestinationAccount();
  }

  @Post("upload-receipt")
  @ApiBearerAuth()
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: { type: "object", properties: { file: { type: "string", format: "binary" } } },
  })
  @ApiOperation({
    summary: "آپلود تصویر رسید پرداخت کارت‌به‌کارت",
    description: "تصویر روی FTP آپلود می‌شود و لینک عمومی آن برگردانده می‌شود.",
  })
  @ApiResponse({ status: 201, description: "لینک تصویر رسید" })
  @UseInterceptors(FileInterceptor("file"))
  uploadReceipt(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }),
          new FileTypeValidator({ fileType: /(jpg|jpeg|png)$/ }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    return this.service.uploadReceipt(file);
  }

  @Get("manual/pending")
  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @Roles("admin")
  @ApiOperation({
    summary: "[Admin] پرداخت‌های کارت‌به‌کارت منتظر تأیید",
    description: "لیست پرداخت‌هایی که کاربر رسید/اطلاعات پرداخت فرستاده ولی هنوز ادمین تأیید نکرده.",
  })
  @ApiResponse({ status: 200, description: "لیست صفحه‌بندی‌شده پرداخت‌های منتظر تأیید" })
  @ApiResponse({ status: 403, description: "فقط admin" })
  findPendingManual(@Query() query: PaginationDto) {
    return this.service.findPendingManual(query.page ?? 1, query.limit ?? 20);
  }

  @Post("manual/:paymentId/approve")
  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @Roles("admin")
  @ApiOperation({
    summary: "[Admin] تأیید پرداخت کارت‌به‌کارت",
    description: "پرداخت paid می‌شود، سفارش paid می‌شود و فاکتور ساخته می‌شود.",
  })
  @ApiParam({ name: "paymentId", description: "Payment UUID" })
  @ApiResponse({ status: 201, description: "پرداخت تأیید شد" })
  @ApiResponse({ status: 400, description: "PAYMENT_ALREADY_PROCESSED" })
  @ApiResponse({ status: 404, description: "PAYMENT_NOT_FOUND" })
  @ApiResponse({ status: 403, description: "فقط admin" })
  approveManual(@Param("paymentId") paymentId: string) {
    return this.service.approveManual(paymentId);
  }

  @Post("manual/:paymentId/reject")
  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @Roles("admin")
  @ApiOperation({
    summary: "[Admin] رد پرداخت کارت‌به‌کارت",
    description: "پرداخت failed می‌شود — کاربر باید دوباره اطلاعات پرداخت را ارسال کند.",
  })
  @ApiParam({ name: "paymentId", description: "Payment UUID" })
  @ApiResponse({ status: 201, description: "پرداخت رد شد" })
  @ApiResponse({ status: 400, description: "PAYMENT_ALREADY_PROCESSED" })
  @ApiResponse({ status: 404, description: "PAYMENT_NOT_FOUND" })
  @ApiResponse({ status: 403, description: "فقط admin" })
  rejectManual(@Param("paymentId") paymentId: string) {
    return this.service.rejectManual(paymentId);
  }

  @Post("manual/:orderId")
  @ApiBearerAuth()
  @ApiOperation({
    summary: "ثبت اطلاعات پرداخت کارت‌به‌کارت برای یک سفارش",
    description: "کد رهگیری، شماره کارت مبدأ و در صورت وجود لینک رسید ثبت می‌شود. پرداخت با وضعیت pending منتظر تأیید دستی ادمین می‌ماند.",
  })
  @ApiParam({ name: "orderId", description: "Order UUID" })
  @ApiResponse({ status: 201, description: "اطلاعات پرداخت ثبت شد" })
  @ApiResponse({ status: 400, description: "ORDER_ALREADY_PAID | ORDER_NOT_PAYABLE" })
  @ApiResponse({ status: 404, description: "ORDER_NOT_FOUND" })
  submitCardToCard(
    @Request() req: { user: { id: string } },
    @Param("orderId") orderId: string,
    @Body() dto: SubmitCardToCardDto,
  ) {
    return this.service.submitCardToCard(orderId, req.user.id, dto);
  }
}
