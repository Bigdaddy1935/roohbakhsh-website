import type { Metadata } from "next";
import type { ArticleRecord } from "@roohbakhsh/shared";
import ArticleDetailPage from "@/components/features/articles/ArticleDetailPage";
import { serverGet } from "@/lib/api-server";

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: "ar" | "ur"; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const article = await serverGet<ArticleRecord>(`/articles/${slug}`);
  if (!article) return {};

  const title = article.metaTitle?.[locale] ?? article.metaTitle?.ar ?? article.title[locale] ?? article.title.ar;
  const description = article.metaDescription?.[locale] ?? article.metaDescription?.ar ?? article.summary[locale] ?? article.summary.ar;
  const keywords = article.metaKeywords?.[locale] ?? article.metaKeywords?.ar ?? undefined;
  const image = article.thumbnailUrl[locale] ?? article.thumbnailUrl.ar ?? undefined;
  const author = article.instructor?.name?.[locale] ?? article.instructor?.name?.ar;
  const robots = article.robots ?? "index";

  const canonicalUrl = `${SITE_URL}/${locale}/articles/${slug}`;

  return {
    title,
    description,
    keywords,
    authors: author ? [{ name: author }] : undefined,
    robots: { index: robots === "index", follow: robots === "index" },
    alternates: {
      canonical: canonicalUrl,
      languages: {
        ar: `${SITE_URL}/ar/articles/${slug}`,
        ur: `${SITE_URL}/ur/articles/${slug}`,
        "x-default": `${SITE_URL}/ar/articles/${slug}`,
      },
    },
    openGraph: {
      title,
      description,
      type: "article",
      url: canonicalUrl,
      publishedTime: article.publishedAt ?? undefined,
      modifiedTime: article.updatedAt,
      authors: author ? [author] : undefined,
      images: image ? [{ url: image, alt: title }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: image ? [image] : undefined,
    },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: "ar" | "ur"; slug: string }>;
}) {
  const { locale, slug } = await params;
  const article = await serverGet<ArticleRecord>(`/articles/${slug}`);

  const jsonLd = article
    ? {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: article.metaTitle?.[locale] ?? article.title[locale] ?? article.title.ar,
        description: article.metaDescription?.[locale] ?? article.summary[locale] ?? article.summary.ar,
        image: article.thumbnailUrl[locale] ?? article.thumbnailUrl.ar ?? undefined,
        url: `${SITE_URL}/${locale}/articles/${slug}`,
        inLanguage: locale === "ar" ? "ar-SA" : "ur-PK",
        datePublished: article.publishedAt ?? article.createdAt,
        dateModified: article.updatedAt,
        keywords: article.metaKeywords?.[locale] ?? article.metaKeywords?.ar ?? undefined,
        author: article.instructor
          ? {
              "@type": "Person",
              name: article.instructor.name[locale] ?? article.instructor.name.ar,
              url: `${SITE_URL}/${locale}/instructors/${article.instructor.slug}`,
            }
          : undefined,
        publisher: {
          "@type": "Organization",
          name: "آکادمی بین‌المللی اسلامی روح‌بخش",
          url: SITE_URL,
        },
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": `${SITE_URL}/${locale}/articles/${slug}`,
        },
      }
    : null;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <ArticleDetailPage articleSlug={slug} />
    </>
  );
}
