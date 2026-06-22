import { Injectable, Logger, OnApplicationBootstrap } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import * as bcrypt from "bcrypt";
import type { Localized } from "@roohbakhsh/shared";
import { User } from "../../modules/auth/entities/user.entity";
import { Instructor } from "../../modules/instructor/entities/instructor.entity";
import { Category } from "../../modules/category/entities/category.entity";
import { Coupon } from "../../modules/coupon/entities/coupon.entity";
import { Course } from "../../modules/courses/entities/course.entity";
import { Section } from "../../modules/courses/entities/section.entity";
import { Lesson } from "../../modules/courses/entities/lesson.entity";
import { Article } from "../../modules/articles/entities/article.entity";
import { Review } from "../../modules/reviews/entities/review.entity";

const SAMPLE_THUMBNAILS = [
  "https://storage.sabzlearn.ir/legacy-statics/2025/07/21-1.webp",
  "https://storage.sabzlearn.ir/legacy-statics/2025/11/AlpineJS8-1.webp",
  "https://storage.sabzlearn.ir/legacy-statics/2025/11/SQL5.webp",
  "https://storage.sabzlearn.ir/legacy-statics/2024/12/Bash-Script-1.webp",
];

function randomThumbnail(): string {
  return SAMPLE_THUMBNAILS[Math.floor(Math.random() * SAMPLE_THUMBNAILS.length)]!;
}

interface SeedCourseDef {
  slug: string;
  title: Localized;
  description: Localized;
  amountMinor: number;
  level: "beginner" | "intermediate" | "advanced";
  sections: { title: Localized; lessonCount: number }[];
}

interface SeedArticleDef {
  slug: string;
  title: Localized;
  summary: Localized;
  bodyAr: string;
  bodyUr: string;
  status: "draft" | "published";
  hasThumbnail: boolean;
}

/**
 * فقط در محیط توسعه اجرا می‌شود (SeedModule فقط وقتی NODE_ENV !== production ایمپورت می‌شود).
 * هر بخش idempotent است — اگر رکورد با همان slug/email/code از قبل باشد، دوباره نمی‌سازد.
 */
@Injectable()
export class SeedService implements OnApplicationBootstrap {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(Instructor) private readonly instructorRepo: Repository<Instructor>,
    @InjectRepository(Category) private readonly categoryRepo: Repository<Category>,
    @InjectRepository(Coupon) private readonly couponRepo: Repository<Coupon>,
    @InjectRepository(Course) private readonly courseRepo: Repository<Course>,
    @InjectRepository(Section) private readonly sectionRepo: Repository<Section>,
    @InjectRepository(Lesson) private readonly lessonRepo: Repository<Lesson>,
    @InjectRepository(Article) private readonly articleRepo: Repository<Article>,
    @InjectRepository(Review) private readonly reviewRepo: Repository<Review>,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    this.logger.log("شروع seed داده‌های نمونه...");

    await this.seedAdmin();
    const instructor = await this.seedInstructor();
    const categories = await this.seedCategories();
    const students = await this.seedStudents();
    await this.seedCoupons();
    const courseIds = await this.seedCourses(instructor.id, categories.map((c) => c.id));
    await this.seedArticles(instructor.id);
    await this.seedReviews(courseIds, students.map((s) => s.id));

    this.logger.log("seed داده‌های نمونه تمام شد.");
  }

  private async seedAdmin(): Promise<User> {
    const email = "admin@roohbakhsh.ac";
    const existing = await this.userRepo.findOne({ where: { email } });
    if (existing) return existing;

    const passwordHash = await bcrypt.hash("Test@1234", 12);
    const user = this.userRepo.create({
      email,
      passwordHash,
      fullName: "مدیر سامانه",
      role: "admin",
      preferredLocale: "ar",
    });
    const saved = await this.userRepo.save(user);
    this.logger.log(`✓ ادمین نمونه ساخته شد: ${email} / Test@1234`);
    return saved;
  }

  private async seedStudents(): Promise<User[]> {
    const defs = [
      { email: "student1@roohbakhsh.ac", fullName: "محمد الأحمدي" },
      { email: "student2@roohbakhsh.ac", fullName: "علي حسن" },
      { email: "student3@roohbakhsh.ac", fullName: "فاطمة الزهراء" },
    ];

    const users: User[] = [];
    for (const def of defs) {
      const existing = await this.userRepo.findOne({ where: { email: def.email } });
      if (existing) {
        users.push(existing);
        continue;
      }

      const passwordHash = await bcrypt.hash("Test@1234", 12);
      const saved = await this.userRepo.save(
        this.userRepo.create({
          email: def.email,
          passwordHash,
          fullName: def.fullName,
          role: "user",
          preferredLocale: "ar",
        }),
      );
      users.push(saved);
      this.logger.log(`✓ کاربر نمونه ساخته شد: ${def.email} / Test@1234`);
    }
    return users;
  }

  private async seedInstructor(): Promise<Instructor> {
    const slug = "shaikh-ahmad-roohbakhsh";
    const existing = await this.instructorRepo.findOne({ where: { slug } });
    if (existing) return existing;

    const instructor = this.instructorRepo.create({
      name: { ar: "الشيخ أحمد روح‌بخش", ur: "شیخ احمد روح بخش" },
      slug,
      bio: {
        ar: "أستاذ الفقه والتفسير في الأكاديمية الإسلامية الدولية روح‌بخش.",
        ur: "روح بخش بین الاقوامی اسلامی اکیڈمی میں فقہ اور تفسیر کے استاد۔",
      },
    });
    const saved = await this.instructorRepo.save(instructor);
    this.logger.log(`✓ استاد نمونه ساخته شد: ${slug}`);
    return saved;
  }

  private categoryDefs(): { slug: string; name: Localized; description: Localized }[] {
    return [
      {
        slug: "fiqh-and-tafsir",
        name: { ar: "الفقه والتفسير", ur: "فقہ اور تفسیر" },
        description: {
          ar: "دوره‌های مرتبط با فقه اسلامی و تفسیر قرآن کریم.",
          ur: "اسلامی فقہ اور قرآن کریم کی تفسیر سے متعلق کورسز۔",
        },
      },
      {
        slug: "hadith-sciences-category",
        name: { ar: "علوم الحديث", ur: "علوم حدیث" },
        description: {
          ar: "دوره‌های مرتبط با مصطلح الحدیث و علم رجال.",
          ur: "اصطلاح حدیث اور علم رجال سے متعلق کورسز۔",
        },
      },
      {
        slug: "islamic-history-category",
        name: { ar: "التاريخ الإسلامي", ur: "اسلامی تاریخ" },
        description: {
          ar: "دوره‌های مرتبط با تاریخ اسلام از بعثت تا امروز.",
          ur: "بعثت سے آج تک اسلامی تاریخ سے متعلق کورسز۔",
        },
      },
      {
        slug: "arabic-language-category",
        name: { ar: "اللغة العربية", ur: "عربی زبان" },
        description: {
          ar: "دوره‌های آموزش زبان عربی برای فهم بهتر متون دینی.",
          ur: "دینی متون کو بہتر سمجھنے کے لیے عربی زبان کے کورسز۔",
        },
      },
      {
        slug: "aqeedah-category",
        name: { ar: "العقيدة", ur: "عقیدہ" },
        description: {
          ar: "دوره‌های مرتبط با اصول عقاید اسلامی.",
          ur: "اسلامی عقائد کے اصولوں سے متعلق کورسز۔",
        },
      },
      {
        slug: "quran-recitation-category",
        name: { ar: "تلاوة وتجويد القرآن", ur: "قرآن کی تلاوت و تجوید" },
        description: {
          ar: "دوره‌های تلاوت صحیح و تجوید قرآن کریم.",
          ur: "قرآن کریم کی صحیح تلاوت اور تجوید کے کورسز۔",
        },
      },
      {
        slug: "fiqh-of-worship-category",
        name: { ar: "فقه العبادات", ur: "فقہ عبادات" },
        description: {
          ar: "دوره‌های مرتبط با احکام نماز، روزه، زکات و حج.",
          ur: "نماز، روزہ، زکوۃ اور حج کے احکام سے متعلق کورسز۔",
        },
      },
      {
        slug: "islamic-ethics-category",
        name: { ar: "الأخلاق والآداب الإسلامية", ur: "اسلامی اخلاق و آداب" },
        description: {
          ar: "دوره‌های مرتبط با اخلاق و آداب اسلامی در زندگی روزمره.",
          ur: "روزمرہ زندگی میں اسلامی اخلاق و آداب سے متعلق کورسز۔",
        },
      },
      {
        slug: "seerah-category",
        name: { ar: "السيرة النبوية", ur: "سیرت نبوی" },
        description: {
          ar: "دوره‌های مرتبط با زندگی و سیره‌ی پیامبر اسلام.",
          ur: "نبی اکرم کی زندگی اور سیرت سے متعلق کورسز۔",
        },
      },
      {
        slug: "islamic-jurisprudence-comparative",
        name: { ar: "الفقه المقارن", ur: "تقابلی فقہ" },
        description: {
          ar: "دوره‌های مقایسه‌ی مذاهب فقهی اسلامی.",
          ur: "اسلامی فقہی مذاہب کے تقابلی مطالعہ کے کورسز۔",
        },
      },
    ];
  }

  private async seedCategories(): Promise<Category[]> {
    const categories: Category[] = [];
    for (let i = 0; i < this.categoryDefs().length; i++) {
      const def = this.categoryDefs()[i]!;
      const existing = await this.categoryRepo.findOne({ where: { slug: def.slug } });
      if (existing) {
        categories.push(existing);
        continue;
      }

      const saved = await this.categoryRepo.save(
        this.categoryRepo.create({
          name: def.name,
          slug: def.slug,
          description: def.description,
          thumbnailUrl: { ar: randomThumbnail(), ur: randomThumbnail() },
          order: i + 1,
        }),
      );
      categories.push(saved);
      this.logger.log(`✓ دسته‌بندی نمونه ساخته شد: ${def.slug}`);
    }
    return categories;
  }

  private async seedCoupons(): Promise<void> {
    const defs: Partial<Coupon>[] = [
      {
        code: "ROOH20",
        discountType: "percentage",
        discountValue: 20,
        maxUses: 100,
        isActive: true,
      },
      {
        code: "WELCOME50",
        discountType: "fixed",
        discountValue: 500000,
        currency: "IRR",
        maxUses: 50,
        isActive: true,
      },
    ];

    for (const def of defs) {
      const existing = await this.couponRepo.findOne({ where: { code: def.code } });
      if (existing) continue;
      await this.couponRepo.save(this.couponRepo.create(def));
      this.logger.log(`✓ کوپن نمونه ساخته شد: ${def.code}`);
    }
  }

  private courseDefs(): SeedCourseDef[] {
    return [
      {
        slug: "intro-to-fiqh-course",
        title: { ar: "مقدمة في الفقه الإسلامي", ur: "اسلامی فقہ کا تعارف" },
        description: {
          ar: "دورة شاملة لتعلم أصول الفقه الإسلامي من الصفر حتى الاحترافية.",
          ur: "اسلامی فقہ کے اصول صفر سے پروفیشنل سطح تک سیکھنے کا مکمل کورس۔",
        },
        amountMinor: 1000000,
        level: "beginner",
        sections: [
          { title: { ar: "الفصل الأول: مدخل إلى الفقه", ur: "پہلا باب: فقہ کا تعارف" }, lessonCount: 4 },
          { title: { ar: "الفصل الثاني: أحكام الطهارة", ur: "دوسرا باب: طہارت کے احکام" }, lessonCount: 6 },
          { title: { ar: "الفصل الثالث: أحكام الصلاة", ur: "تیسرا باب: نماز کے احکام" }, lessonCount: 3 },
        ],
      },
      {
        slug: "quran-tafsir-basics",
        title: { ar: "أساسيات تفسير القرآن الكريم", ur: "قرآن کریم کی تفسیر کے بنیادی اصول" },
        description: {
          ar: "تعلم منهجية تفسير القرآن الكريم وفهم آياته في سياقها الصحيح.",
          ur: "قرآن کریم کی تفسیر کا طریقہ کار اور آیات کو صحیح تناظر میں سمجھنا سیکھیں۔",
        },
        amountMinor: 1500000,
        level: "intermediate",
        sections: [
          { title: { ar: "مدخل إلى علوم التفسير", ur: "علوم تفسیر کا تعارف" }, lessonCount: 5 },
          { title: { ar: "قواعد التفسير", ur: "تفسیر کے قواعد" }, lessonCount: 8 },
          { title: { ar: "تفسير سورة الفاتحة", ur: "سورہ فاتحہ کی تفسیر" }, lessonCount: 2 },
        ],
      },
      {
        slug: "hadith-sciences",
        title: { ar: "علوم الحديث النبوي", ur: "حدیث نبوی کے علوم" },
        description: {
          ar: "دراسة معمقة في مصطلح الحديث وطرق التحقق من صحة الأحاديث.",
          ur: "اصطلاحات حدیث اور احادیث کی صحت جانچنے کے طریقوں کا گہرا مطالعہ۔",
        },
        amountMinor: 2000000,
        level: "advanced",
        sections: [
          { title: { ar: "مصطلح الحديث", ur: "اصطلاح حدیث" }, lessonCount: 7 },
          { title: { ar: "أقسام الحديث من حيث الصحة", ur: "صحت کے اعتبار سے حدیث کی اقسام" }, lessonCount: 6 },
          { title: { ar: "رجال الحديث وعلم الجرح والتعديل", ur: "رجال حدیث اور علم جرح و تعدیل" }, lessonCount: 4 },
        ],
      },
      {
        slug: "islamic-history-101",
        title: { ar: "مدخل إلى التاريخ الإسلامي", ur: "اسلامی تاریخ کا تعارف" },
        description: {
          ar: "نظرة شاملة على أهم محطات التاريخ الإسلامي من البعثة حتى العصر الحاضر.",
          ur: "بعثت سے لے کر دور حاضر تک اسلامی تاریخ کے اہم ترین مراحل کا جامع جائزہ۔",
        },
        amountMinor: 800000,
        level: "beginner",
        sections: [
          { title: { ar: "العصر النبوي", ur: "عہد نبوی" }, lessonCount: 3 },
          { title: { ar: "الخلافة الراشدة", ur: "خلافت راشدہ" }, lessonCount: 5 },
          { title: { ar: "الدول الإسلامية الكبرى", ur: "بڑی اسلامی سلطنتیں" }, lessonCount: 8 },
        ],
      },
      {
        slug: "arabic-for-quran",
        title: { ar: "اللغة العربية لفهم القرآن", ur: "قرآن سمجھنے کے لیے عربی زبان" },
        description: {
          ar: "تعلم قواعد اللغة العربية الأساسية اللازمة لفهم النص القرآني مباشرة.",
          ur: "قرآنی متن کو براہ راست سمجھنے کے لیے ضروری عربی گرامر کے بنیادی اصول سیکھیں۔",
        },
        amountMinor: 1200000,
        level: "beginner",
        sections: [
          { title: { ar: "أساسيات النحو", ur: "نحو کے بنیادی اصول" }, lessonCount: 6 },
          { title: { ar: "أساسيات الصرف", ur: "صرف کے بنیادی اصول" }, lessonCount: 4 },
          { title: { ar: "مفردات القرآن الشائعة", ur: "قرآن کے عام الفاظ" }, lessonCount: 2 },
        ],
      },
    ];
  }

  private async seedCourses(instructorId: string, categoryIds: string[]): Promise<string[]> {
    const courseIds: string[] = [];

    for (const def of this.courseDefs()) {
      const existing = await this.courseRepo.findOne({ where: { slug: def.slug } });
      if (existing) {
        courseIds.push(existing.id);
        continue;
      }

      const randomCategoryId = categoryIds[Math.floor(Math.random() * categoryIds.length)]!;
      const course = await this.courseRepo.save(
        this.courseRepo.create({
          title: def.title,
          slug: def.slug,
          description: def.description,
          thumbnailUrl: { ar: randomThumbnail(), ur: randomThumbnail() },
          price: { amountMinor: def.amountMinor, currency: "IRR" },
          level: def.level,
          runStatus: "ongoing",
          accessType: "online_only",
          isPublished: true,
          instructorId,
          categoryId: randomCategoryId,
        }),
      );

      for (let s = 0; s < def.sections.length; s++) {
        const sectionDef = def.sections[s]!;
        const section = await this.sectionRepo.save(
          this.sectionRepo.create({
            courseId: course.id,
            title: sectionDef.title,
            order: s + 1,
          }),
        );

        const lessons = Array.from({ length: sectionDef.lessonCount }, (_, i) =>
          this.lessonRepo.create({
            title: {
              ar: `${sectionDef.title.ar} — الدرس ${i + 1}`,
              ur: `${sectionDef.title.ur} — درس ${i + 1}`,
            },
            order: i + 1,
            durationMinutes: 10 + ((i * 5) % 25),
            isFreePreview: s === 0 && i === 0,
            sectionId: section.id,
            courseId: course.id,
          }),
        );
        await this.lessonRepo.save(lessons);
      }

      courseIds.push(course.id);
      this.logger.log(`✓ دوره نمونه ساخته شد: ${def.slug} (${def.sections.length} سرفصل)`);
    }

    return courseIds;
  }

  private articleDefs(): SeedArticleDef[] {
    return [
      {
        slug: "intro-to-fiqh",
        title: { ar: "مقدمة في الفقه الإسلامي", ur: "اسلامی فقہ کا تعارف" },
        summary: {
          ar: "نظرة عامة على أصول الفقه وأهميته في حياة المسلم.",
          ur: "فقہ کے اصولوں اور مسلمان کی زندگی میں اس کی اہمیت کا جائزہ۔",
        },
        bodyAr: "يُعدّ الفقه الإسلامي علماً واسعاً يتناول أحكام العبادات والمعاملات...",
        bodyUr: "اسلامی فقہ ایک وسیع علم ہے جو عبادات اور معاملات کے احکام پر مشتمل ہے...",
        status: "published",
        hasThumbnail: true,
      },
      {
        slug: "pillars-of-salah",
        title: { ar: "أركان الصلاة الخمسة", ur: "نماز کے پانچ ارکان" },
        summary: {
          ar: "شرح مبسّط لأركان الصلاة الأساسية.",
          ur: "نماز کے بنیادی ارکان کی آسان وضاحت۔",
        },
        bodyAr: "تشمل الصلاة أركاناً عدة يجب على المصلي الالتزام بها...",
        bodyUr: "نماز میں کئی ارکان شامل ہیں جن کی پابندی نمازی پر لازم ہے...",
        status: "draft",
        hasThumbnail: false,
      },
      {
        slug: "etiquette-of-fasting",
        title: { ar: "آداب الصيام في رمضان", ur: "رمضان میں روزے کے آداب" },
        summary: {
          ar: "أهم الآداب والمستحبات التي ينبغي للصائم الالتزام بها.",
          ur: "وہ اہم آداب اور مستحبات جن کی روزہ دار کو پابندی کرنی چاہیے۔",
        },
        bodyAr: "للصيام آداب كثيرة تزيد من أجره وتحقق المقصود الأعظم منه...",
        bodyUr: "روزے کے بہت سے آداب ہیں جو اس کے اجر میں اضافہ کرتے ہیں...",
        status: "published",
        hasThumbnail: true,
      },
      {
        slug: "importance-of-seeking-knowledge",
        title: { ar: "فضل طلب العلم في الإسلام", ur: "اسلام میں علم حاصل کرنے کی اہمیت" },
        summary: {
          ar: "نصوص وأدلة على مكانة العلم وطلبه في الشريعة الإسلامية.",
          ur: "اسلامی شریعت میں علم اور اس کے حصول کے مقام پر نصوص و دلائل۔",
        },
        bodyAr: "حثّ الإسلام على طلب العلم وجعله فريضة على كل مسلم ومسلمة...",
        bodyUr: "اسلام نے علم کے حصول کی ترغیب دی اور اسے ہر مسلمان مرد و عورت پر فرض قرار دیا...",
        status: "published",
        hasThumbnail: true,
      },
      {
        slug: "zakat-rules-overview",
        title: { ar: "نظرة عامة على أحكام الزكاة", ur: "زکوۃ کے احکام کا جامع جائزہ" },
        summary: {
          ar: "شروط وجوب الزكاة ومقاديرها على اختلاف الأموال.",
          ur: "مختلف اموال پر زکوۃ کی شرائط اور مقدار کی وضاحت۔",
        },
        bodyAr: "الزكاة ركن من أركان الإسلام الخمسة، ولها أحكام تفصيلية تختلف باختلاف نوع المال...",
        bodyUr: "زکوۃ اسلام کے پانچ ارکان میں سے ایک ہے، اور اس کے تفصیلی احکام مال کی قسم کے لحاظ سے مختلف ہیں...",
        status: "draft",
        hasThumbnail: false,
      },
      {
        slug: "hajj-step-by-step",
        title: { ar: "خطوات الحج بالتفصيل", ur: "حج کے مراحل تفصیل سے" },
        summary: {
          ar: "دليل عملي مبسّط لمراحل الحج من الإحرام إلى التحلل.",
          ur: "احرام سے تحلل تک حج کے مراحل کی آسان عملی رہنمائی۔",
        },
        bodyAr: "يمر الحاج بعدة مراحل أساسية تبدأ بالإحرام وتنتهي بطواف الوداع...",
        bodyUr: "حاجی کئی بنیادی مراحل سے گزرتا ہے جو احرام سے شروع ہو کر طواف وداع پر ختم ہوتے ہیں...",
        status: "published",
        hasThumbnail: true,
      },
      {
        slug: "quran-memorization-tips",
        title: { ar: "نصائح عملية لحفظ القرآن الكريم", ur: "قرآن کریم حفظ کرنے کے عملی نکات" },
        summary: {
          ar: "أساليب مجرّبة تساعد على حفظ القرآن وتثبيته في الذهن.",
          ur: "آزمائے ہوئے طریقے جو قرآن حفظ کرنے اور ذہن میں محفوظ رکھنے میں مدد دیتے ہیں۔",
        },
        bodyAr: "حفظ القرآن الكريم يحتاج إلى منهجية واضحة وتكرار منتظم...",
        bodyUr: "قرآن کریم حفظ کرنے کے لیے واضح طریقہ کار اور باقاعدہ تکرار ضروری ہے...",
        status: "published",
        hasThumbnail: true,
      },
      {
        slug: "manners-of-seeking-knowledge",
        title: { ar: "آداب طالب العلم", ur: "طالب علم کے آداب" },
        summary: {
          ar: "الصفات والآداب التي ينبغي أن يتحلى بها طالب العلم الشرعي.",
          ur: "وہ صفات اور آداب جن سے دینی علم کے طالب کو آراستہ ہونا چاہیے۔",
        },
        bodyAr: "لطالب العلم آداب ينبغي التحلي بها مع نفسه ومع شيخه ومع زملائه...",
        bodyUr: "طالب علم کے کچھ آداب ہیں جو اسے اپنے نفس، استاد اور ساتھیوں کے ساتھ اپنانے چاہئیں...",
        status: "draft",
        hasThumbnail: false,
      },
    ];
  }

  private async seedArticles(instructorId: string): Promise<void> {
    for (const def of this.articleDefs()) {
      const existing = await this.articleRepo.findOne({ where: { slug: def.slug } });
      if (existing) continue;

      await this.articleRepo.save(
        this.articleRepo.create({
          title: def.title,
          slug: def.slug,
          summary: def.summary,
          bodyAr: def.bodyAr,
          bodyUr: def.bodyUr,
          thumbnailUrl: def.hasThumbnail
            ? { ar: randomThumbnail(), ur: randomThumbnail() }
            : null,
          instructorId,
          status: def.status,
          publishedAt: def.status === "published" ? new Date() : null,
        }),
      );
      this.logger.log(`✓ مقاله نمونه ساخته شد: ${def.slug} (${def.status})`);
    }
  }

  private async seedReviews(courseIds: string[], studentIds: string[]): Promise<void> {
    const sampleReviews = [
      { rating: 5, comment: "دورة ممتازة ومحتوى مرتب، استفدت كثيراً." },
      { rating: 4, comment: "شرح جيد جداً لكن أتمنى أمثلة أكثر." },
      { rating: 5, comment: null },
      { rating: 3, comment: "الدورة مفيدة لكن سرعة الشرح كانت سريعة قليلاً." },
    ];

    for (const courseId of courseIds) {
      for (let i = 0; i < studentIds.length; i++) {
        const studentId = studentIds[i]!;
        const existing = await this.reviewRepo.findOne({ where: { courseId, userId: studentId } });
        if (existing) continue;

        const sample = sampleReviews[(courseIds.indexOf(courseId) + i) % sampleReviews.length]!;
        await this.reviewRepo.save(
          this.reviewRepo.create({
            courseId,
            userId: studentId,
            rating: sample.rating,
            comment: sample.comment,
          }),
        );
      }
    }
    this.logger.log(`✓ نظرات نمونه ساخته شدند (${courseIds.length} دوره × ${studentIds.length} کاربر)`);
  }
}
