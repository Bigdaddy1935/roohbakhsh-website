export type Locale = "ar" | "ur";

export const MOCK_USER_PROFILE = {
  name: { ar: "أحمد محمد الرشيدي", ur: "احمد محمد راشدی" },
  email: "ahmad@example.com",
  phone: "+966501234567",
  avatar: "https://secure.gravatar.com/avatar/4f10b9f676fbf54ff6dbe991b237849e?s=96&d=mp&r=g",
  joinDate: { ar: "١ يناير ٢٠٢٤", ur: "١ جنوری ۲۰۲۴" },
};

export const MOCK_STATS = {
  courses: 15,
  questions: 14,
  tickets: 16,
  wallet: 0,
};

export const MOCK_MY_COURSES = [
  { id: "c1", title: { ar: "تجويد القرآن الكريم", ur: "تجوید القرآن الکریم" }, instructor: { ar: "الشيخ أحمد", ur: "شیخ احمد" }, progress: 48, thumb: "https://s3.eseminar.tv/upload/teacher/1595422681_64.jpg" },
  { id: "c2", title: { ar: "أصول الفقه الإسلامي", ur: "اصول فقہ اسلامی" }, instructor: { ar: "د. محمد", ur: "ڈاکٹر محمد" }, progress: 10, thumb: "https://s3.eseminar.tv/upload/teacher/1595422681_64.jpg" },
  { id: "c3", title: { ar: "العقيدة الطحاوية", ur: "عقیدہ طحاویہ" }, instructor: { ar: "الشيخ علي", ur: "شیخ علی" }, progress: 0, thumb: "https://s3.eseminar.tv/upload/teacher/1595422681_64.jpg" },
  { id: "c4", title: { ar: "السيرة النبوية", ur: "سیرت النبی ﷺ" }, instructor: { ar: "د. أحمد", ur: "ڈاکٹر احمد" }, progress: 75, thumb: "https://s3.eseminar.tv/upload/teacher/1595422681_64.jpg" },
  { id: "c5", title: { ar: "النحو الميسر", ur: "عربی نحو" }, instructor: { ar: "الأستاذ كريم", ur: "استاد کریم" }, progress: 20, thumb: "https://s3.eseminar.tv/upload/teacher/1595422681_64.jpg" },
  { id: "c6", title: { ar: "تزكية النفس", ur: "تزکیہ نفس" }, instructor: { ar: "الشيخ يوسف", ur: "شیخ یوسف" }, progress: 5, thumb: "https://s3.eseminar.tv/upload/teacher/1595422681_64.jpg" },
];

export const MOCK_TRANSACTIONS = [
  { id: "T-3958", desc: { ar: "تجويد القرآن الكريم", ur: "تجوید القرآن الکریم" }, date: { ar: "٢١ ديسمبر ٢٠٢٤", ur: "۲۱ دسمبر ۲۰۲۴" }, amount: 120000, status: "paid" as const },
  { id: "T-3721", desc: { ar: "أصول الفقه الإسلامي", ur: "اصول فقہ اسلامی" }, date: { ar: "١٠ نوفمبر ٢٠٢٤", ur: "۱۰ نومبر ۲۰۲۴" }, amount: 95000, status: "cancelled" as const },
  { id: "T-3540", desc: { ar: "العقيدة الطحاوية", ur: "عقیدہ طحاویہ" }, date: { ar: "٥ أكتوبر ٢٠٢٤", ur: "۵ اکتوبر ۲۰۲۴" }, amount: 80000, status: "paid" as const },
  { id: "T-3201", desc: { ar: "السيرة النبوية", ur: "سیرت النبی ﷺ" }, date: { ar: "١٢ سبتمبر ٢٠٢٤", ur: "۱۲ ستمبر ۲۰۲۴" }, amount: 150000, status: "paid" as const },
];

export type TicketStatus = "open" | "answered" | "closed";
export const MOCK_TICKETS = [
  { id: "25205", subject: { ar: "واجهة الموقع", ur: "سائٹ UI" }, dept: { ar: "الدعم الفني", ur: "تکنیکی سپورٹ" }, date: { ar: "٢٢ أبريل ٢٠٢٥", ur: "۲۲ اپریل ۲۰۲۵" }, status: "answered" as TicketStatus },
  { id: "22773", subject: { ar: "دورة تجويد", ur: "تجوید کورس" }, dept: { ar: "الدعم الفني", ur: "تکنیکی سپورٹ" }, date: { ar: "١٣ فبراير ٢٠٢٥", ur: "۱۳ فروری ۲۰۲۵" }, status: "closed" as TicketStatus },
  { id: "19149", subject: { ar: "مشكلة في الدفع", ur: "پیمنٹ مسئلہ" }, dept: { ar: "الدعم المالي", ur: "مالی سپورٹ" }, date: { ar: "١ أبريل ٢٠٢٤", ur: "۱ اپریل ۲۰۲۴" }, status: "closed" as TicketStatus },
  { id: "15214", subject: { ar: "تغيير البريد الإلكتروني", ur: "ای میل تبدیل" }, dept: { ar: "الدعم الفني", ur: "تکنیکی سپورٹ" }, date: { ar: "١ أكتوبر ٢٠٢٣", ur: "۱ اکتوبر ۲۰۲۳" }, status: "closed" as TicketStatus },
  { id: "15137", subject: { ar: "خطأ في شهادة الدورة", ur: "سرٹیفکیٹ خرابی" }, dept: { ar: "الدعم الفني", ur: "تکنیکی سپورٹ" }, date: { ar: "٢٧ سبتمبر ٢٠٢٣", ur: "۲۷ ستمبر ۲۰۲۳" }, status: "closed" as TicketStatus },
];
