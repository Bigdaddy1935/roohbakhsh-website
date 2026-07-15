"use client";

import { useRouter, useParams } from "next/navigation";
import { useCoupon, useUpdateCoupon } from "@/hooks/queries/use-coupons";
import CouponEditForm, { type CouponEditValues } from "@/components/coupons/CouponEditForm";

export default function EditCouponPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params.id;
  const { data: coupon, isLoading } = useCoupon(id);
  const updateMut = useUpdateCoupon(id);

  async function handleSubmit(values: CouponEditValues) {
    await updateMut.mutateAsync({
      maxUses: values.maxUses ? Number(values.maxUses) : null,
      expiresAt: values.expiresAt || null,
      isActive: values.isActive,
    });
    router.push("/dashboard/coupons");
  }

  if (isLoading || !coupon) return <div className="text-sm text-gray-400">در حال بارگذاری...</div>;

  const initialValues: CouponEditValues = {
    maxUses: coupon.maxUses != null ? String(coupon.maxUses) : "",
    expiresAt: coupon.expiresAt ?? "",
    isActive: coupon.isActive,
  };

  return <CouponEditForm couponCode={coupon.code} initialValues={initialValues} onSubmit={handleSubmit} isPending={updateMut.isPending} />;
}
