"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Key } from "@heroui/react";
import type { User, UserRole } from "@roohbakhsh/shared";
import { useUsers } from "@/hooks/queries/use-users";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { Select, ListBox } from "@heroui/react";
import DataTable from "@/components/ui/DataTable";
import SwitchField from "@/components/ui/SwitchField";
import Link from "next/link";
import { RiUserAddLine, RiEditLine } from "react-icons/ri";


export default function UsersPage() {
  const [page, setPage] = useState(1);
  const router = useRouter();
  const { data, isLoading } = useUsers({ page, limit: 15 });
  const qc = useQueryClient();

  const updateRoleMut = useMutation<User, Error, { id: string; role: UserRole }>({
    mutationFn: ({ id, role }) => api.patch<User>(`/users/${id}/role`, { role }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["users"] }),
  });

  const updateStatusMut = useMutation<User, Error, { id: string; isActive: boolean }>({
    mutationFn: ({ id, isActive }) => api.patch<User>(`/users/${id}/status`, { isActive }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["users"] }),
  });

  const items = data?.items ?? [];
  const totalPages = data?.totalPages ?? 1;

  const columns = [
    {
      key: "avatar", label: "",
      render: (r: User) => r.avatarUrl
        ? <img src={r.avatarUrl} alt={r.fullName ?? ""} className="size-9 rounded-full object-cover" />
        : <div className="size-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 text-sm font-bold">{(r.fullName ?? r.email)[0]?.toUpperCase()}</div>,
    },
    { key: "fullName", label: "نام کامل", render: (r: User) => r.fullName ?? "-" },
    { key: "email", label: "ایمیل", render: (r: User) => r.email },
    {
      key: "edit", label: "",
      render: (r: User) => (
        <Link
          href={`/dashboard/users/${r.id}/edit`}
          className="p-2 rounded-md text-gray-400 hover:text-[var(--brand)] hover:bg-gray-100 transition-colors inline-flex"
          title="ویرایش کاربر"
        >
          <RiEditLine size={17} />
        </Link>
      ),
    },
    {
      key: "role",
      label: "نقش",
      render: (r: User) => (
        <Select
          value={r.role}
          onChange={(val: Key | Key[] | null) =>
            updateRoleMut.mutate({ id: r.id, role: String(val ?? r.role) as UserRole })
          }
          variant="secondary"
          className="min-w-[120px]"
        >
          <Select.Trigger className="shadow-none border border-gray-200 rounded-md bg-white px-3 py-1.5 text-xs">
            <Select.Value />
            <Select.Indicator />
          </Select.Trigger>
          <Select.Popover className="rounded-md border border-gray-200 shadow-sm">
            <ListBox className="text-right" dir="rtl">
              <ListBox.Item id="user" textValue="کاربر" className="text-right" dir="rtl">کاربر<ListBox.ItemIndicator /></ListBox.Item>
              <ListBox.Item id="instructor" textValue="استاد" className="text-right" dir="rtl">استاد<ListBox.ItemIndicator /></ListBox.Item>
              <ListBox.Item id="author" textValue="نویسنده" className="text-right" dir="rtl">نویسنده<ListBox.ItemIndicator /></ListBox.Item>
              <ListBox.Item id="admin" textValue="ادمین" className="text-right" dir="rtl">ادمین<ListBox.ItemIndicator /></ListBox.Item>
            </ListBox>
          </Select.Popover>
        </Select>
      ),
    },
    {
      key: "isActive",
      label: "وضعیت",
      render: (r: User) => (
        <SwitchField
          label={r.isActive ? "فعال" : "غیرفعال"}
          checked={r.isActive}
          onChange={(checked) => updateStatusMut.mutate({ id: r.id, isActive: checked })}
        />
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-white border border-gray-100 rounded-[20px] px-5 h-[105px]">
        <div>
          <h1 className="text-xl font-extrabold text-[var(--ink)]">کاربران</h1>
          <p className="text-sm text-gray-400 mt-0.5">مدیریت کاربران سایت</p>
        </div>
        <button
          onClick={() => router.push("/dashboard/users/new")}
          className="flex items-center gap-2 px-5 py-2.5 text-sm rounded-full bg-[var(--brand)] text-white hover:opacity-90 transition-colors"
        >
          <RiUserAddLine size={16} />
          افزودن کاربر
        </button>
      </div>

      <DataTable
        columns={columns as Parameters<typeof DataTable>[0]["columns"]}
        data={items}
        isLoading={isLoading}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />

    </div>
  );
}
