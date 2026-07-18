"use client";

import { useState } from "react";
import { toast } from "sonner";
import { RiSaveLine, RiBankCardLine } from "react-icons/ri";
import PageHeader from "@/components/ui/PageHeader";
import { usePaymentDestination, useUpdatePaymentDestination } from "@/hooks/queries/use-settings";
import type { PaymentDestinationAccount } from "@roohbakhsh/shared";

export default function SettingsPage() {
  const { data, isLoading } = usePaymentDestination();

  return (
    <div className="flex flex-col gap-4">
      <PageHeader title="تنظیمات" description="تنظیمات عمومی پنل" />

      <div className="bg-white rounded-[20px] border border-gray-100 p-5 pt-4">
        <div className="flex items-center gap-2 mb-6 text-[var(--ink)] font-bold text-base border-b border-gray-100 pb-4">
          <RiBankCardLine size={20} className="text-[var(--brand)]" />
          اطلاعات حساب کارت‌به‌کارت
        </div>

        {isLoading || !data ? (
          <div className="flex flex-col gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-11 rounded-lg bg-gray-100 animate-pulse" />
            ))}
          </div>
        ) : (
          <PaymentDestinationForm initial={data} />
        )}
      </div>
    </div>
  );
}

function PaymentDestinationForm({ initial }: { initial: PaymentDestinationAccount }) {
  const { mutate, isPending } = useUpdatePaymentDestination();

  const [cardNumber, setCardNumber] = useState(initial.cardNumber ?? "");
  const [accountHolder, setAccountHolder] = useState(initial.accountHolder ?? "");
  const [bankName, setBankName] = useState(initial.bankName ?? "");
  const [accountNumber, setAccountNumber] = useState(initial.accountNumber ?? "");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    mutate(
      { cardNumber, accountHolder, bankName, accountNumber },
      {
        onSuccess: () => toast.success("تنظیمات با موفقیت ذخیره شد"),
        onError: () => toast.error("خطا در ذخیره تنظیمات"),
      }
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="grid grid-cols-2 gap-5">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm text-gray-500">شماره کارت</label>
          <input
            type="text"
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
            placeholder="6037-XXXX-XXXX-XXXX"
            dir="ltr"
            className="h-11 rounded-lg border border-gray-200 px-3 text-sm focus:outline-none focus:border-[var(--brand)] transition-colors"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm text-gray-500">نام صاحب حساب</label>
          <input
            type="text"
            value={accountHolder}
            onChange={(e) => setAccountHolder(e.target.value)}
            placeholder="آکادمی بین‌المللی اسلامی روح‌بخش"
            className="h-11 rounded-lg border border-gray-200 px-3 text-sm focus:outline-none focus:border-[var(--brand)] transition-colors"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm text-gray-500">نام بانک</label>
          <input
            type="text"
            value={bankName}
            onChange={(e) => setBankName(e.target.value)}
            placeholder="بانک ملی"
            className="h-11 rounded-lg border border-gray-200 px-3 text-sm focus:outline-none focus:border-[var(--brand)] transition-colors"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm text-gray-500">شماره حساب (اختیاری)</label>
          <input
            type="text"
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
            placeholder="1234567890"
            dir="ltr"
            className="h-11 rounded-lg border border-gray-200 px-3 text-sm focus:outline-none focus:border-[var(--brand)] transition-colors"
          />
        </div>
      </div>

      <div className="flex justify-start pt-2">
        <button
          type="submit"
          disabled={isPending}
          className="flex items-center justify-center gap-2 h-11 px-6 rounded-lg bg-[var(--brand)] text-white text-sm font-bold hover:opacity-90 disabled:opacity-60 transition-opacity"
        >
          <RiSaveLine size={16} />
          {isPending ? "در حال ذخیره..." : "ذخیره تغییرات"}
        </button>
      </div>
    </form>
  );
}
