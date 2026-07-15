"use client";

import { useRouter, useParams } from "next/navigation";
import { useCategories, useUpdateCategory } from "@/hooks/queries/use-categories";
import CategoryForm, { type CategoryFormValues } from "@/components/categories/CategoryForm";

export default function EditCategoryPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params.id;
  const { data: categories, isLoading } = useCategories();
  const category = categories?.find((c) => c.id === id);
  const updateMut = useUpdateCategory(id);

  async function handleSubmit(values: CategoryFormValues) {
    await updateMut.mutateAsync({ name: values.name, slug: values.slug, parentId: values.parentId || undefined, order: values.order });
    router.push("/dashboard/categories");
  }

  if (isLoading || !category) return <div className="text-sm text-gray-400">در حال بارگذاری...</div>;

  const initialValues: CategoryFormValues = {
    name: { ar: category.name.ar, ur: category.name.ur },
    slug: category.slug,
    parentId: category.parentId ?? "",
    order: category.order ?? 0,
  };

  return <CategoryForm title="ویرایش دسته‌بندی" initialValues={initialValues} onSubmit={handleSubmit} isPending={updateMut.isPending} editingId={id} />;
}
