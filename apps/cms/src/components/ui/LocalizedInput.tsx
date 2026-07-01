"use client";

import type { Localized } from "@roohbakhsh/shared";

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
  const baseClass =
    "w-full border border-gray-200 rounded-md px-3 py-2 text-sm text-[var(--ink)] focus:outline-none focus:border-[var(--brand)]";

  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-gray-600">
        {label}
        {required && <span className="text-red-500 mr-1">*</span>}
      </label>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <span className="text-xs text-gray-400">عربی</span>
          {multiline ? (
            <textarea
              value={value.ar}
              onChange={(e) => onChange({ ...value, ar: e.target.value })}
              placeholder={placeholder?.ar}
              required={required}
              rows={3}
              className={baseClass}
              dir="rtl"
            />
          ) : (
            <input
              type="text"
              value={value.ar}
              onChange={(e) => onChange({ ...value, ar: e.target.value })}
              placeholder={placeholder?.ar}
              required={required}
              className={baseClass}
              dir="rtl"
            />
          )}
        </div>
        <div className="space-y-1">
          <span className="text-xs text-gray-400">اردو</span>
          {multiline ? (
            <textarea
              value={value.ur}
              onChange={(e) => onChange({ ...value, ur: e.target.value })}
              placeholder={placeholder?.ur}
              rows={3}
              className={baseClass}
              dir="rtl"
            />
          ) : (
            <input
              type="text"
              value={value.ur}
              onChange={(e) => onChange({ ...value, ur: e.target.value })}
              placeholder={placeholder?.ur}
              className={baseClass}
              dir="rtl"
            />
          )}
        </div>
      </div>
    </div>
  );
}
