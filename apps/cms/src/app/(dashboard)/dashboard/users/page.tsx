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
  admin: { label: "Ø§Ø¯Ù…ÛŒÙ†", color: "bg-purple-50 text-purple-700" },
  instructor: { label: "Ø§Ø³ØªØ§Ø¯", color: "bg-blue-50 text-blue-700" },
  user: { label: "Ú©Ø§Ø±Ø¨Ø±", color: "bg-gray-100 text-gray-500" },
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
    { key: "fullName", label: "Ù†Ø§Ù… Ú©Ø§Ù…Ù„", render: (r: User) => r.fullName ?? "-" },
    { key: "email", label: "Ø§ÛŒÙ…ÛŒÙ„", render: (r: User) => r.email },
    {
      key: "role",
      label: "Ù†Ù‚Ø´",
      render: (r: User) => (
        <select
          value={r.role}
          onChange={(e) =>
            updateRoleMut.mutate({ id: r.id, role: e.target.value as UserRole })
          }
          className="border border-gray-200 rounded-md px-2 py-1 text-xs focus:outline-none focus:border-[var(--brand)]"
        >
          <option value="user">Ú©Ø§Ø±Ø¨Ø±</option>
          <option value="instructor">Ø§Ø³ØªØ§Ø¯</option>
          <option value="admin">Ø§Ø¯Ù…ÛŒÙ†</option>
        </select>
      ),
    },
    {
      key: "createdAt",
      label: "ØªØ§Ø±ÛŒØ® Ø¹Ø¶ÙˆÛŒØª",
      render: (r: User) => (r as User & { createdAt?: string }).createdAt?.slice(0, 10) ?? "-",
    },
  ];

  return (
    <div>
      <PageHeader title="Ú©Ø§Ø±Ø¨Ø±Ø§Ù†" description="Ù…Ø¯ÛŒØ±ÛŒØª Ú©Ø§Ø±Ø¨Ø±Ø§Ù† Ø³Ø§ÛŒØª" />

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

