import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Payment } from "./entities/payment.entity";
import { OrdersModule } from "../orders/orders.module";
import { InvoicesModule } from "../invoices/invoices.module";
import { PaymentsService } from "./payments.service";
import { PaymentsController } from "./payments.controller";
import { FtpUploaderService } from "./ftp-uploader.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([Payment]),
    OrdersModule,
    InvoicesModule,
  ],
  controllers: [PaymentsController],
  providers: [PaymentsService, FtpUploaderService],
})
export class PaymentsModule {}
