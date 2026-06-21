import { Controller, Get, Param, Query, Request } from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiHeader,
  ApiParam,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { LANG_HEADER } from "../../common/swagger/lang-header";
import { PaginationDto } from "../../common/dto/pagination.dto";
import { InvoicesService } from "./invoices.service";

@ApiTags("Invoices")
@ApiHeader(LANG_HEADER)
@ApiBearerAuth()
@Controller("invoices")
export class InvoicesController {
  constructor(private readonly service: InvoicesService) {}

  @Get("mine")
  @ApiOperation({
    summary: "List current user invoices",
    description: "Paginated list of invoices issued to the current user after successful payment.",
  })
  @ApiResponse({ status: 200, description: "Paginated invoice list" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  findMine(@Request() req: { user: { id: string } }, @Query() query: PaginationDto) {
    return this.service.findMine(req.user.id, query.page ?? 1, query.limit ?? 12);
  }

  @Get("mine/:invoiceNumber")
  @ApiOperation({
    summary: "Get invoice by number",
    description: "Returns the invoice only if it belongs to the current user.",
  })
  @ApiParam({ name: "invoiceNumber", description: "Invoice number — format: INV-YYYYMMDD-XXXX", example: "INV-20260620-0001" })
  @ApiResponse({ status: 200, description: "Invoice found" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 404, description: "INVOICE_NOT_FOUND" })
  findOne(
    @Request() req: { user: { id: string } },
    @Param("invoiceNumber") invoiceNumber: string,
  ) {
    return this.service.findOneByNumber(invoiceNumber, req.user.id);
  }
}
