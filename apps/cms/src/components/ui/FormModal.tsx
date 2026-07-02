"use client";

import type { FormEvent, ReactNode } from "react";
import { Modal } from "@heroui/react";
import { RiCloseLine } from "react-icons/ri";

interface FormModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  onSubmit: (e: FormEvent) => void;
  isPending: boolean;
  submitLabel?: string;
  size?: "default" | "cover";
}

export default function FormModal({
  isOpen,
  onClose,
  title,
  children,
  onSubmit,
  isPending,
  submitLabel = "ذخیره",
  size = "default",
}: FormModalProps) {
  const isCover = size === "cover";

  return (
    <Modal isOpen={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Modal.Backdrop>
        <Modal.Container
          placement="center"
          className={
            isCover
              ? "!w-[95vw] !h-[92vh] !max-w-none !m-auto"
              : "max-w-2xl w-full mx-4"
          }
        >
          <Modal.Dialog
            className={`bg-white ${isCover ? "!w-full !h-full !max-w-none rounded-lg flex flex-col" : "rounded-lg"}`}
          >
            <Modal.Header className="flex items-center justify-between px-5 py-4 shrink-0">
              <Modal.Heading className="text-[var(--ink)] font-bold text-base">
                {title}
              </Modal.Heading>
              <Modal.CloseTrigger
                onClick={onClose}
                className="size-8 flex items-center justify-center rounded-md hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <RiCloseLine size={18} />
              </Modal.CloseTrigger>
            </Modal.Header>

            <form onSubmit={onSubmit} className="flex flex-col min-h-0 flex-1">
              <Modal.Body
                className={`flex flex-col gap-4 overflow-y-auto ${
                  isCover ? "flex-1" : "max-h-[60vh]"
                }`}
              >
                {children}
              </Modal.Body>

              <Modal.Footer className="flex gap-3 shrink-0">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isPending}
                  className="flex-1 py-2.5 text-sm rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 transition-colors"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="flex-1 py-2.5 text-sm rounded-md bg-[var(--brand)] text-white hover:opacity-90 disabled:opacity-50 transition-opacity"
                >
                  {isPending ? "در حال ذخیره..." : submitLabel}
                </button>
              </Modal.Footer>
            </form>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
