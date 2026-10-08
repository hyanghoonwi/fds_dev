import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../utils/cn";

const dotVariants = cva("size-1.5 shrink-0 rounded-[3px]", {
  variants: {
    status: {
      live: "bg-brand-error",
      offline: "bg-border-strong",
    },
  },
  defaultVariants: {
    status: "live",
  },
});

export interface LiveBadgeProps extends VariantProps<typeof dotVariants> {
  label?: string;
  className?: string;
  ref?: React.Ref<HTMLSpanElement>;
}

// 영상 위에 얹히는 용도라 텍스트는 테마 무관 항상 흰색
export function LiveBadge({ status = "live", label = "LIVE", className, ref }: LiveBadgeProps) {
  return (
    <span
      ref={ref}
      className={cn(
        "inline-flex items-center gap-1 font-fds text-xs font-semibold text-white",
        className,
      )}
    >
      <span className={cn(dotVariants({ status }))} />
      {label}
    </span>
  );
}
