"use client";

import { useState, type FormEvent } from "react";
import type { Localized } from "@roohbakhsh/shared";
import { useSendNotification } from "@/hooks/queries/use-notifications";
import PageHeader from "@/components/ui/PageHeader";
import LocalizedInput from "@/components/ui/LocalizedInput";
import { RiSendPlaneLine } from "react-icons/ri";

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
        title="Ø§Ø±Ø³Ø§Ù„ Ø§Ø¹Ù„Ø§Ù†"
        description="Ø§Ø±Ø³Ø§Ù„ Ø§Ø¹Ù„Ø§Ù† Ø¨Ø±Ø§ÛŒ Ù‡Ù…Ù‡â€ŒÛŒ Ú©Ø§Ø±Ø¨Ø±Ø§Ù†"
      />

      <div className="max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          <LocalizedInput
            label="Ø¹Ù†ÙˆØ§Ù†"
            value={form.title}
            onChange={(v) => setForm((f) => ({ ...f, title: v }))}
            required
          />
          <LocalizedInput
            label="Ù…ØªÙ† Ø§Ø¹Ù„Ø§Ù†"
            value={form.body}
            onChange={(v) => setForm((f) => ({ ...f, body: v }))}
            multiline
            required
          />
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-600">Ù„ÛŒÙ†Ú© (Ø§Ø®ØªÛŒØ§Ø±ÛŒ)</label>
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
              Ø§Ø¹Ù„Ø§Ù† Ø¨Ø§ Ù…ÙˆÙÙ‚ÛŒØª Ø§Ø±Ø³Ø§Ù„ Ø´Ø¯.
            </p>
          )}

          {sendMut.isError && (
            <p className="text-sm text-red-600 bg-red-50 rounded-md px-3 py-2">
              Ø®Ø·Ø§ Ø¯Ø± Ø§Ø±Ø³Ø§Ù„ Ø§Ø¹Ù„Ø§Ù†. Ù„Ø·ÙØ§Ù‹ Ø¯ÙˆØ¨Ø§Ø±Ù‡ ØªÙ„Ø§Ø´ Ú©Ù†ÛŒØ¯.
            </p>
          )}

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={sendMut.isPending}
              className="flex items-center gap-1.5 px-5 py-2 text-sm rounded-md bg-[var(--brand)] text-white hover:opacity-90 disabled:opacity-50"
            >
              <RiSendPlaneLine />
              {sendMut.isPending ? "Ø¯Ø± Ø­Ø§Ù„ Ø§Ø±Ø³Ø§Ù„..." : "Ø§Ø±Ø³Ø§Ù„ Ø§Ø¹Ù„Ø§Ù†"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

