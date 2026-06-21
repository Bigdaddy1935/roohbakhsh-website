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
    country: { ar: "السعودية", ur: "سعودی عرب" },
    course: { ar: "تجويد القرآن الكريم", ur: "تجوید القرآن الکریم" },
    text: {
      ar: "تجربة تعليمية رائعة! استطعت إتقان أحكام التجويد في وقت قصير بفضل أسلوب الشيخ البسيط والمحتوى المنظّم.",
      ur: "بہترین تعلیمی تجربہ! شیخ کے آسان انداز اور منظم مواد کی وجہ سے کم وقت میں تجوید سیکھ لی۔",
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
      ar: "الدكتور البستاني يشرح المسائل المعقدة بطريقة جميلة جداً. استطعت فهم أصول الفقه لأول مرة بشكل صحيح.",
      ur: "ڈاکٹر البستانی پیچیدہ مسائل کو خوبصورت انداز میں سمجھاتے ہیں۔ یہ اکیڈمی واقعی ایک خزانہ ہے۔",
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
      ar: "ما توقعت أن دراسة السيرة ستكون ممتعة إلى هذا الحد. الأستاذ يربط الأحداث التاريخية بواقعنا المعاصر.",
      ur: "مجھے امید نہ تھی کہ سیرت کا مطالعہ اتنا دلچسپ ہوگا۔ روح‌بخش اکیڈمی کا شکریہ۔",
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
      ar: "كنت أخاف من النحو، الآن أحبه! الدكتورة فاطمة تجعل أصعب القواعد سهلة ومحببة للجميع.",
      ur: "میں نحو سے ڈرتی تھی، اب مجھے پسند ہے! ڈاکٹرہ فاطمہ مشکل ترین قواعد کو آسان بنا دیتی ہیں۔",
    },
    rating: 5,
    initials: "عم",
    color: "bg-rose-500",
  },
  {
    name: { ar: "حمزة الأحمدي", ur: "حمزہ احمدی" },
    country: { ar: "الكويت", ur: "کویت" },
    course: { ar: "العقيدة الطحاوية", ur: "عقیدہ طحاویہ" },
    text: {
      ar: "شرح مبسّط ورائع للعقيدة الطحاوية. استفدت كثيراً وتعمّق فهمي للعقيدة الإسلامية الصحيحة.",
      ur: "عقیدہ طحاویہ کی شاندار اور آسان تشریح۔ اسلامی عقیدے کی صحیح سمجھ میں بہت فائدہ ہوا۔",
    },
    rating: 5,
    initials: "حا",
    color: "bg-purple-500",
  },
  {
    name: { ar: "زينب الحسيني", ur: "زینب حسینی" },
    country: { ar: "الأردن", ur: "اردن" },
    course: { ar: "تفسير جزء عم", ur: "تفسیر جزء عم" },
    text: {
      ar: "دورة التفسير غيّرت علاقتي بالقرآن الكريم. الشرح العلمي الدقيق مع الأمثلة الحياتية جعل الفهم عميقاً.",
      ur: "تفسیر کورس نے قرآن کریم سے میرے تعلق کو بدل دیا۔ علمی شرح اور زندگی کی مثالوں نے گہری سمجھ دی۔",
    },
    rating: 5,
    initials: "زح",
    color: "bg-teal-500",
  },
];

const VISIBLE = 3; /* cards shown at once on desktop */

export default function Testimonials() {
  const t = useTranslations("Home.testimonials");
  const locale = useLocale() as "ar" | "ur";
  const [start, setStart] = useState(0);
  const total = TESTIMONIALS.length;
  const maxStart = total - VISIBLE;

  const next = useCallback(() => setStart((s) => (s >= maxStart ? 0 : s + 1)), [maxStart]);
  const prev = useCallback(() => setStart((s) => (s <= 0 ? maxStart : s - 1)), [maxStart]);

  useEffect(() => {
    const id = setInterval(next, 4000);
    return () => clearInterval(id);
  }, [next]);

  /* drag-to-swipe */
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

  /* visible window */
  const visible = Array.from({ length: VISIBLE }, (_, i) => TESTIMONIALS[(start + i) % total]);

  return (
    <section className="py-16 bg-gradient-to-br from-[#f0faf7] to-[var(--bg)] overflow-hidden">
      <div className="container">

        {/* Header */}
        <div className="text-center mb-10">
          <p className="text-[var(--brand)] text-sm font-semibold mb-1.5">{t("subtitle")}</p>
          <h2 className="text-2xl lg:text-3xl font-extrabold text-[var(--ink)]">{t("title")}</h2>
        </div>

        {/* Slider row */}
        <div
          className="cursor-grab active:cursor-grabbing select-none"
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 transition-all duration-500">
            {visible.map((item, i) => (
              <div
                key={`${start}-${i}`}
                className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300 p-5 flex flex-col gap-y-4"
              >
                {/* Quote + text */}
                <div>
                  <RiDoubleQuotesL size={28} className="text-[var(--brand)]/15 mb-2" />
                  <p className="text-[var(--ink)] text-sm leading-7 line-clamp-4">
                    {item.text[locale]}
                  </p>
                </div>

                {/* Stars */}
                <div className="flex items-center gap-x-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <RiStarFill key={s} size={13} className={s <= item.rating ? "text-[var(--cta)]" : "text-gray-200"} />
                  ))}
                </div>

                {/* Author */}
                <div className="flex items-center gap-x-3 pt-3 border-t border-gray-100">
                  <div className={`size-10 rounded-lg ${item.color} flex items-center justify-center text-white font-bold text-xs shrink-0`}>
                    {item.initials}
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-[var(--ink)] text-sm truncate">{item.name[locale]}</p>
                    <p className="text-[11px] text-gray-400 truncate">
                      {item.country[locale]} · {item.course[locale]}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Nav */}
        <div className="flex items-center justify-center gap-x-4 mt-8">
          <button type="button" onClick={prev} className="size-9 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:border-[var(--brand)] hover:text-[var(--brand)] transition-colors cursor-pointer">
            <RiArrowRightSLine size={18} />
          </button>
          <div className="flex items-center gap-x-1.5">
            {Array.from({ length: maxStart + 1 }, (_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setStart(i)}
                className={`transition-all duration-300 rounded-full cursor-pointer ${
                  i === start ? "w-5 h-2 bg-[var(--brand)]" : "size-2 bg-gray-200 hover:bg-gray-300"
                }`}
              />
            ))}
          </div>
          <button type="button" onClick={next} className="size-9 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:border-[var(--brand)] hover:text-[var(--brand)] transition-colors cursor-pointer">
            <RiArrowLeftSLine size={18} />
          </button>
        </div>

      </div>
    </section>
  );
}
