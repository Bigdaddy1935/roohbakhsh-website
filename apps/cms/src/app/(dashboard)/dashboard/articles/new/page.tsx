"use client";

import { useRouter } from "next/navigation";
import { useCreateArticle } from "@/hooks/queries/use-articles";
import ArticleForm, { type ArticleFormValues } from "@/components/articles/ArticleForm";

const emptyForm: ArticleFormValues = {
  title: { ar: "", ur: "" },
  slug: "",
  summary: { ar: "", ur: "" },
  bodyAr: "",
  bodyUr: "",
  instructorId: "",
  status: "draft",
};

export default function NewArticlePage() {
  const router = useRouter();
  const createMut = useCreateArticle();

  async function handleSubmit(values: ArticleFormValues) {
    await createMut.mutateAsync({
      title: values.title,
      slug: values.slug,
      summary: values.summary,
      body: { ar: values.bodyAr, ur: values.bodyUr },
      instructorId: values.instructorId || "",
      status: values.status,
    });
    router.push("/dashboard/articles");
  }

  return (
    <ArticleForm
      title="مقاله جدید"
      initialValues={emptyForm}
      onSubmit={handleSubmit}
      isPending={createMut.isPending}
    />
  );
}
