"use client";

import { useState, useRef } from "react";
import type { MediaCategory, MediaItem } from "@roohbakhsh/shared";
import { MEDIA_CATEGORIES } from "@roohbakhsh/shared";
import { useMedia, useUploadMedia, useDeleteMedia } from "@/hooks/queries/use-media";
import { RiUploadCloud2Line, RiDeleteBinLine, RiImageLine } from "react-icons/ri";

export default function GalleryPage() {
  const [category, setCategory] = useState<MediaCategory>("courses");
  const [locale, setLocale] = useState<"ar" | "ur">("ar");
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const { data, isLoading } = useMedia(category, locale);
  const uploadMut = useUploadMedia();
  const deleteMut = useDeleteMedia();

  const items = data?.items ?? [];

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      await uploadMut.mutateAsync({ file, category, locale });
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  return (
    <div className="space-y-5">
      {/* هدر */}
      <div className="flex items-center justify-between bg-white border border-gray-100 rounded-[20px] px-5 h-[105px]">
        <div>
          <h1 className="text-xl font-extrabold text-[var(--ink)]">گالری تصاویر</h1>
          <p className="text-sm text-gray-400 mt-0.5">مدیریت تصاویر سایت بر اساس دسته‌بندی و زبان</p>
        </div>
        <div className="flex items-center gap-3">
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
          <button
            type="button"
            disabled={uploading}
            onClick={() => fileRef.current?.click()}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[var(--brand)] text-white text-sm font-bold hover:opacity-90 disabled:opacity-60 transition-colors"
          >
            <RiUploadCloud2Line size={17} />
            {uploading ? "در حال آپلود..." : "آپلود تصویر"}
          </button>
        </div>
      </div>

      {/* فیلترها */}
      <div className="bg-white border border-gray-100 rounded-[20px] px-5 py-4 flex flex-wrap items-center gap-4">
        {/* دسته‌بندی */}
        <div className="flex gap-2 flex-wrap">
          {MEDIA_CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              type="button"
              onClick={() => setCategory(cat.value)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                category === cat.value
                  ? "bg-[var(--brand)] text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="h-5 w-px bg-gray-200" />

        {/* زبان */}
        <div className="flex items-center gap-1 bg-gray-100 rounded-full p-1">
          {(["ar", "ur"] as const).map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => setLocale(l)}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${
                locale === l ? "bg-white text-[var(--brand)] shadow-sm" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {l === "ar" ? "عربی" : "اردو"}
            </button>
          ))}
        </div>

        <span className="text-xs text-gray-400 mr-auto">{data?.total ?? 0} تصویر</span>
      </div>

      {/* گرید */}
      <div className="bg-white border border-gray-100 rounded-[20px] p-5">
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="aspect-square rounded-[12px] bg-gray-100 animate-pulse" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3 text-gray-400">
            <RiImageLine size={44} />
            <p className="text-sm font-medium">هیچ تصویری در این دسته و زبان وجود ندارد</p>
            <p className="text-xs">برای آپلود روی دکمه «آپلود تصویر» کلیک کنید</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {items.map((item: MediaItem) => (
              <div key={item.id} className="group relative aspect-square rounded-[12px] overflow-hidden border border-gray-100">
                <img src={item.url} alt={item.originalName} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex flex-col justify-between p-2 opacity-0 group-hover:opacity-100">
                  <button
                    type="button"
                    onClick={() => deleteMut.mutate(item.id)}
                    disabled={deleteMut.isPending}
                    className="self-end size-8 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors"
                  >
                    <RiDeleteBinLine size={14} />
                  </button>
                  <p className="text-white text-[10px] truncate bg-black/40 rounded px-1.5 py-0.5">
                    {item.originalName}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
