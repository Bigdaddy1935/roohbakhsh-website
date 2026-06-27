import ArticleDetailPage from "@/components/features/articles/ArticleDetailPage";

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <ArticleDetailPage articleSlug={slug} />;
}
