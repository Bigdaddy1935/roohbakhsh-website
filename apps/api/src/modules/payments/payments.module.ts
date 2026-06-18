import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Payment } from "./entities/payment.entity";
import { OrdersModule } from "../orders/orders.module";
import { PaymentsService } from "./payments.service";
import { PaymentsController } from "./payments.controller";

@Module({
  imports: [
    TypeOrmModule.forFeature([Payment]),
    OrdersModule,
  ],
  controllers: [PaymentsController],
  providers: [PaymentsService],
})
export class PaymentsModule {}
