"use client";

import { useLocale, useTranslations } from "next-intl";
import CardSlider from "@/components/ui/CardSlider";
import CourseCard, { CourseCardData } from "@/components/ui/CourseCard";

const IMAGES = [
  "https://dl.poshtybanman.ir/upload/%D8%B4%D8%AE%D8%B5%DB%8C%D8%AA%20%D9%BE%D8%A7%DB%8C%D8%AF%D8%A7%D8%B1_63c813433aeb8.png",
  "https://dl.poshtybanman.ir/upload/%D8%B5%D9%88%D8%AA%DB%8C2_63ccef6bddbc7.png",
  "https://dl.poshtybanman.ir/upload/1%20(4)_63dd121c7b132.png",
  "https://dl.poshtybanman.ir/upload/%DA%A9%D8%A7%D9%88%D8%B1%20%D8%A7%D8%B5%D9%84%DB%8C%20(1)_63b42e6d23f65.png",
];

const MOCK: Record<"ar" | "ur", CourseCardData[]> = {
  ar: [
    { id:"n1", title:"أصول الفقه الإسلامي — المستوى المتقدم", description:"دراسة معمّقة في أصول الفقه مع تطبيقات عملية على المسائل الفقهية المعاصرة.", instructor:"د. محمد البستاني", rating:4.8, students:870, duration:36, price:"٩٩ ر.س", originalPrice:"١٩٩ ر.س", discount:50, image:IMAGES[0], href:"/courses/fiqh/usul-advanced", category:"الفقه" },
    { id:"n2", title:"البلاغة القرآنية — دراسة تطبيقية", description:"استكشاف الإعجاز البياني في القرآن الكريم من خلال أمثلة وتحليلات.", instructor:"د. فاطمة النجار", rating:4.9, students:540, duration:28, price:"٧٩ ر.س", originalPrice:"١٤٩ ر.س", discount:47, image:IMAGES[1], href:"/courses/arabic/balagha", category:"اللغة العربية" },
    { id:"n3", title:"تاريخ الدولة الإسلامية — العصر العباسي", description:"رحلة علمية في أزهى عصور الحضارة الإسلامية وإسهاماتها.", instructor:"الأستاذ عمر الزيد", rating:4.7, students:430, duration:32, price:"٨٩ ر.س", originalPrice:"١٧٩ ر.س", discount:50, image:IMAGES[2], href:"/courses/history/abbasid", category:"التاريخ" },
    { id:"n4", title:"العقيدة الطحاوية — شرح مفصّل", description:"شرح متكامل لمتن العقيدة الطحاوية مع ربطها بالواقع المعاصر.", instructor:"الشيخ خالد المنصور", rating:5.0, students:1100, duration:40, price:"١١٩ ر.س", originalPrice:"٢٣٩ ر.س", discount:50, image:IMAGES[3], href:"/courses/aqeedah/tahawiyya", category:"العقيدة" },
    { id:"n5", title:"رياض الصالحين — المنهج المنظّم", description:"دراسة منهجية لكتاب رياض الصالحين مع التطبيق العملي.", instructor:"الشيخ يوسف الأنصاري", rating:4.8, students:680, duration:22, price:"٦٩ ر.س", originalPrice:"١٣٩ ر.س", discount:50, image:IMAGES[0], href:"/courses/tazkiyah/riyad", category:"التزكية" },
  ],
  ur: [
    { id:"n1", title:"اصول فقہ — اعلیٰ درجہ", description:"معاصر فقہی مسائل پر عملی اطلاق کے ساتھ اصول فقہ کا گہرا مطالعہ۔", instructor:"ڈاکٹر محمد البستانی", rating:4.8, students:870, duration:36, price:"99 ر.س", originalPrice:"199 ر.س", discount:50, image:IMAGES[0], href:"/courses/fiqh/usul-advanced", category:"فقہ" },
    { id:"n2", title:"قرآنی بلاغت — تطبیقی مطالعہ", description:"قرآن کریم کے اعجاز بیانی کو مثالوں اور تجزیوں کے ذریعے سمجھیں۔", instructor:"ڈاکٹرہ فاطمہ النجار", rating:4.9, students:540, duration:28, price:"79 ر.س", originalPrice:"149 ر.س", discount:47, image:IMAGES[1], href:"/courses/arabic/balagha", category:"عربی زبان" },
    { id:"n3", title:"اسلامی تاریخ — عباسی دور", description:"اسلامی تہذیب کے سنہرے دور اور اس کی علمی کاوشوں کا علمی سفر۔", instructor:"استاد عمر الزید", rating:4.7, students:430, duration:32, price:"89 ر.س", originalPrice:"179 ر.س", discount:50, image:IMAGES[2], href:"/courses/history/abbasid", category:"تاریخ" },
    { id:"n4", title:"عقیدہ طحاویہ — تفصیلی شرح", description:"عقیدہ طحاویہ کی مکمل شرح اور معاصر دور سے ربط۔", instructor:"شیخ خالد المنصور", rating:5.0, students:1100, duration:40, price:"119 ر.س", originalPrice:"239 ر.س", discount:50, image:IMAGES[3], href:"/courses/aqeedah/tahawiyya", category:"عقیدہ" },
    { id:"n5", title:"ریاض الصالحین — منظم منہاج", description:"ریاض الصالحین کا منظم مطالعہ اور عملی اطلاق۔", instructor:"شیخ یوسف الانصاری", rating:4.8, students:680, duration:22, price:"69 ر.س", originalPrice:"139 ر.س", discount:50, image:IMAGES[0], href:"/courses/tazkiyah/riyad", category:"تزکیہ" },
  ],
};

export default function NewestCourses() {
  const t = useTranslations("Home.newest");
  const locale = useLocale() as "ar" | "ur";

  return (
    <CardSlider
      title={t("title")}
      subtitle={t("subtitle")}
      viewAllHref="/courses?sort=newest"
      viewAllLabel={t("view_all")}
    >
      {MOCK[locale].map((course) => (
        <CourseCard key={course.id} course={course} />
      ))}
    </CardSlider>
  );
}
