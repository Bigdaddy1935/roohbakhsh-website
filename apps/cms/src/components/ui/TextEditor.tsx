"use client";

import { useEffect, useId, useRef } from "react";

declare global {
  interface Window {
    tinymce?: any;
  }
}

interface Props {
  value: string;
  onChange: (content: string) => void;
  label: string;
  errorMessage?: string;
}

const SCRIPT_SRC = "/tinymce/tinymce/tinymce.min.js";

function loadTinymceScript(): Promise<void> {
  if (window.tinymce) return Promise.resolve();
  const existing = document.querySelector(`script[src="${SCRIPT_SRC}"]`) as HTMLScriptElement | null;
  if (existing) {
    return new Promise((resolve) => existing.addEventListener("load", () => resolve(), { once: true }));
  }
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = SCRIPT_SRC;
    script.referrerPolicy = "origin";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("tinymce script failed to load"));
    document.head.appendChild(script);
  });
}

export default function TextEditor({
  value,
  onChange,
  label,
  errorMessage,
}: Props) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const editorId = useId().replace(/:/g, "-");
  const onChangeRef = useRef(onChange);
  const valueRef = useRef(value);

  useEffect(() => {
    onChangeRef.current = onChange;
    valueRef.current = value;
  }, [onChange, value]);

  useEffect(() => {
    let editor: any = null;
    let cancelled = false;

    loadTinymceScript().then(() => {
      if (cancelled || !textareaRef.current) return;
      window.tinymce!.init({
        target: textareaRef.current,
        language: "fa",
        height: 530,
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
        plugins: ["lists", "link", "image", "code", "table"],
        toolbar:
          "undo redo | formatselect | bold italic underline | " +
          "alignleft aligncenter alignright alignjustify | " +
          "bullist numlist outdent indent | link image | code",
        automatic_uploads: true,
        images_upload_handler: (blobInfo: any) =>
          new Promise((resolve) => {
            const base64 = blobInfo.base64();
            const mime = blobInfo.blob().type;
            resolve(`data:${mime};base64,${base64}`);
          }),
        image_title: true,
        file_picker_types: "image",
        file_picker_callback: (cb: any) => {
          const input = document.createElement("input");
          input.setAttribute("type", "file");
          input.setAttribute("accept", "image/*");
          input.onchange = () => {
            const file = input.files?.[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = () => cb(reader.result as string, { title: file.name });
            reader.readAsDataURL(file);
          };
          input.click();
        },
        setup: (ed: any) => {
          editor = ed;
          ed.on("init", () => {
            if (cancelled) return;
            ed.setContent(valueRef.current ?? "");
          });
          ed.on("change input undo redo keyup", () => {
            onChangeRef.current(ed.getContent());
          });
        },
      });
    });

    return () => {
      cancelled = true;
      if (editor) window.tinymce?.remove(editor);
    };
  }, []);

  return (
    <div>
      <p className="mb-2.5">{label}</p>
      <div className={errorMessage?.length ? "border-1.5 border-red-300 rounded-xl" : ""}>
        <textarea id={editorId} ref={textareaRef} style={{ visibility: "hidden" }} />
      </div>
    </div>
  );
}
