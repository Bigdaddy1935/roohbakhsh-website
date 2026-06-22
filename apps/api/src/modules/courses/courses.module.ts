import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Course } from "./entities/course.entity";
import { Section } from "./entities/section.entity";
import { Lesson } from "./entities/lesson.entity";
import { Instructor } from "../instructor/entities/instructor.entity";
import { Category } from "../category/entities/category.entity";
import { ReviewsModule } from "../reviews/reviews.module";
import { CourseService } from "./course.service";
import { SectionService } from "./section.service";
import { LessonService } from "./lesson.service";
import { CourseController } from "./course.controller";
import { SectionController } from "./section.controller";
import { LessonController } from "./lesson.controller";

@Module({
  imports: [
    TypeOrmModule.forFeature([Course, Section, Lesson, Instructor, Category]),
    ReviewsModule,
  ],
  controllers: [CourseController, SectionController, LessonController],
  providers: [CourseService, SectionService, LessonService],
})
export class CoursesModule {}
