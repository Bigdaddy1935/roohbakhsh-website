"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useCreateArticle } from "@/hooks/queries/use-articles";
import ArticleForm, { type ArticleFormValues } from "@/components/articles/ArticleForm";

const emptyForm: ArticleFormValues = {
  title: { ar: "", ur: "" },
  slug: "",
  summary: { ar: "", ur: "" },
  bodyAr: "",
  bodyUr: "",
  thumbnailAr: "",
  thumbnailUr: "",
  metaTitle: { ar: "", ur: "" },
  metaDescription: { ar: "", ur: "" },
  metaKeywords: { ar: "", ur: "" },
  robots: "index",
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
      thumbnailUrl: (values.thumbnailAr || values.thumbnailUr)
        ? { ar: values.thumbnailAr || null, ur: values.thumbnailUr || null }
        : undefined,
      metaTitle: (values.metaTitle.ar || values.metaTitle.ur) ? values.metaTitle : undefined,
      metaDescription: (values.metaDescription.ar || values.metaDescription.ur) ? values.metaDescription : undefined,
      metaKeywords: (values.metaKeywords.ar || values.metaKeywords.ur) ? values.metaKeywords : undefined,
      robots: values.robots,
      instructorId: values.instructorId || "",
      status: values.status,
    });
    toast.success("مقاله با موفقیت ایجاد شد.");
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
