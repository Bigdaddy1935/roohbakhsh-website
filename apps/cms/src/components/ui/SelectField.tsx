"use client";

import type { Key } from "@heroui/react";
import { Select, Label, ListBox } from "@heroui/react";

interface SelectFieldOption {
  value: string;
  label: string;
}

interface SelectFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectFieldOption[];
  required?: boolean;
  placeholder?: string;
}

export default function SelectField({
  label,
  value,
  onChange,
  options,
  required,
  placeholder = "انتخاب کنید",
}: SelectFieldProps) {
  return (
    <Select
      value={value === "" ? null : value}
      onChange={(val: Key | Key[] | null) => onChange(val === null ? "" : String(val))}
      fullWidth
      isRequired={required}
      placeholder={placeholder}
      variant="secondary"
    >
      <Label className="text-sm font-medium text-gray-700">
        {label}
      </Label>
      <Select.Trigger className="shadow-none border border-gray-200 rounded-md bg-white px-3 py-2.5 text-sm">
        <Select.Value />
        <Select.Indicator />
      </Select.Trigger>
      <Select.Popover className="rounded-md border border-gray-200 shadow-sm">
        <ListBox className="text-right" dir="rtl">
          {options.map((opt) => (
            <ListBox.Item key={opt.value || "__empty__"} id={opt.value || "__empty__"} textValue={opt.label} className="text-right" dir="rtl">
              {opt.label}
              <ListBox.ItemIndicator />
            </ListBox.Item>
          ))}
        </ListBox>
      </Select.Popover>
    </Select>
  );
}
