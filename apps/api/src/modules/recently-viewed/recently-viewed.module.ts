import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RecentView } from "./entities/recent-view.entity";
import { Course } from "../courses/entities/course.entity";
import { Lesson } from "../courses/entities/lesson.entity";
import { RecentlyViewedService } from "./recently-viewed.service";
import { RecentlyViewedController } from "./recently-viewed.controller";

@Module({
  imports: [TypeOrmModule.forFeature([RecentView, Course, Lesson])],
  controllers: [RecentlyViewedController],
  providers: [RecentlyViewedService],
  exports: [RecentlyViewedService],
})
export class RecentlyViewedModule {}
