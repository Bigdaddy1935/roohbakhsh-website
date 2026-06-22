"use client";

import { Link } from "@/i18n/navigation";
import { RiStarFill, RiUserLine } from "react-icons/ri";

export type CourseCardData = {
  id: string;
  title: string;
  description: string;
  instructor: string;
  averageRating: number | null;
  reviewCount: number;
  participantCount: number;
  lessonCount: number;
  durationMinutes: number;
  price: string;
  originalPrice?: string;
  discount?: number;
  image: string;
  href: string;
  isFree?: boolean;
  level?: string;
};

export default function CourseCard({ course }: { course: CourseCardData }) {
  const rating = course.averageRating ?? 5;

  return (
    <div className="group/course flex flex-col bg-white rounded-lg min-h-[402px] h-full">
      {/* Thumbnail */}
      <Link href={course.href} className="block relative">
        <img
          src={course.image}
          alt={course.title}
          className="w-full aspect-video object-cover rounded-lg group-hover/course:brightness-110 transition-all"
          loading="lazy"
        />
        {course.discount && (
          <span className="absolute top-2 start-2 px-2 py-0.5 bg-[var(--cta)] text-white text-[11px] font-bold rounded-md">
            {course.discount}%
          </span>
        )}
      </Link>

      {/* Body */}
      <div className="px-3 sm:px-5 pb-4 pt-3 flex flex-col justify-between flex-1">
        {/* Title + description */}
        <div className="flex flex-col gap-y-3 mb-6">
          <h3>
            <Link
              href={course.href}
              className="text-sm sm:text-[15px] font-semibold text-[var(--ink)] line-clamp-2 hover:text-[var(--brand)] transition-colors leading-6"
            >
              {course.title}
            </Link>
          </h3>
          <p className="text-xs sm:text-sm text-gray-500 font-normal line-clamp-2 leading-7">
            {course.description}
          </p>
        </div>

        <div className="space-y-2 sm:space-y-3 divide-y divide-gray-100">
          {/* Row 1: instructor | rating */}
          <div className="pb-2 sm:pb-3 flex items-center justify-between">
            <div className="flex items-center gap-x-2">
              <span className="size-5 sm:size-6 rounded-full bg-[var(--brand)]/15 flex items-center justify-center shrink-0">
                <RiUserLine size={12} className="text-[var(--brand)]" />
              </span>
              <span className="text-[11px] sm:text-xs text-gray-700 truncate max-w-[120px]">
                {course.instructor}
              </span>
            </div>
            <div className="flex items-center gap-x-1">
              <RiStarFill size={14} className="text-yellow-400" />
              <span className="text-xs font-semibold text-gray-700">{rating.toFixed(1)}</span>
              {course.reviewCount > 0 && (
                <span className="text-[11px] text-gray-400">({course.reviewCount})</span>
              )}
            </div>
          </div>

          {/* Row 2: participants | price */}
          <div className="flex items-center justify-between pt-2 gap-x-2">
            {/* Participants — سمت راست */}
            <div className="flex items-center gap-x-1 text-[11px] text-gray-400">
              {course.participantCount > 0 ? (
                <>
                  <RiUserLine size={12} />
                  <span>{course.participantCount.toLocaleString()} دانشجو</span>
                </>
              ) : <span />}
            </div>

            {/* Price — سمت چپ */}
            <div className="flex items-center gap-x-1.5 shrink-0">
              {course.isFree ? (
                <span className="text-sm font-bold text-[var(--brand)]">{course.price}</span>
              ) : course.discount ? (
                <div className="flex flex-col items-end -space-y-0.5">
                  <span className="text-[11px] font-light line-through text-gray-400">{course.originalPrice}</span>
                  <span className="text-sm font-bold text-[var(--brand)]">{course.price}</span>
                </div>
              ) : (
                <span className="text-sm font-bold text-[var(--brand)]">{course.price}</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
