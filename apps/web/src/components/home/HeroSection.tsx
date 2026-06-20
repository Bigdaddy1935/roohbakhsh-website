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
      <section className="relative overflow-hidden bg-gradient-to-b from-[#edfaf5] to-[var(--bg)] py-14 lg:py-20">
        {/* Decorative blobs */}
        <span className="pointer-events-none absolute -top-28 -end-28 size-[420px] rounded-full bg-[var(--brand)]/8 blur-3xl" />
        <span className="pointer-events-none absolute bottom-0 start-0 size-72 rounded-full bg-[var(--cta)]/6 blur-3xl" />

        <div className="container relative">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">

            {/* ── Text ── */}
            <div className="flex-1 flex flex-col gap-y-6 text-center lg:text-start">
              <span className="inline-flex items-center gap-x-2 self-center lg:self-start px-4 py-1.5 rounded-full bg-[var(--brand)]/10 text-[var(--brand)] text-sm font-bold">
                <span className="size-2 rounded-full bg-[var(--brand)] animate-pulse" />
                {t("badge")}
              </span>

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
                className="w-full max-w-md"
              >
                <div className="relative flex items-center bg-white rounded-xl shadow-lg shadow-black/8 border border-gray-200 focus-within:border-[var(--brand)] focus-within:shadow-[var(--brand)]/15 transition-all duration-200">
                  <RiSearchLine size={20} className="absolute start-4 text-gray-400 pointer-events-none shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t("search_placeholder")}
                    className="w-full h-13 ps-11 pe-32 text-sm text-[var(--ink)] placeholder:text-gray-400 bg-transparent outline-none"
                  />
                  <button
                    type="submit"
                    className="absolute end-2 h-9 px-5 rounded-lg bg-[var(--cta)] text-white text-sm font-bold hover:opacity-90 transition-opacity whitespace-nowrap shadow-md shadow-[var(--cta)]/25"
                  >
                    {t("search_btn")}
                  </button>
                </div>
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
                src="/hero-student.png"
                alt="طالب يتعلم العلوم الإسلامية"
                className="w-full max-w-[520px] object-contain drop-shadow-2xl"
              />
            </div>

          </div>
        </div>
      </section>
    </>
  );
}
