"use client";

import { useRouter } from "next/navigation";
import { useCreateCoupon } from "@/hooks/queries/use-coupons";
import CouponCreateForm, { type CouponCreateValues } from "@/components/coupons/CouponCreateForm";

const emptyForm: CouponCreateValues = {
  code: "",
  discountType: "percentage",
  discountValue: "",
  currency: "USD",
  maxUses: "",
  expiresAt: "",
  isActive: true,
};

export default function NewCouponPage() {
  const router = useRouter();
  const createMut = useCreateCoupon();

  async function handleSubmit(values: CouponCreateValues) {
    await createMut.mutateAsync({
      code: values.code,
      discountType: values.discountType,
      discountValue: Number(values.discountValue),
      currency: values.currency,
      maxUses: values.maxUses ? Number(values.maxUses) : undefined,
      expiresAt: values.expiresAt || undefined,
      isActive: values.isActive,
    });
    router.push("/dashboard/coupons");
  }

  return <CouponCreateForm initialValues={emptyForm} onSubmit={handleSubmit} isPending={createMut.isPending} />;
}
