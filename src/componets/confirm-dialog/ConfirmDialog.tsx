import type { ReactNode } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Button } from "@/componets/button/Button";
import { cn } from "@/utils/cn";

export interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: ReactNode;
  description?: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel?: () => void;
  /** danger는 삭제처럼 되돌릴 수 없는 액션에 사용 (확인 버튼이 빨간색으로 바뀜) */
  variant?: "default" | "danger";
  /** 확인 처리 중에는 버튼을 막아 중복 클릭을 방지 */
  isConfirming?: boolean;
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "확인",
  cancelLabel = "취소",
  onConfirm,
  onCancel,
  variant = "default",
  isConfirming = false,
}: ConfirmDialogProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40" />
        <Dialog.Content
          className={cn(
            "fixed top-1/2 left-1/2 z-50 w-full max-w-sm -translate-x-1/2 -translate-y-1/2",
            "rounded-lg border border-gray-200 bg-white p-6 shadow-lg focus:outline-none",
          )}
        >
          <Dialog.Title className="text-base font-semibold text-gray-900">{title}</Dialog.Title>
          {description && (
            <Dialog.Description className="mt-2 text-sm text-gray-500">
              {description}
            </Dialog.Description>
          )}
          <div className="mt-6 flex justify-end gap-2">
            <Button
              variant="outline"
              label={cancelLabel}
              disabled={isConfirming}
              onClick={() => {
                onCancel?.();
                onOpenChange(false);
              }}
            />
            <Button
              variant="primary"
              label={confirmLabel}
              disabled={isConfirming}
              className={cn(variant === "danger" && "bg-red-600 hover:bg-red-700")}
              onClick={onConfirm}
            />
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
