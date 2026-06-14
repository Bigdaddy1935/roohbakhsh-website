import { useTranslations } from "next-intl";
import type { Locale } from "@roohbakhsh/shared";
import { getCourses } from "../../lib/api";

// صفحه‌ی اصلی (نمونه). داده‌ها را از API بک‌اند می‌گیرد و کارت دوره می‌سازد.
export default async function HomePage({
  params,
}: {
  params: { locale: Locale };
}) {
  const { locale } = params;

  // اگر بک‌اند بالا نباشد، صفحه خالی نشود
  let courses;
  try {
    courses = await getCourses();
  } catch {
    courses = { items: [] };
  }

  return (
    <main className="container">
      <Header />
      <section>
        <h2 className="section-title">الدورات / کورسز</h2>
        <div className="course-grid">
          {courses.items.map((c) => (
            <article key={c.id} className="course-card">
              <h3 className="course-title">{c.title[locale]}</h3>
              <p className="course-excerpt">{c.excerpt[locale]}</p>
              <span className="instructor">{c.instructor.name[locale]}</span>
              <button className="cta">عرض الدورة / کورس دیکھیں</button>
            </article>
          ))}
          {courses.items.length === 0 && (
            <p className="empty">دوره‌ای یافت نشد — مطمئن شو API بالا است.</p>
          )}
        </div>
      </section>
    </main>
  );
}

function Header() {
  // useTranslations فقط برای نمونه‌ی i18n
  const t = useTranslations("home");
  return (
    <header className="site-header">
      <strong className="brand">{t("brand")}</strong>
    </header>
  );
}
