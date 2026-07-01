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
}

export default function FormModal({
  isOpen,
  onClose,
  title,
  children,
  onSubmit,
  isPending,
  submitLabel = "ذخیره",
}: FormModalProps) {
  return (
    <Modal isOpen={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Modal.Backdrop>
        <Modal.Container placement="center" className="max-w-2xl w-full mx-4">
          <Modal.Dialog className="bg-white rounded-lg">
            <Modal.Header className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
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

            <form onSubmit={onSubmit} className="flex flex-col">
              <Modal.Body className="flex flex-col gap-4 px-5 py-5 max-h-[60vh] overflow-y-auto">
                {children}
              </Modal.Body>

              <Modal.Footer className="flex gap-3 justify-end px-5 py-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isPending}
                  className="px-4 py-2 text-sm rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 transition-colors"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-4 py-2 text-sm rounded-md bg-[var(--brand)] text-white hover:opacity-90 disabled:opacity-50 transition-opacity"
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
