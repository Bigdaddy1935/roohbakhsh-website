"use client";

import { useLocale, useTranslations } from "next-intl";
import { RiUserLine } from "react-icons/ri";

type Member = { key: string; name: { ar: string; ur: string }; role: { ar: string; ur: string }; color: string };

const TEAM: Member[] = [
  { key:"m1", name:{ar:"الشيخ أحمد الحسن",         ur:"شیخ احمد الحسن"},         role:{ar:"مؤسس الأكاديمية ومدرّس القرآن",     ur:"اکیڈمی کے بانی اور قرآن استاد"},    color:"from-emerald-400 to-teal-500"   },
  { key:"m2", name:{ar:"د. محمد البستاني",           ur:"ڈاکٹر محمد البستانی"},     role:{ar:"مدير التعليم ومدرّس الفقه",        ur:"تعلیمی ڈائریکٹر اور فقہ استاد"},   color:"from-blue-400 to-indigo-500"    },
  { key:"m3", name:{ar:"د. فاطمة النجار",            ur:"ڈاکٹرہ فاطمہ النجار"},     role:{ar:"رئيسة قسم اللغة العربية",          ur:"عربی زبان شعبے کی سربراہ"},         color:"from-violet-400 to-purple-500"  },
  { key:"m4", name:{ar:"الأستاذ عمر الزيد",         ur:"استاد عمر الزید"},         role:{ar:"مدرّس التاريخ الإسلامي والسيرة",   ur:"اسلامی تاریخ اور سیرت استاد"},     color:"from-amber-400 to-orange-500"   },
];

export default function AboutTeam() {
  const t = useTranslations("About.team");
  const locale = useLocale() as "ar" | "ur";

  return (
    <section className="py-16 bg-white">
      <div className="container">
        <div className="text-center mb-12">
          <p className="text-[var(--brand)] text-sm font-semibold mb-1">{t("subtitle")}</p>
          <h2 className="text-2xl lg:text-3xl font-extrabold text-[var(--ink)]">{t("title")}</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {TEAM.map(({ key, name, role, color }) => (
            <div key={key} className="flex flex-col items-center text-center gap-y-3 p-6 rounded-2xl border border-gray-100 hover:shadow-lg transition-all">
              <div className={`size-20 rounded-full bg-gradient-to-br ${color} flex items-center justify-center shadow-lg`}>
                <RiUserLine size={36} className="text-white" />
              </div>
              <p className="font-extrabold text-[var(--ink)] text-[15px]">{name[locale]}</p>
              <p className="text-xs text-gray-400 leading-5">{role[locale]}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
