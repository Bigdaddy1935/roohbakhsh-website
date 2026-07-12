import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Payment } from "./entities/payment.entity";
import { User } from "../auth/entities/user.entity";
import { OrdersModule } from "../orders/orders.module";
import { InvoicesModule } from "../invoices/invoices.module";
import { MailModule } from "../mail/mail.module";
import { PaymentsService } from "./payments.service";
import { PaymentsController } from "./payments.controller";
import { FtpUploaderService } from "../../common/ftp/ftp-uploader.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([Payment, User]),
    OrdersModule,
    InvoicesModule,
    MailModule,
  ],
  controllers: [PaymentsController],
  providers: [PaymentsService, FtpUploaderService],
})
export class PaymentsModule {}
