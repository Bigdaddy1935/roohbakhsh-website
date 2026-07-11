import type { Metadata } from "next";
import type { ArticleRecord } from "@roohbakhsh/shared";
import ArticleDetailPage from "@/components/features/articles/ArticleDetailPage";
import { serverGet } from "@/lib/api-server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: "ar" | "ur"; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const article = await serverGet<ArticleRecord>(`/articles/${slug}`);
  if (!article) return {};

  const title = article.title[locale] ?? article.title.ar;
  const description = article.summary[locale] ?? article.summary.ar;
  const image = article.thumbnailUrl[locale] ?? article.thumbnailUrl.ar ?? undefined;

  return {
    title,
    description,
    alternates: { canonical: `/${locale}/articles/${slug}` },
    openGraph: { title, description, type: "article", images: image ? [image] : undefined },
    twitter: { card: "summary_large_image", title, description, images: image ? [image] : undefined },
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <ArticleDetailPage articleSlug={slug} />;
}
