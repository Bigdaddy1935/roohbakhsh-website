"use client";

import { useState, type FormEvent } from "react";
import type { Localized } from "@roohbakhsh/shared";
import { useSendNotification } from "@/hooks/queries/use-notifications";
import PageHeader from "@/components/ui/PageHeader";
import LocalizedInput from "@/components/ui/LocalizedInput";
import { RiSendPlanLine } from "react-icons/ri";

const emptyForm = {
  title: { ar: "", ur: "" } as Localized,
  body: { ar: "", ur: "" } as Localized,
  link: "",
};

export default function NotificationsPage() {
  const [form, setForm] = useState(emptyForm);
  const [sent, setSent] = useState(false);
  const sendMut = useSendNotification();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    await sendMut.mutateAsync({
      title: form.title,
      body: form.body,
      link: form.link || null,
    });
    setForm(emptyForm);
    setSent(true);
    setTimeout(() => setSent(false), 3000);
  }

  return (
    <div>
      <PageHeader
        title="ارسال اعلان"
        description="ارسال اعلان برای همه‌ی کاربران"
      />

      <div className="max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          <LocalizedInput
            label="عنوان"
            value={form.title}
            onChange={(v) => setForm((f) => ({ ...f, title: v }))}
            required
          />
          <LocalizedInput
            label="متن اعلان"
            value={form.body}
            onChange={(v) => setForm((f) => ({ ...f, body: v }))}
            multiline
            required
          />
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-600">لینک (اختیاری)</label>
            <input
              type="text"
              value={form.link}
              onChange={(e) => setForm((f) => ({ ...f, link: e.target.value }))}
              placeholder="https://..."
              className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[var(--brand)]"
              dir="ltr"
            />
          </div>

          {sent && (
            <p className="text-sm text-green-600 bg-green-50 rounded-md px-3 py-2">
              اعلان با موفقیت ارسال شد.
            </p>
          )}

          {sendMut.isError && (
            <p className="text-sm text-red-600 bg-red-50 rounded-md px-3 py-2">
              خطا در ارسال اعلان. لطفاً دوباره تلاش کنید.
            </p>
          )}

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={sendMut.isPending}
              className="flex items-center gap-1.5 px-5 py-2 text-sm rounded-md bg-[var(--brand)] text-white hover:opacity-90 disabled:opacity-50"
            >
              <RiSendPlanLine />
              {sendMut.isPending ? "در حال ارسال..." : "ارسال اعلان"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
