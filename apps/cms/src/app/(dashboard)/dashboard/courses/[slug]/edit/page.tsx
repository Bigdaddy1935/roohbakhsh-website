"use client";

import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import { useCourse, useUpdateCourse } from "@/hooks/queries/use-courses";
import CourseForm, { type CourseFormValues } from "@/components/courses/CourseForm";

export default function EditCoursePage() {
  const router = useRouter();
  const { slug } = useParams<{ slug: string }>();
  const { data: course, isLoading } = useCourse(slug);
  const updateMut = useUpdateCourse(course?.id ?? "");

  async function handleSubmit(values: CourseFormValues) {
    await updateMut.mutateAsync({
      title: values.title,
      slug: values.slug,
      description: values.description,
      level: values.level,
      thumbnailUrl: { ar: values.thumbnailAr || null, ur: values.thumbnailUr || null },
      introVideoUrl: { ar: values.introVideoAr || null, ur: values.introVideoUr || null },
      runStatus: values.runStatus,
      accessType: values.accessType,
      instructorId: values.instructorId,
      categoryId: values.categoryId || undefined,
      price: values.priceAmountMinor ? { amountMinor: Number(values.priceAmountMinor), currency: values.priceCurrency } : undefined,
      discountPrice: values.discountPriceAmountMinor ? { amountMinor: Number(values.discountPriceAmountMinor), currency: values.priceCurrency } : null,
      discountExpiresAt: values.discountExpiresAt ? new Date(values.discountExpiresAt).toISOString() : null,
      isPublished: values.isPublished,
    });
    toast.success("دوره با موفقیت ذخیره شد.");
    router.push("/dashboard/courses");
  }

  if (isLoading || !course) {
    return <div className="text-sm text-gray-400 p-6">در حال بارگذاری...</div>;
  }

  const initialValues: CourseFormValues = {
    title: { ar: course.title.ar, ur: course.title.ur },
    slug: course.slug,
    description: { ar: course.description.ar, ur: course.description.ur },
    thumbnailAr: course.thumbnailUrl?.ar ?? "",
    thumbnailUr: course.thumbnailUrl?.ur ?? "",
    introVideoAr: course.introVideoUrl?.ar ?? "",
    introVideoUr: course.introVideoUrl?.ur ?? "",
    level: course.level,
    runStatus: course.runStatus,
    accessType: course.accessType,
    instructorId: course.instructorId ?? "",
    categoryId: course.categoryId ?? "",
    priceAmountMinor: course.price?.amountMinor != null ? String(course.price.amountMinor) : "",
    priceCurrency: (course.price?.currency ?? "USD") as CourseFormValues["priceCurrency"],
    discountPriceAmountMinor: course.discount?.price.amountMinor != null ? String(course.discount.price.amountMinor) : "",
    discountExpiresAt: course.discount?.expiresAt ? course.discount.expiresAt.slice(0, 10) : "",
    isPublished: course.isPublished,
  };

  return (
    <CourseForm
      title="ویرایش دوره"
      initialValues={initialValues}
      onSubmit={handleSubmit}
      isPending={updateMut.isPending}
    />
  );
}
