"use client";

import type { Localized } from "@roohbakhsh/shared";

const inputCls = "w-full h-[48px] border border-gray-200 rounded-md px-3 text-sm text-[var(--ink)] focus:outline-none focus:border-[var(--brand)] bg-white transition-colors";
const textareaCls = "w-full min-h-[140px] border border-gray-200 rounded-md px-3 py-2.5 text-sm text-[var(--ink)] focus:outline-none focus:border-[var(--brand)] bg-white transition-colors resize-y";

interface LocalizedInputProps {
  label: string;
  value: Localized;
  onChange: (value: Localized) => void;
  placeholder?: Localized;
  required?: boolean;
  multiline?: boolean;
  layout?: "stacked" | "grid";
  /** اگر داده بشه فقط همون locale نمایش داده می‌شه (برای فرم‌هایی با تب زبان) */
  locale?: "ar" | "ur";
}

export default function LocalizedInput({
  label,
  value,
  onChange,
  placeholder,
  required,
  multiline,
  layout = "stacked",
  locale,
}: LocalizedInputProps) {
  if (locale) {
    const inputValue = value[locale] ?? "";
    const inputPlaceholder = placeholder?.[locale];
    return (
      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 mr-1">*</span>}
        </span>
        {multiline ? (
          <textarea
            value={inputValue}
            onChange={(e) => onChange({ ...value, [locale]: e.target.value })}
            placeholder={inputPlaceholder}
            required={required}
            dir="rtl"
            className={textareaCls}
          />
        ) : (
          <input
            value={inputValue}
            onChange={(e) => onChange({ ...value, [locale]: e.target.value })}
            placeholder={inputPlaceholder}
            required={required}
            dir="rtl"
            className={inputCls}
          />
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 mr-1">*</span>}
      </span>
      <div className={layout === "grid" ? "grid grid-cols-1 md:grid-cols-2 gap-3" : "flex flex-col gap-3"}>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-gray-400">عربی</label>
          {multiline ? (
            <textarea
              value={value.ar}
              onChange={(e) => onChange({ ...value, ar: e.target.value })}
              placeholder={placeholder?.ar}
              required={required}
              dir="rtl"
              className={textareaCls}
            />
          ) : (
            <input
              value={value.ar}
              onChange={(e) => onChange({ ...value, ar: e.target.value })}
              placeholder={placeholder?.ar}
              required={required}
              dir="rtl"
              className={inputCls}
            />
          )}
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-gray-400">اردو</label>
          {multiline ? (
            <textarea
              value={value.ur}
              onChange={(e) => onChange({ ...value, ur: e.target.value })}
              placeholder={placeholder?.ur}
              dir="rtl"
              className={textareaCls}
            />
          ) : (
            <input
              value={value.ur}
              onChange={(e) => onChange({ ...value, ur: e.target.value })}
              placeholder={placeholder?.ur}
              dir="rtl"
              className={inputCls}
            />
          )}
        </div>
      </div>
    </div>
  );
}
