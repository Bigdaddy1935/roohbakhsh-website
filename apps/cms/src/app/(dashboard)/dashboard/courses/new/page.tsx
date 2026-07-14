"use client";

import { useRouter } from "next/navigation";
import { useCreateCourse } from "@/hooks/queries/use-courses";
import CourseForm, { type CourseFormValues } from "@/components/courses/CourseForm";

const emptyForm: CourseFormValues = {
  title: { ar: "", ur: "" },
  slug: "",
  description: { ar: "", ur: "" },
  thumbnailAr: "",
  thumbnailUr: "",
  introVideoAr: "",
  introVideoUr: "",
  level: "beginner",
  runStatus: "ongoing",
  accessType: "online_only",
  instructorId: "",
  categoryId: "",
  priceAmountMinor: "",
  priceCurrency: "USD",
  discountPriceAmountMinor: "",
  discountExpiresAt: "",
  isPublished: false,
};

export default function NewCoursePage() {
  const router = useRouter();
  const createMut = useCreateCourse();

  async function handleSubmit(values: CourseFormValues) {
    await createMut.mutateAsync({
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
    });
    router.push("/dashboard/courses");
  }

  return (
    <CourseForm
      title="دوره جدید"
      initialValues={emptyForm}
      onSubmit={handleSubmit}
      isPending={createMut.isPending}
    />
  );
}
