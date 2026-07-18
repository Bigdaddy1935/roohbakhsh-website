"use client";

import { useState, useRef } from "react";
import { Modal } from "@heroui/react";
import type { MediaCategory, MediaItem } from "@roohbakhsh/shared";
import { MEDIA_CATEGORIES } from "@roohbakhsh/shared";
import { useMedia, useUploadMedia, useDeleteMedia } from "@/hooks/queries/use-media";
import {
  RiUploadCloud2Line, RiDeleteBinLine, RiImageLine,
  RiCheckLine, RiCloseLine, RiVideoLine, RiArticleLine,
  RiUserLine, RiLayoutGridLine, RiFolderLine,
} from "react-icons/ri";

const CATEGORY_ICONS: Record<string, React.ElementType<object>> = {
  courses:    RiVideoLine,
  articles:   RiArticleLine,
  staff:      RiUserLine,
  categories: RiLayoutGridLine,
  other:      RiFolderLine,
};

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
  defaultCategory?: MediaCategory;
}

export default function GalleryPicker({ isOpen, onClose, onSelect, defaultCategory = "other" }: Props) {
  const [category, setCategory] = useState<MediaCategory>(defaultCategory);
  const [locale, setLocale] = useState<"ar" | "ur">("ar");
  const [selected, setSelected] = useState<string | null>(null);
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

  function handleConfirm() {
    if (!selected) return;
    onSelect(selected);
    setSelected(null);
    onClose();
  }

  function handleClose() {
    setSelected(null);
    onClose();
  }

  return (
    <Modal isOpen={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <Modal.Backdrop isDismissable>
        <Modal.Container placement="center" className="w-full h-full flex items-center justify-center">
          <Modal.Dialog
            aria-label="انتخاب از گالری"
            style={{ width: "min(92vw, 1200px)", height: "88vh", maxWidth: "none" }}
            className="flex flex-col bg-white rounded-[20px] shadow-2xl overflow-hidden outline-none"
          >
          {/* ── هدر ── */}
          <div className="shrink-0 flex items-center justify-between gap-4 px-6 py-3 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-800">انتخاب از گالری</h2>

            <div className="flex items-center gap-3 mr-auto">
              {category !== "staff" && (
                <div className="flex items-center bg-gray-100 rounded-full p-0.5 gap-0.5">
                  {(["ar", "ur"] as const).map((l) => (
                    <button key={l} type="button"
                      onClick={() => { setLocale(l); setSelected(null); }}
                      className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                        locale === l ? "bg-white text-[var(--brand)] shadow-sm" : "text-gray-500"
                      }`}
                    >
                      {l === "ar" ? "عربی" : "اردو"}
                    </button>
                  ))}
                </div>
              )}

              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
              <button type="button" disabled={uploading} onClick={() => fileRef.current?.click()}
                className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold bg-[var(--brand)] text-white hover:opacity-90 disabled:opacity-60 transition-opacity"
              >
                <RiUploadCloud2Line size={16} />
                {uploading ? "آپلود..." : "آپلود تصویر"}
              </button>
            </div>

            <button type="button" onClick={handleClose}
              className="size-9 flex items-center justify-center rounded-[10px] text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors cursor-pointer"
            >
              <RiCloseLine size={20} />
            </button>
          </div>

          {/* ── بدنه: سایدبار + گرید ── */}
          <div className="flex flex-1 overflow-hidden">

            {/* سایدبار */}
            <aside className="w-56 shrink-0 bg-gray-50 border-l border-gray-100 flex flex-col py-4 gap-1 overflow-y-auto">
              <p className="px-5 pb-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">دسته‌بندی</p>
              {MEDIA_CATEGORIES.map((cat) => {
                const Icon = CATEGORY_ICONS[cat.value] as React.ElementType<{ size?: number; className?: string }>;
                const isActive = category === cat.value;
                return (
                  <button key={cat.value} type="button"
                    onClick={() => { setCategory(cat.value); setSelected(null); }}
                    className={`flex items-center gap-3 mx-2 px-3 py-2.5 rounded-[10px] text-sm font-medium transition-colors text-right w-[calc(100%-16px)] ${
                      isActive
                        ? "bg-[var(--brand)]/10 text-[var(--brand)]"
                        : "text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                    }`}
                  >
                    <Icon size={18} className={isActive ? "text-[var(--brand)]" : "text-gray-400"} />
                    <span className="flex-1">{cat.label}</span>
                    {isActive && data?.total != null && (
                      <span className="text-xs bg-[var(--brand)]/15 text-[var(--brand)] font-bold px-2 py-0.5 rounded-full">
                        {data.total}
                      </span>
                    )}
                  </button>
                );
              })}
            </aside>

            {/* ناحیه تصاویر */}
            <main className="flex-1 overflow-y-auto p-6 bg-white">
              {isLoading ? (
                <div className="grid grid-cols-4 xl:grid-cols-5 gap-4">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <div key={i} className="aspect-square rounded-[14px] bg-gray-100 animate-pulse" />
                  ))}
                </div>
              ) : items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-3 text-gray-300">
                  <RiImageLine size={52} />
                  <p className="text-base font-medium text-gray-400">تصویری در این دسته وجود ندارد</p>
                  <p className="text-sm text-gray-300">برای آپلود از دکمه بالا استفاده کنید</p>
                </div>
              ) : (
                <div className="grid grid-cols-4 xl:grid-cols-5 gap-4">
                  {items.map((item: MediaItem) => (
                    <div key={item.id}
                      onClick={() => setSelected(selected === item.url ? null : item.url)}
                      style={selected === item.url
                        ? { boxShadow: "0 0 0 3px var(--brand)", borderRadius: 14, background: "color-mix(in srgb, var(--brand) 12%, transparent)" }
                        : { borderRadius: 14 }}
                      className="group relative aspect-square cursor-pointer transition-all p-1"
                    >
                      <div className="w-full h-full rounded-[14px] overflow-hidden bg-gray-50">
                        <img src={item.url} alt={item.originalName}
                          className="w-full h-full object-cover group-hover:opacity-85 transition-opacity"
                        />
                      </div>

                      {selected === item.url && (
                        <div className="absolute inset-0 rounded-[14px] bg-[var(--brand)]/20 flex items-center justify-center pointer-events-none">
                          <div className="size-8 rounded-full bg-[var(--brand)] flex items-center justify-center shadow-lg">
                            <RiCheckLine size={16} className="text-white" />
                          </div>
                        </div>
                      )}

                      <button type="button"
                        onClick={(e) => { e.stopPropagation(); deleteMut.mutate(item.id); }}
                        disabled={deleteMut.isPending}
                        className="absolute top-2 left-2 size-7 rounded-full bg-red-500 text-white items-center justify-center hidden group-hover:flex shadow transition-all"
                      >
                        <RiDeleteBinLine size={12} />
                      </button>

                      <p className="absolute bottom-0 inset-x-0 rounded-b-[14px] bg-black/50 text-white text-xs px-2 py-1.5 truncate opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        {item.originalName}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </main>
          </div>

          {/* ── فوتر ── */}
          <div className="shrink-0 flex items-center justify-between px-6 py-3 border-t border-gray-100 bg-white">
            <span className="text-sm text-gray-400">
              {selected ? "یک تصویر انتخاب شده" : `${data?.total ?? 0} تصویر در این دسته`}
            </span>
            <div className="flex gap-2">
              <button type="button" onClick={handleClose}
                className="px-5 py-2.5 rounded-[10px] text-sm font-medium text-gray-500 hover:bg-gray-200 transition-colors"
              >
                انصراف
              </button>
              <button type="button" disabled={!selected} onClick={handleConfirm}
                className="px-6 py-2.5 rounded-[10px] text-sm font-bold bg-[var(--brand)] text-white hover:opacity-90 disabled:opacity-40 transition-opacity"
              >
                انتخاب
              </button>
            </div>
          </div>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
