import { Injectable, Logger, OnApplicationBootstrap } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import * as bcrypt from "bcrypt";
import { User } from "../../modules/auth/entities/user.entity";
import { Instructor } from "../../modules/instructor/entities/instructor.entity";
import { Category } from "../../modules/category/entities/category.entity";
import { Coupon } from "../../modules/coupon/entities/coupon.entity";
import { Course } from "../../modules/courses/entities/course.entity";
import { Section } from "../../modules/courses/entities/section.entity";
import { Lesson } from "../../modules/courses/entities/lesson.entity";
import { Article } from "../../modules/articles/entities/article.entity";

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
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    this.logger.log("شروع seed داده‌های نمونه...");

    const admin = await this.seedAdmin();
    const instructor = await this.seedInstructor();
    const category = await this.seedCategory();
    await this.seedCoupon();
    const course = await this.seedCourse(instructor.id, category.id);
    await this.seedSectionsAndLessons(course.id);
    await this.seedArticles(admin.id);

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

  private async seedCategory(): Promise<Category> {
    const slug = "fiqh-and-tafsir";
    const existing = await this.categoryRepo.findOne({ where: { slug } });
    if (existing) return existing;

    const category = this.categoryRepo.create({
      name: { ar: "الفقه والتفسير", ur: "فقہ اور تفسیر" },
      slug,
      description: {
        ar: "دوره‌های مرتبط با فقه اسلامی و تفسیر قرآن کریم.",
        ur: "اسلامی فقہ اور قرآن کریم کی تفسیر سے متعلق کورسز۔",
      },
      order: 1,
    });
    const saved = await this.categoryRepo.save(category);
    this.logger.log(`✓ دسته‌بندی نمونه ساخته شد: ${slug}`);
    return saved;
  }

  private async seedCoupon(): Promise<void> {
    const code = "ROOH20";
    const existing = await this.couponRepo.findOne({ where: { code } });
    if (existing) return;

    const coupon = this.couponRepo.create({
      code,
      discountType: "percentage",
      discountValue: 20,
      maxUses: 100,
      isActive: true,
    });
    await this.couponRepo.save(coupon);
    this.logger.log(`✓ کوپن نمونه ساخته شد: ${code} (۲۰٪)`);
  }

  private async seedCourse(instructorId: string, categoryId: string): Promise<Course> {
    const slug = "intro-to-fiqh-course";
    const existing = await this.courseRepo.findOne({ where: { slug } });
    if (existing) return existing;

    const course = this.courseRepo.create({
      title: { ar: "مقدمة في الفقه الإسلامي", ur: "اسلامی فقہ کا تعارف" },
      slug,
      description: {
        ar: "دورة شاملة لتعلم أصول الفقه الإسلامي من الصفر حتى الاحترافية.",
        ur: "اسلامی فقہ کے اصول صفر سے پروفیشنل سطح تک سیکھنے کا مکمل کورس۔",
      },
      thumbnailUrl: {
        ar: "https://cdn.roohbakhsh.ac/courses/fiqh/thumb-ar.webp",
        ur: "https://cdn.roohbakhsh.ac/courses/fiqh/thumb-ur.webp",
      },
      price: { amountMinor: 1000000, currency: "IRR" },
      level: "beginner",
      runStatus: "ongoing",
      accessType: "online_only",
      isPublished: true,
      instructorId,
      categoryId,
    });
    const saved = await this.courseRepo.save(course);
    this.logger.log(`✓ دوره نمونه ساخته شد: ${slug}`);
    return saved;
  }

  private async seedSectionsAndLessons(courseId: string): Promise<void> {
    const existing = await this.sectionRepo.findOne({ where: { courseId } });
    if (existing) return;

    const section1 = await this.sectionRepo.save(
      this.sectionRepo.create({
        courseId,
        title: { ar: "الفصل الأول: مدخل إلى الفقه", ur: "پہلا باب: فقہ کا تعارف" },
        order: 1,
      }),
    );
    const section2 = await this.sectionRepo.save(
      this.sectionRepo.create({
        courseId,
        title: { ar: "الفصل الثاني: أحكام الطهارة", ur: "دوسرا باب: طہارت کے احکام" },
        order: 2,
      }),
    );

    await this.lessonRepo.save([
      this.lessonRepo.create({
        title: { ar: "تعريف الفقه ومصادره", ur: "فقہ کی تعریف اور اس کے مصادر" },
        order: 1,
        durationMinutes: 15,
        isFreePreview: true,
        sectionId: section1.id,
        courseId,
      }),
      this.lessonRepo.create({
        title: { ar: "تاريخ التشريع الإسلامي", ur: "اسلامی قانون سازی کی تاریخ" },
        order: 2,
        durationMinutes: 20,
        isFreePreview: false,
        sectionId: section1.id,
        courseId,
      }),
      this.lessonRepo.create({
        title: { ar: "الوضوء وأحكامه", ur: "وضو اور اس کے احکام" },
        order: 1,
        durationMinutes: 18,
        isFreePreview: false,
        sectionId: section2.id,
        courseId,
      }),
    ]);
    this.logger.log("✓ سرفصل‌ها و درس‌های نمونه ساخته شدند");
  }

  private async seedArticles(authorId: string): Promise<void> {
    const slug = "intro-to-fiqh";
    const existing = await this.articleRepo.findOne({ where: { slug } });
    if (existing) return;

    await this.articleRepo.save([
      this.articleRepo.create({
        title: { ar: "مقدمة في الفقه الإسلامي", ur: "اسلامی فقہ کا تعارف" },
        slug,
        summary: {
          ar: "نظرة عامة على أصول الفقه وأهميته في حياة المسلم.",
          ur: "فقہ کے اصولوں اور مسلمان کی زندگی میں اس کی اہمیت کا جائزہ۔",
        },
        bodyAr: "يُعدّ الفقه الإسلامي علماً واسعاً يتناول أحكام العبادات والمعاملات...",
        bodyUr: "اسلامی فقہ ایک وسیع علم ہے جو عبادات اور معاملات کے احکام پر مشتمل ہے...",
        thumbnailUrl: {
          ar: "https://cdn.roohbakhsh.ac/articles/fiqh/thumb-ar.webp",
          ur: "https://cdn.roohbakhsh.ac/articles/fiqh/thumb-ur.webp",
        },
        authorId,
        status: "published",
        publishedAt: new Date(),
      }),
      this.articleRepo.create({
        title: { ar: "أركان الصلاة الخمسة", ur: "نماز کے پانچ ارکان" },
        slug: "pillars-of-salah",
        summary: {
          ar: "شرح مبسّط لأركان الصلاة الأساسية.",
          ur: "نماز کے بنیادی ارکان کی آسان وضاحت۔",
        },
        bodyAr: "تشمل الصلاة أركاناً عدة يجب على المصلي الالتزام بها...",
        bodyUr: "نماز میں کئی ارکان شامل ہیں جن کی پابندی نمازی پر لازم ہے...",
        thumbnailUrl: null,
        authorId,
        status: "draft",
        publishedAt: null,
      }),
    ]);
    this.logger.log("✓ مقالات نمونه ساخته شدند");
  }
}
