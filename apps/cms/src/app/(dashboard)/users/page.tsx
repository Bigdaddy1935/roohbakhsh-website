"use client";

import { useState } from "react";
import type { User, UserRole } from "@roohbakhsh/shared";
import { useUsers } from "@/hooks/queries/use-users";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import PageHeader from "@/components/ui/PageHeader";
import DataTable from "@/components/ui/DataTable";
import StatusBadge from "@/components/ui/StatusBadge";

const ROLE_MAP = {
  admin: { label: "ادمین", color: "bg-purple-50 text-purple-700" },
  instructor: { label: "استاد", color: "bg-blue-50 text-blue-700" },
  user: { label: "کاربر", color: "bg-gray-100 text-gray-500" },
};

export default function UsersPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useUsers({ page, limit: 15 });
  const qc = useQueryClient();

  const updateRoleMut = useMutation<User, Error, { id: string; role: UserRole }>({
    mutationFn: ({ id, role }) => api.patch<User>(`/users/${id}/role`, { role }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["users"] }),
  });

  const items = data?.items ?? [];
  const totalPages = data?.totalPages ?? 1;

  const columns = [
    { key: "fullName", label: "نام کامل", render: (r: User) => r.fullName ?? "-" },
    { key: "email", label: "ایمیل", render: (r: User) => r.email },
    {
      key: "role",
      label: "نقش",
      render: (r: User) => (
        <select
          value={r.role}
          onChange={(e) =>
            updateRoleMut.mutate({ id: r.id, role: e.target.value as UserRole })
          }
          className="border border-gray-200 rounded-md px-2 py-1 text-xs focus:outline-none focus:border-[var(--brand)]"
        >
          <option value="user">کاربر</option>
          <option value="instructor">استاد</option>
          <option value="admin">ادمین</option>
        </select>
      ),
    },
    {
      key: "createdAt",
      label: "تاریخ عضویت",
      render: (r: User) => (r as User & { createdAt?: string }).createdAt?.slice(0, 10) ?? "-",
    },
  ];

  return (
    <div>
      <PageHeader title="کاربران" description="مدیریت کاربران سایت" />

      <DataTable
        columns={columns as Parameters<typeof DataTable>[0]["columns"]}
        data={items as Record<string, unknown>[]}
        isLoading={isLoading}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </div>
  );
}
