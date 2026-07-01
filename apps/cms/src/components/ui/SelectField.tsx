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
        {required && <span className="text-red-500 mr-1">*</span>}
      </Label>
      <Select.Trigger className="shadow-none border border-gray-200 rounded-md">
        <Select.Value />
        <Select.Indicator />
      </Select.Trigger>
      <Select.Popover>
        <ListBox>
          {options.map((opt) => (
            <ListBox.Item key={opt.value || "__empty__"} id={opt.value || "__empty__"} textValue={opt.label}>
              {opt.label}
              <ListBox.ItemIndicator />
            </ListBox.Item>
          ))}
        </ListBox>
      </Select.Popover>
    </Select>
  );
}
