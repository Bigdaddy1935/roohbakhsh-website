"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  RiArrowLeftSLine, RiLoader4Line, RiBankCardLine, RiFileCopyLine, RiCheckLine,
  RiImageAddLine, RiCheckboxCircleFill, RiErrorWarningLine,
} from "react-icons/ri";
import { useMyOrder } from "@/hooks/queries/use-orders";
import { useDestinationAccount, useUploadReceipt, useSubmitCardToCard } from "@/hooks/queries/use-payments";
import { formatMoney } from "@/lib/format";
import type { ApiError } from "@roohbakhsh/shared";
import { OrderPaymentPageSkeleton } from "@/components/dashboard/DashboardSkeleton";

type SubmitMode = "receipt" | "text";

function getErrorMessage(err: unknown): string | undefined {
  const apiErr = err as ApiError;
  return apiErr?.message;
}

export default function OrderPaymentPage({ orderId }: { orderId: string }) {
  const t = useTranslations("Payment");
  const locale = useLocale() as "ar" | "ur";

  const { data: order, isLoading: orderLoading, error: orderError } = useMyOrder(orderId);
  const { data: destination, isLoading: destLoading } = useDestinationAccount();
  const { mutate: uploadReceipt, isPending: uploading } = useUploadReceipt();
  const { mutate: submitPayment, isPending: submitting, isSuccess, error: submitError } = useSubmitCardToCard(orderId);

  const [mode, setMode] = useState<SubmitMode>("receipt");
  const [trackingCode, setTrackingCode] = useState("");
  const [sourceCardNumber, setSourceCardNumber] = useState("");
  const [transferredAt, setTransferredAt] = useState("");
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [receiptUrl, setReceiptUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  function handleCopy() {
    if (!destination?.cardNumber) return;
    navigator.clipboard.writeText(destination.cardNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  function handleFileSelect(file: File | null) {
    setReceiptFile(file);
    setReceiptUrl(null);
    if (!file) return;
    uploadReceipt(file, { onSuccess: (res) => setReceiptUrl(res.url) });
  }

  function handleSubmit() {
    if (!trackingCode.trim()) return setFormError(t("error_tracking_code_required"));
    if (!sourceCardNumber.trim()) return setFormError(t("error_source_card_required"));
    if (!transferredAt) return setFormError(t("error_transferred_at_required"));
    if (mode === "receipt" && !receiptUrl) return setFormError(t("error_receipt_required"));

    setFormError(null);
    submitPayment({
      trackingCode: trackingCode.trim(),
      cardNumber: sourceCardNumber.trim(),
      transferredAt: new Date(transferredAt).toISOString(),
      ...(mode === "receipt" && receiptUrl ? { receiptImageUrl: receiptUrl } : {}),
    });
  }

  if (orderLoading || destLoading || (!order && !orderError)) {
    return <OrderPaymentPageSkeleton />;
  }

  if (orderError || !order) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-y-3 text-center">
        <RiErrorWarningLine size={36} className="text-rose-500" />
        <p className="text-[var(--ink)] font-bold">{t("order_not_found")}</p>
      </div>
    );
  }

  return (
    <div className="bg-[var(--bg)] min-h-[70vh]">
      <div className="container py-8 max-w-5xl">

        <div className="flex items-center gap-x-2 text-sm text-gray-400 mb-6">
          <Link href="/" className="hover:text-[var(--brand)] transition-colors">{t("breadcrumb_home")}</Link>
          <RiArrowLeftSLine size={16} className="rotate-180 shrink-0" />
          <Link href="/cart" className="hover:text-[var(--brand)] transition-colors">{t("breadcrumb_cart")}</Link>
          <RiArrowLeftSLine size={16} className="rotate-180 shrink-0" />
          <span className="text-[var(--ink)] font-semibold">{t("breadcrumb_payment")}</span>
        </div>

        <h1 className="text-lg font-extrabold text-[var(--ink)] mb-6">{t("title")}</h1>

        {order.status === "paid" ? (
          <div className="bg-white rounded-md p-6 flex flex-col items-center gap-y-3 text-center">
            <RiCheckboxCircleFill size={40} className="text-[var(--brand)]" />
            <p className="font-bold text-[var(--ink)]">{t("order_already_paid")}</p>
            <Link href="/" className="text-[var(--brand)] text-sm font-semibold hover:underline">{t("back_to_orders")}</Link>
          </div>
        ) : isSuccess ? (
          <div className="bg-white rounded-md p-6 flex flex-col items-center gap-y-3 text-center">
            <RiCheckboxCircleFill size={40} className="text-[var(--brand)]" />
            <p className="font-bold text-[var(--ink)]">{t("submit_success_title")}</p>
            <p className="text-sm text-gray-400">{t("submit_success_body")}</p>
            <Link href="/" className="mt-2 text-[var(--brand)] text-sm font-semibold hover:underline">{t("back_to_orders")}</Link>
          </div>
        ) : (
          <div className="flex flex-col gap-y-5">

            {/* Order summary */}
            <div className="bg-white rounded-md p-5 flex justify-between items-center">
              <span className="text-sm text-gray-500">{t("order_summary")}</span>
              <span className="font-extrabold text-[var(--brand)] text-base">
                {t("amount_due")}: {formatMoney(order.total, locale)}
              </span>
            </div>

            {/* Two boxes side by side on desktop */}
            <div className="flex flex-col lg:flex-row gap-5 items-start">

              {/* Destination account — right on desktop (start in RTL = flex-row-reverse end) */}
              <div className="bg-white rounded-md p-5 flex flex-col gap-y-3 w-full lg:w-72 lg:shrink-0">
                <div className="flex items-center gap-x-2 font-extrabold text-[var(--ink)] text-[14px]">
                  <RiBankCardLine size={18} className="text-[var(--brand)]" />
                  {t("destination_title")}
                </div>
                {destination && (
                  <div className="flex flex-col gap-y-4 text-[13px]">
                    <div className="flex flex-col gap-y-1">
                      <span className="text-gray-400">{t("destination_card_number")}</span>
                      <div className="flex items-center gap-x-2">
                        <span className="font-bold text-[var(--ink)] tracking-wide" dir="ltr">{destination.cardNumber}</span>
                        <button onClick={handleCopy} type="button" className="text-gray-400 hover:text-[var(--brand)] transition-colors" aria-label={t("copy")}>
                          {copied ? <RiCheckLine size={15} className="text-[var(--brand)]" /> : <RiFileCopyLine size={15} />}
                        </button>
                      </div>
                    </div>
                    <div className="flex flex-col gap-y-1">
                      <span className="text-gray-400">{t("destination_account_holder")}</span>
                      <span className="font-bold text-[var(--ink)]">{destination.accountHolder}</span>
                    </div>
                    <div className="flex flex-col gap-y-1">
                      <span className="text-gray-400">{t("destination_bank_name")}</span>
                      <span className="font-bold text-[var(--ink)]">{destination.bankName}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Submission form — left on desktop */}
              <div className="bg-white rounded-md p-5 flex flex-col gap-y-4 w-full lg:flex-1">
                <p className="text-[13px] font-bold text-[var(--ink)]">{t("mode_title")}</p>

                <div className="flex gap-x-2">
                  {(["receipt", "text"] as SubmitMode[]).map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setMode(m)}
                      className={`flex-1 h-11 rounded-md text-[13px] font-bold border transition-colors ${
                        mode === m
                          ? "bg-[var(--brand)] text-white border-[var(--brand)]"
                          : "bg-white text-gray-500 border-gray-200 hover:border-[var(--brand)]"
                      }`}
                    >
                      {m === "receipt" ? t("mode_receipt") : t("mode_text")}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex flex-col gap-y-1.5">
                    <label className="text-[12px] text-gray-500">{t("tracking_code")}</label>
                    <input
                      type="text"
                      value={trackingCode}
                      onChange={(e) => setTrackingCode(e.target.value)}
                      placeholder={t("tracking_code_placeholder")}
                      className="h-12 rounded-md border border-gray-200 px-3 text-sm text-[var(--ink)] placeholder-gray-400 focus:outline-none focus:border-[var(--brand)] transition-colors"
                    />
                  </div>
                  <div className="flex flex-col gap-y-1.5">
                    <label className="text-[12px] text-gray-500">{t("source_card_number")}</label>
                    <input
                      type="text"
                      value={sourceCardNumber}
                      onChange={(e) => setSourceCardNumber(e.target.value)}
                      placeholder={t("source_card_number_placeholder")}
                      dir="ltr"
                      className="h-12 rounded-md border border-gray-200 px-3 text-sm text-[var(--ink)] placeholder-gray-400 focus:outline-none focus:border-[var(--brand)] transition-colors"
                    />
                  </div>
                  <div className="flex flex-col gap-y-1.5">
                    <label className="text-[12px] text-gray-500">{t("transferred_at")}</label>
                    <input
                      type="datetime-local"
                      value={transferredAt}
                      onChange={(e) => setTransferredAt(e.target.value)}
                      className="h-12 rounded-md border border-gray-200 px-3 text-sm text-[var(--ink)] focus:outline-none focus:border-[var(--brand)] transition-colors"
                    />
                  </div>
                  {mode === "receipt" && (
                    <div className="flex flex-col gap-y-1.5">
                      <label className="text-[12px] text-gray-500">{t("receipt_upload_label")}</label>
                      <label className="h-12 rounded-md border border-dashed border-gray-300 px-3 flex items-center gap-x-2 text-sm text-gray-400 cursor-pointer hover:border-[var(--brand)] transition-colors">
                        <RiImageAddLine size={16} />
                        <span className="truncate">
                          {uploading ? t("uploading") : receiptFile ? receiptFile.name : t("receipt_upload_hint")}
                        </span>
                        <input
                          type="file"
                          accept="image/png,image/jpeg"
                          className="hidden"
                          onChange={(e) => handleFileSelect(e.target.files?.[0] ?? null)}
                        />
                      </label>
                    </div>
                  )}
                </div>

                {(formError || submitError) && (
                  <p className="text-xs text-red-500">{formError ?? getErrorMessage(submitError)}</p>
                )}

                <button
                  onClick={handleSubmit}
                  disabled={submitting || uploading}
                  className="self-end h-11 px-8 rounded-md bg-[var(--cta)] text-white font-extrabold text-[14px] hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-60 flex items-center justify-center gap-x-2"
                >
                  {submitting && <RiLoader4Line size={18} className="animate-spin" />}
                  {submitting ? t("submitting") : t("submit_btn")}
                </button>
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
}
