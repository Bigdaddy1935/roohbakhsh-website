"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import {
  RiPlayCircleLine,
  RiSearchLine,
  RiAwardLine,
  RiUserStarLine,
  RiGiftLine,
  RiCloseLine,
} from "react-icons/ri";

const VIDEO_URL =
  "https://dl.poshtybanman.ir/Mahdyar/Daqdaqe-Daq/%D9%82%D8%B3%D9%85%D8%AA%201.mp4";

export default function HeroSection() {
  const t = useTranslations("Home.hero");
  const router = useRouter();
  const [videoOpen, setVideoOpen] = useState(false);
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

            {/* ── Video thumbnail ── */}
            <div className="flex-1 w-full max-w-md lg:max-w-none">
              <div
                className="relative rounded-xl overflow-hidden aspect-[4/3] shadow-2xl shadow-[var(--brand)]/20 cursor-pointer group bg-black"
                onClick={() => setVideoOpen(true)}
              >
                {/* Show real video first frame as poster */}
                {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
                <video
                  src={VIDEO_URL}
                  preload="metadata"
                  muted
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover"
                />

                {/* Dark overlay with play button */}
                <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center gap-y-3 group-hover:bg-black/40 transition-colors">
                  <div className="size-20 rounded-full bg-white/25 flex items-center justify-center ring-4 ring-white/20 group-hover:scale-110 transition-transform duration-300">
                    <RiPlayCircleLine size={48} className="text-white" />
                  </div>
                  <p className="text-white/80 text-sm font-medium">{t("video_hint")}</p>
                </div>

                {/* Floating info card */}
                <div className="absolute bottom-5 start-5 end-5 rounded-xl bg-white/95 backdrop-blur p-4 flex items-center gap-x-3 shadow-xl">
                  <div className="size-10 rounded-xl bg-[var(--cta)]/15 flex items-center justify-center shrink-0">
                    <RiAwardLine size={20} className="text-[var(--cta)]" />
                  </div>
                  <div>
                    <p className="text-[13px] font-bold text-[var(--ink)]">{t("card_title")}</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">{t("card_sub")}</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── Video modal ── */}
      {videoOpen && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={() => setVideoOpen(false)}
        >
          <div
            className="relative w-full max-w-3xl rounded-xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setVideoOpen(false)}
              className="absolute top-3 end-3 z-10 size-9 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition cursor-pointer"
            >
              <RiCloseLine size={20} />
            </button>
            {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
            <video
              src={VIDEO_URL}
              controls
              autoPlay
              className="w-full aspect-video bg-black"
            />
          </div>
        </div>
      )}
    </>
  );
}
