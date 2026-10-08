import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../utils/cn";

const chatBubbleVariants = cva(
  "inline-flex items-end gap-2 px-[14px] py-[10px] max-w-[260px] font-fds text-[12px] leading-[1.5] break-words [overflow-wrap:anywhere] whitespace-pre-wrap",
  {
    variants: {
      variant: {
        received: "rounded-[0_20px_20px_20px] bg-bg-base text-text-primary",
        sent: "rounded-[20px_20px_0_20px] bg-brand-primary text-text-inverse",
      },
    },
    defaultVariants: {
      variant: "received",
    },
  },
);

export interface ChatBubbleProps
  extends Omit<React.ComponentProps<"div">, "children">, VariantProps<typeof chatBubbleVariants> {
  children: React.ReactNode;
}

export function ChatBubble({ className, variant, children, ...props }: ChatBubbleProps) {
  return (
    <div className={cn(chatBubbleVariants({ variant, className }))} {...props}>
      {children}
    </div>
  );
}
