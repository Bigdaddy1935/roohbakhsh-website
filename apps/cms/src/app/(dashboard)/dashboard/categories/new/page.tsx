"use client";

import { useRouter } from "next/navigation";
import { useCreateCategory } from "@/hooks/queries/use-categories";
import CategoryForm, { type CategoryFormValues } from "@/components/categories/CategoryForm";

const emptyForm: CategoryFormValues = {
  name: { ar: "", ur: "" },
  slug: "",
  parentId: "",
  order: 0,
};

export default function NewCategoryPage() {
  const router = useRouter();
  const createMut = useCreateCategory();

  async function handleSubmit(values: CategoryFormValues) {
    await createMut.mutateAsync({ name: values.name, slug: values.slug, parentId: values.parentId || undefined, order: values.order });
    router.push("/dashboard/categories");
  }

  return <CategoryForm title="دسته‌بندی جدید" initialValues={emptyForm} onSubmit={handleSubmit} isPending={createMut.isPending} />;
}
