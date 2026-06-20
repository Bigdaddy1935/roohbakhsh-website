"use client";

import Image from "next/image";
import { Link } from "@/i18n/navigation";
import {
  RiStarFill,
  RiUserLine,
  RiTimeLine,
} from "react-icons/ri";

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

export default function CourseCard({ course, fluid }: { course: CourseCardData; fluid?: boolean }) {
  return (
    <Link
      href={course.href}
      className={`group flex flex-col bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-[var(--brand)]/20 transition-all duration-300 overflow-hidden ${fluid ? "w-full" : "w-72 shrink-0"}`}
    >
      {/* Thumbnail */}
      <div className="relative h-44 overflow-hidden bg-gray-100">
        <Image
          src={course.image}
          alt={course.title}
          fill
          draggable={false}
          className="object-cover transition-transform duration-500 group-hover:scale-105 pointer-events-none"
          sizes="288px"
        />
        {/* Category badge */}
        <span className="absolute top-3 start-3 px-2.5 py-1 rounded-lg bg-black/40 backdrop-blur text-white text-[11px] font-semibold">
          {course.category}
        </span>
        {/* Price badge */}
        {course.isFree ? (
          <span className="absolute top-3 end-3 px-2.5 py-1 rounded-lg bg-[var(--brand)] text-white text-[11px] font-bold">
            مجاني
          </span>
        ) : course.discount ? (
          <span className="absolute top-3 end-3 px-2.5 py-1 rounded-lg bg-rose-500 text-white text-[11px] font-bold">
            {course.discount}٪
          </span>
        ) : null}
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-4 gap-y-2.5">
        <h3 className="font-bold text-[var(--ink)] text-[14px] leading-6 line-clamp-2 group-hover:text-[var(--brand)] transition-colors">
          {course.title}
        </h3>
        <p className="text-[12px] text-gray-400 line-clamp-2 leading-5">
          {course.description}
        </p>

        {/* Rating row */}
        <div className="flex items-center gap-x-1 mt-0.5">
          {[1, 2, 3, 4, 5].map((s) => (
            <RiStarFill
              key={s}
              size={13}
              className={s <= Math.round(course.rating) ? "text-[var(--cta)]" : "text-gray-200"}
            />
          ))}
          <span className="text-[11px] text-gray-400 ms-1">{course.rating.toFixed(1)}</span>
        </div>

        {/* Instructor + students */}
        <div className="flex items-center justify-between text-[11px] text-gray-400 mt-auto pt-2 border-t border-gray-50">
          <span className="flex items-center gap-x-1.5">
            <span className="size-6 rounded-full bg-[var(--brand)]/15 flex items-center justify-center shrink-0">
              <RiUserLine size={12} className="text-[var(--brand)]" />
            </span>
            <span className="truncate max-w-[110px]">{course.instructor}</span>
          </span>
          <span className="flex items-center gap-x-1">
            <RiTimeLine size={11} />
            {course.duration}h
          </span>
        </div>

        {/* Price row */}
        <div className="flex items-center justify-between mt-1">
          {course.isFree ? (
            <span className="text-[var(--brand)] font-bold text-[15px]">مجاني</span>
          ) : (
            <div className="flex items-end gap-x-2">
              <span className="text-[var(--brand)] font-extrabold text-[15px]">{course.price}</span>
              {course.originalPrice && (
                <span className="text-gray-300 text-[11px] line-through">{course.originalPrice}</span>
              )}
            </div>
          )}
          <span className="flex items-center gap-x-1 text-[11px] text-gray-400">
            <RiUserLine size={11} />
            {course.students.toLocaleString()}
          </span>
        </div>
      </div>
    </Link>
  );
}
