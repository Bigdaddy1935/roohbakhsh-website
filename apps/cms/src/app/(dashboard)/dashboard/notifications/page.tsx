"use client";

import { useState, type FormEvent } from "react";
import type { Localized, NotificationItem } from "@roohbakhsh/shared";
import { useSendNotification, useNotificationsHistory } from "@/hooks/queries/use-notifications";
import PageHeader from "@/components/ui/PageHeader";
import DataTable from "@/components/ui/DataTable";
import LocalizedInput from "@/components/ui/LocalizedInput";
import FormField from "@/components/ui/FormField";
import { RiSendPlaneLine, RiCheckLine } from "react-icons/ri";

const emptyForm = {
  title: { ar: "", ur: "" } as Localized,
  body: { ar: "", ur: "" } as Localized,
  link: "",
};

export default function NotificationsPage() {
  const [form, setForm] = useState(emptyForm);
  const [sent, setSent] = useState(false);
  const sendMut = useSendNotification();

  const [page, setPage] = useState(1);
  const { data: history, isLoading: historyLoading } = useNotificationsHistory({ page, limit: 10 });

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    await sendMut.mutateAsync({ title: form.title, body: form.body, link: form.link || null });
    setForm(emptyForm);
    setSent(true);
    setTimeout(() => setSent(false), 3000);
  }

  return (
    <div>
      <PageHeader title="ارسال اعلان" description="ارسال اعلان برای همه‌ی کاربران" />

      <div className="w-full bg-white border border-gray-100 rounded-[20px] p-6">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <LocalizedInput label="عنوان" value={form.title} onChange={(v) => setForm((f) => ({ ...f, title: v }))} required layout="grid" />
          <LocalizedInput label="متن اعلان" value={form.body} onChange={(v) => setForm((f) => ({ ...f, body: v }))} multiline required layout="grid" />
          <FormField label="لینک (اختیاری)" value={form.link} onChange={(e) => setForm((f) => ({ ...f, link: e.target.value }))} dir="ltr" type="url" />

          {sent && (
            <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 rounded-md px-3 py-2.5">
              <RiCheckLine size={16} />
              اعلان با موفقیت ارسال شد.
            </div>
          )}
          {sendMut.isError && (
            <p className="text-sm text-red-600 bg-red-50 rounded-md px-3 py-2.5">
              خطا در ارسال اعلان. لطفاً دوباره تلاش کنید.
            </p>
          )}

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={sendMut.isPending}
              className="flex items-center gap-2 px-5 py-2.5 text-sm rounded-md bg-[var(--brand)] text-white hover:opacity-90 disabled:opacity-50 transition-opacity"
            >
              <RiSendPlaneLine size={16} />
              {sendMut.isPending ? "در حال ارسال..." : "ارسال اعلان"}
            </button>
          </div>
        </form>
      </div>

      <div className="mt-6">
        <h2 className="text-base font-bold text-[var(--ink)] mb-4">تاریخچه اعلان‌های ارسالی</h2>
        <DataTable
          columns={[
            { key: "title", label: "عنوان", render: (r: NotificationItem) => r.title.ar },
            { key: "body", label: "متن", render: (r: NotificationItem) => <span className="line-clamp-2 max-w-md block">{r.body.ar}</span> },
            { key: "link", label: "لینک", render: (r: NotificationItem) => r.link ?? "-" },
            { key: "createdAt", label: "تاریخ", render: (r: NotificationItem) => r.createdAt.slice(0, 10) },
          ]}
          data={history?.items ?? []}
          isLoading={historyLoading}
          page={page}
          totalPages={history?.totalPages ?? 1}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
}
