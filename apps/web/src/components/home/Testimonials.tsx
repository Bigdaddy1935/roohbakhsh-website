"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useTranslations, useLocale } from "next-intl";
import { RiStarFill, RiArrowRightSLine, RiArrowLeftSLine, RiDoubleQuotesL } from "react-icons/ri";

type Testimonial = {
  name: { ar: string; ur: string };
  country: { ar: string; ur: string };
  course: { ar: string; ur: string };
  text: { ar: string; ur: string };
  rating: number;
  initials: string;
  color: string;
};

const TESTIMONIALS: Testimonial[] = [
  {
    name: { ar: "سارة عبدالله", ur: "سارہ عبداللہ" },
    country: { ar: "المملكة العربية السعودية", ur: "سعودی عرب" },
    course: { ar: "تجويد القرآن الكريم", ur: "تجوید القرآن الکریم" },
    text: {
      ar: "تجربة تعليمية رائعة! استطعت إتقان أحكام التجويد في وقت قصير بفضل أسلوب الشيخ البسيط والمحتوى المنظّم. أنصح به كل مسلم يريد تحسين تلاوته.",
      ur: "بہترین تعلیمی تجربہ! شیخ کے آسان انداز اور منظم مواد کی وجہ سے میں نے کم وقت میں تجوید کے احکام سیکھ لیے۔ ہر مسلمان کے لیے سفارش کرتی ہوں۔",
    },
    rating: 5,
    initials: "سع",
    color: "bg-emerald-500",
  },
  {
    name: { ar: "يوسف كريمي", ur: "یوسف کریمی" },
    country: { ar: "إيران", ur: "ایران" },
    course: { ar: "أصول الفقه الإسلامي", ur: "اصول فقہ اسلامی" },
    text: {
      ar: "الدكتور البستاني يشرح المسائل المعقدة بطريقة جميلة جداً. استطعت فهم أصول الفقه لأول مرة بشكل صحيح وعميق. هذه الأكاديمية كنز حقيقي.",
      ur: "ڈاکٹر البستانی پیچیدہ مسائل کو انتہائی خوبصورت انداز میں سمجھاتے ہیں۔ میں نے پہلی بار اصول فقہ کو صحیح اور گہرے انداز سے سمجھا۔ یہ اکیڈمی واقعی ایک خزانہ ہے۔",
    },
    rating: 5,
    initials: "یک",
    color: "bg-blue-500",
  },
  {
    name: { ar: "نور الإسلام", ur: "نور الاسلام" },
    country: { ar: "باكستان", ur: "پاکستان" },
    course: { ar: "السيرة النبوية", ur: "سیرت النبی ﷺ" },
    text: {
      ar: "ما توقعت أن دراسة السيرة ستكون ممتعة إلى هذا الحد. الأستاذ يربط الأحداث التاريخية بواقعنا المعاصر بشكل مدهش. شكراً لأكاديمية روح‌بخش.",
      ur: "مجھے امید نہ تھی کہ سیرت کا مطالعہ اتنا دلچسپ ہوگا۔ استاد تاریخی واقعات کو ہمارے دور سے اتنے خوبصورت انداز میں جوڑتے ہیں۔ روح‌بخش اکیڈمی کا شکریہ۔",
    },
    rating: 5,
    initials: "نا",
    color: "bg-amber-500",
  },
  {
    name: { ar: "عائشة محمود", ur: "عائشہ محمود" },
    country: { ar: "مصر", ur: "مصر" },
    course: { ar: "اللغة العربية", ur: "عربی زبان" },
    text: {
      ar: "كنت أخاف من النحو، الآن أحبه! الدكتورة فاطمة طريقتها في التدريس تجعل أصعب القواعد سهلة ومحببة. المحتوى المجاني وحده يستحق المتابعة.",
      ur: "میں نحو سے ڈرتی تھی، اب مجھے پسند ہے! ڈاکٹرہ فاطمہ کا پڑھانے کا انداز مشکل ترین قواعد کو بھی آسان بنا دیتا ہے۔ مفت مواد بھی قابل تعریف ہے۔",
    },
    rating: 5,
    initials: "عم",
    color: "bg-rose-500",
  },
];

export default function Testimonials() {
  const t = useTranslations("Home.testimonials");
  const locale = useLocale() as "ar" | "ur";
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => setCurrent((c) => (c + 1) % TESTIMONIALS.length), []);
  const prev = useCallback(() => setCurrent((c) => (c - 1 + TESTIMONIALS.length) % TESTIMONIALS.length), []);

  useEffect(() => {
    const id = setInterval(next, 5000);
    return () => clearInterval(id);
  }, [next]);

  /* Drag-to-swipe */
  const dragStartX = useRef(0);
  const dragging = useRef(false);
  const onPointerDown = (e: React.PointerEvent) => {
    dragStartX.current = e.clientX;
    dragging.current = true;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onPointerUp = (e: React.PointerEvent) => {
    if (!dragging.current) return;
    dragging.current = false;
    const diff = e.clientX - dragStartX.current;
    if (Math.abs(diff) > 50) diff > 0 ? prev() : next();
  };

  const item = TESTIMONIALS[current];

  return (
    <section className="py-16 bg-gradient-to-br from-[#f0faf7] to-[var(--bg)]">
      <div className="container">

        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-[var(--brand)] text-sm font-semibold mb-1.5">{t("subtitle")}</p>
          <h2 className="text-2xl lg:text-3xl font-extrabold text-[var(--ink)]">{t("title")}</h2>
        </div>

        {/* Card */}
        <div className="relative max-w-2xl mx-auto">
          <div
            className="bg-white rounded-3xl shadow-xl shadow-black/5 p-8 lg:p-10 transition-all duration-500 cursor-grab active:cursor-grabbing select-none"
            onPointerDown={onPointerDown}
            onPointerUp={onPointerUp}
          >

            {/* Quote icon */}
            <RiDoubleQuotesL size={40} className="text-[var(--brand)]/15 mb-4" />

            {/* Text */}
            <p className="text-[var(--ink)] text-base leading-8 mb-8">
              {item.text[locale]}
            </p>

            {/* Stars */}
            <div className="flex items-center gap-x-1 mb-5">
              {[1, 2, 3, 4, 5].map((s) => (
                <RiStarFill key={s} size={16} className={s <= item.rating ? "text-[var(--cta)]" : "text-gray-200"} />
              ))}
            </div>

            {/* Author */}
            <div className="flex items-center gap-x-4">
              <div className={`size-12 rounded-2xl ${item.color} flex items-center justify-center text-white font-bold text-sm shrink-0`}>
                {item.initials}
              </div>
              <div>
                <p className="font-bold text-[var(--ink)] text-sm">{item.name[locale]}</p>
                <p className="text-[12px] text-gray-400 mt-0.5">
                  {item.country[locale]} · {item.course[locale]}
                </p>
              </div>
            </div>
          </div>

          {/* Nav */}
          <div className="flex items-center justify-center gap-x-4 mt-8">
            <button type="button" onClick={prev} className="size-10 rounded-xl border border-gray-200 flex items-center justify-center text-gray-400 hover:border-[var(--brand)] hover:text-[var(--brand)] transition-colors cursor-pointer">
              <RiArrowRightSLine size={20} />
            </button>
            {/* Dots */}
            <div className="flex items-center gap-x-2">
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setCurrent(i)}
                  className={`transition-all duration-300 rounded-full cursor-pointer ${
                    i === current
                      ? "w-6 h-2.5 bg-[var(--brand)]"
                      : "size-2.5 bg-gray-200 hover:bg-gray-300"
                  }`}
                />
              ))}
            </div>
            <button type="button" onClick={next} className="size-10 rounded-xl border border-gray-200 flex items-center justify-center text-gray-400 hover:border-[var(--brand)] hover:text-[var(--brand)] transition-colors cursor-pointer">
              <RiArrowLeftSLine size={20} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
