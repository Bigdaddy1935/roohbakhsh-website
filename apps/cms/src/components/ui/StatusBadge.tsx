"use client";

interface StatusBadgeProps {
  status: string;
  map: Record<string, { label: string; color: string }>;
}

export default function StatusBadge({ status, map }: StatusBadgeProps) {
  const entry = map[status] ?? { label: status, color: "bg-gray-100 text-gray-500" };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${entry.color}`}>
      {entry.label}
    </span>
  );
}
