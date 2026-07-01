"use client";

import type { Localized } from "@roohbakhsh/shared";
import { TextField, Label, Input, TextArea } from "@heroui/react";

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
        <TextField className="flex flex-col gap-1.5">
          <Label className="text-xs text-gray-400">عربی</Label>
          {multiline ? (
            <TextArea
              value={value.ar}
              onChange={(e) => onChange({ ...value, ar: e.target.value })}
              placeholder={placeholder?.ar}
              required={required}
              rows={3}
              dir="rtl"
              className="w-full shadow-none"
            />
          ) : (
            <Input
              value={value.ar}
              onChange={(e) => onChange({ ...value, ar: e.target.value })}
              placeholder={placeholder?.ar}
              required={required}
              dir="rtl"
              className="w-full shadow-none"
            />
          )}
        </TextField>
        <TextField className="flex flex-col gap-1.5">
          <Label className="text-xs text-gray-400">اردو</Label>
          {multiline ? (
            <TextArea
              value={value.ur}
              onChange={(e) => onChange({ ...value, ur: e.target.value })}
              placeholder={placeholder?.ur}
              rows={3}
              dir="rtl"
              className="w-full shadow-none"
            />
          ) : (
            <Input
              value={value.ur}
              onChange={(e) => onChange({ ...value, ur: e.target.value })}
              placeholder={placeholder?.ur}
              dir="rtl"
              className="w-full shadow-none"
            />
          )}
        </TextField>
      </div>
    </div>
  );
}
