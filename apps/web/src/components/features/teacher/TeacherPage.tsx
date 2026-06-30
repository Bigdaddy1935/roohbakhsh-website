"use client";

import Image from "next/image";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { RiArrowRightSLine, RiUserStarLine, RiBookOpenLine, RiStarFill, RiGroupLine, RiLoader4Line } from "react-icons/ri";
import { useInstructorBySlug } from "@/hooks/queries/use-instructors";
import { useCourses } from "@/hooks/queries/use-courses";
import { formatMoney, isFree, discountPercent } from "@/lib/format";
import CourseCard from "@/components/ui/CourseCard";

const UI = {
  ar: { home: "الرئيسية", courses: "الدورات", teacherCourses: "دورات المدرس", noCourses: "لا توجد دورات بعد", student: "طالب", course: "دورة", rating: "تقييم" },
  ur: { home: "ہوم", courses: "کورسز", teacherCourses: "استاد کے کورسز", noCourses: "ابھی کوئی کورس نہیں", student: "طلباء", course: "کورسز", rating: "ریٹنگ" },
};

export default function TeacherPage({ slug }: { slug: string }) {
  const locale = useLocale() as "ar" | "ur";
  const ui = UI[locale];

  const { data: instructor, isLoading: loadingInstructor } = useInstructorBySlug(slug);
  const { data: coursesData, isLoading: loadingCourses } = useCourses({ limit: 50 });

  const instructorCourses = (coursesData?.items ?? []).filter(
    (c) => c.instructorId === instructor?.id,
  );

  if (loadingInstructor) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <RiLoader4Line size={36} className="text-[var(--brand)] animate-spin" />
      </div>
    );
  }

  if (!instructor) {
    return (
      <div className="container py-32 text-center text-gray-400">
        {locale === "ar" ? "المدرس غير موجود" : "استاد نہیں ملا"}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <div className="container py-10">

        <nav className="flex items-center gap-x-2 text-sm text-gray-400 mb-14 overflow-x-hidden">
          <Link href="/" className="hover:text-[var(--brand)] transition-colors whitespace-nowrap">{ui.home}</Link>
          <RiArrowRightSLine size={14} className="rotate-180 text-gray-300 shrink-0" />
          <Link href="/courses" className="hover:text-[var(--brand)] transition-colors whitespace-nowrap">{ui.courses}</Link>
          <RiArrowRightSLine size={14} className="rotate-180 text-gray-300 shrink-0" />
          <span className="text-[var(--ink)] font-semibold truncate">{instructor.name[locale]}</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-8 items-start">

          <aside className="lg:w-[300px] shrink-0 sticky top-24 self-start">
            <div className="bg-white rounded-lg overflow-hidden">
              <div className="px-6 pt-8 flex flex-col items-center text-center">
                <div className="relative mb-4">
                  {instructor.avatarUrl ? (
                    <Image
                      src={instructor.avatarUrl}
                      alt={instructor.name[locale]}
                      width={100}
                      height={100}
                      className="rounded-full object-cover border-4 border-white"
                      style={{ width: 100, height: 100 }}
                    />
                  ) : (
                    <div className="size-[100px] rounded-full bg-[var(--brand)]/10 flex items-center justify-center border-4 border-white">
                      <RiUserStarLine size={40} className="text-[var(--brand)]" />
                    </div>
                  )}
                </div>
                <h1 className="font-extrabold text-[var(--ink)] text-lg leading-snug">{instructor.name[locale]}</h1>
              </div>
              {instructor.bio && (
                <div className="px-5 pt-2 pb-8">
                  <p className="text-sm text-gray-500 leading-7">{instructor.bio[locale]}</p>
                </div>
              )}
            </div>
          </aside>

          <main className="flex-1 min-w-0">
            {loadingCourses ? (
              <div className="flex items-center justify-center py-20">
                <RiLoader4Line size={32} className="text-[var(--brand)] animate-spin" />
              </div>
            ) : instructorCourses.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {instructorCourses.map((course) => {
                  const free = isFree(course.effectivePrice);
                  const thumb = course.thumbnailUrl?.[locale] ?? course.thumbnailUrl?.ar ?? "";
                  return (
                    <CourseCard
                      key={course.id}
                      course={{
                        id: course.id,
                        href: `/courses/${course.slug}`,
                        image: thumb || "https://dl.poshtybanman.ir/upload/1%20(4)_63dd121c7b132.png",
                        title: course.title[locale],
                        description: course.description[locale],
                        instructor: course.instructor.name[locale],
                        averageRating: course.averageRating,
                        reviewCount: course.reviewCount,
                        participantCount: course.participantCount,
                        lessonCount: course.lessonCount,
                        durationMinutes: course.durationMinutes ?? 0,
                        price: free ? (locale === "ar" ? "مجاني" : "مفت") : formatMoney(course.effectivePrice, locale),
                        originalPrice: course.price ? formatMoney(course.price, locale) : undefined,
                        discount: discountPercent(course.price, course.effectivePrice) || undefined,
                        isFree: free,
                      }}
                    />
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                <RiBookOpenLine size={48} className="mb-3 opacity-30" />
                <p>{ui.noCourses}</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
