"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  RiTelegramLine,
  RiInstagramLine,
  RiLinkedinBoxLine,
  RiTwitterXLine,
  RiMailLine,
  RiArrowLeftSLine,
} from "react-icons/ri";

const USEFUL_LINKS = [
  { key: "link_terms",   href: "/terms"   },
  { key: "link_support", href: "/support" },
  { key: "link_about",   href: "/about"   },
  { key: "link_contact", href: "/contact" },
] as const;

const COURSES = [
  { key: "course_1", href: "/courses/quran"   },
  { key: "course_2", href: "/courses/fiqh"    },
  { key: "course_3", href: "/courses/history" },
  { key: "course_4", href: "/courses/arabic"  },
] as const;

const SOCIALS = [
  { Icon: RiTelegramLine,    href: "https://t.me/roohbakhsh",                    label: "Telegram"  },
  { Icon: RiInstagramLine,   href: "https://instagram.com/roohbakhsh",            label: "Instagram" },
  { Icon: RiLinkedinBoxLine, href: "https://linkedin.com/company/roohbakhsh",     label: "LinkedIn"  },
  { Icon: RiTwitterXLine,    href: "https://x.com/roohbakhsh",                   label: "X"         },
] as const;

export default function Footer() {
  const t = useTranslations("Footer");

  return (
    <footer className="bg-[#1a1f36] text-gray-300 mt-8">

        {/* Main grid */}
        <div className="container py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">

          {/* About */}
          <div className="flex flex-col gap-y-5">
            <Link href="/" className="inline-block">
              <Image src="https://roohbakhshac.ir/logo.png" alt="روح‌بخش" width={130} height={44} className="object-contain h-11 w-auto brightness-0 invert" />
            </Link>
            <p className="text-sm leading-7 text-gray-400">{t("about_desc")}</p>
            <div className="flex items-center gap-x-2.5 mt-1">
              {SOCIALS.map(({ Icon, href, label }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                  className="flex items-center justify-center size-9 rounded-xl bg-white/5 hover:bg-[var(--brand)] text-gray-400 hover:text-white transition-all duration-200">
                  <Icon size={17} />
                </a>
              ))}
            </div>
          </div>

          {/* Useful links */}
          <div className="flex flex-col gap-y-4">
            <h3 className="text-white font-bold text-sm uppercase tracking-wide opacity-60 mb-1">{t("useful_links_title")}</h3>
            <ul className="flex flex-col gap-y-2.5">
              {USEFUL_LINKS.map(({ key, href }) => (
                <li key={key}>
                  <Link href={href} className="flex items-center gap-x-1.5 text-sm text-gray-400 hover:text-[var(--brand)] transition-colors group">
                    <RiArrowLeftSLine size={15} className="text-[var(--brand)] opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                    {t(key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Courses */}
          <div className="flex flex-col gap-y-4">
            <h3 className="text-white font-bold text-sm uppercase tracking-wide opacity-60 mb-1">{t("courses_title")}</h3>
            <ul className="flex flex-col gap-y-2.5">
              {COURSES.map(({ key, href }) => (
                <li key={key}>
                  <Link href={href} className="flex items-center gap-x-1.5 text-sm text-gray-400 hover:text-[var(--brand)] transition-colors group">
                    <RiArrowLeftSLine size={15} className="text-[var(--brand)] opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                    {t(key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="flex flex-col gap-y-4">
            <h3 className="text-white font-bold text-sm uppercase tracking-wide opacity-60 mb-1">{t("contact_title")}</h3>
            <ul className="flex flex-col gap-y-2.5">
              <li>
                <a href="https://t.me/roohbakhsh_support" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-x-2.5 text-sm text-gray-400 hover:text-[var(--brand)] transition-colors">
                  <RiTelegramLine size={15} className="text-[var(--brand)] shrink-0" />
                  {t("contact_telegram")}
                </a>
              </li>
              <li>
                <a href="mailto:info@roohbakhshac.ir" className="flex items-center gap-x-2.5 text-sm text-gray-400 hover:text-[var(--brand)] transition-colors">
                  <RiMailLine size={15} className="text-[var(--brand)] shrink-0" />
                  {t("contact_email")}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/[0.06]">
          <div className="container py-5 flex flex-col sm:flex-row items-center justify-between gap-y-2 text-xs text-gray-600">
            <span>© {new Date().getFullYear()} — {t("copyright")}</span>
            <span>{t("built_by")}</span>
          </div>
        </div>

    </footer>
  );
}
