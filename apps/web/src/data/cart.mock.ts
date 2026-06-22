export type CartItem = {
  id: string;
  courseId: string;
  image: string;
  title: { ar: string; ur: string };
  instructor: { ar: string; ur: string };
  originalPrice: number;
  discountedPrice: number;
  discountPct: number;
};

export const MOCK_CART_ITEMS: CartItem[] = [
  {
    id: "ci1",
    courseId: "c1",
    image: "https://dl.poshtybanman.ir/upload/6%20(1)_68924fcebd53d.jpg",
    title: { ar: "تجويد القرآن الكريم من الصفر", ur: "تجوید القرآن الکریم از صفر" },
    instructor: { ar: "الشيخ أحمد الحسن", ur: "شیخ احمد حسن" },
    originalPrice: 4000000,
    discountedPrice: 1200000,
    discountPct: 70,
  },
  {
    id: "ci2",
    courseId: "c2",
    image: "https://dl.poshtybanman.ir/upload/%D8%B5%D9%84%D8%AD_6880d1068d6f3.jpg",
    title: { ar: "النحو الميسّر للمبتدئين", ur: "مبتدیوں کے لیے آسان نحو" },
    instructor: { ar: "د. فاطمة التجار", ur: "ڈاکٹر فاطمہ تاجر" },
    originalPrice: 1955000,
    discountedPrice: 586500,
    discountPct: 70,
  },
];
