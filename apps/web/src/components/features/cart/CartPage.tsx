"use client";

import { useState, Suspense } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import {
  RiArrowLeftSLine, RiDeleteBin6Line, RiTicket2Line, RiShoppingBag3Line,
  RiArrowDownSLine, RiArrowUpSLine, RiLoader4Line,
} from "react-icons/ri";
import { useCart, useRemoveFromCart } from "@/hooks/queries/use-cart";
import { useCreateOrder } from "@/hooks/queries/use-orders";
import { useInitiatePayment } from "@/hooks/queries/use-payments";
import { useValidateCoupon } from "@/hooks/queries/use-coupons";
import { formatMoney } from "@/lib/format";
import type { ApiError } from "@roohbakhsh/shared";

function CartContent() {
  const t = useTranslations("Cart");
  const locale = useLocale() as "ar" | "ur";
  const router = useRouter();

  const { data: cart, isLoading } = useCart();
  const { mutate: removeItem, isPending: removing } = useRemoveFromCart();
  const { mutate: createOrder, isPending: ordering } = useCreateOrder();
  const { mutate: initiatePayment, isPending: paying } = useInitiatePayment();
  const { mutate: validateCoupon, isPending: validatingCoupon, data: couponData, error: couponError } = useValidateCoupon();

  const [couponCode, setCouponCode] = useState("");
  const [couponOpen, setCouponOpen] = useState(false);

  const items = cart?.items ?? [];

  function handleCheckout() {
    createOrder({ couponCode: couponData?.couponId ? couponCode : undefined }, {
      onSuccess: (order) => {
        if (order.total.amountMinor === 0) {
          initiatePayment(order.id);
        } else {
          router.push(`/orders/${order.id}/payment`);
        }
      },
    });
  }

  function handleApplyCoupon() {
    if (!couponCode || !cart?.total) return;
    validateCoupon({ code: couponCode, orderTotal: cart.total });
  }

  const total = couponData ? couponData.finalTotal : cart?.total;
  const discount = couponData ? couponData.discountAmount : null;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <RiLoader4Line size={36} className="text-[var(--brand)] animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-[var(--bg)] min-h-screen">
      <div className="container py-8">

        <div className="flex items-center gap-x-2 text-sm text-gray-400 mb-6">
          <Link href="/" className="hover:text-[var(--brand)] transition-colors">{t("breadcrumb_home")}</Link>
          <RiArrowLeftSLine size={16} className="rotate-180 shrink-0" />
          <span className="text-[var(--ink)] font-semibold">{t("breadcrumb_cart")}</span>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 gap-y-4 text-center">
            <div className="size-20 rounded-xl bg-[var(--brand)]/10 flex items-center justify-center">
              <RiShoppingBag3Line size={36} className="text-[var(--brand)]" />
            </div>
            <p className="text-lg font-extrabold text-[var(--ink)]">{t("empty")}</p>
            <p className="text-sm text-gray-400">{t("empty_hint")}</p>
            <Link
              href="/courses"
              className="mt-2 h-11 px-8 rounded-xl bg-[var(--brand)] text-white text-sm font-bold hover:opacity-90 transition-opacity flex items-center gap-x-2"
            >
              <RiArrowLeftSLine size={16} className="rotate-180" />
              {t("browse_courses")}
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 items-start">

            <div className="flex flex-col gap-y-4">
              <h1 className="text-lg font-extrabold text-[var(--ink)]">{t("title")}</h1>

              {items.map((item) => {
                const thumb = item.thumbnailUrl?.[locale] ?? item.thumbnailUrl?.ar ?? "";
                return (
                  <div
                    key={item.courseId}
                    className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex gap-x-4 items-start"
                  >
                    <div className="relative h-24 w-36 shrink-0 rounded-xl overflow-hidden bg-gray-100">
                      {thumb && (
                        <Image src={thumb} alt={item.title[locale]} fill className="object-cover" sizes="144px" />
                      )}
                    </div>
                    <div className="flex flex-col flex-1 gap-y-1.5 min-w-0">
                      <h3 className="font-bold text-[var(--ink)] text-[14px] leading-6 line-clamp-2">
                        {item.title[locale]}
                      </h3>
                      <div className="flex items-center gap-x-3 mt-1">
                        <span className="text-[14px] font-extrabold text-[var(--brand)]">
                          {formatMoney(item.effectivePrice, locale)}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => removeItem(item.courseId)}
                      disabled={removing}
                      className="shrink-0 size-9 rounded-xl border border-gray-100 flex items-center justify-center text-gray-400 hover:text-rose-500 hover:border-rose-200 transition-colors disabled:opacity-50"
                      aria-label={t("remove")}
                    >
                      <RiDeleteBin6Line size={16} />
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="flex flex-col gap-y-4 sticky top-24 self-start">
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex flex-col gap-y-4">
                <div className="-mx-5 -mt-5 px-5 py-4 rounded-t-2xl bg-[var(--brand)] text-white font-extrabold text-[15px]">
                  {t("summary_title")}
                </div>

                <div className="flex flex-col gap-y-3 text-[13px]">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">{t("summary_total")}</span>
                    <span className="font-semibold text-[var(--ink)]">
                      {formatMoney(cart?.total, locale)}
                    </span>
                  </div>
                  {discount && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500">{t("summary_discount")}</span>
                      <span className="font-bold text-[var(--brand)]">
                        {formatMoney(discount, locale)}
                      </span>
                    </div>
                  )}
                  <div className="h-px bg-gray-100" />
                  <div className="flex justify-between items-center">
                    <span className="font-extrabold text-[var(--ink)] text-[14px]">{t("summary_payable")}</span>
                    <span className="font-extrabold text-[var(--brand)] text-[16px]">
                      {formatMoney(total, locale)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={ordering || paying}
                  className="w-full h-12 rounded-xl bg-[var(--brand)] text-white font-extrabold text-[14px] hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-60 flex items-center justify-center gap-x-2"
                >
                  {(ordering || paying) && <RiLoader4Line size={18} className="animate-spin" />}
                  {t("pay_btn")}
                </button>

                <p className="text-[11px] text-gray-400 text-center leading-5">
                  {t("terms_pre")}
                  <Link href="/terms" className="text-[var(--brand)] hover:underline">{t("terms_link1")}</Link>
                  {t("terms_and")}
                  <Link href="/terms" className="text-[var(--brand)] hover:underline">{t("terms_link2")}</Link>
                  {t("terms_post")}
                </p>
              </div>

              <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <button
                  onClick={() => setCouponOpen((o) => !o)}
                  className="w-full flex items-center justify-between px-5 py-4 text-[13px] font-bold text-[var(--ink)]"
                >
                  <span className="flex items-center gap-x-2">
                    <RiTicket2Line size={17} className="text-[var(--brand)]" />
                    {t("coupon_title")}
                  </span>
                  {couponOpen ? <RiArrowUpSLine size={18} className="text-gray-400" /> : <RiArrowDownSLine size={18} className="text-gray-400" />}
                </button>

                {couponOpen && (
                  <div className="px-5 pb-5 flex flex-col gap-y-2">
                    <div className="flex gap-x-2">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        placeholder={t("coupon_placeholder")}
                        className="flex-1 h-10 rounded-xl border border-gray-200 px-3 text-sm text-[var(--ink)] placeholder-gray-400 focus:outline-none focus:border-[var(--brand)] transition-colors"
                      />
                      <button
                        onClick={handleApplyCoupon}
                        disabled={validatingCoupon}
                        className="h-10 px-4 rounded-xl bg-gray-800 text-white text-[13px] font-bold hover:opacity-90 transition-opacity shrink-0 disabled:opacity-60"
                      >
                        {t("coupon_apply")}
                      </button>
                    </div>
                    {couponData && (
                      <p className="text-xs text-[var(--brand)] font-semibold">
                        ✓ {formatMoney(couponData.discountAmount, locale)}
                      </p>
                    )}
                    {couponError && (
                      <p className="text-xs text-red-500">
                        {(couponError as unknown as ApiError).message ?? couponError.message}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function CartPage() {
  return (
    <Suspense>
      <CartContent />
    </Suspense>
  );
}
