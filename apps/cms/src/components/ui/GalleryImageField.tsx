"use client";

import { useState } from "react";
import type { MediaCategory } from "@roohbakhsh/shared";
import GalleryPicker from "./GalleryPicker";
import { RiImageAddLine, RiDeleteBinLine, RiLinkM, RiGalleryLine } from "react-icons/ri";

interface Props {
  label: string;
  value: string;
  onChange: (url: string) => void;
  category?: MediaCategory;
}

export default function GalleryImageField({ label, value, onChange, category = "other" }: Props) {
  const [open, setOpen] = useState(false);
  const [urlMode, setUrlMode] = useState(false);
  const [urlInput, setUrlInput] = useState("");

  function handleUrlConfirm() {
    const trimmed = urlInput.trim();
    if (trimmed) onChange(trimmed);
    setUrlInput("");
    setUrlMode(false);
  }

  return (
    <div className="flex flex-col gap-2">
      {label && <span className="text-sm font-medium text-gray-700">{label}</span>}

      {value && !urlMode ? (
        <div className="relative group w-full aspect-video rounded-[12px] overflow-hidden border border-gray-100">
          <img src={value} alt="تصویر انتخاب‌شده" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="px-3 py-1.5 rounded-full bg-white text-xs font-medium text-gray-700 hover:bg-gray-100 transition-colors"
            >
              تغییر از گالری
            </button>
            <button
              type="button"
              onClick={() => { setUrlInput(value); setUrlMode(true); }}
              className="px-3 py-1.5 rounded-full bg-white text-xs font-medium text-gray-700 hover:bg-gray-100 transition-colors"
            >
              ویرایش URL
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
      ) : urlMode ? (
        <div className="flex flex-col gap-2">
          <input
            type="url"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleUrlConfirm())}
            placeholder="https://example.com/image.jpg"
            dir="ltr"
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-[10px] focus:outline-none focus:border-[var(--brand)]"
            autoFocus
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleUrlConfirm}
              className="px-4 py-1.5 rounded-[10px] text-xs font-medium bg-[var(--brand)] text-white hover:opacity-90 transition-opacity"
            >
              تأیید
            </button>
            <button
              type="button"
              onClick={() => { setUrlMode(false); setUrlInput(""); }}
              className="px-4 py-1.5 rounded-[10px] text-xs font-medium text-gray-500 hover:bg-gray-100 transition-colors"
            >
              انصراف
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="w-full aspect-video rounded-[12px] border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-2 text-gray-400 hover:border-[var(--brand)] hover:text-[var(--brand)] transition-colors"
          >
            <RiImageAddLine size={28} />
            <span className="text-xs font-medium">انتخاب از گالری</span>
          </button>
          <button
            type="button"
            onClick={() => setUrlMode(true)}
            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-[var(--brand)] transition-colors self-start"
          >
            <RiLinkM size={13} />
            وارد کردن URL مستقیم
          </button>
        </div>
      )}

      <GalleryPicker
        isOpen={open}
        onClose={() => setOpen(false)}
        onSelect={(url) => { onChange(url); setUrlMode(false); }}
        defaultCategory={category}
      />
    </div>
  );
}
