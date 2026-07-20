"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import type { AdminOrderRecord } from "@roohbakhsh/shared";
import { useCourses } from "@/hooks/queries/use-courses";
import { useOrdersAdmin } from "@/hooks/queries/use-orders";
import DataTable from "@/components/ui/DataTable";
import { RiArrowRightLine, RiUserLine } from "react-icons/ri";

export default function CourseEnrollmentsPage() {
  const router = useRouter();
  const { slug } = useParams<{ slug: string }>();
  const [page, setPage] = useState(1);

  const { data: coursesData } = useCourses({ page: 1, limit: 100 });
  const course = coursesData?.items.find((c) => c.slug === slug);

  const { data, isLoading } = useOrdersAdmin({
    page,
    limit: 15,
    courseId: course?.id,
  });

  const columns = [
    {
      key: "user",
      label: "کاربر",
      render: (r: AdminOrderRecord) => (
        <div className="flex flex-col">
          <span className="font-medium text-gray-800">{r.user?.fullName ?? "—"}</span>
          <span className="text-xs text-gray-400 dir-ltr">{r.user?.email ?? ""}</span>
        </div>
      ),
    },
    {
      key: "total",
      label: "مبلغ پرداختی",
      render: (r: AdminOrderRecord) =>
        r.total.amountMinor === 0
          ? "رایگان"
          : new Intl.NumberFormat("fa-IR").format(r.total.amountMinor / 100) + " تومان",
    },
    {
      key: "createdAt",
      label: "تاریخ ثبت‌نام",
      render: (r: AdminOrderRecord) => r.createdAt.slice(0, 10),
    },
    {
      key: "coupon",
      label: "کد تخفیف",
      render: (r: AdminOrderRecord) => r.couponCode ?? "—",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-x-3 bg-white border border-gray-100 rounded-[20px] px-5 h-[105px]">
        <button
          type="button"
          onClick={() => router.push("/dashboard/courses")}
          className="p-2 rounded-[20px] text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
        >
          <RiArrowRightLine size={20} />
        </button>
        <div>
          <h1 className="text-lg font-bold text-gray-800">
            ثبت‌نام‌شدگان دوره
          </h1>
          <p className="text-sm text-gray-400">
            {course ? course.title.ar : slug} — {data?.total ?? "..."} ثبت‌نام
          </p>
        </div>
        <div className="ms-auto flex items-center gap-2 bg-[var(--brand)]/10 text-[var(--brand)] px-4 py-2 rounded-full text-sm font-semibold">
          <RiUserLine size={16} />
          {data?.total ?? "..."} نفر
        </div>
      </div>

      <DataTable
        columns={columns as Parameters<typeof DataTable>[0]["columns"]}
        data={data?.items ?? []}
        isLoading={isLoading || !course}
        page={page}
        totalPages={data?.totalPages ?? 1}
        onPageChange={setPage}
      />
    </div>
  );
}
