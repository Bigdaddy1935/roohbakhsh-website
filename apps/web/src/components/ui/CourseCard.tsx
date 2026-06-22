"use client";

import { Link } from "@/i18n/navigation";
import { RiStarFill, RiUserLine } from "react-icons/ri";

export type CourseCardData = {
  id: string;
  title: string;
  description: string;
  instructor: string;
  rating: number;
  students: number;
  duration: number;
  price: string;
  originalPrice?: string;
  discount?: number;
  image: string;
  href: string;
  isFree?: boolean;
  category: string;
};

export default function CourseCard({ course, fluid: _fluid }: { course: CourseCardData; fluid?: boolean }) {
  return (
    <div className="group/course flex flex-col bg-white rounded-lg min-h-[402px] h-full">
      {/* Thumbnail */}
      <Link href={course.href} className="block cursor-pointer">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={course.image}
          alt={course.title}
          className="w-full aspect-video object-cover rounded-lg group-hover/course:brightness-110 transition-all"
          loading="lazy"
        />
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

        {/* Divider rows */}
        <div className="space-y-2 sm:space-y-3 divide-y divide-gray-100">
          {/* Row 1: instructor | rating */}
          <div className="pb-2 sm:pb-3 flex items-center justify-between">
            <div className="flex items-center gap-x-2 cursor-pointer">
              <span className="size-5 sm:size-6 rounded-full bg-[var(--brand)]/15 flex items-center justify-center shrink-0">
                <RiUserLine size={12} className="text-[var(--brand)]" />
              </span>
              <span className="text-[11px] sm:text-xs text-gray-700 truncate max-w-[120px]">{course.instructor}</span>
            </div>
            <div className="flex items-center gap-x-1">
              <span className="text-xs sm:text-sm text-gray-500">{course.rating > 0 ? course.rating.toFixed(1) : "5"}</span>
              <RiStarFill size={16} className="text-yellow-400" />
            </div>
          </div>

          {/* Row 2: students | price */}
          <div className="flex items-end justify-between pt-2">
            {/* Students */}
            <div className="flex items-center gap-x-1 text-gray-500">
              <RiUserLine size={16} />
              <span className="text-sm font-normal">{course.students > 0 ? course.students.toLocaleString() : "—"}</span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-x-2 sm:gap-x-3.5">
              {course.isFree ? (
                <span className="text-sm sm:text-base font-bold text-[var(--brand)]">{course.price}</span>
              ) : course.discount ? (
                <>
                  {/* Price column: original + new */}
                  <div className="flex flex-col items-end -space-y-1">
                    <div className="flex items-center gap-x-2">
                      <span className="text-xs font-light line-through text-gray-400">{course.originalPrice}</span>
                    </div>
                    <span className="text-sm sm:text-base font-bold text-[var(--brand)]">{course.price}</span>
                  </div>
                  {/* Discount badge */}
                  <div className="flex flex-col items-center gap-y-1 text-xs sm:text-sm">
                    <span className="w-7 sm:w-10 font-bold bg-[var(--brand)] text-white text-center rounded-md py-0.5 text-[11px]">
                      {course.discount}%
                    </span>
                  </div>
                </>
              ) : (
                <span className="text-sm sm:text-base font-bold text-[var(--brand)]">{course.price}</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
