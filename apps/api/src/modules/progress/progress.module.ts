import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { LessonProgress } from "./entities/lesson-progress.entity";
import { Lesson } from "../courses/entities/lesson.entity";
import { Course } from "../courses/entities/course.entity";
import { ProgressService } from "./progress.service";
import { ProgressController } from "./progress.controller";

@Module({
  imports: [TypeOrmModule.forFeature([LessonProgress, Lesson, Course])],
  controllers: [ProgressController],
  providers: [ProgressService],
  exports: [ProgressService],
})
export class ProgressModule {}
