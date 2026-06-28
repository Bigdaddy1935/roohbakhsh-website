"use client";

import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  RiTelegramLine,
  RiInstagramLine,
  RiLinkedinBoxLine,
  RiTwitterXLine,
  RiMailLine,
} from "react-icons/ri";
import { useCourses } from "@/hooks/queries/use-courses";

const USEFUL_LINKS = [
  { key: "link_terms",   href: "/terms"   },
  { key: "link_about",   href: "/about"   },
] as const;

const SOCIALS = [
  { Icon: RiTelegramLine,    href: "https://t.me/roohbakhsh",                label: "Telegram",  color: "hover:bg-[#29a7e1]" },
  { Icon: RiInstagramLine,   href: "https://instagram.com/roohbakhsh",        label: "Instagram", color: "hover:bg-[#e1306c]" },
  { Icon: RiLinkedinBoxLine, href: "https://linkedin.com/company/roohbakhsh", label: "LinkedIn",  color: "hover:bg-[#0077b5]" },
  { Icon: RiTwitterXLine,    href: "https://x.com/roohbakhsh",               label: "X",         color: "hover:bg-[#1da1f2]" },
] as const;

export default function Footer() {
  const t = useTranslations("Footer");
  const locale = useLocale() as "ar" | "ur";
  const { data: coursesData } = useCourses({ limit: 4 });
  const courses = coursesData?.items ?? [];

  return (
    <footer className="py-6 sm:pt-8 lg:pt-12 sm:pb-8">
      <div className="container">
      <div className="rounded-lg bg-[#242424] overflow-hidden px-10 py-8">

      {/* Main grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

        {/* About */}
        <div className="flex flex-col gap-y-5 lg:col-span-1">
          <h3 className="font-extrabold text-white text-lg">{t("about_title")}</h3>
          <p className="text-sm leading-9 text-[#d6d6d6]">{t("about_desc")}</p>
          {/* Socials */}
          <div className="flex items-center gap-x-2 mt-1">
            {SOCIALS.map(({ Icon, href, label, color }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className={`flex items-center justify-center size-9 rounded-full bg-white/10 text-[#d6d6d6] hover:text-white transition-all duration-200 ${color}`}
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>

        {/* Suggested Courses */}
        <div className="flex flex-col gap-y-8">
          <h3 className="font-extrabold text-white text-lg">{t("courses_title")}</h3>
          <ul className="flex flex-col gap-y-5">
            {courses.map((course) => (
              <li key={course.id}>
                <Link
                  href={`/courses/${course.slug}`}
                  className="flex items-center gap-x-2 text-sm text-[#d6d6d6] hover:text-[var(--brand)] transition-colors"
                >
                  <span className="text-[var(--brand)] font-bold leading-none">-</span>
                  {course.title[locale]}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Useful Links */}
        <div className="flex flex-col gap-y-8">
          <h3 className="font-extrabold text-white text-lg">{t("useful_links_title")}</h3>
          <ul className="flex flex-col gap-y-5">
            {USEFUL_LINKS.map(({ key, href }) => (
              <li key={key}>
                <Link
                  href={href}
                  className="flex items-center gap-x-2 text-sm text-[#d6d6d6] hover:text-[var(--brand)] transition-colors"
                >
                  <span className="text-[var(--brand)] font-bold leading-none">-</span>
                  {t(key)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div className="flex flex-col gap-y-8">
          <h3 className="font-extrabold text-white text-lg">{t("contact_title")}</h3>
          <ul className="flex flex-col gap-y-5">
            <li>
              <a
                href="https://t.me/roohbakhsh_support"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-x-2 text-sm text-[#d6d6d6] hover:text-[var(--brand)] transition-colors"
              >
                <RiTelegramLine size={15} className="text-[var(--brand)] shrink-0" />
                {t("contact_telegram")}
              </a>
            </li>
            <li>
              <a
                href="mailto:info@roohbakhshac.ir"
                className="flex items-center gap-x-2 text-sm text-[#d6d6d6] hover:text-[var(--brand)] transition-colors"
              >
                <RiMailLine size={15} className="text-[var(--brand)] shrink-0" />
                {t("contact_email")}
              </a>
            </li>
          </ul>
        </div>

      </div>

      {/* Bottom bar */}
      <div className="mt-12">
        <div className="bg-[#3A3A3A] rounded-md px-4 sm:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-y-3 sm:gap-y-2 text-xs text-center sm:text-start">
          <span className="text-white leading-6">© {new Date().getFullYear()} — {t("copyright")}</span>
          <span className="text-white">{t("built_by")}</span>
        </div>
      </div>

      </div>
      </div>
    </footer>
  );
}
