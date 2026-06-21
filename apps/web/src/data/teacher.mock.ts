import { MOCK_COURSES } from "./courses.mock";

export type Teacher = {
  slug: string;
  name: { ar: string; ur: string };
  title: { ar: string; ur: string };
  bio: { ar: string; ur: string };
  avatar: string;
  students: number;
  courses: number;
  rating: number;
  courseIds: string[];
};

export const TEACHERS: Record<string, Teacher> = {
  sheikh_ahmad: {
    slug: "sheikh_ahmad",
    name: { ar: "الشيخ أحمد الحسن", ur: "شیخ احمد حسن" },
    title: { ar: "مجاز في رواية حفص — خبير تجويد", ur: "روایت حفص میں مجاز — ماہر تجوید" },
    bio: {
      ar: "عالم متخصص في علوم القرآن الكريم والتجويد، حاصل على إجازة برواية حفص عن عاصم. يمتلك أكثر من خمسة عشر عاماً من الخبرة في تدريس القرآن الكريم لطلاب من أكثر من أربعين دولة حول العالم. تتميز دوراته بالمنهجية العلمية الدقيقة مع الأسلوب التطبيقي الميسّر.",
      ur: "قرآن کریم اور تجوید کے علوم میں متخصص عالم، روایت حفص عن عاصم میں اجازہ یافتہ۔ دنیا بھر کے چالیس سے زائد ممالک کے طلباء کو قرآن کریم پڑھانے کا پندرہ سال سے زیادہ تجربہ رکھتے ہیں۔ ان کے کورسز علمی منہج اور آسان عملی انداز کی وجہ سے ممتاز ہیں۔",
    },
    avatar: "https://s3.eseminar.tv/upload/teacher/1595422681_64.jpg",
    students: 1309221,
    courses: 4,
    rating: 5,
    courseIds: ["c1", "c2"],
  },
};

export function getTeacher(slug: string): Teacher | undefined {
  return TEACHERS[slug];
}

export { MOCK_COURSES };
