export type CourseCategory = {
  value: string;
  ar: string;
  ur: string;
};

export type MockCourse = {
  id: string;
  category: string;
  image: string;
  title: { ar: string; ur: string };
  excerpt: { ar: string; ur: string };
  instructor: { name: { ar: string; ur: string }; avatar: string };
  rating: number;
  students: number;
  originalPrice: number;
  discountedPrice: number;
  discountPct: number;
  updatedAt: string;
};

export const COURSE_CATEGORIES: CourseCategory[] = [
  { value: "quran",     ar: "العلوم القرآنية",    ur: "قرآنی علوم"      },
  { value: "fiqh",      ar: "الفقه والأصول",      ur: "فقہ و اصول"      },
  { value: "aqeedah",   ar: "العقيدة والكلام",     ur: "عقیدہ و کلام"    },
  { value: "history",   ar: "التاريخ الإسلامي",   ur: "اسلامی تاریخ"    },
  { value: "arabic",    ar: "اللغة العربية",       ur: "عربی زبان"       },
  { value: "tazkiyah",  ar: "التزكية والسلوك",     ur: "تزکیہ و سلوک"    },
  { value: "education", ar: "التربية الإسلامية",   ur: "اسلامی تعلیم"    },
  { value: "dawah",     ar: "الدعوة والإرشاد",     ur: "دعوت و ارشاد"    },
];

export const COURSE_SORT_OPTIONS = [
  { value: "newest",   ar: "الأحدث",          ur: "نئے ترین"        },
  { value: "popular",  ar: "الأكثر شعبيةً",   ur: "مقبول ترین"      },
  { value: "updated",  ar: "آخر تحديث",       ur: "تازہ ترین اپڈیٹ" },
  { value: "advanced", ar: "المستوى المتقدم",  ur: "اعلی درجہ"       },
];

const AVATARS = [
  "https://roohbakhshac.ir/logo.png",
];

export const COURSES: MockCourse[] = [
  {
    id: "c1", category: "quran",
    image: "https://dl.poshtybanman.ir/upload/6%20(1)_68924fcebd53d.jpg",
    title:    { ar: "تجويد القرآن الكريم من الصفر", ur: "تجوید القرآن الکریم از صفر" },
    excerpt:  { ar: "دورة شاملة لتعلم أحكام التجويد وتحسين التلاوة", ur: "تجوید کے احکام سیکھنے کی جامع کورس" },
    instructor: { name: { ar: "الشيخ أحمد الحسن", ur: "شیخ احمد حسن" }, avatar: AVATARS[0]! },
    rating: 5, students: 1309221, originalPrice: 4000000, discountedPrice: 1200000, discountPct: 70, updatedAt: "2026-05-10",
  },
  {
    id: "c2", category: "arabic",
    image: "https://dl.poshtybanman.ir/upload/%D8%B5%D9%84%D8%AD_6880d1068d6f3.jpg",
    title:    { ar: "النحو الميسّر للمبتدئين", ur: "مبتدیوں کے لیے آسان نحو" },
    excerpt:  { ar: "تعلّم قواعد النحو العربي بأسلوب مبسّط وسلس", ur: "عربی نحو کے قواعد سادہ انداز میں" },
    instructor: { name: { ar: "د. فاطمة التجار", ur: "ڈاکٹر فاطمہ تاجر" }, avatar: AVATARS[0]! },
    rating: 5, students: 735, originalPrice: 1955000, discountedPrice: 586500, discountPct: 70, updatedAt: "2026-04-20",
  },
  {
    id: "c3", category: "fiqh",
    image: "https://dl.poshtybanman.ir/upload/7%20(1)_68924fcdf18ae.jpg",
    title:    { ar: "أصول الفقه الإسلامي", ur: "اسلامی فقہ کے اصول" },
    excerpt:  { ar: "دراسة معمّقة لأصول الفقه وطرق الاستنباط الشرعي", ur: "فقہ کے اصولوں اور استنباط کا گہرا مطالعہ" },
    instructor: { name: { ar: "الشيخ يوسف الأنصاري", ur: "شیخ یوسف انصاری" }, avatar: AVATARS[0]! },
    rating: 5, students: 45, originalPrice: 5130000, discountedPrice: 1536000, discountPct: 70, updatedAt: "2026-03-15",
  },
  {
    id: "c4", category: "aqeedah",
    image: "https://dl.poshtybanman.ir/upload/%D8%B9%DA%A9%D8%B3%20%D9%87%D8%AF%D8%B1_690c6ae90fcc2.jpg",
    title:    { ar: "العقيدة الطحاوية", ur: "عقیدہ طحاویہ" },
    excerpt:  { ar: "شرح مفصّل للعقيدة الطحاوية على منهج أهل السنة", ur: "اہل سنت کے منہج پر عقیدہ طحاویہ کی تفصیلی شرح" },
    instructor: { name: { ar: "الشيخ أحمد الحسن", ur: "شیخ احمد حسن" }, avatar: AVATARS[0]! },
    rating: 5, students: 2300, originalPrice: 3200000, discountedPrice: 960000, discountPct: 70, updatedAt: "2026-05-01",
  },
  {
    id: "c5", category: "history",
    image: "https://dl.poshtybanman.ir/upload/6%20(1)_68924fcebd53d.jpg",
    title:    { ar: "السيرة النبوية الشريفة", ur: "سیرت النبی ﷺ" },
    excerpt:  { ar: "رحلة شاملة في حياة النبي ﷺ من المولد إلى الوفاة", ur: "نبی کریم ﷺ کی حیات مبارکہ کا جامع سفر" },
    instructor: { name: { ar: "د. محمد البستاني", ur: "ڈاکٹر محمد بستانی" }, avatar: AVATARS[0]! },
    rating: 5, students: 4100, originalPrice: 2800000, discountedPrice: 840000, discountPct: 70, updatedAt: "2026-02-28",
  },
  {
    id: "c6", category: "tazkiyah",
    image: "https://dl.poshtybanman.ir/upload/%D8%B5%D9%84%D8%AD_6880d1068d6f3.jpg",
    title:    { ar: "تزكية النفس ومراقي السعادة", ur: "تزکیہ نفس اور سعادت کی منازل" },
    excerpt:  { ar: "طريقك إلى تزكية النفس والارتقاء بالأخلاق الإسلامية", ur: "نفس کی تطہیر اور اسلامی اخلاق کی بلندی" },
    instructor: { name: { ar: "الشيخ أحمد الحسن", ur: "شیخ احمد حسن" }, avatar: AVATARS[0]! },
    rating: 5, students: 1900, originalPrice: 2500000, discountedPrice: 750000, discountPct: 70, updatedAt: "2026-04-05",
  },
  {
    id: "c7", category: "education",
    image: "https://dl.poshtybanman.ir/upload/7%20(1)_68924fcdf18ae.jpg",
    title:    { ar: "التربية الإسلامية للأسرة", ur: "خاندان کی اسلامی تربیت" },
    excerpt:  { ar: "كيف تبني أسرة مسلمة متماسكة على أسس إسلامية", ur: "اسلامی بنیادوں پر مضبوط مسلمان خاندان کیسے بنائیں" },
    instructor: { name: { ar: "د. فاطمة التجار", ur: "ڈاکٹر فاطمہ تاجر" }, avatar: AVATARS[0]! },
    rating: 5, students: 870, originalPrice: 1800000, discountedPrice: 540000, discountPct: 70, updatedAt: "2026-01-20",
  },
  {
    id: "c8", category: "dawah",
    image: "https://dl.poshtybanman.ir/upload/%D8%B9%DA%A9%D8%B3%20%D9%87%D8%AF%D8%B1_690c6ae90fcc2.jpg",
    title:    { ar: "فن الدعوة إلى الله", ur: "دعوت الی اللہ کا فن" },
    excerpt:  { ar: "أساليب الدعوة الفعّالة في العصر الحديث", ur: "جدید دور میں موثر دعوت کے اسالیب" },
    instructor: { name: { ar: "الشيخ يوسف الأنصاري", ur: "شیخ یوسف انصاری" }, avatar: AVATARS[0]! },
    rating: 5, students: 620, originalPrice: 2200000, discountedPrice: 660000, discountPct: 70, updatedAt: "2026-03-30",
  },
  {
    id: "c9", category: "quran",
    image: "https://dl.poshtybanman.ir/upload/6%20(1)_68924fcebd53d.jpg",
    title:    { ar: "الإجازة القرآنية بالروايات", ur: "قرآنی اجازہ بالروایات" },
    excerpt:  { ar: "برنامج متخصص للحصول على إجازة التلاوة والتحفيظ", ur: "تلاوت اور حفظ کی اجازہ کا خصوصی پروگرام" },
    instructor: { name: { ar: "الشيخ أحمد الحسن", ur: "شیخ احمد حسن" }, avatar: AVATARS[0]! },
    rating: 5, students: 310, originalPrice: 6000000, discountedPrice: 1800000, discountPct: 70, updatedAt: "2026-05-15",
  },
];
