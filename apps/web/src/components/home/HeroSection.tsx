"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import {
  RiSearchLine,
  RiAwardLine,
  RiUserStarLine,
  RiGiftLine,
} from "react-icons/ri";

export default function HeroSection() {
  const t = useTranslations("Home.hero");
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <>
      <section className="container relative py-10 sm:py-16 lg:py-20 overflow-hidden">
          <div className="flex flex-col-reverse lg:flex-row items-center gap-12 lg:gap-16">

            {/* ── Text ── */}
            <div className="flex-1 flex flex-col gap-y-6 text-center lg:text-start">
              <h1 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-extrabold text-[var(--ink)] leading-tight">
                {t("title_1")}
                <span className="block text-[var(--brand)] mt-1">{t("title_2")}</span>
              </h1>

              <p className="text-base text-gray-500 leading-8 max-w-xl mx-auto lg:mx-0">
                {t("description")}
              </p>

              {/* Search box */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (searchQuery.trim()) router.push(`/courses?q=${encodeURIComponent(searchQuery.trim())}`);
                }}
                className="w-full max-w-md mx-auto lg:mx-0 flex items-center justify-between gap-x-4 bg-white py-2.5 ps-5 pe-2.5 rounded-xl"
              >
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t("search_placeholder")}
                  className="w-full text-sm text-[var(--ink)] placeholder:text-gray-400 bg-transparent outline-none"
                />
                <button
                  type="submit"
                  className="flex items-center justify-center shrink-0 size-10 sm:size-12 bg-[var(--brand)]/10 text-[var(--brand)] rounded-lg cursor-pointer border border-transparent hover:border-[var(--brand)]/50 transition-colors"
                >
                  <RiSearchLine size={20} />
                </button>
              </form>

              {/* Trust indicators */}
              <div className="flex flex-wrap items-center gap-x-6 gap-y-3 justify-center lg:justify-start mt-1">
                <span className="flex items-center gap-x-2 text-sm text-gray-500">
                  <RiAwardLine size={18} className="text-[var(--brand)] shrink-0" />
                  {t("trust_1")}
                </span>
                <span className="flex items-center gap-x-2 text-sm text-gray-500">
                  <RiUserStarLine size={18} className="text-[var(--brand)] shrink-0" />
                  {t("trust_2")}
                </span>
                <span className="flex items-center gap-x-2 text-sm text-gray-500">
                  <RiGiftLine size={18} className="text-[var(--brand)] shrink-0" />
                  {t("trust_3")}
                </span>
              </div>
            </div>

            {/* ── Hero image ── */}
            <div className="flex-1 w-full max-w-md lg:max-w-none flex items-end justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://sabzlearn.ir/young-man.webp"
                alt="طالب يتعلم العلوم الإسلامية"
                className="w-full max-w-[520px] object-contain drop-shadow-2xl"
              />
            </div>

          </div>
      </section>
    </>
  );
}
