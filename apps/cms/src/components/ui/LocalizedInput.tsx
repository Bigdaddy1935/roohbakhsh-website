"use client";

import type { Localized } from "@roohbakhsh/shared";

const inputCls = "w-full border border-gray-200 rounded-md px-3 py-2.5 text-sm text-[var(--ink)] focus:outline-none focus:border-[var(--brand)] bg-white transition-colors";

interface LocalizedInputProps {
  label: string;
  value: Localized;
  onChange: (value: Localized) => void;
  placeholder?: Localized;
  required?: boolean;
  multiline?: boolean;
}

export default function LocalizedInput({
  label,
  value,
  onChange,
  placeholder,
  required,
  multiline,
}: LocalizedInputProps) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 mr-1">*</span>}
      </span>
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-gray-400">عربی</label>
          {multiline ? (
            <textarea
              value={value.ar}
              onChange={(e) => onChange({ ...value, ar: e.target.value })}
              placeholder={placeholder?.ar}
              required={required}
              rows={3}
              dir="rtl"
              className={inputCls}
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
              rows={3}
              dir="rtl"
              className={inputCls}
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
