"use client";

import { useLocale, useTranslations } from "next-intl";
import CardSlider from "@/components/ui/CardSlider";
import CourseCard, { CourseCardData } from "@/components/ui/CourseCard";

const IMAGES = [
  "https://dl.poshtybanman.ir/upload/1%20(4)_63dd121c7b132.png",
  "https://dl.poshtybanman.ir/upload/%DA%A9%D8%A7%D9%88%D8%B1%20%D8%A7%D8%B5%D9%84%DB%8C%20(1)_63b42e6d23f65.png",
  "https://dl.poshtybanman.ir/upload/%D8%B5%D9%88%D8%AA%DB%8C2_63ccef6bddbc7.png",
  "https://dl.poshtybanman.ir/upload/%D8%B4%D8%AE%D8%B5%DB%8C%D8%AA%20%D9%BE%D8%A7%DB%8C%D8%AF%D8%A7%D8%B1_63c813433aeb8.png",
];

const MOCK: Record<"ar" | "ur", CourseCardData[]> = {
  ar: [
    { id:"p1", title:"تجويد القرآن الكريم للمبتدئين", description:"تعلّم أحكام التجويد بأسلوب ميسّر مع الأستاذ المتخصص وشهادة معتمدة.", instructor:"الشيخ أحمد الحسن", rating:4.9, students:1420, duration:24, price:"مجاني", isFree:true, image:IMAGES[0], href:"/courses/quran/tajweed", category:"القرآن الكريم" },
    { id:"p2", title:"أصول الفقه الإسلامي", description:"دراسة معمّقة في أصول الفقه مع تطبيقات عملية على المسائل المعاصرة.", instructor:"د. محمد البستاني", rating:4.8, students:870, duration:36, price:"٩٩ ر.س", originalPrice:"١٩٩ ر.س", discount:50, image:IMAGES[1], href:"/courses/fiqh/usul", category:"الفقه" },
    { id:"p3", title:"السيرة النبوية الشريفة", description:"رحلة ممتعة في حياة خير البشر ﷺ من الميلاد حتى الوفاة.", instructor:"الأستاذ عمر الزيد", rating:5.0, students:2100, duration:48, price:"مجاني", isFree:true, image:IMAGES[2], href:"/courses/history/seerah", category:"التاريخ" },
    { id:"p4", title:"النحو الميسر للمبتدئين", description:"تعلّم أساسيات النحو العربي بطريقة تفاعلية مع تمارين ومشاريع.", instructor:"د. فاطمة النجار", rating:4.7, students:3400, duration:20, price:"٧٩ ر.س", originalPrice:"١٤٩ ر.س", discount:47, image:IMAGES[3], href:"/courses/arabic/grammar", category:"اللغة العربية" },
    { id:"p5", title:"العقيدة الطحاوية — شرح مفصّل", description:"شرح شامل لمتن العقيدة الطحاوية للشيخ المتخصص مع أسئلة وتفاعل.", instructor:"د. خالد المنصور", rating:5.0, students:1100, duration:40, price:"١١٩ ر.س", originalPrice:"٢٣٩ ر.س", discount:50, image:IMAGES[0], href:"/courses/aqeedah/tahawiyya", category:"العقيدة" },
  ],
  ur: [
    { id:"p1", title:"تجوید القرآن الکریم برائے مبتدیین", description:"ماہر استاد کے ساتھ آسان طریقے سے تجوید کے احکام سیکھیں — سرٹیفکیٹ کے ساتھ۔", instructor:"شیخ احمد الحسن", rating:4.9, students:1420, duration:24, price:"مفت", isFree:true, image:IMAGES[0], href:"/courses/quran/tajweed", category:"قرآن کریم" },
    { id:"p2", title:"اصول فقہ اسلامی", description:"معاصر مسائل پر عملی اطلاق کے ساتھ اصول فقہ کا گہرا مطالعہ۔", instructor:"ڈاکٹر محمد البستانی", rating:4.8, students:870, duration:36, price:"99 ر.س", originalPrice:"199 ر.س", discount:50, image:IMAGES[1], href:"/courses/fiqh/usul", category:"فقہ" },
    { id:"p3", title:"سیرت النبی ﷺ", description:"ولادت سے وفات تک — نبی کریم ﷺ کی حیات طیبہ کا دلچسپ علمی سفر۔", instructor:"استاد عمر الزید", rating:5.0, students:2100, duration:48, price:"مفت", isFree:true, image:IMAGES[2], href:"/courses/history/seerah", category:"تاریخ" },
    { id:"p4", title:"عربی نحو برائے مبتدیین", description:"انٹرایکٹو مشقوں اور پروجیکٹس کے ساتھ عربی نحو کے بنیادی اصول سیکھیں۔", instructor:"ڈاکٹرہ فاطمہ النجار", rating:4.7, students:3400, duration:20, price:"79 ر.س", originalPrice:"149 ر.س", discount:47, image:IMAGES[3], href:"/courses/arabic/grammar", category:"عربی زبان" },
    { id:"p5", title:"عقیدہ طحاویہ — تفصیلی شرح", description:"متن عقیدہ طحاویہ کی جامع شرح سوالات اور تعامل کے ساتھ۔", instructor:"ڈاکٹر خالد المنصور", rating:5.0, students:1100, duration:40, price:"119 ر.س", originalPrice:"239 ر.س", discount:50, image:IMAGES[0], href:"/courses/aqeedah/tahawiyya", category:"عقیدہ" },
  ],
};

export default function FeaturedCourses() {
  const t = useTranslations("Home.featured");
  const locale = useLocale() as "ar" | "ur";

  return (
    <CardSlider
      title={t("title")}
      subtitle={t("subtitle")}
      viewAllHref="/courses"
      viewAllLabel={t("view_all")}
      bgClass="bg-white"
    >
      {MOCK[locale].map((course) => (
        <CourseCard key={course.id} course={course} />
      ))}
    </CardSlider>
  );
}
