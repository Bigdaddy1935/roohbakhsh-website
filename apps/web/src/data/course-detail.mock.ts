export type Lesson = {
  id: string;
  title: { ar: string; ur: string };
  duration: string;
  free: boolean;
  videoUrl?: string;
};

export type Chapter = {
  id: string;
  title: { ar: string; ur: string };
  lessonCount: number;
  duration: string;
  lessons: Lesson[];
};

export type Review = {
  id: string;
  author: string;
  avatar: string;
  date: { ar: string; ur: string };
  rating: number;
  body: { ar: string; ur: string };
  reply?: { author: string; body: { ar: string; ur: string } };
};

export type CourseDetail = {
  id: string;
  category: { ar: string; ur: string };
  image: string;
  title: { ar: string; ur: string };
  description: { ar: string; ur: string };
  instructor: {
    name: { ar: string; ur: string };
    title: { ar: string; ur: string };
    avatar: string;
  };
  rating: number;
  students: number;
  hoursTotal: number;
  lessonCount: number;
  updatedAt: { ar: string; ur: string };
  originalPrice: number;
  discountedPrice: number;
  discountPct: number;
  prerequisites: { ar: string; ur: string }[];
  chapters: Chapter[];
  reviews: Review[];
};

export const COURSE_DETAILS: Record<string, CourseDetail> = {
  c1: {
    id: "c1",
    category: { ar: "العلوم القرآنية", ur: "قرآنی علوم" },
    image: "https://dl.poshtybanman.ir/upload/6%20(1)_68924fcebd53d.jpg",
    title: { ar: "تجويد القرآن الكريم من الصفر", ur: "تجوید القرآن الکریم از صفر" },
    description: {
      ar: `دورة شاملة ومتكاملة لتعلّم أحكام التجويد وتحسين التلاوة من الصفر حتى الإتقان. ستتعلم في هذه الدورة مخارج الحروف، وأحكام النون الساكنة والتنوين، والمدود، والوقف والابتداء، والترقيق والتفخيم، وغيرها من أحكام التلاوة الصحيحة.

الهدف من هذه الدورة هو تمكين الطالب من قراءة القرآن الكريم قراءةً صحيحةً مجوَّدةً وفق رواية حفص عن عاصم، مع تقديم تدريبات عملية مكثّفة وتمارين تطبيقية على الآيات الكريمة.

لمَن هذه الدورة؟
مناسبة لجميع من يرغب في إتقان تلاوة القرآن الكريم، سواء أكان مبتدئاً أم في مستوى متوسط يسعى إلى التحسين والإتقان.`,
      ur: `قرآن کریم کی تلاوت کو درست کرنے اور تجوید کے احکام سیکھنے کی ایک جامع اور مکمل کورس۔ اس کورس میں آپ مخارج الحروف، نون ساکنہ و تنوین کے احکام، مدود، وقف و ابتداء، ترقیق و تفخیم اور دیگر تلاوت کے احکام سیکھیں گے۔

اس کورس کا مقصد طالب علم کو حفص عن عاصم کی روایت کے مطابق قرآن کریم کو صحیح اور مجوّد انداز میں پڑھنے کے قابل بنانا ہے، ساتھ ہی آیات کریمہ پر عملی مشقیں بھی شامل ہیں۔

یہ کورس کس کے لیے ہے؟
قرآن کریم کی تلاوت میں مہارت حاصل کرنے کے خواہشمند ہر شخص کے لیے، خواہ مبتدی ہو یا درمیانی سطح کا طالب علم۔`,
    },
    instructor: {
      name: { ar: "الشيخ أحمد الحسن", ur: "شیخ احمد حسن" },
      title: { ar: "مجاز في رواية حفص — خبير تجويد", ur: "روایت حفص میں مجاز — ماہر تجوید" },
      avatar: "https://roohbakhshac.ir/logo.png",
    },
    rating: 5,
    students: 1309221,
    hoursTotal: 19,
    lessonCount: 112,
    updatedAt: { ar: "٢٩ / ٠٣ / ١٤٠٥", ur: "۱۴۰۵/۰۳/۲۹" },
    originalPrice: 4000000,
    discountedPrice: 1200000,
    discountPct: 70,
    prerequisites: [
      { ar: "معرفة قراءة الحروف العربية", ur: "عربی حروف پڑھنے کی بنیادی معرفت" },
      { ar: "مصحف للتدريب العملي", ur: "عملی مشق کے لیے قرآن مجید" },
      { ar: "رغبة صادقة في الإتقان", ur: "مہارت حاصل کرنے کا سچا جذبہ" },
    ],
    chapters: [
      {
        id: "ch1",
        title: { ar: "معرفة الدورة — تمهيد", ur: "کورس کا تعارف" },
        lessonCount: 1, duration: "5m",
        lessons: [
          { id: "l1", title: { ar: "مقدمة ومعرفة الدورة", ur: "تعارف اور کورس کا جائزہ" }, duration: "5:28", free: true, videoUrl: "https://dl.poshtybanman.ir/Mahdyar/Daqdaqe-Daq/%D9%82%D8%B3%D9%85%D8%AA%206.mp4" },
        ],
      },
      {
        id: "ch2",
        title: { ar: "مقدمات التجويد", ur: "تجوید کا تعارف" },
        lessonCount: 5, duration: "38m",
        lessons: [
          { id: "l2", title: { ar: "تعريف التجويد وفضله", ur: "تجوید کی تعریف اور فضیلت" }, duration: "8:12", free: false },
          { id: "l3", title: { ar: "أقسام الأحكام التجويدية", ur: "تجوید کے احکام کی اقسام" }, duration: "9:45", free: false },
          { id: "l4", title: { ar: "مخارج الحروف", ur: "مخارج الحروف" }, duration: "7:33", free: false },
          { id: "l5", title: { ar: "صفات الحروف", ur: "حروف کی صفات" }, duration: "6:20", free: false },
          { id: "l6", title: { ar: "مراجعة شاملة", ur: "جامع مراجعہ" }, duration: "6:50", free: false },
        ],
      },
      {
        id: "ch3",
        title: { ar: "النون الساكنة والتنوين", ur: "نون ساکنہ اور تنوین" },
        lessonCount: 17, duration: "2h 6m",
        lessons: [
          { id: "l7", title: { ar: "حكم الإظهار", ur: "اظہار کا حکم" }, duration: "12:00", free: false },
          { id: "l8", title: { ar: "حكم الإدغام", ur: "ادغام کا حکم" }, duration: "14:30", free: false },
          { id: "l9", title: { ar: "حكم الإقلاب", ur: "اقلاب کا حکم" }, duration: "10:15", free: false },
          { id: "l10", title: { ar: "حكم الإخفاء", ur: "اخفاء کا حکم" }, duration: "15:45", free: false },
        ],
      },
      {
        id: "ch4",
        title: { ar: "المدود وأحكامها", ur: "مدود اور ان کے احکام" },
        lessonCount: 6, duration: "44m",
        lessons: [
          { id: "l11", title: { ar: "المد الطبيعي", ur: "مد طبیعی" }, duration: "8:00", free: false },
          { id: "l12", title: { ar: "المد الفرعي", ur: "مد فرعی" }, duration: "11:20", free: false },
        ],
      },
      {
        id: "ch5",
        title: { ar: "الوقف والابتداء", ur: "وقف اور ابتداء" },
        lessonCount: 11, duration: "1h 20m",
        lessons: [
          { id: "l13", title: { ar: "أنواع الوقف", ur: "وقف کی اقسام" }, duration: "13:10", free: false },
          { id: "l14", title: { ar: "علامات الوقف في المصحف", ur: "مصحف میں وقف کی علامات" }, duration: "9:55", free: false },
        ],
      },
      {
        id: "ch6",
        title: { ar: "مشروع التطبيق العملي", ur: "عملی منصوبہ" },
        lessonCount: 18, duration: "2h 3m",
        lessons: [
          { id: "l15", title: { ar: "تطبيق على سورة الفاتحة", ur: "سورہ فاتحہ پر اطلاق" }, duration: "18:00", free: false },
          { id: "l16", title: { ar: "تطبيق على سورة البقرة", ur: "سورہ بقرہ پر اطلاق" }, duration: "22:30", free: false },
        ],
      },
      {
        id: "ch7",
        title: { ar: "الاختبار والشهادة", ur: "امتحان اور سرٹیفکیٹ" },
        lessonCount: 8, duration: "1h",
        lessons: [
          { id: "l17", title: { ar: "الاختبار النهائي", ur: "حتمی امتحان" }, duration: "30:00", free: false },
          { id: "l18", title: { ar: "منح الشهادة", ur: "سرٹیفکیٹ کا اجراء" }, duration: "5:00", free: false },
        ],
      },
    ],
    reviews: [
      {
        id: "r1",
        author: "AAIPiye",
        avatar: "",
        date: { ar: "١ مايو ٢٠٢٥", ur: "یکم مئی ۲۰۲۵" },
        rating: 5,
        body: {
          ar: "السلام عليكم، أنا الآن أتعلم هذه الدورة من البداية وأريد أن أكون مؤهلاً للتدريس. هل تنصحني بالاستمرار بعد إتمام هذه الدورة؟",
          ur: "السلام علیکم، میں ابھی شروع سے یہ کورس سیکھ رہا ہوں اور تدریس کے لیے خود کو تیار کرنا چاہتا ہوں۔ کیا اس کورس کے بعد جاری رکھنے کا مشورہ دیتے ہیں؟",
        },
        reply: {
          author: "الشيخ أحمد الحسن",
          body: {
            ar: "وعليكم السلام، أنصحك بإتمام هذه الدورة أولاً ثم الانتقال إلى دورة الإجازة القرآنية. بعدها يمكنك الانتساب إلى برنامج تأهيل المعلمين في أكاديميتنا. وفّقك الله! ❤️",
            ur: "وعلیکم السلام، میں آپ کو مشورہ دیتا ہوں کہ پہلے اس کورس کو مکمل کریں، پھر اجازہ قرآنی کورس کی طرف بڑھیں۔ اس کے بعد ہماری اکیڈمی میں معلمین کی تربیت کے پروگرام میں داخلہ لے سکتے ہیں۔ اللہ آپ کی مدد فرمائے! ❤️",
          },
        },
      },
      {
        id: "r2",
        author: "sajjad_Amir",
        avatar: "",
        date: { ar: "١٥ أبريل ٢٠٢٥", ur: "۱۵ اپریل ۲۰۲۵" },
        rating: 5,
        body: {
          ar: "استاذ بارك الله فيك، تعبت كثيراً في البحث عن دورة تجويد متكاملة. لقد جربت دورات في مواقع أخرى ولم أستفد منها كما استفدت هنا في الدرس الأول فقط! شكراً جزيلاً.",
          ur: "استاد اللہ آپ کو جزائے خیر دے، میں نے کافی محنت سے ایک جامع تجوید کورس ڈھونڈا۔ دوسری ویب سائٹس پر کورسز آزمائے لیکن جو فائدہ یہاں پہلے ہی سبق میں ملا وہ کہیں نہیں ملا! بہت بہت شکریہ۔",
        },
      },
      {
        id: "r3",
        author: "فاطمة الزهراء",
        avatar: "",
        date: { ar: "٣ مارس ٢٠٢٥", ur: "۳ مارچ ۲۰۲۵" },
        rating: 5,
        body: {
          ar: "الدورة ممتازة جداً والشرح واضح ومبسط. أنا في الأسبوع الثالث وقد شعرت بتحسن ملحوظ في تلاوتي. أنصح به لكل من يريد تعلم التجويد بطريقة احترافية.",
          ur: "کورس بہت عمدہ ہے اور تشریح واضح اور آسان ہے۔ میں تیسرے ہفتے میں ہوں اور اپنی تلاوت میں نمایاں بہتری محسوس کی ہے۔ ہر اس شخص کے لیے تجویز کرتی ہوں جو پیشہ ورانہ انداز سے تجوید سیکھنا چاہے۔",
        },
      },
    ],
  },
};

export function getCourseDetail(id: string): CourseDetail | null {
  return COURSE_DETAILS[id] ?? null;
}

export type LessonContext = {
  lesson: Lesson;
  chapter: Chapter;
  chapterIndex: number;
  lessonIndex: number;
  prevLesson: { id: string; courseId: string } | null;
  nextLesson: { id: string; courseId: string } | null;
};

export function getLessonContext(courseId: string, lessonId: string): LessonContext | null {
  const course = getCourseDetail(courseId);
  if (!course) return null;

  const allLessons: { lesson: Lesson; chapter: Chapter; ci: number; li: number }[] = [];
  course.chapters.forEach((ch, ci) =>
    ch.lessons.forEach((l, li) => allLessons.push({ lesson: l, chapter: ch, ci, li }))
  );

  const pos = allLessons.findIndex((x) => x.lesson.id === lessonId);
  if (pos === -1) return null;

  const { lesson, chapter, ci, li } = allLessons[pos];
  return {
    lesson,
    chapter,
    chapterIndex: ci,
    lessonIndex: li,
    prevLesson: pos > 0 ? { id: allLessons[pos - 1].lesson.id, courseId } : null,
    nextLesson: pos < allLessons.length - 1 ? { id: allLessons[pos + 1].lesson.id, courseId } : null,
  };
}
