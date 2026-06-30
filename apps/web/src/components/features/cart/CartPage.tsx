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
import { CartPageSkeleton } from "@/components/dashboard/DashboardSkeleton";

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
          initiatePayment(order.id, {
            onSuccess: (data) => {
              if (data.gatewayUrl) {
                window.location.href = data.gatewayUrl;
              } else {
                router.push("/dashboard/my-courses");
              }
            },
          });
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

  if (isLoading || (!cart && items.length === 0)) {
    return <CartPageSkeleton />;
  }

  return (
    <div className="bg-[var(--bg)] min-h-[80vh]">
      <div className="container py-16">

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
              <div className="bg-white rounded-lg overflow-hidden p-6">
              <div className="mb-4">
                <h1 className="text-lg font-extrabold text-[var(--ink)]">{t("title")}</h1>
              </div>
              <div className="divide-y divide-gray-100 pt-2">
                {items.map((item) => {
                  const thumb = item.thumbnailUrl?.[locale] ?? item.thumbnailUrl?.ar ?? "";
                  const hasDiscount = item.originalPrice && item.effectivePrice &&
                    item.originalPrice.amountMinor > item.effectivePrice.amountMinor;
                  return (
                    <div key={item.courseId}
                      className="py-3 flex flex-row items-center justify-between">

                      {/* thumbnail + title + mobile trash */}
                      <div className="flex items-center gap-x-3 sm:gap-x-5 min-w-0 flex-1">
                        <div className="relative h-[101px] w-[180px] shrink-0 rounded-md overflow-hidden bg-gray-100">
                          {thumb && (
                            <Image src={thumb} alt={item.title[locale]} fill className="object-cover" sizes="140px" />
                          )}
                        </div>
                        <h3 className="flex-1 text-sm sm:text-[15px] font-semibold text-[var(--ink)] line-clamp-2 leading-6 hover:text-[var(--brand)] transition-colors cursor-default">
                          {item.title[locale]}
                        </h3>
                        <button onClick={() => removeItem(item.courseId)} disabled={removing}
                          className="sm:hidden shrink-0 text-gray-300 hover:text-red-500 transition-colors disabled:opacity-50"
                          aria-label={t("remove")}>
                          <RiDeleteBin6Line size={16} />
                        </button>
                      </div>

                      {/* price + desktop trash */}
                      <div className="flex items-center gap-x-5 shrink-0 ms-4">
                        <div className="flex flex-col items-end gap-y-0.5">
                          {hasDiscount && (
                            <span className="text-xs text-gray-400 line-through whitespace-nowrap">
                              {formatMoney(item.originalPrice, locale)}
                            </span>
                          )}
                          <span className="text-sm sm:text-base font-extrabold text-[var(--brand)] whitespace-nowrap">
                            {formatMoney(item.effectivePrice, locale)}
                          </span>
                        </div>
                        <button onClick={() => removeItem(item.courseId)} disabled={removing}
                          className="hidden sm:flex text-gray-300 hover:text-red-500 transition-colors disabled:opacity-50"
                          aria-label={t("remove")}>
                          <RiDeleteBin6Line size={18} />
                        </button>
                      </div>

                    </div>
                  );
                })}
              </div>
              </div>
            </div>

            <div className="flex flex-col gap-y-4 sticky top-24 self-start">
              <div className="bg-white rounded-lg px-6 py-6 flex flex-col">
                <h2 className="text-[15px] font-extrabold text-[var(--ink)] mb-8">{t("summary_title")}</h2>

                <div className="flex flex-col gap-y-3 pb-5 mb-5 border-b border-gray-100 text-[13px]">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">{t("summary_total")}</span>
                    <span className="font-bold text-[var(--ink)]">{formatMoney(cart?.total, locale)}</span>
                  </div>
                  {discount && (
                    <div className="flex items-center justify-between text-[var(--brand)]">
                      <span>{t("summary_discount")}</span>
                      <span className="font-bold">{formatMoney(discount, locale)}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between mb-6">
                  <span className="text-[13px] text-gray-600">{t("summary_payable")}</span>
                  <span className="text-[17px] font-extrabold text-[var(--ink)]">{formatMoney(total, locale)}</span>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={ordering || paying}
                  className="w-full h-12 rounded-md bg-[var(--brand)] text-white font-extrabold text-[14px] hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-60 flex items-center justify-center gap-x-2 mb-4"
                >
                  {(ordering || paying) && <RiLoader4Line size={18} className="animate-spin" />}
                  {t("pay_btn")}
                </button>

                <p className="text-[11px] text-gray-400 leading-5">
                  {t("terms_pre")}
                  <Link href="/terms" className="text-[var(--brand)] hover:underline">{t("terms_link1")}</Link>
                  {t("terms_and")}
                  <Link href="/terms" className="text-[var(--brand)] hover:underline">{t("terms_link2")}</Link>
                  {t("terms_post")}
                </p>
              </div>

              <div className="bg-white rounded-lg overflow-hidden">
                <button
                  onClick={() => setCouponOpen((o) => !o)}
                  className="w-full flex items-center justify-between px-6 py-5 text-[13px] font-bold text-[var(--ink)]"
                >
                  <span className="flex items-center gap-x-2">
                    <RiTicket2Line size={17} className="text-[var(--brand)]" />
                    {t("coupon_title")}
                  </span>
                  {couponOpen ? <RiArrowUpSLine size={18} className="text-gray-400" /> : <RiArrowDownSLine size={18} className="text-gray-400" />}
                </button>

                {couponOpen && (
                  <div className="px-6 pb-6 flex flex-col gap-y-2">
                    <div className="flex gap-x-2">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        placeholder={t("coupon_placeholder")}
                        className="flex-1 h-10 rounded-md border border-gray-200 px-3 text-sm text-[var(--ink)] placeholder-gray-400 focus:outline-none focus:border-[var(--brand)] transition-colors"
                      />
                      <button
                        onClick={handleApplyCoupon}
                        disabled={validatingCoupon}
                        className="h-10 px-4 rounded-md bg-gray-800 text-white text-[13px] font-bold hover:opacity-90 transition-opacity shrink-0 disabled:opacity-60"
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
    <Suspense fallback={<CartPageSkeleton />}>
      <CartContent />
    </Suspense>
  );
}
