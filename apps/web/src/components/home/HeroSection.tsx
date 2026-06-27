"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter, Link } from "@/i18n/navigation";
import {
  RiSearchLine,
  RiAwardLine,
  RiUserStarLine,
  RiGiftLine,
  RiLoader4Line,
} from "react-icons/ri";
import { useCourses } from "@/hooks/queries/use-courses";

const MIN_SEARCH_CHARS = 3;

export default function HeroSection() {
  const t = useTranslations("Home.hero");
  const locale = useLocale() as "ar" | "ur";
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const id = setTimeout(() => setDebouncedQuery(searchQuery.trim()), 300);
    return () => clearTimeout(id);
  }, [searchQuery]);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setDropdownOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const searchActive = debouncedQuery.length >= MIN_SEARCH_CHARS;
  const { data, isLoading } = useCourses({ limit: 6, q: searchActive ? debouncedQuery : undefined });
  const results = searchActive ? data?.items ?? [] : [];

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
              <div ref={boxRef} className="relative w-full max-w-md mx-auto lg:mx-0">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (searchQuery.trim()) router.push(`/courses?q=${encodeURIComponent(searchQuery.trim())}`);
                  }}
                  className="flex items-center justify-between gap-x-4 bg-white py-2.5 ps-5 pe-2.5 rounded-xl"
                >
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setDropdownOpen(true)}
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

                {dropdownOpen && searchActive && (
                  <div className="absolute inset-x-0 top-full mt-2 bg-white rounded-xl shadow-lg border border-gray-100 text-start overflow-hidden z-20">
                    {isLoading ? (
                      <div className="flex items-center justify-center py-5">
                        <RiLoader4Line size={20} className="text-[var(--brand)] animate-spin" />
                      </div>
                    ) : results.length === 0 ? (
                      <p className="text-sm text-gray-400 text-center py-5">{t("search_no_results")}</p>
                    ) : (
                      <ul className="max-h-72 overflow-y-auto">
                        {results.map((course) => (
                          <li key={course.id}>
                            <Link
                              href={`/courses/${course.slug}`}
                              onClick={() => setDropdownOpen(false)}
                              className="block px-4 py-3 text-sm text-[var(--ink)] hover:bg-[var(--bg)] transition-colors truncate"
                            >
                              {course.title[locale]}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>

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
