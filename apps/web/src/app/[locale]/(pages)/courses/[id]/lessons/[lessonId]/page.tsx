import LessonPage from "@/components/features/courses/LessonPage";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string; lessonId: string }>;
}) {
  const { id, lessonId } = await params;
  return <LessonPage courseId={id} lessonId={lessonId} />;
}
