import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../auth/entities/user.entity";
import { Order } from "../orders/entities/order.entity";
import { TicketsModule } from "../tickets/tickets.module";
import { RecentlyViewedModule } from "../recently-viewed/recently-viewed.module";
import { FavoritesModule } from "../favorites/favorites.module";
import { ProgressModule } from "../progress/progress.module";
import { NotificationsModule } from "../notifications/notifications.module";
import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Order]),
    TicketsModule,
    RecentlyViewedModule,
    FavoritesModule,
    ProgressModule,
    NotificationsModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
