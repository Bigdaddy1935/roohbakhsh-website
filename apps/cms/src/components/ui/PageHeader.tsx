"use client";

import { RiAddLine } from "react-icons/ri";

interface PageHeaderProps {
  title: string;
  description?: string;
  onAdd?: () => void;
  addLabel?: string;
}

export default function PageHeader({
  title,
  description,
  onAdd,
  addLabel = "افزودن",
}: PageHeaderProps) {
  return (
    <div className="flex items-start justify-between mb-6">
      <div>
        <h1 className="text-xl font-extrabold text-[var(--ink)]">{title}</h1>
        {description && (
          <p className="text-sm text-gray-400 mt-1">{description}</p>
        )}
      </div>
      {onAdd && (
        <button
          type="button"
          onClick={onAdd}
          className="flex items-center gap-1.5 px-4 py-2 text-sm rounded-md bg-[var(--brand)] text-white hover:opacity-90"
        >
          <RiAddLine className="text-base" />
          {addLabel}
        </button>
      )}
    </div>
  );
}
