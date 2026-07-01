"use client";

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

type FormFieldProps = InputFieldProps | TextareaFieldProps;

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
          className="w-full shadow-none"
        />
      ) : (
        <Input
          type={(props as InputFieldProps).type ?? "text"}
          value={String((props as InputFieldProps).value)}
          onChange={(e) => props.onChange({ target: { value: e.target.value } })}
          placeholder={(props as InputFieldProps).placeholder}
          required={required}
          dir={dir}
          className="w-full shadow-none"
        />
      )}
    </TextField>
  );
}
