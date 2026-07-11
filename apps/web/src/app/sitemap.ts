import type { MetadataRoute } from "next";
import type { CourseRecord, ArticleRecord, Paginated } from "@roohbakhsh/shared";
import { serverGet } from "@/lib/api-server";
import { SITE_URL } from "@/lib/seo";
import { routing } from "@/i18n/routing";

const STATIC_PATHS = ["", "/courses", "/articles", "/about", "/terms"];

async function fetchAll<T>(path: string): Promise<T[]> {
  const items: T[] = [];
  let page = 1;
  const limit = 50;
  for (let i = 0; i < 20; i++) {
    const res = await serverGet<Paginated<T>>(`${path}?page=${page}&limit=${limit}`);
    if (!res || res.items.length === 0) break;
    items.push(...res.items);
    if (page >= res.totalPages) break;
    page++;
  }
  return items;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [courses, articles] = await Promise.all([
    fetchAll<CourseRecord>("/courses"),
    fetchAll<ArticleRecord>("/articles"),
  ]);

  const entries: MetadataRoute.Sitemap = [];

  for (const locale of routing.locales) {
    for (const path of STATIC_PATHS) {
      entries.push({ url: `${SITE_URL}/${locale}${path}`, changeFrequency: "weekly", priority: path === "" ? 1 : 0.7 });
    }
    for (const course of courses) {
      entries.push({
        url: `${SITE_URL}/${locale}/courses/${course.slug}`,
        lastModified: course.updatedAt,
        changeFrequency: "weekly",
        priority: 0.9,
      });
    }
    for (const article of articles) {
      entries.push({
        url: `${SITE_URL}/${locale}/articles/${article.slug}`,
        lastModified: article.updatedAt,
        changeFrequency: "monthly",
        priority: 0.6,
      });
    }
  }

  return entries;
}
