import type { Metadata } from "next";
import type { CourseRecord } from "@roohbakhsh/shared";
import CourseDetailPage from "@/components/features/courses/CourseDetailPage";
import { serverGet } from "@/lib/api-server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: "ar" | "ur"; id: string }>;
}): Promise<Metadata> {
  const { locale, id } = await params;
  const course = await serverGet<CourseRecord>(`/courses/${id}`);
  if (!course) return {};

  const title = course.title[locale] ?? course.title.ar;
  const description = course.description[locale] ?? course.description.ar;
  const image = course.thumbnailUrl[locale] ?? course.thumbnailUrl.ar ?? undefined;

  return {
    title,
    description,
    alternates: { canonical: `/${locale}/courses/${id}` },
    openGraph: { title, description, type: "website", images: image ? [image] : undefined },
    twitter: { card: "summary_large_image", title, description, images: image ? [image] : undefined },
  };
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <CourseDetailPage courseId={id} />;
}
