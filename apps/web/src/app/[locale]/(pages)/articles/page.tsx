import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import ArticlesPage from "@/components/features/articles/ArticlesPage";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Meta" });
  return {
    title: t("articles_title"),
    description: t("articles_description"),
    alternates: { canonical: `/${locale}/articles` },
  };
}

export default function Page() {
  return <ArticlesPage />;
}
