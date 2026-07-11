"use client";

import { useState, type FormEvent } from "react";
import type { Localized, NotificationItem } from "@roohbakhsh/shared";
import { useSendNotification, useNotificationsHistory } from "@/hooks/queries/use-notifications";
import PageHeader from "@/components/ui/PageHeader";
import DataTable from "@/components/ui/DataTable";
import FormModal from "@/components/ui/FormModal";
import LocalizedInput from "@/components/ui/LocalizedInput";
import FormField from "@/components/ui/FormField";
import { toast } from "sonner";

const emptyForm = {
  title: { ar: "", ur: "" } as Localized,
  body: { ar: "", ur: "" } as Localized,
  link: "",
};

export default function NotificationsPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const sendMut = useSendNotification();

  const [page, setPage] = useState(1);
  const { data: history, isLoading: historyLoading } = useNotificationsHistory({ page, limit: 10 });

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    try {
      await sendMut.mutateAsync({ title: form.title, body: form.body, link: form.link || null });
      toast.success("اعلان با موفقیت ارسال شد.");
      setForm(emptyForm);
      setModalOpen(false);
    } catch {
      toast.error("خطا در ارسال اعلان. لطفاً دوباره تلاش کنید.");
    }
  }

  return (
    <div>
      <PageHeader
        title="اعلان‌ها"
        description="ارسال اعلان برای همه‌ی کاربران"
        onAdd={() => { setForm(emptyForm); setModalOpen(true); }}
        addLabel="اعلان جدید"
      />

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

      <FormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="اعلان جدید"
        onSubmit={handleSubmit}
        isPending={sendMut.isPending}
        submitLabel="ارسال اعلان"
      >
        <LocalizedInput label="عنوان" value={form.title} onChange={(v) => setForm((f) => ({ ...f, title: v }))} required />
        <LocalizedInput label="متن اعلان" value={form.body} onChange={(v) => setForm((f) => ({ ...f, body: v }))} multiline required />
        <FormField label="لینک (اختیاری)" value={form.link} onChange={(e) => setForm((f) => ({ ...f, link: e.target.value }))} dir="ltr" type="url" />
      </FormModal>
    </div>
  );
}
