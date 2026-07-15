"use client";

import { useState } from "react";
import type { MediaCategory } from "@roohbakhsh/shared";
import GalleryPicker from "./GalleryPicker";
import { RiImageAddLine, RiDeleteBinLine } from "react-icons/ri";

interface Props {
  label: string;
  value: string;
  onChange: (url: string) => void;
  category?: MediaCategory;
}

export default function GalleryImageField({ label, value, onChange, category = "other" }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col gap-2">
      {label && <span className="text-sm font-medium text-gray-700">{label}</span>}

      {value ? (
        <div className="relative group w-full aspect-video rounded-[12px] overflow-hidden border border-gray-100">
          <img src={value} alt="تصویر انتخاب‌شده" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="px-3 py-1.5 rounded-full bg-white text-xs font-medium text-gray-700 hover:bg-gray-100 transition-colors"
            >
              تغییر
            </button>
            <button
              type="button"
              onClick={() => onChange("")}
              className="size-8 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors"
            >
              <RiDeleteBinLine size={14} />
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="w-full aspect-video rounded-[12px] border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-2 text-gray-400 hover:border-[var(--brand)] hover:text-[var(--brand)] transition-colors"
        >
          <RiImageAddLine size={28} />
          <span className="text-xs font-medium">انتخاب از گالری</span>
        </button>
      )}

      <GalleryPicker
        isOpen={open}
        onClose={() => setOpen(false)}
        onSelect={onChange}
        defaultCategory={category}
      />
    </div>
  );
}
