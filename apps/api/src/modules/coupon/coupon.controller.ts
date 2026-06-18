import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiHeader,
  ApiParam,
} from "@nestjs/swagger";
import { LANG_HEADER } from "../../common/swagger/lang-header";
import { Public } from "../auth/decorators/public.decorator";
import { RolesGuard, Roles } from "../../common/guards/roles.guard";
import { PaginationDto } from "../../common/dto/pagination.dto";
import { CouponService } from "./coupon.service";
import { CreateCouponDto } from "./dto/create-coupon.dto";
import { UpdateCouponDto } from "./dto/update-coupon.dto";
import { ValidateCouponDto } from "./dto/validate-coupon.dto";

@ApiTags("Coupons")
@ApiHeader(LANG_HEADER)
@Controller("coupons")
export class CouponController {
  constructor(private readonly service: CouponService) {}

  @Get()
  @UseGuards(RolesGuard)
  @Roles("admin")
  @ApiOperation({ summary: "List all coupons", description: "Paginated list — admin only" })
  @ApiResponse({ status: 200, description: "Paginated coupon list" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 403, description: "Forbidden — admin only" })
  findAll(@Query() query: PaginationDto) {
    return this.service.findAll(query.page ?? 1, query.limit ?? 12);
  }

  @Get(":id")
  @UseGuards(RolesGuard)
  @Roles("admin")
  @ApiOperation({ summary: "Get coupon by ID", description: "Admin only" })
  @ApiParam({ name: "id", description: "Coupon UUID" })
  @ApiResponse({ status: 200, description: "Coupon found" })
  @ApiResponse({ status: 404, description: "COUPON_NOT_FOUND" })
  findOne(@Param("id") id: string) {
    return this.service.findOne(id);
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles("admin")
  @ApiOperation({ summary: "Create a new coupon", description: "Admin only" })
  @ApiResponse({ status: 201, description: "Coupon created" })
  @ApiResponse({ status: 409, description: "COUPON_CODE_TAKEN" })
  create(@Body() dto: CreateCouponDto) {
    return this.service.create(dto);
  }

  @Patch(":id")
  @UseGuards(RolesGuard)
  @Roles("admin")
  @ApiOperation({ summary: "Update coupon (maxUses, expiresAt, isActive)", description: "Admin only" })
  @ApiParam({ name: "id", description: "Coupon UUID" })
  @ApiResponse({ status: 200, description: "Coupon updated" })
  @ApiResponse({ status: 404, description: "COUPON_NOT_FOUND" })
  update(@Param("id") id: string, @Body() dto: UpdateCouponDto) {
    return this.service.update(id, dto);
  }

  @Delete(":id")
  @UseGuards(RolesGuard)
  @Roles("admin")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Delete coupon", description: "Admin only" })
  @ApiParam({ name: "id", description: "Coupon UUID" })
  @ApiResponse({ status: 204, description: "Coupon deleted" })
  @ApiResponse({ status: 404, description: "COUPON_NOT_FOUND" })
  remove(@Param("id") id: string) {
    return this.service.remove(id);
  }

  @Post("validate")
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Validate a coupon code",
    description: "Returns discount amount and final total. Public endpoint — call before checkout.",
  })
  @ApiResponse({ status: 200, description: "Coupon is valid — returns discount calculation" })
  @ApiResponse({ status: 400, description: "COUPON_EXPIRED_OR_EXHAUSTED" })
  @ApiResponse({ status: 404, description: "COUPON_NOT_FOUND" })
  validate(@Body() dto: ValidateCouponDto) {
    return this.service.validate(dto);
  }
}
