"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import type { Localized } from "@roohbakhsh/shared";
import { useSendNotification } from "@/hooks/queries/use-notifications";
import LocalizedInput from "@/components/ui/LocalizedInput";
import FormField from "@/components/ui/FormField";
import { RiArrowRightLine, RiSendPlaneLine } from "react-icons/ri";
import { toast } from "sonner";

const emptyForm = { title: { ar: "", ur: "" } as Localized, body: { ar: "", ur: "" } as Localized, link: "" };

export default function NewNotificationPage() {
  const router = useRouter();
  const sendMut = useSendNotification();
  const [form, setForm] = useState(emptyForm);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    try {
      await sendMut.mutateAsync({ title: form.title, body: form.body, link: form.link || null });
      toast.success("اعلان با موفقیت ارسال شد.");
      router.push("/dashboard/notifications");
    } catch {
      toast.error("خطا در ارسال اعلان.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between mb-6 bg-white border border-gray-100 rounded-[20px] px-5 h-[105px]">
        <div className="flex items-center gap-x-3">
          <button type="button" onClick={() => router.push("/dashboard/notifications")} className="p-2 rounded-[20px] text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
            <RiArrowRightLine size={20} />
          </button>
          <div>
            <h1 className="text-lg font-bold text-gray-800">اعلان جدید</h1>
            <p className="text-sm text-gray-400">اعلان برای همه‌ی کاربران ارسال می‌شود</p>
          </div>
        </div>
        <button type="submit" disabled={sendMut.isPending} className="flex items-center gap-x-2 px-5 py-2.5 bg-[var(--brand)] text-white text-sm font-bold rounded-[20px] hover:bg-[var(--brand)]/90 disabled:opacity-60 transition-colors">
          <RiSendPlaneLine size={16} />
          {sendMut.isPending ? "در حال ارسال..." : "ارسال اعلان"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white rounded-[20px] p-6 space-y-5">
            <h2 className="text-sm font-bold text-gray-600 border-b border-gray-100 pb-3">محتوای اعلان</h2>
            <LocalizedInput label="عنوان" value={form.title} onChange={(v) => setForm((f) => ({ ...f, title: v }))} required />
            <LocalizedInput label="متن اعلان" value={form.body} onChange={(v) => setForm((f) => ({ ...f, body: v }))} multiline required />
          </div>
        </div>

        <div className="space-y-5">
          <div className="bg-white rounded-[20px] p-6 space-y-5">
            <h2 className="text-sm font-bold text-gray-600 border-b border-gray-100 pb-3">تنظیمات</h2>
            <div className="space-y-1.5">
              <FormField label="لینک (اختیاری)" value={form.link} onChange={(e) => setForm((f) => ({ ...f, link: e.target.value }))} dir="ltr" type="url" />
              <p className="text-xs text-gray-400">کاربر با کلیک روی اعلان به این آدرس هدایت می‌شود.</p>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
