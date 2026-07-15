"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import type { User, UserRole } from "@roohbakhsh/shared";
import FormField from "@/components/ui/FormField";
import SelectField from "@/components/ui/SelectField";
import { RiArrowRightLine, RiSaveLine } from "react-icons/ri";

export default function NewUserPage() {
  const router = useRouter();
  const qc = useQueryClient();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "user" as UserRole,
    preferredLocale: "ar" as "ar" | "ur",
  });
  const [error, setError] = useState("");

  const createMut = useMutation<unknown, Error, typeof form>({
    mutationFn: async (data) => {
      const res = await api.post<{ user: User }>("/auth/register", {
        fullName: data.fullName,
        email: data.email,
        password: data.password,
        preferredLocale: data.preferredLocale,
      });
      if (data.role !== "user") {
        await api.patch(`/users/${(res as { user: User }).user.id}/role`, { role: data.role });
      }
      return res;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["users"] });
      router.push("/dashboard/users");
    },
    onError: (e) => setError(e.message ?? "خطا در ساخت کاربر"),
  });

  const set = <K extends keyof typeof form>(key: K, val: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [key]: val }));

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    createMut.mutate(form);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* هدر */}
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
            <h1 className="text-lg font-bold text-gray-800">کاربر جدید</h1>
            <p className="text-sm text-gray-400">اطلاعات کاربر را وارد کنید</p>
          </div>
        </div>
        <button
          type="submit"
          disabled={createMut.isPending || !form.fullName || !form.email || form.password.length < 8}
          className="flex items-center gap-x-2 px-5 py-2.5 bg-[var(--brand)] text-white text-sm font-bold rounded-[20px] hover:bg-[var(--brand)]/90 disabled:opacity-60 transition-colors"
        >
          <RiSaveLine size={16} />
          {createMut.isPending ? "در حال ذخیره..." : "ذخیره"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ستون اصلی */}
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white rounded-[20px] p-6 space-y-5">
            <h2 className="text-sm font-bold text-gray-600 border-b border-gray-100 pb-3">اطلاعات پایه</h2>
            <FormField
              label="نام کامل"
              type="text"
              value={form.fullName}
              onChange={(e) => set("fullName", e.target.value)}
              placeholder="مثلاً: محمد احمدی"
              required
            />
            <FormField
              label="ایمیل"
              type="email"
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
              placeholder="user@example.com"
              required
              dir="ltr"
            />
            <FormField
              label="رمز عبور (موقت)"
              type="password"
              value={form.password}
              onChange={(e) => set("password", e.target.value)}
              placeholder="حداقل ۸ کاراکتر"
              required
            />
            {error && <p className="text-xs text-red-500 pt-1">{error}</p>}
          </div>
        </div>

        {/* ستون کنار */}
        <div className="space-y-5">
          <div className="bg-white rounded-[20px] p-6 space-y-5">
            <h2 className="text-sm font-bold text-gray-600 border-b border-gray-100 pb-3">تنظیمات</h2>
            <SelectField
              label="نقش"
              value={form.role}
              onChange={(v) => set("role", v as UserRole)}
              options={[
                { value: "user", label: "کاربر" },
                { value: "instructor", label: "استاد" },
                { value: "author", label: "نویسنده" },
                { value: "admin", label: "ادمین" },
              ]}
            />
            <SelectField
              label="زبان ترجیحی"
              value={form.preferredLocale}
              onChange={(v) => set("preferredLocale", v as "ar" | "ur")}
              options={[
                { value: "ar", label: "عربی" },
                { value: "ur", label: "اردو" },
              ]}
            />
          </div>
        </div>
      </div>
    </form>
  );
}
