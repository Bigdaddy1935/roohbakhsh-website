"use client";

import { useRouter, useParams } from "next/navigation";
import { useArticleAdminById, useUpdateArticle } from "@/hooks/queries/use-articles";
import ArticleForm, { type ArticleFormValues } from "@/components/articles/ArticleForm";

export default function EditArticlePage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params.id;
  const { data: article, isLoading } = useArticleAdminById(id);
  const updateMut = useUpdateArticle(id);

  async function handleSubmit(values: ArticleFormValues) {
    await updateMut.mutateAsync({
      title: values.title,
      slug: values.slug,
      summary: values.summary,
      body: { ar: values.bodyAr, ur: values.bodyUr },
      instructorId: values.instructorId || "",
      status: values.status,
    });
    router.push("/dashboard/articles");
  }

  if (isLoading || !article) {
    return <div className="text-sm text-gray-400">در حال بارگذاری...</div>;
  }

  const initialValues: ArticleFormValues = {
    title: { ar: article.title.ar, ur: article.title.ur },
    slug: article.slug,
    summary: { ar: article.summary?.ar ?? "", ur: article.summary?.ur ?? "" },
    bodyAr: article.body?.ar ?? "",
    bodyUr: article.body?.ur ?? "",
    instructorId: article.instructorId ?? "",
    status: article.status as "draft" | "published",
  };

  return (
    <ArticleForm
      title="ویرایش مقاله"
      initialValues={initialValues}
      onSubmit={handleSubmit}
      isPending={updateMut.isPending}
    />
  );
}
