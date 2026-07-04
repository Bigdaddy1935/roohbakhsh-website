"use client";

import { useRef } from "react";
import { useUploadMedia } from "@/hooks/queries/use-media";
import { RiUploadCloud2Line, RiCloseLine, RiLoader4Line } from "react-icons/ri";

interface ImageUploadFieldProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  required?: boolean;
}

export default function ImageUploadField({ label, value, onChange, required }: ImageUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const uploadMut = useUploadMedia();

  function handleFileSelect(file: File | null) {
    if (!file) return;
    uploadMut.mutate(file, { onSuccess: (res) => onChange(res.url) });
  }

  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 mr-1">*</span>}
      </span>

      <div className="flex items-center gap-3">
        {value ? (
          <div className="relative shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element -- پیش‌نمایش تصویر آپلودشده از CDN خارجی */}
            <img src={value} alt={label} className="size-16 rounded-md object-cover border border-gray-200" />
            <button
              type="button"
              onClick={() => onChange("")}
              className="absolute -top-1.5 -right-1.5 size-5 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors"
              aria-label="حذف تصویر"
            >
              <RiCloseLine size={12} />
            </button>
          </div>
        ) : (
          <div className="size-16 rounded-md border border-dashed border-gray-300 flex items-center justify-center text-gray-300 shrink-0">
            <RiUploadCloud2Line size={22} />
          </div>
        )}

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploadMut.isPending}
          className="flex items-center gap-1.5 px-3 py-2 text-xs rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 transition-colors"
        >
          {uploadMut.isPending ? <RiLoader4Line size={14} className="animate-spin" /> : <RiUploadCloud2Line size={14} />}
          {uploadMut.isPending ? "در حال آپلود..." : value ? "تغییر تصویر" : "آپلود تصویر"}
        </button>

        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          className="hidden"
          onChange={(e) => handleFileSelect(e.target.files?.[0] ?? null)}
        />
      </div>

      {uploadMut.isError && (
        <span className="text-xs text-red-500">آپلود تصویر ناموفق بود. دوباره تلاش کنید.</span>
      )}
    </div>
  );
}
