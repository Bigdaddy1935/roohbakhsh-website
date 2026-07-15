import type { Metadata } from "next";
import type { InstructorRecord } from "@roohbakhsh/shared";
import TeacherPage from "@/components/features/teacher/TeacherPage";
import { serverGet } from "@/lib/api-server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: "ar" | "ur"; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const instructors = await serverGet<InstructorRecord[]>("/instructors");
  const instructor = instructors?.find((i) => i.slug === slug);
  if (!instructor) return {};

  const title = instructor.name[locale] ?? instructor.name.ar;
  const description = instructor.bio?.[locale] ?? instructor.bio?.ar ?? undefined;

  return {
    title,
    description,
    alternates: { canonical: `/${locale}/teacher/${slug}` },
    openGraph: { title, description, type: "profile", images: instructor.avatarUrl ? [instructor.avatarUrl] : undefined },
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <TeacherPage slug={slug} />;
}
