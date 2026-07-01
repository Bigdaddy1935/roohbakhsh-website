"use client";

import { Modal } from "@heroui/react";
import { RiCloseLine, RiDeleteBinLine } from "react-icons/ri";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isPending: boolean;
  title: string;
  description?: string;
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  isPending,
  title,
  description,
}: ConfirmModalProps) {
  return (
    <Modal isOpen={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Modal.Backdrop>
        <Modal.Container placement="center" className="max-w-sm w-full mx-4">
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

            {description && (
              <Modal.Body className="px-5 py-4">
                <p className="text-sm text-gray-500">{description}</p>
              </Modal.Body>
            )}

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
                type="button"
                onClick={onConfirm}
                disabled={isPending}
                className="flex items-center gap-2 px-4 py-2 text-sm rounded-md bg-red-500 text-white hover:bg-red-600 disabled:opacity-50 transition-colors"
              >
                <RiDeleteBinLine size={15} />
                {isPending ? "در حال حذف..." : "حذف"}
              </button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
