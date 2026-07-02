"use client";

import { Editor } from "@tinymce/tinymce-react";

interface Props {
  value: string;
  onChange: (content: string) => void;
  label: string;
  errorMessage?: string;
}

export default function TextEditor({
  value,
  onChange,
  label,
  errorMessage,
}: Props) {
  return (
    <div>
      <p className="mb-2.5">{label}</p>
      <div className={errorMessage?.length ? "border-1.5 border-red-300 rounded-xl" : ""}>
        <Editor
          value={value}
          onEditorChange={(content: any) => {
            onChange(content);
          }}
          tinymceScriptSrc="/tinymce/tinymce/tinymce.min.js"
          init={{
            language: "fa",
            height: 700,
            directionality: "rtl",
            content_style: `
            @font-face {
              font-family: IRANSans;
              src: url('/fonts/IRANSans/IRANSansWeb.woff');
            }
            body {
              direction: rtl;
              text-align: right;
              font-family: IRANSans;
              font-size: 16px;
              line-height: 2;
            }
          `,
            plugins: ["lists", "link", "code", "table"],
            toolbar:
              "undo redo | formatselect | bold italic underline | " +
              "alignleft aligncenter alignright alignjustify | " +
              "bullist numlist outdent indent | link | code",
          }}
        />
      </div>
    </div>
  );
}
