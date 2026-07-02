"use client";

const inputCls = "w-full border border-gray-200 rounded-md px-3 py-2.5 text-sm text-[var(--ink)] focus:outline-none focus:border-[var(--brand)] bg-white transition-colors";

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
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 mr-1">*</span>}
      </label>

      {props.as === "textarea" ? (
        <textarea
          value={props.value}
          onChange={(e) => props.onChange({ target: { value: e.target.value } })}
          placeholder={props.placeholder}
          required={required}
          rows={props.rows ?? 3}
          dir={dir}
          className={inputCls}
        />
      ) : (
        <input
          type={(props as InputFieldProps).type ?? "text"}
          value={String((props as InputFieldProps).value)}
          onChange={(e) => props.onChange({ target: { value: e.target.value } })}
          placeholder={(props as InputFieldProps).placeholder}
          required={required}
          dir={dir}
          className={inputCls}
        />
      )}
    </div>
  );
}
