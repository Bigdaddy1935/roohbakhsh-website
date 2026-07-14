"use client";

import { useRef, useState } from "react";
import { useUploadMedia } from "@/hooks/queries/use-media";
import { RiUploadCloud2Line, RiCloseLine, RiLoader4Line, RiImageLine } from "react-icons/ri";

interface ImageUploadFieldProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  required?: boolean;
}

export default function ImageUploadField({ label, value, onChange, required }: ImageUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const uploadMut = useUploadMedia();
  const [imgFailed, setImgFailed] = useState(false);

  function handleFileSelect(file: File | null) {
    if (!file) return;
    setImgFailed(false);
    uploadMut.mutate(file, { onSuccess: (res) => onChange(res.url) });
  }

  const showImage = !!value && !imgFailed;

  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 mr-1">*</span>}
      </span>

      <div
        onClick={() => !uploadMut.isPending && inputRef.current?.click()}
        className={`group relative w-full h-[220px] rounded-[12px] border overflow-hidden transition-colors ${
          uploadMut.isPending
            ? "border-gray-200 cursor-wait"
            : "border-dashed border-gray-300 hover:border-[var(--brand)] cursor-pointer"
        }`}
      >
        {showImage ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element -- پیش‌نمایش تصویر آپلودشده از CDN خارجی */}
            <img
              src={value}
              alt={label}
              onError={() => setImgFailed(true)}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
              <span className="flex items-center gap-1.5 text-white text-xs font-medium">
                <RiUploadCloud2Line size={16} />
                تغییر تصویر
              </span>
            </div>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); setImgFailed(false); onChange(""); }}
              className="absolute top-1.5 left-1.5 size-6 rounded-full bg-white/90 text-red-500 flex items-center justify-center hover:bg-white transition-colors shadow-sm"
              aria-label="حذف تصویر"
            >
              <RiCloseLine size={14} />
            </button>
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-1.5 text-gray-400 bg-white">
            {uploadMut.isPending ? (
              <>
                <RiLoader4Line size={24} className="animate-spin text-[var(--brand)]" />
                <span className="text-xs">در حال آپلود...</span>
              </>
            ) : imgFailed ? (
              <>
                <RiImageLine size={24} />
                <span className="text-xs">تصویر بارگذاری نشد — برای تعویض کلیک کنید</span>
              </>
            ) : (
              <>
                <RiUploadCloud2Line size={24} />
                <span className="text-xs">برای آپلود تصویر کلیک کنید</span>
              </>
            )}
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className="hidden"
        onChange={(e) => handleFileSelect(e.target.files?.[0] ?? null)}
      />

      {uploadMut.isError && (
        <span className="text-xs text-red-500">آپلود تصویر ناموفق بود. دوباره تلاش کنید.</span>
      )}
    </div>
  );
}
