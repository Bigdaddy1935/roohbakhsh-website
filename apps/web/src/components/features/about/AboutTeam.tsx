"use client";

import { useLocale, useTranslations } from "next-intl";
import { RiUserLine } from "react-icons/ri";
import { useInstructors } from "@/hooks/queries/use-instructors";

export default function AboutTeam() {
  const t = useTranslations("About.team");
  const locale = useLocale() as "ar" | "ur";
  const { data: instructors, isLoading } = useInstructors();

  const list = (instructors ?? []).slice(0, 4);

  return (
    <section className="py-16">
      <div className="container">
        <div className="text-center mb-12">
          <p className="text-[var(--brand)] text-sm font-semibold mb-1">{t("subtitle")}</p>
          <h2 className="text-2xl lg:text-3xl font-extrabold text-[var(--ink)]">{t("title")}</h2>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-y-3 p-6 rounded-md border border-gray-100 animate-pulse">
                <div className="size-20 rounded-full bg-gray-100" />
                <div className="h-4 w-32 bg-gray-100 rounded" />
                <div className="h-3 w-24 bg-gray-100 rounded" />
              </div>
            ))}
          </div>
        ) : list.length === 0 ? null : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {list.map((instructor) => (
              <div key={instructor.id} className="flex flex-col items-center text-center gap-y-3 p-6 rounded-md border border-gray-100">
                {instructor.avatarUrl ? (
                  <img
                    src={instructor.avatarUrl}
                    alt={instructor.name[locale] ?? ""}
                    className="size-20 rounded-full object-cover border-2 border-[var(--brand)]/20"
                  />
                ) : (
                  <div className="size-20 rounded-full bg-[var(--brand)]/10 flex items-center justify-center">
                    <RiUserLine size={32} className="text-[var(--brand)]/50" />
                  </div>
                )}
                <p className="font-extrabold text-[var(--ink)] text-[15px]">
                  {instructor.name[locale]}
                </p>
                {instructor.bio?.[locale] && (
                  <p className="text-xs text-gray-400 leading-5 line-clamp-2">
                    {instructor.bio[locale]}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
