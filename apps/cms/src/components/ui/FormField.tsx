"use client";

import type { ReactNode } from "react";
import { TextField, Label, Input, TextArea } from "@heroui/react";

type ChangeHandler = (e: { target: { value: string } }) => void;

interface BaseProps {
  label: string;
  required?: boolean;
  dir?: "ltr" | "rtl";
  onChange: ChangeHandler;
}

interface InputFieldProps extends BaseProps {
  as?: "input";
  type?: "text" | "number" | "email" | "url" | "date";
  value: string | number;
  placeholder?: string;
}

interface TextareaFieldProps extends BaseProps {
  as: "textarea";
  value: string;
  placeholder?: string;
  rows?: number;
}

interface SelectFieldProps extends BaseProps {
  as: "select";
  value: string;
  children: ReactNode;
}

type FormFieldProps = InputFieldProps | TextareaFieldProps | SelectFieldProps;

export default function FormField(props: FormFieldProps) {
  const { label, required, dir = "rtl" } = props;

  return (
    <TextField className="flex flex-col gap-2" isRequired={required}>
      <Label className="text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 mr-1">*</span>}
      </Label>

      {props.as === "textarea" ? (
        <TextArea
          value={props.value}
          onChange={(e) => props.onChange({ target: { value: e.target.value } })}
          placeholder={props.placeholder}
          required={required}
          rows={props.rows ?? 3}
          dir={dir}
          className="w-full"
        />
      ) : props.as === "select" ? (
        <select
          value={props.value}
          onChange={(e) => props.onChange({ target: { value: e.target.value } })}
          required={required}
          dir={dir}
          className="w-full border border-gray-200 rounded-md px-3 py-2.5 text-sm text-[var(--ink)] focus:outline-none focus:border-[var(--brand)] bg-white"
        >
          {props.children}
        </select>
      ) : (
        <Input
          type={(props as InputFieldProps).type ?? "text"}
          value={String((props as InputFieldProps).value)}
          onChange={(e) => props.onChange({ target: { value: e.target.value } })}
          placeholder={(props as InputFieldProps).placeholder}
          required={required}
          dir={dir}
          className="w-full"
        />
      )}
    </TextField>
  );
}
