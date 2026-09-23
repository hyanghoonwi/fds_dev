import * as RadixToast from "@radix-ui/react-toast";
import { cn } from "@/utils/cn";
import { dismissToast, useToasts, type ToastVariant } from "./toast-store";

const variantClass: Record<ToastVariant, string> = {
  default: "border-gray-200 bg-white text-gray-900",
  success: "border-green-200 bg-green-50 text-green-900",
  error: "border-red-200 bg-red-50 text-red-900",
  warning: "border-amber-200 bg-amber-50 text-amber-900",
};

const CloseIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// 앱(혹은 Storybook decorator) 최상단에 한 번만 마운트해두면, 어디서든 toast() 호출만으로
// 알림을 띄울 수 있다. 상태는 toast-store의 전역 스토어에서 구독한다.
export function Toaster() {
  const toasts = useToasts();

  return (
    <RadixToast.Provider swipeDirection="right">
      {toasts.map(({ id, title, description, variant, duration }) => (
        <RadixToast.Root
          key={id}
          data-fds-toast
          duration={duration}
          onOpenChange={(open) => {
            if (!open) dismissToast(id);
          }}
          className={cn("relative rounded-md border p-4 pr-8 shadow-md", variantClass[variant])}
        >
          <RadixToast.Title className="text-sm font-medium">{title}</RadixToast.Title>
          {description && (
            <RadixToast.Description className="mt-1 text-sm opacity-80">
              {description}
            </RadixToast.Description>
          )}
          <RadixToast.Close
            aria-label="닫기"
            className="absolute top-2 right-2 inline-flex h-5 w-5 items-center justify-center rounded text-current opacity-60 transition-opacity hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
          >
            <CloseIcon />
          </RadixToast.Close>
        </RadixToast.Root>
      ))}
      <RadixToast.Viewport className="fixed right-4 bottom-4 z-50 flex w-80 flex-col gap-2 outline-none" />
    </RadixToast.Provider>
  );
}

export { toast } from "./toast-store";
export type { ToastVariant } from "./toast-store";
