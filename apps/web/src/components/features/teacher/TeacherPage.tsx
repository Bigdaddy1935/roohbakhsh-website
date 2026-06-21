"use client";

import Image from "next/image";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { RiArrowRightSLine, RiUserStarLine, RiBookOpenLine, RiStarFill, RiGroupLine } from "react-icons/ri";
import { getTeacher } from "@/data/teacher.mock";
import { COURSE_DETAILS } from "@/data/course-detail.mock";
import CourseCard from "@/components/ui/CourseCard";

const UI = {
  ar: { home: "الرئيسية", courses: "الدورات", teacherCourses: "دورات المدرس", noCoures: "لا توجد دورات بعد", viewProfile: "عرض ملف المدرس", student: "طالب", course: "دورة", rating: "تقييم" },
  ur: { home: "ہوم", courses: "کورسز", teacherCourses: "استاد کے کورسز", noCoures: "ابھی کوئی کورس نہیں", viewProfile: "استاد کا پروفائل", student: "طلباء", course: "کورسز", rating: "ریٹنگ" },
};

export default function TeacherPage({ slug }: { slug: string }) {
  const locale = useLocale() as "ar" | "ur";
  const ui = UI[locale];
  const teacher = getTeacher(slug);

  if (!teacher) {
    return (
      <div className="container py-32 text-center text-gray-400">
        المدرس غير موجود
      </div>
    );
  }

  const courses = teacher.courseIds
    .map((id) => COURSE_DETAILS[id])
    .filter(Boolean);

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <div className="container py-10">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-x-2 text-sm text-gray-400 mb-8 overflow-x-hidden">
          <Link href="/" className="hover:text-[var(--brand)] transition-colors whitespace-nowrap">{ui.home}</Link>
          <RiArrowRightSLine size={14} className="rotate-180 text-gray-300 shrink-0" />
          <Link href="/courses" className="hover:text-[var(--brand)] transition-colors whitespace-nowrap">{ui.courses}</Link>
          <RiArrowRightSLine size={14} className="rotate-180 text-gray-300 shrink-0" />
          <span className="text-[var(--ink)] font-semibold truncate">{teacher.name[locale]}</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-8 items-start">

          {/* ── Instructor sidebar (RIGHT in RTL = first in DOM) ── */}
          <aside className="lg:w-[300px] shrink-0 sticky top-24 self-start">
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="bg-gradient-to-b from-[#edfaf5] to-white px-6 pt-8 pb-6 flex flex-col items-center text-center">
                <div className="relative mb-4">
                  <Image
                    src={teacher.avatar}
                    alt={teacher.name[locale]}
                    width={100}
                    height={100}
                    className="rounded-full object-cover border-4 border-white shadow-lg"
                    style={{ width: 100, height: 100 }}
                  />
                  <span className="absolute -bottom-1 -end-1 size-7 rounded-full bg-[var(--brand)] flex items-center justify-center shadow">
                    <RiUserStarLine size={14} className="text-white" />
                  </span>
                </div>
                <h1 className="font-extrabold text-[var(--ink)] text-lg leading-snug">{teacher.name[locale]}</h1>
                <p className="text-sm text-gray-400 mt-1">{teacher.title[locale]}</p>
              </div>
              <div className="grid grid-cols-3 divide-x divide-x-reverse divide-gray-100 border-t border-gray-100">
                {[
                  { icon: <RiGroupLine size={18} className="text-[var(--brand)]" />, val: `${(teacher.students / 1000).toFixed(0)}K`, label: ui.student },
                  { icon: <RiBookOpenLine size={18} className="text-[var(--brand)]" />, val: teacher.courses.toString(), label: ui.course },
                  { icon: <RiStarFill size={18} className="text-[var(--cta)]" />, val: teacher.rating.toString(), label: ui.rating },
                ].map((s, i) => (
                  <div key={i} className="flex flex-col items-center gap-y-1 py-4 text-center">
                    {s.icon}
                    <span className="font-bold text-[var(--ink)] text-sm">{s.val}</span>
                    <span className="text-[11px] text-gray-400">{s.label}</span>
                  </div>
                ))}
              </div>
              <div className="px-5 py-5 border-t border-gray-100">
                <p className="text-sm text-gray-500 leading-7">{teacher.bio[locale]}</p>
              </div>
            </div>
          </aside>

          {/* ── Courses (LEFT in RTL = second in DOM) ── */}
          <main className="flex-1 min-w-0">
            <h2 className="text-lg font-bold text-[var(--ink)] mb-5 flex items-center gap-x-2">
              <RiBookOpenLine size={20} className="text-[var(--brand)]" />
              {ui.teacherCourses}
            </h2>
            {courses.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {courses.map((course) => (
                  <CourseCard key={course.id} course={{
                    id: course.id,
                    title: course.title[locale],
                    description: course.description[locale].slice(0, 100),
                    image: course.image,
                    category: course.category[locale],
                    instructor: course.instructor.name[locale],
                    rating: course.rating,
                    students: course.students,
                    duration: course.hoursTotal,
                    price: course.discountedPrice === 0 ? "مجاني" : course.discountedPrice.toLocaleString(),
                    originalPrice: course.originalPrice.toLocaleString(),
                    discount: course.discountPct,
                    isFree: course.discountedPrice === 0,
                    href: `/courses/${course.id}`,
                  }} fluid />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                <RiBookOpenLine size={48} className="mb-3 opacity-30" />
                <p>{ui.noCoures}</p>
              </div>
            )}
          </main>

        </div>
      </div>
    </div>
  );
}
