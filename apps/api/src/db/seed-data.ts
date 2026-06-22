/**
 * seed-data: ایجاد داده‌های نمونه برای محیط development
 *
 * اجرا از پوشه apps/api:
 *   npx ts-node -r tsconfig-paths/register src/db/seed-data.ts
 *
 * این اسکریپت موارد زیر را می‌سازد:
 *  - کاربر admin (اگر نباشد)
 *  - ۶ دسته‌بندی
 *  - ۴ استاد
 *  - ۶ دوره (با section + lesson)
 *  - ۸ مقاله
 */
import "reflect-metadata";
import { DataSource } from "typeorm";
import * as bcrypt from "bcrypt";
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.resolve(__dirname, "../../.env.developer") });

const ds = new DataSource({
  type: "mysql",
  host:     process.env["DB_HOST"]     ?? "localhost",
  port:     Number(process.env["DB_PORT"] ?? 3306),
  username: process.env["DB_USERNAME"] ?? "root",
  password: process.env["DB_PASSWORD"] ?? "",
  database: process.env["DB_DATABASE"] ?? "roohbakhshac",
  entities: [__dirname + "/../modules/**/entities/*.entity.{ts,js}"],
  synchronize: false,
});

/* ── helpers ──────────────────────────────────────────────────────────── */
function uuid() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}

/* ── main ─────────────────────────────────────────────────────────────── */
async function main() {
  await ds.initialize();
  console.log("✔  DB connected");

  const userRepo       = ds.getRepository("User");
  const catRepo        = ds.getRepository("Category");
  const instrRepo      = ds.getRepository("Instructor");
  const courseRepo     = ds.getRepository("Course");
  const sectionRepo    = ds.getRepository("Section");
  const lessonRepo     = ds.getRepository("Lesson");
  const articleRepo    = ds.getRepository("Article");

  /* ── 1. Admin user ────────────────────────────────────────────────── */
  let admin = await userRepo.findOne({ where: { email: "admin@roohbakhsh.com" } });
  if (!admin) {
    admin = await userRepo.save(userRepo.create({
      id: uuid(),
      email: "admin@roohbakhsh.com",
      fullName: "Super Admin",
      passwordHash: await bcrypt.hash("Admin@1234", 12),
      role: "admin",
      preferredLocale: "ar",
    }));
    console.log("✔  Admin created: admin@roohbakhsh.com / Admin@1234");
  } else if (admin.role !== "admin") {
    await userRepo.update(admin.id, { role: "admin" });
    console.log("✔  Existing user promoted to admin");
  } else {
    console.log("✔  Admin already exists");
  }

  /* ── 2. Test student ──────────────────────────────────────────────── */
  const student = await userRepo.findOne({ where: { email: "student@roohbakhsh.com" } });
  if (!student) {
    await userRepo.save(userRepo.create({
      id: uuid(),
      email: "student@roohbakhsh.com",
      fullName: "طالب علم نموذجي",
      passwordHash: await bcrypt.hash("Student@1234", 12),
      role: "user",
      preferredLocale: "ar",
    }));
    console.log("✔  Student created: student@roohbakhsh.com / Student@1234");
  }

  /* ── 3. Categories ────────────────────────────────────────────────── */
  const CATS = [
    { slug: "quran",    name: { ar: "القرآن الكريم",       ur: "قرآن کریم"          }, order: 1 },
    { slug: "arabic",   name: { ar: "اللغة العربية",       ur: "عربی زبان"          }, order: 2 },
    { slug: "fiqh",     name: { ar: "الفقه الإسلامي",      ur: "اسلامی فقہ"         }, order: 3 },
    { slug: "aqeedah",  name: { ar: "العقيدة الإسلامية",   ur: "اسلامی عقیدہ"       }, order: 4 },
    { slug: "seerah",   name: { ar: "السيرة النبوية",      ur: "سیرت نبوی"          }, order: 5 },
    { slug: "tazkiyah", name: { ar: "التزكية والسلوك",     ur: "تزکیہ و سلوک"       }, order: 6 },
  ];

  const catIds: Record<string, string> = {};
  for (const c of CATS) {
    let cat = await catRepo.findOne({ where: { slug: c.slug } });
    if (!cat) {
      const id = uuid();
      await catRepo.save(catRepo.create({ id, ...c }));
      catIds[c.slug] = id;
    } else {
      catIds[c.slug] = cat.id;
    }
  }
  console.log("✔  Categories ready");

  /* ── 4. Instructors ───────────────────────────────────────────────── */
  const INSTRUCTORS = [
    {
      slug: "sheikh-ahmad-hasan",
      name:      { ar: "الشيخ أحمد الحسن",    ur: "شیخ احمد الحسن"    },
      title:     { ar: "أستاذ العلوم الإسلامية", ur: "استاد اسلامی علوم" },
      bio:       { ar: "عالم إسلامي متخصص في علوم القرآن واللغة العربية، يتمتع بخبرة تدريس تزيد عن ٢٠ عاماً.", ur: "قرآن اور عربی زبان کے علوم میں ماہر اسلامی عالم، ۲۰ سال سے زائد تدریسی تجربہ۔" },
      photoUrl:  "https://dl.poshtybanman.ir/upload/%D8%B9%DA%A9%D8%B3%20%D9%87%D8%AF%D8%B1_690c6ae90fcc2.jpg",
      expertise: ["quran", "arabic"],
    },
    {
      slug: "dr-fatima-najjar",
      name:      { ar: "د. فاطمة النجار",      ur: "ڈاکٹرہ فاطمہ النجار" },
      title:     { ar: "دكتورة في الفقه الإسلامي", ur: "اسلامی فقہ کی ڈاکٹرہ" },
      bio:       { ar: "متخصصة في الفقه المقارن والمسائل المعاصرة، حاصلة على الدكتوراه من جامعة الأزهر الشريف.", ur: "مقارن فقہ اور معاصر مسائل میں ماہر، جامعہ ازہر سے ڈاکٹریٹ کی حامل۔" },
      photoUrl:  "https://dl.poshtybanman.ir/upload/6%20(1)_68924fcebd53d.jpg",
      expertise: ["fiqh", "aqeedah"],
    },
    {
      slug: "sheikh-yusuf-ansari",
      name:      { ar: "الشيخ يوسف الأنصاري",  ur: "شیخ یوسف الانصاری" },
      title:     { ar: "متخصص في السيرة والتاريخ", ur: "سیرت و تاریخ کے ماہر" },
      bio:       { ar: "باحث وأستاذ متخصص في السيرة النبوية والتاريخ الإسلامي، مؤلف أكثر من ١٥ كتاباً.", ur: "سیرت نبوی اور اسلامی تاریخ کے محقق اور استاد، ۱۵ سے زائد کتابوں کے مصنف۔" },
      photoUrl:  "https://dl.poshtybanman.ir/upload/7%20(1)_68924fcdf18ae.jpg",
      expertise: ["seerah", "tazkiyah"],
    },
    {
      slug: "dr-muhammad-bustani",
      name:      { ar: "د. محمد البستاني",      ur: "ڈاکٹر محمد البستانی" },
      title:     { ar: "دكتور في اللغة العربية والبلاغة", ur: "عربی زبان اور بلاغت کے ڈاکٹر" },
      bio:       { ar: "أستاذ متخصص في النحو والصرف والبلاغة، خبرة تدريس في أكثر من ١٠ دول عربية.", ur: "نحو، صرف اور بلاغت کے ماہر استاد، ۱۰ سے زائد عرب ممالک میں تدریسی تجربہ۔" },
      photoUrl:  "https://dl.poshtybanman.ir/upload/%D8%B5%D9%84%D8%AD_6880d1068d6f3.jpg",
      expertise: ["arabic"],
    },
  ];

  const instrIds: Record<string, string> = {};
  for (const ins of INSTRUCTORS) {
    let existing = await instrRepo.findOne({ where: { slug: ins.slug } });
    if (!existing) {
      const id = uuid();
      await instrRepo.save(instrRepo.create({ id, ...ins }));
      instrIds[ins.slug] = id;
    } else {
      instrIds[ins.slug] = existing.id;
    }
  }
  console.log("✔  Instructors ready");

  /* ── 5. Courses ───────────────────────────────────────────────────── */
  const COURSES = [
    {
      slug: "quran-recitation-foundations",
      title:       { ar: "أساسيات تلاوة القرآن الكريم بالتجويد", ur: "تجوید کے ساتھ قرآن کریم کی تلاوت کی بنیادیں" },
      description: { ar: "تعلّم أسس التجويد الصحيح من البداية حتى الاحتراف، مع التطبيق العملي على الآيات القرآنية الكريمة.", ur: "ابتداء سے احتراف تک تجوید کی بنیادیں سیکھیں، قرآنی آیات پر عملی تطبیق کے ساتھ۔" },
      thumbnailUrl: { ar: "https://dl.poshtybanman.ir/upload/6%20(1)_68924fcebd53d.jpg", ur: "https://dl.poshtybanman.ir/upload/6%20(1)_68924fcebd53d.jpg" },
      price:        { amountMinor: 4900, currency: "USD" },
      effectivePrice: { amountMinor: 3500, currency: "USD" },
      durationMinutes: 720,
      level: "beginner",
      isPublished: true,
      instructorSlug: "sheikh-ahmad-hasan",
      categorySlug: "quran",
      sections: [
        {
          title: { ar: "مقدمة في علم التجويد", ur: "علم التجوید کا تعارف" },
          order: 1,
          lessons: [
            { title: { ar: "تعريف التجويد وحكمه", ur: "تجوید کی تعریف اور حکم" }, order: 1, durationMinutes: 25, isFreePreview: true },
            { title: { ar: "مخارج الحروف", ur: "حروف کے مخارج" }, order: 2, durationMinutes: 40, isFreePreview: true },
            { title: { ar: "صفات الحروف", ur: "حروف کی صفات" }, order: 3, durationMinutes: 35, isFreePreview: false },
          ],
        },
        {
          title: { ar: "أحكام النون الساكنة والتنوين", ur: "نون ساکنہ اور تنوین کے احکام" },
          order: 2,
          lessons: [
            { title: { ar: "الإظهار الحلقي", ur: "اظہار حلقی" }, order: 1, durationMinutes: 30, isFreePreview: false },
            { title: { ar: "الإدغام بنوعيه", ur: "ادغام اور اس کی اقسام" }, order: 2, durationMinutes: 30, isFreePreview: false },
            { title: { ar: "الإخفاء الحقيقي", ur: "اخفاء حقیقی" }, order: 3, durationMinutes: 30, isFreePreview: false },
          ],
        },
        {
          title: { ar: "أحكام المد", ur: "مد کے احکام" },
          order: 3,
          lessons: [
            { title: { ar: "المد الطبيعي", ur: "مد طبیعی" }, order: 1, durationMinutes: 25, isFreePreview: false },
            { title: { ar: "المد الفرعي", ur: "مد فرعی" }, order: 2, durationMinutes: 35, isFreePreview: false },
          ],
        },
      ],
    },
    {
      slug: "arabic-grammar-beginners",
      title:       { ar: "النحو العربي للمبتدئين — من الصفر إلى المتوسط", ur: "مبتدیوں کے لیے عربی گرامر — صفر سے درمیانی سطح تک" },
      description: { ar: "دورة شاملة في قواعد النحو والصرف العربي، مُصممة للمبتدئين الراغبين في فهم القرآن والسنة.", ur: "عربی نحو اور صرف کا مکمل کورس، ابتدائی طالب علموں کے لیے جو قرآن و سنت سمجھنا چاہتے ہیں۔" },
      thumbnailUrl: { ar: "https://dl.poshtybanman.ir/upload/%D8%B5%D9%84%D8%AD_6880d1068d6f3.jpg", ur: "https://dl.poshtybanman.ir/upload/%D8%B5%D9%84%D8%AD_6880d1068d6f3.jpg" },
      price:        { amountMinor: 5900, currency: "USD" },
      effectivePrice: { amountMinor: 5900, currency: "USD" },
      durationMinutes: 960,
      level: "beginner",
      isPublished: true,
      instructorSlug: "dr-muhammad-bustani",
      categorySlug: "arabic",
      sections: [
        {
          title: { ar: "المبتدأ والخبر", ur: "مبتدأ اور خبر" },
          order: 1,
          lessons: [
            { title: { ar: "تعريف المبتدأ وأنواعه", ur: "مبتدأ کی تعریف اور اقسام" }, order: 1, durationMinutes: 30, isFreePreview: true },
            { title: { ar: "أنواع الخبر", ur: "خبر کی اقسام" }, order: 2, durationMinutes: 30, isFreePreview: false },
          ],
        },
        {
          title: { ar: "الأفعال والضمائر", ur: "افعال اور ضمائر" },
          order: 2,
          lessons: [
            { title: { ar: "الماضي والمضارع والأمر", ur: "ماضی، مضارع اور امر" }, order: 1, durationMinutes: 45, isFreePreview: false },
            { title: { ar: "الضمائر المنفصلة والمتصلة", ur: "ضمائر منفصلہ اور متصلہ" }, order: 2, durationMinutes: 40, isFreePreview: false },
          ],
        },
      ],
    },
    {
      slug: "fiqh-essentials",
      title:       { ar: "أسس الفقه الإسلامي — الطهارة والصلاة", ur: "اسلامی فقہ کی بنیادیں — طہارت اور نماز" },
      description: { ar: "تعلّم أحكام الطهارة والصلاة وفق المذاهب الأربعة، مع التدليل من القرآن والسنة.", ur: "چاروں مذاہب کے مطابق طہارت اور نماز کے احکام سیکھیں، قرآن و سنت سے دلائل کے ساتھ۔" },
      thumbnailUrl: { ar: "https://dl.poshtybanman.ir/upload/7%20(1)_68924fcdf18ae.jpg", ur: "https://dl.poshtybanman.ir/upload/7%20(1)_68924fcdf18ae.jpg" },
      price:        { amountMinor: 0, currency: "USD" },
      effectivePrice: null,
      durationMinutes: 540,
      level: "beginner",
      isPublished: true,
      instructorSlug: "dr-fatima-najjar",
      categorySlug: "fiqh",
      sections: [
        {
          title: { ar: "أحكام الطهارة", ur: "طہارت کے احکام" },
          order: 1,
          lessons: [
            { title: { ar: "الوضوء وشروطه", ur: "وضو اور اس کی شرائط" }, order: 1, durationMinutes: 35, isFreePreview: true },
            { title: { ar: "موجبات الغسل", ur: "غسل کے موجبات" }, order: 2, durationMinutes: 30, isFreePreview: true },
            { title: { ar: "التيمم وأحكامه", ur: "تیمم اور اس کے احکام" }, order: 3, durationMinutes: 25, isFreePreview: false },
          ],
        },
        {
          title: { ar: "أحكام الصلاة", ur: "نماز کے احکام" },
          order: 2,
          lessons: [
            { title: { ar: "شروط الصلاة وأركانها", ur: "نماز کی شرائط اور ارکان" }, order: 1, durationMinutes: 40, isFreePreview: false },
            { title: { ar: "مبطلات الصلاة", ur: "نماز توڑنے والی چیزیں" }, order: 2, durationMinutes: 30, isFreePreview: false },
          ],
        },
      ],
    },
    {
      slug: "seerah-nabawiyya-complete",
      title:       { ar: "السيرة النبوية الشريفة — دراسة شاملة", ur: "سیرت نبوی شریفہ — مکمل مطالعہ" },
      description: { ar: "رحلة عميقة في حياة النبي محمد ﷺ من المولد حتى الوفاة، مع استخلاص الدروس والعبر.", ur: "نبی محمد ﷺ کی حیات کا ولادت سے وفات تک گہرا سفر، سبق اور نصیحت کے استخلاص کے ساتھ۔" },
      thumbnailUrl: { ar: "https://dl.poshtybanman.ir/upload/%D8%B9%DA%A9%D8%B3%20%D9%87%D8%AF%D8%B1_690c6ae90fcc2.jpg", ur: "https://dl.poshtybanman.ir/upload/%D8%B9%DA%A9%D8%B3%20%D9%87%D8%AF%D8%B1_690c6ae90fcc2.jpg" },
      price:        { amountMinor: 7900, currency: "USD" },
      effectivePrice: { amountMinor: 5900, currency: "USD" },
      durationMinutes: 1440,
      level: "intermediate",
      isPublished: true,
      instructorSlug: "sheikh-yusuf-ansari",
      categorySlug: "seerah",
      sections: [
        {
          title: { ar: "مكة المكرمة — مرحلة الوحي والدعوة", ur: "مکہ مکرمہ — وحی اور دعوت کا مرحلہ" },
          order: 1,
          lessons: [
            { title: { ar: "نسب النبي ﷺ ومولده الشريف", ur: "نبی ﷺ کا نسب اور ولادت باسعادت" }, order: 1, durationMinutes: 40, isFreePreview: true },
            { title: { ar: "مرحلة الشباب وسلوك النبي ﷺ", ur: "جوانی کا دور اور نبی ﷺ کی سیرت" }, order: 2, durationMinutes: 35, isFreePreview: true },
            { title: { ar: "بدء الوحي والدعوة السرية", ur: "وحی کا آغاز اور خفیہ دعوت" }, order: 3, durationMinutes: 45, isFreePreview: false },
          ],
        },
        {
          title: { ar: "المدينة المنورة — بناء الدولة الإسلامية", ur: "مدینہ منورہ — اسلامی ریاست کی تعمیر" },
          order: 2,
          lessons: [
            { title: { ar: "الهجرة النبوية وأحداثها", ur: "نبوی ہجرت اور اس کے واقعات" }, order: 1, durationMinutes: 50, isFreePreview: false },
            { title: { ar: "بناء المسجد والمجتمع الإسلامي", ur: "مسجد اور اسلامی معاشرے کی تعمیر" }, order: 2, durationMinutes: 40, isFreePreview: false },
          ],
        },
      ],
    },
    {
      slug: "aqeedah-tahawiyya",
      title:       { ar: "شرح العقيدة الطحاوية — المعتقد الإسلامي الصحيح", ur: "شرح عقیدہ طحاویہ — صحیح اسلامی عقیدہ" },
      description: { ar: "شرح مبسّط وعميق لمتن العقيدة الطحاوية، يُعرّف بالعقيدة الإسلامية الصحيحة بعيداً عن الانحرافات.", ur: "عقیدہ طحاویہ کی آسان اور گہری شرح جو انحرافات سے دور صحیح اسلامی عقیدے سے متعارف کراتی ہے۔" },
      thumbnailUrl: { ar: "https://dl.poshtybanman.ir/upload/6%20(1)_68924fcebd53d.jpg", ur: "https://dl.poshtybanman.ir/upload/6%20(1)_68924fcebd53d.jpg" },
      price:        { amountMinor: 4500, currency: "USD" },
      effectivePrice: { amountMinor: 4500, currency: "USD" },
      durationMinutes: 840,
      level: "intermediate",
      isPublished: true,
      instructorSlug: "dr-fatima-najjar",
      categorySlug: "aqeedah",
      sections: [
        {
          title: { ar: "أصول الإيمان", ur: "ایمان کے اصول" },
          order: 1,
          lessons: [
            { title: { ar: "الإيمان بالله وصفاته", ur: "اللہ اور اس کی صفات پر ایمان" }, order: 1, durationMinutes: 45, isFreePreview: true },
            { title: { ar: "الإيمان بالملائكة والكتب", ur: "فرشتوں اور کتابوں پر ایمان" }, order: 2, durationMinutes: 35, isFreePreview: false },
          ],
        },
      ],
    },
    {
      slug: "tazkiyah-nafs",
      title:       { ar: "تزكية النفس — رحلة التحول الروحي", ur: "تزکیہ نفس — روحانی تبدیلی کا سفر" },
      description: { ar: "دورة متكاملة في علم التزكية وتهذيب النفس، تجمع بين النصوص الشرعية والمنهج التربوي العملي.", ur: "تزکیہ اور اصلاح نفس کا مکمل کورس جو شرعی نصوص اور عملی تربیتی منہج کو یکجا کرتا ہے۔" },
      thumbnailUrl: { ar: "https://dl.poshtybanman.ir/upload/%D8%B5%D9%84%D8%AD_6880d1068d6f3.jpg", ur: "https://dl.poshtybanman.ir/upload/%D8%B5%D9%84%D8%AD_6880d1068d6f3.jpg" },
      price:        { amountMinor: 3500, currency: "USD" },
      effectivePrice: { amountMinor: 2500, currency: "USD" },
      durationMinutes: 600,
      level: "beginner",
      isPublished: true,
      instructorSlug: "sheikh-yusuf-ansari",
      categorySlug: "tazkiyah",
      sections: [
        {
          title: { ar: "محاسبة النفس والمراقبة", ur: "نفس کا محاسبہ اور مراقبہ" },
          order: 1,
          lessons: [
            { title: { ar: "أهمية تزكية النفس في الإسلام", ur: "اسلام میں تزکیہ نفس کی اہمیت" }, order: 1, durationMinutes: 30, isFreePreview: true },
            { title: { ar: "أسباب أمراض القلوب", ur: "دل کی بیماریوں کے اسباب" }, order: 2, durationMinutes: 35, isFreePreview: false },
            { title: { ar: "وسائل تزكية النفس", ur: "تزکیہ نفس کے وسائل" }, order: 3, durationMinutes: 40, isFreePreview: false },
          ],
        },
      ],
    },
  ];

  for (const c of COURSES) {
    let course = await courseRepo.findOne({ where: { slug: c.slug } });
    if (!course) {
      const id = uuid();
      await courseRepo.save(courseRepo.create({
        id,
        slug: c.slug,
        title: c.title,
        description: c.description,
        thumbnailUrl: c.thumbnailUrl,
        price: c.price?.amountMinor === 0 ? null : c.price,
        effectivePrice: c.effectivePrice,
        durationMinutes: c.durationMinutes,
        level: c.level,
        isPublished: c.isPublished,
        instructorId: instrIds[c.instructorSlug],
        categoryId: catIds[c.categorySlug],
      }));

      for (const sec of c.sections) {
        const secId = uuid();
        await sectionRepo.save(sectionRepo.create({
          id: secId,
          title: sec.title,
          order: sec.order,
          courseSlug: c.slug,
        }));

        for (const les of sec.lessons) {
          await lessonRepo.save(lessonRepo.create({
            id: uuid(),
            title: les.title,
            order: les.order,
            durationMinutes: les.durationMinutes,
            isFreePreview: les.isFreePreview,
            sectionId: secId,
          }));
        }
      }

      console.log(`✔  Course: ${c.slug}`);
    } else {
      console.log(`–  Course exists: ${c.slug}`);
    }
  }

  /* ── 6. Articles ──────────────────────────────────────────────────── */
  const ARTICLES = [
    {
      slug: "quran-recitation-importance",
      title:       { ar: "فضل تعلم علوم القرآن الكريم", ur: "قرآن کریم کے علوم سیکھنے کی فضیلت" },
      summary:     { ar: "في زمن تتشابك فيه المعلومات يزداد أهمية العودة إلى المصادر الأصيلة للعلم الإسلامي وأثرها في حياة المسلم.", ur: "معلومات کے اس دور میں اصیل اسلامی علمی منابع کی طرف رجوع اور بھی ضروری ہو جاتا ہے۔" },
      content:     { ar: "<p>العلم بالقرآن الكريم هو أشرف العلوم وأجلّها قدراً...</p>", ur: "<p>قرآن کریم کا علم تمام علوم میں سب سے شریف ہے...</p>" },
      thumbnailUrl: { ar: "https://dl.poshtybanman.ir/upload/6%20(1)_68924fcebd53d.jpg", ur: "https://dl.poshtybanman.ir/upload/6%20(1)_68924fcebd53d.jpg" },
      categorySlug: "quran",
      isPublished: true,
    },
    {
      slug: "arabic-language-start",
      title:       { ar: "كيف تبدأ رحلتك في اللغة العربية؟", ur: "عربی زبان سیکھنے کا آغاز کیسے کریں؟" },
      summary:     { ar: "اللغة العربية بوابتك لفهم القرآن الكريم والتراث الإسلامي الغني. إليك الخطوات العملية للبداية الصحيحة.", ur: "عربی زبان قرآن اور اسلامی ورثے کو سمجھنے کا دروازہ ہے۔ یہاں شروع کرنے کے عملی اقدامات ہیں۔" },
      content:     { ar: "<p>تعلّم اللغة العربية رحلة مثيرة تبدأ بخطوة...</p>", ur: "<p>عربی زبان سیکھنا ایک دلچسپ سفر ہے جو ایک قدم سے شروع ہوتا ہے...</p>" },
      thumbnailUrl: { ar: "https://dl.poshtybanman.ir/upload/%D8%B5%D9%84%D8%AD_6880d1068d6f3.jpg", ur: "https://dl.poshtybanman.ir/upload/%D8%B5%D9%84%D8%AD_6880d1068d6f3.jpg" },
      categorySlug: "arabic",
      isPublished: true,
    },
    {
      slug: "salaf-method-tazkiyah",
      title:       { ar: "منهج السلف في التزكية والسلوك", ur: "تزکیہ میں سلف کا منہج" },
      summary:     { ar: "تعرّف على منهج أئمة السلف في تزكية النفس وتهذيب الأخلاق وبناء الشخصية المسلمة السوية.", ur: "ائمہ سلف کا نفس کی اصلاح، اخلاق کی تہذیب اور مسلم شخصیت کی تعمیر کا طریقہ سمجھیں۔" },
      content:     { ar: "<p>اهتم السلف الصالح اهتماماً بالغاً بتزكية النفوس...</p>", ur: "<p>سلف صالحین نے نفس کی تزکیہ کو بہت اہمیت دی...</p>" },
      thumbnailUrl: { ar: "https://dl.poshtybanman.ir/upload/7%20(1)_68924fcdf18ae.jpg", ur: "https://dl.poshtybanman.ir/upload/7%20(1)_68924fcdf18ae.jpg" },
      categorySlug: "tazkiyah",
      isPublished: true,
    },
    {
      slug: "quran-ijazah-guide",
      title:       { ar: "الإجازة القرآنية: ما هي وكيف تنالها؟", ur: "قرآنی اجازہ: کیا ہے اور کیسے ملتا ہے؟" },
      summary:     { ar: "الإجازة القرآنية شهادة تواتر تثبت صحة قراءتك. تعرّف على شروطها وكيفية الحصول عليها من المتخصصين.", ur: "قرآنی اجازہ تواتر کی سند ہے جو آپ کی قراءت کی صحت ثابت کرتی ہے۔ اس کی شرائط اور حصول کا طریقہ جانیں۔" },
      content:     { ar: "<p>الإجازة القرآنية من أعلى الأسانيد العلمية في علوم القرآن...</p>", ur: "<p>قرآنی اجازہ علوم قرآن میں سب سے اعلی اسناد میں سے ہے...</p>" },
      thumbnailUrl: { ar: "https://dl.poshtybanman.ir/upload/%D8%B9%DA%A9%D8%B3%20%D9%87%D8%AF%D8%B1_690c6ae90fcc2.jpg", ur: "https://dl.poshtybanman.ir/upload/%D8%B9%DA%A9%D8%B3%20%D9%87%D8%AF%D8%B1_690c6ae90fcc2.jpg" },
      categorySlug: "quran",
      isPublished: true,
    },
    {
      slug: "fiqh-daily-life",
      title:       { ar: "أثر الفقه في الحياة اليومية للمسلم", ur: "روزمرہ زندگی میں فقہ کا اثر" },
      summary:     { ar: "الفقه ليس مجرد علم نظري، بل هو منهج حياة ينظم علاقاتك في كل جانب من جوانب الحياة اليومية.", ur: "فقہ محض نظری علم نہیں بلکہ وہ منہج حیات ہے جو زندگی کے ہر پہلو کو منظم کرتا ہے۔" },
      content:     { ar: "<p>يمتد أثر الفقه الإسلامي ليشمل جميع جوانب حياة المسلم...</p>", ur: "<p>اسلامی فقہ کا اثر مسلمان کی زندگی کے تمام پہلوؤں پر پھیلا ہوا ہے...</p>" },
      thumbnailUrl: { ar: "https://dl.poshtybanman.ir/upload/6%20(1)_68924fcebd53d.jpg", ur: "https://dl.poshtybanman.ir/upload/6%20(1)_68924fcebd53d.jpg" },
      categorySlug: "fiqh",
      isPublished: true,
    },
    {
      slug: "seerah-lessons-modern",
      title:       { ar: "السيرة النبوية: دروس للحياة المعاصرة", ur: "سیرت نبوی: جدید زندگی کے لیے سبق" },
      summary:     { ar: "حياة النبي ﷺ لم تكن مجرد تاريخ، بل هي منهج متكامل يُلهم المسلمين في كل زمان ومكان.", ur: "نبی ﷺ کی حیات محض تاریخ نہیں بلکہ ایک مکمل منہج ہے جو ہر زمانے میں رہنمائی کرتا ہے۔" },
      content:     { ar: "<p>تزخر السيرة النبوية بالدروس العملية التي تُلهم المسلم في حياته المعاصرة...</p>", ur: "<p>سیرت نبوی ایسے عملی سبقوں سے بھری پڑی ہے جو مسلمان کو جدید زندگی میں رہنمائی دیتی ہے...</p>" },
      thumbnailUrl: { ar: "https://dl.poshtybanman.ir/upload/%D8%B5%D9%84%D8%AD_6880d1068d6f3.jpg", ur: "https://dl.poshtybanman.ir/upload/%D8%B5%D9%84%D8%AD_6880d1068d6f3.jpg" },
      categorySlug: "seerah",
      isPublished: true,
    },
    {
      slug: "aqeedah-modern-challenges",
      title:       { ar: "العقيدة الإسلامية في مواجهة التحديات المعاصرة", ur: "جدید چیلنجز کا سامنا کرتی اسلامی عقیدہ" },
      summary:     { ar: "كيف يمكن للعقيدة الإسلامية الراسخة أن تواجه الشبهات الفكرية المعاصرة بمنهجية وعلمية؟", ur: "اسلامی عقیدہ کس طرح منظم اور علمی انداز میں جدید فکری شبہات کا سامنا کر سکتا ہے؟" },
      content:     { ar: "<p>يواجه المسلم المعاصر تحديات فكرية متجددة تستدعي ترسيخ العقيدة الصحيحة...</p>", ur: "<p>جدید مسلمان نئے فکری چیلنجز کا سامنا کر رہا ہے جن کے لیے صحیح عقیدہ کی مضبوطی ضروری ہے...</p>" },
      thumbnailUrl: { ar: "https://dl.poshtybanman.ir/upload/7%20(1)_68924fcdf18ae.jpg", ur: "https://dl.poshtybanman.ir/upload/7%20(1)_68924fcdf18ae.jpg" },
      categorySlug: "aqeedah",
      isPublished: true,
    },
    {
      slug: "arabic-quran-connection",
      title:       { ar: "العربية مفتاح القرآن — أثرها في فهم النصوص", ur: "عربی قرآن کی چابی — متون کی فہم میں اس کا اثر" },
      summary:     { ar: "يكشف هذا المقال عن العلاقة الوثيقة بين إتقان اللغة العربية والقدرة على استيعاب المعاني القرآنية.", ur: "یہ مقالہ عربی زبان کی مہارت اور قرآنی معانی کو سمجھنے کی صلاحیت کے گہرے تعلق کو واضح کرتا ہے۔" },
      content:     { ar: "<p>ارتبط القرآن الكريم باللغة العربية ارتباطاً وثيقاً لا ينفصل...</p>", ur: "<p>قرآن کریم عربی زبان سے ایک ایسے گہرے تعلق میں منسلک ہے جو جدا نہیں ہو سکتا...</p>" },
      thumbnailUrl: { ar: "https://dl.poshtybanman.ir/upload/%D8%B9%DA%A9%D8%B3%20%D9%87%D8%AF%D8%B1_690c6ae90fcc2.jpg", ur: "https://dl.poshtybanman.ir/upload/%D8%B9%DA%A9%D8%B3%20%D9%87%D8%AF%D8%B1_690c6ae90fcc2.jpg" },
      categorySlug: "arabic",
      isPublished: true,
    },
  ];

  for (const a of ARTICLES) {
    const existing = await articleRepo.findOne({ where: { slug: a.slug } });
    if (!existing) {
      await articleRepo.save(articleRepo.create({
        id: uuid(),
        slug: a.slug,
        title: a.title,
        summary: a.summary,
        content: a.content,
        thumbnailUrl: a.thumbnailUrl,
        categoryId: catIds[a.categorySlug],
        authorId: admin!.id,
        isPublished: a.isPublished,
        publishedAt: new Date().toISOString(),
      }));
      console.log(`✔  Article: ${a.slug}`);
    } else {
      console.log(`–  Article exists: ${a.slug}`);
    }
  }

  await ds.destroy();
  console.log("\n🎉  Seed complete!");
  console.log("   Admin:   admin@roohbakhsh.com  /  Admin@1234");
  console.log("   Student: student@roohbakhsh.com  /  Student@1234");
}

main().catch((e) => { console.error(e); process.exit(1); });
