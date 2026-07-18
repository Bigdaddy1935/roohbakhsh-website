import { Controller, Get, Patch, Body, UseGuards } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiHeader } from "@nestjs/swagger";
import { SettingsService } from "./settings.service";
import { UpdatePaymentDestinationDto } from "./dto/update-payment-destination.dto";
import { Public } from "../auth/decorators/public.decorator";
import { RolesGuard, Roles } from "../../common/guards/roles.guard";

@ApiTags("Settings")
@ApiHeader({ name: "Accept-Language", description: "زبان پاسخ", required: false })
@Controller("settings")
export class SettingsController {
  constructor(private readonly service: SettingsService) {}

  @Get("payment-destination")
  @Public()
  @ApiOperation({ summary: "اطلاعات حساب مقصد پرداخت کارت‌به‌کارت" })
  @ApiResponse({ status: 200, description: "اطلاعات حساب مقصد" })
  getPaymentDestination() {
    return this.service.getPaymentDestination();
  }

  @Patch("payment-destination")
  @UseGuards(RolesGuard)
  @Roles("admin")
  @ApiBearerAuth()
  @ApiOperation({ summary: "به‌روزرسانی اطلاعات حساب مقصد (فقط ادمین)" })
  @ApiResponse({ status: 200, description: "اطلاعات به‌روزرسانی شد" })
  updatePaymentDestination(@Body() dto: UpdatePaymentDestinationDto) {
    return this.service.updatePaymentDestination(dto);
  }
}
