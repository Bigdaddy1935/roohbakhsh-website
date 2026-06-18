"use client";

import { useLocale, useTranslations } from "next-intl";
import CardSlider from "@/components/ui/CardSlider";
import ArticleCard, { ArticleCardData } from "@/components/ui/ArticleCard";

const IMAGES = [
  "https://dl.poshtybanman.ir/upload/6%20(1)_68924fcebd53d.jpg",
  "https://dl.poshtybanman.ir/upload/%D8%B5%D9%84%D8%AD_6880d1068d6f3.jpg",
  "https://dl.poshtybanman.ir/upload/7%20(1)_68924fcdf18ae.jpg",
  "https://dl.poshtybanman.ir/upload/%D8%B9%DA%A9%D8%B3%20%D9%87%D8%AF%D8%B1_690c6ae90fcc2.jpg",
];

const MOCK: Record<"ar" | "ur", ArticleCardData[]> = {
  ar: [
    { id:"a1", title:"فضل تعلم العلوم الإسلامية في هذا العصر", excerpt:"في زمن تتشابك فيه المعلومات، يزداد أهمية العودة إلى المصادر الأصيلة للعلم الإسلامي...", author:"الشيخ أحمد الحسن", readTime:"٨ دقائق", image:IMAGES[0], href:"/articles/fadl-ilm", category:"التربية" },
    { id:"a2", title:"كيف تبدأ رحلتك في تعلم اللغة العربية؟", excerpt:"اللغة العربية بوابتك لفهم القرآن الكريم والتراث الإسلامي الغني. إليك الخطوات العملية للبداية.", author:"د. فاطمة النجار", readTime:"٦ دقائق", image:IMAGES[1], href:"/articles/arabic-start", category:"اللغة العربية" },
    { id:"a3", title:"منهج السلف في التزكية والسلوك", excerpt:"تعرّف على منهج أئمة السلف في تزكية النفس وتهذيب الأخلاق وبناء الشخصية المسلمة.", author:"الشيخ يوسف الأنصاري", readTime:"١٠ دقائق", image:IMAGES[2], href:"/articles/salaf-tazkiyah", category:"التزكية" },
    { id:"a4", title:"الإجازة القرآنية: ما هي وكيف تحصل عليها؟", excerpt:"الإجازة القرآنية شهادة تواتر تثبت صحة قراءتك للقرآن الكريم. تعرّف على شروطها وطريقة نيلها.", author:"الشيخ أحمد الحسن", readTime:"٥ دقائق", image:IMAGES[3], href:"/articles/ijazah", category:"القرآن الكريم" },
    { id:"a5", title:"أثر الفقه في حياة المسلم اليومية", excerpt:"الفقه ليس مجرد علم نظري، بل هو منهج حياة يُنظّم علاقتك بربك وبالناس في كل لحظة.", author:"د. محمد البستاني", readTime:"٧ دقائق", image:IMAGES[0], href:"/articles/fiqh-daily", category:"الفقه" },
  ],
  ur: [
    { id:"a1", title:"اس دور میں اسلامی علوم سیکھنے کی فضیلت", excerpt:"جب معلومات کا طوفان ہو، اصیل اسلامی علمی منابع کی طرف رجوع اور بھی ضروری ہو جاتا ہے...", author:"شیخ احمد الحسن", readTime:"8 منٹ", image:IMAGES[0], href:"/articles/fadl-ilm", category:"تربیت" },
    { id:"a2", title:"عربی زبان سیکھنے کا آغاز کیسے کریں؟", excerpt:"عربی زبان قرآن اور اسلامی ورثے کو سمجھنے کا دروازہ ہے۔ شروع کرنے کے عملی اقدامات۔", author:"ڈاکٹرہ فاطمہ النجار", readTime:"6 منٹ", image:IMAGES[1], href:"/articles/arabic-start", category:"عربی زبان" },
    { id:"a3", title:"تزکیہ و سلوک میں سلف کا منہج", excerpt:"ائمہ سلف کا نفس کی اصلاح، اخلاق کی تہذیب اور مسلم شخصیت کی تعمیر کا طریقہ۔", author:"شیخ یوسف الانصاری", readTime:"10 منٹ", image:IMAGES[2], href:"/articles/salaf-tazkiyah", category:"تزکیہ" },
    { id:"a4", title:"قرآنی اجازہ: کیا ہے اور کیسے ملتا ہے؟", excerpt:"قرآنی اجازہ ایک سند تواتر ہے جو آپ کی قرآن کریم کی قراءت کی صحت کو ثابت کرتی ہے۔", author:"شیخ احمد الحسن", readTime:"5 منٹ", image:IMAGES[3], href:"/articles/ijazah", category:"قرآن کریم" },
    { id:"a5", title:"روزمرہ زندگی میں فقہ کا اثر", excerpt:"فقہ محض نظری علم نہیں بلکہ زندگی کا وہ منہج ہے جو ہر لمحے آپ کی رہنمائی کرتا ہے۔", author:"ڈاکٹر محمد البستانی", readTime:"7 منٹ", image:IMAGES[0], href:"/articles/fiqh-daily", category:"فقہ" },
  ],
};

export default function LatestArticles() {
  const t = useTranslations("Home.articles");
  const locale = useLocale() as "ar" | "ur";

  return (
    <CardSlider
      title={t("title")}
      subtitle={t("subtitle")}
      viewAllHref="/articles"
      viewAllLabel={t("view_all")}
      bgClass="bg-white"
    >
      {MOCK[locale].map((article) => (
        <ArticleCard key={article.id} article={article} />
      ))}
    </CardSlider>
  );
}
