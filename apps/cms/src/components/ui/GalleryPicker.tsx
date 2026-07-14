"use client";

import { useState, useRef } from "react";
import { Modal } from "@heroui/react";
import type { MediaCategory, MediaItem } from "@roohbakhsh/shared";
import { MEDIA_CATEGORIES } from "@roohbakhsh/shared";
import { useMedia, useUploadMedia, useDeleteMedia } from "@/hooks/queries/use-media";
import { RiUploadCloud2Line, RiDeleteBinLine, RiImageLine, RiCheckLine, RiCloseLine } from "react-icons/ri";

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
        <Modal.Container placement="center" className="w-full max-w-3xl mx-4">
          <Modal.Dialog className="bg-white rounded-[20px] overflow-hidden">

            {/* هدر */}
            <Modal.Header className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <Modal.Heading className="text-base font-bold text-gray-800">انتخاب از گالری</Modal.Heading>
              <Modal.CloseTrigger
                onClick={handleClose}
                className="size-8 flex items-center justify-center rounded-[10px] text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors cursor-pointer"
              >
                <RiCloseLine size={18} />
              </Modal.CloseTrigger>
            </Modal.Header>

            <Modal.Body className="p-0">
              {/* نوار ابزار */}
              <div className="px-6 py-3 border-b border-gray-100 bg-gray-50 flex items-center justify-between gap-3 flex-wrap">
                {/* دسته‌بندی‌ها */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  {MEDIA_CATEGORIES.map((cat) => (
                    <button
                      key={cat.value}
                      type="button"
                      onClick={() => { setCategory(cat.value); setSelected(null); }}
                      className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                        category === cat.value
                          ? "bg-[var(--brand)] text-white"
                          : "bg-white text-gray-500 border border-gray-200 hover:border-[var(--brand)] hover:text-[var(--brand)]"
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>

                {/* سمت چپ: locale + آپلود */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center bg-white border border-gray-200 rounded-full p-0.5">
                    {(["ar", "ur"] as const).map((l) => (
                      <button
                        key={l}
                        type="button"
                        onClick={() => { setLocale(l); setSelected(null); }}
                        className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                          locale === l ? "bg-[var(--brand)] text-white" : "text-gray-500 hover:text-gray-700"
                        }`}
                      >
                        {l === "ar" ? "عربی" : "اردو"}
                      </button>
                    ))}
                  </div>

                  <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                  <button
                    type="button"
                    disabled={uploading}
                    onClick={() => fileRef.current?.click()}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-[var(--brand)] text-white hover:opacity-90 disabled:opacity-60 transition-opacity"
                  >
                    <RiUploadCloud2Line size={13} />
                    {uploading ? "آپلود..." : "آپلود تصویر"}
                  </button>
                </div>
              </div>

              {/* گرید تصاویر */}
              <div className="p-5" style={{ minHeight: 280 }}>
                {isLoading ? (
                  <div className="grid grid-cols-5 gap-3">
                    {Array.from({ length: 10 }).map((_, i) => (
                      <div key={i} className="aspect-square rounded-[10px] bg-gray-100 animate-pulse" />
                    ))}
                  </div>
                ) : items.length === 0 ? (
                  <div className="flex flex-col items-center justify-center gap-2 py-16 text-gray-300">
                    <RiImageLine size={44} />
                    <p className="text-sm font-medium text-gray-400">هیچ تصویری در این دسته وجود ندارد</p>
                    <p className="text-xs text-gray-300">برای آپلود از دکمه بالا استفاده کنید</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-5 gap-3 max-h-72 overflow-y-auto">
                    {items.map((item: MediaItem) => (
                      <div
                        key={item.id}
                        onClick={() => setSelected(selected === item.url ? null : item.url)}
                        className={`group relative aspect-square rounded-[10px] overflow-hidden cursor-pointer transition-all ${
                          selected === item.url
                            ? "ring-2 ring-[var(--brand)] ring-offset-1"
                            : "hover:ring-2 hover:ring-gray-300 hover:ring-offset-1"
                        }`}
                      >
                        <img src={item.url} alt={item.originalName} className="w-full h-full object-cover bg-gray-100" />

                        {selected === item.url && (
                          <div className="absolute inset-0 bg-[var(--brand)]/15 flex items-center justify-center">
                            <div className="size-6 rounded-full bg-[var(--brand)] flex items-center justify-center shadow">
                              <RiCheckLine size={13} className="text-white" />
                            </div>
                          </div>
                        )}

                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); deleteMut.mutate(item.id); }}
                          disabled={deleteMut.isPending}
                          className="absolute top-1 left-1 size-6 rounded-full bg-red-500 text-white items-center justify-center hidden group-hover:flex transition-all shadow"
                        >
                          <RiDeleteBinLine size={11} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Modal.Body>

            {/* فوتر */}
            <Modal.Footer className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50">
              <span className="text-xs text-gray-400">
                {selected ? "یک تصویر انتخاب شده" : `${data?.total ?? 0} تصویر`}
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 rounded-[10px] text-sm text-gray-500 hover:bg-gray-200 transition-colors"
                >
                  انصراف
                </button>
                <button
                  type="button"
                  disabled={!selected}
                  onClick={handleConfirm}
                  className="px-5 py-2 rounded-[10px] text-sm font-bold bg-[var(--brand)] text-white hover:opacity-90 disabled:opacity-40 transition-opacity"
                >
                  انتخاب
                </button>
              </div>
            </Modal.Footer>

          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
