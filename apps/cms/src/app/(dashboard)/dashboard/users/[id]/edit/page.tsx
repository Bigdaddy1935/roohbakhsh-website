"use client";

import { useState, type FormEvent, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import { useUser, useUpdateUser } from "@/hooks/queries/use-users";
import FormField from "@/components/ui/FormField";
import SelectField from "@/components/ui/SelectField";
import GalleryImageField from "@/components/ui/GalleryImageField";
import { RiArrowRightLine, RiSaveLine } from "react-icons/ri";

export default function EditUserPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const { data: user, isLoading } = useUser(id);
  const updateMut = useUpdateUser(id);

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    avatarUrl: "",
    preferredLocale: "ar" as "ar" | "ur",
  });

  useEffect(() => {
    if (user) {
      setForm({
        fullName: user.fullName ?? "",
        phone: user.phone ?? "",
        avatarUrl: user.avatarUrl ?? "",
        preferredLocale: user.preferredLocale ?? "ar",
      });
    }
  }, [user]);

  const set = <K extends keyof typeof form>(key: K, val: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [key]: val }));

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    await updateMut.mutateAsync({
      fullName: form.fullName || undefined,
      phone: form.phone || undefined,
      avatarUrl: form.avatarUrl || undefined,
      preferredLocale: form.preferredLocale,
    });
    toast.success("اطلاعات کاربر ذخیره شد.");
    router.push("/dashboard/users");
  }

  if (isLoading) return <div className="text-sm text-gray-400 p-6">در حال بارگذاری...</div>;
  if (!user) return <div className="text-sm text-red-500 p-6">کاربر یافت نشد.</div>;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between bg-white border border-gray-100 rounded-[20px] px-5 h-[105px]">
        <div className="flex items-center gap-x-3">
          <button
            type="button"
            onClick={() => router.push("/dashboard/users")}
            className="p-2 rounded-[20px] text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <RiArrowRightLine size={20} />
          </button>
          <div>
            <h1 className="text-lg font-bold text-gray-800">ویرایش کاربر</h1>
            <p className="text-sm text-gray-400">{user.email}</p>
          </div>
        </div>
        <button
          type="submit"
          disabled={updateMut.isPending}
          className="flex items-center gap-x-2 px-5 py-2.5 bg-[var(--brand)] text-white text-sm font-bold rounded-[20px] hover:bg-[var(--brand)]/90 disabled:opacity-60 transition-colors"
        >
          <RiSaveLine size={16} />
          {updateMut.isPending ? "در حال ذخیره..." : "ذخیره"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white rounded-[20px] p-6 space-y-5">
            <h2 className="text-sm font-bold text-gray-600 border-b border-gray-100 pb-3">اطلاعات پایه</h2>
            <FormField label="نام کامل" value={form.fullName} onChange={(e) => set("fullName", e.target.value)} placeholder="مثلاً: محمد احمدی" />
            <FormField label="شماره تلفن" value={form.phone} onChange={(e) => set("phone", e.target.value)} dir="ltr" placeholder="+966500000000" />
          </div>
        </div>

        <div className="space-y-5">
          <div className="bg-white rounded-[20px] p-6 space-y-5">
            <h2 className="text-sm font-bold text-gray-600 border-b border-gray-100 pb-3">تنظیمات</h2>
            <SelectField
              label="زبان ترجیحی"
              value={form.preferredLocale}
              onChange={(v) => set("preferredLocale", v as "ar" | "ur")}
              options={[
                { value: "ar", label: "عربی" },
                { value: "ur", label: "اردو" },
              ]}
            />
            <GalleryImageField
              label="تصویر پروفایل"
              value={form.avatarUrl}
              onChange={(url) => set("avatarUrl", url)}
              category="staff"
            />
          </div>
        </div>
      </div>
    </form>
  );
}
