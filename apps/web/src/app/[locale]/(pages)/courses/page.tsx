import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import CoursesPage from "@/components/features/courses/CoursesPage";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Meta" });
  return {
    title: t("courses_title"),
    description: t("courses_description"),
    alternates: { canonical: `/${locale}/courses` },
  };
}

export default function Page() {
  return <CoursesPage />;
}
