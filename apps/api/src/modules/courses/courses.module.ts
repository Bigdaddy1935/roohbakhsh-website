import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Course } from "./entities/course.entity";
import { Lesson } from "./entities/lesson.entity";
import { Instructor } from "../instructor/entities/instructor.entity";
import { Category } from "../category/entities/category.entity";
import { CourseService } from "./course.service";
import { LessonService } from "./lesson.service";
import { CourseController } from "./course.controller";
import { LessonController } from "./lesson.controller";

@Module({
  imports: [TypeOrmModule.forFeature([Course, Lesson, Instructor, Category])],
  controllers: [CourseController, LessonController],
  providers: [CourseService, LessonService],
})
export class CoursesModule {}
