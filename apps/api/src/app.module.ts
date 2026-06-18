import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_FILTER, APP_GUARD } from "@nestjs/core";
import { validate } from "./config/env";
import { DatabaseModule } from "./db/database.module";
import { AuthModule } from "./modules/auth/auth.module";
import { CoursesModule } from "./modules/courses/courses.module";
import { CategoryModule } from "./modules/category/category.module";
import { HttpExceptionFilter } from "./common/filters/http-exception.filter";
import { JwtAuthGuard } from "./modules/auth/guards/jwt-auth.guard";
import { RolesGuard } from "./common/guards/roles.guard";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath:
        process.env.NODE_ENV === "production"
          ? ".env.production"
          : ".env.developer",
      validate,
    }),
    DatabaseModule,
    AuthModule,
    CoursesModule,
    CategoryModule,
  ],
  providers: [
    { provide: APP_FILTER, useClass: HttpExceptionFilter },
    // JwtAuthGuard به‌صورت سراسری — مسیرهای عمومی با @Public() علامت می‌خورند
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    RolesGuard,
  ],
})
export class AppModule {}
