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
    { id:"f1", title:"تجويد القرآن الكريم للمبتدئين", description:"تعلّم أحكام التجويد من الصفر بأسلوب ميسّر مع شهادة معتمدة.", instructor:"الشيخ أحمد الحسن", rating:4.9, students:1420, duration:24, price:"مجاني", isFree:true, image:IMAGES[0], href:"/courses/quran/tajweed", category:"القرآن الكريم" },
    { id:"f2", title:"مقدمة في علم العقيدة الإسلامية", description:"نظرة شاملة على أصول العقيدة الإسلامية لكل مسلم.", instructor:"د. خالد المنصور", rating:4.8, students:980, duration:18, price:"مجاني", isFree:true, image:IMAGES[1], href:"/courses/aqeedah/intro", category:"العقيدة" },
    { id:"f3", title:"السيرة النبوية الشريفة — الجزء الأول", description:"رحلة ممتعة في حياة خير البشر ﷺ من الميلاد حتى البعثة.", instructor:"الأستاذ عمر الزيد", rating:5.0, students:2100, duration:30, price:"مجاني", isFree:true, image:IMAGES[2], href:"/courses/history/seerah-1", category:"التاريخ" },
    { id:"f4", title:"النحو الميسر — المستوى الأول", description:"تعلّم أساسيات النحو العربي بطريقة تفاعلية وسهلة.", instructor:"د. فاطمة النجار", rating:4.7, students:3400, duration:20, price:"مجاني", isFree:true, image:IMAGES[3], href:"/courses/arabic/grammar-1", category:"اللغة العربية" },
    { id:"f5", title:"مدخل إلى الفقه الإسلامي", description:"أساسيات الفقه لكل من يريد فهم الأحكام الشرعية.", instructor:"الشيخ محمود سالم", rating:4.6, students:760, duration:15, price:"مجاني", isFree:true, image:IMAGES[0], href:"/courses/fiqh/intro", category:"الفقه" },
    { id:"f6", title:"تزكية النفس — المدخل", description:"أولى خطواتك في طريق التزكية والسلوك الروحي.", instructor:"الشيخ يوسف الأنصاري", rating:4.9, students:1200, duration:12, price:"مجاني", isFree:true, image:IMAGES[1], href:"/courses/tazkiyah/intro", category:"التزكية" },
  ],
  ur: [
    { id:"f1", title:"تجوید القرآن الکریم برائے مبتدیین", description:"آسان اور مؤثر طریقے سے تجوید کے احکام سیکھیں — سرٹیفکیٹ کے ساتھ۔", instructor:"شیخ احمد الحسن", rating:4.9, students:1420, duration:24, price:"مفت", isFree:true, image:IMAGES[0], href:"/courses/quran/tajweed", category:"قرآن کریم" },
    { id:"f2", title:"اسلامی عقیدہ کا تعارف", description:"ہر مسلمان کے لیے اسلامی عقیدہ کے اصولوں کا جامع تعارف۔", instructor:"ڈاکٹر خالد منصور", rating:4.8, students:980, duration:18, price:"مفت", isFree:true, image:IMAGES[1], href:"/courses/aqeedah/intro", category:"عقیدہ" },
    { id:"f3", title:"سیرت النبی ﷺ — حصہ اول", description:"ولادت سے بعثت تک — نبی کریم ﷺ کی حیات طیبہ کا دلچسپ سفر۔", instructor:"استاد عمر الزید", rating:5.0, students:2100, duration:30, price:"مفت", isFree:true, image:IMAGES[2], href:"/courses/history/seerah-1", category:"تاریخ" },
    { id:"f4", title:"عربی نحو — پہلا درجہ", description:"عربی نحو کے بنیادی اصول آسان اور انٹرایکٹو طریقے سے سیکھیں۔", instructor:"ڈاکٹرہ فاطمہ النجار", rating:4.7, students:3400, duration:20, price:"مفت", isFree:true, image:IMAGES[3], href:"/courses/arabic/grammar-1", category:"عربی زبان" },
    { id:"f5", title:"فقہ اسلامی کا تعارف", description:"احکام شرعیہ سمجھنے کے لیے فقہ کی بنیادی باتیں۔", instructor:"شیخ محمود سالم", rating:4.6, students:760, duration:15, price:"مفت", isFree:true, image:IMAGES[0], href:"/courses/fiqh/intro", category:"فقہ" },
    { id:"f6", title:"تزکیہ نفس — تعارف", description:"تزکیہ اور روحانی سلوک کی راہ میں پہلے قدم۔", instructor:"شیخ یوسف الانصاری", rating:4.9, students:1200, duration:12, price:"مفت", isFree:true, image:IMAGES[1], href:"/courses/tazkiyah/intro", category:"تزکیہ" },
  ],
};

export default function FreeCourses() {
  const t = useTranslations("Home.free");
  const locale = useLocale() as "ar" | "ur";

  return (
    <CardSlider
      title={t("title")}
      subtitle={t("subtitle")}
      viewAllHref="/courses?filter=free"
      viewAllLabel={t("view_all")}
      bgClass="bg-white"
    >
      {MOCK[locale].map((course) => (
        <CourseCard key={course.id} course={course} />
      ))}
    </CardSlider>
  );
}
