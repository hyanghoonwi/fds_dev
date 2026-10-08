import type { ComponentProps } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../utils/cn";

const iconButtonVariants = cva(
  "inline-flex shrink-0 items-center justify-center rounded-full border cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:pointer-events-none",
  {
    variants: {
      size: {
        sm: "size-9",
        md: "size-10",
      },
      variant: {
        line: "border-line-2 bg-bg-elevated text-text-icon-default hover:border-line-1 hover:bg-bg-blue-tint hover:text-brand-primary active:border-line-1 active:bg-bg-blue-tint active:text-brand-primary",
        primary:
          "border-transparent bg-brand-primary text-text-inverse hover:bg-foundation-blue-400 active:bg-foundation-blue-400",
        tint: "border-bg-blue-tint bg-bg-blue-tint text-brand-primary",
        /** 광고 상태 표시. "Ad" 마크가 내장되어 있어 children이 필요 없다 */
        ad: "border-line-2 bg-bg-surface",
      },
    },
    defaultVariants: {
      size: "sm",
      variant: "line",
    },
  },
);

export interface IconButtonProps
  extends ComponentProps<"button">, VariantProps<typeof iconButtonVariants> {}

export function IconButton({
  className,
  size,
  variant,
  children,
  type = "button",
  ref,
  ...props
}: IconButtonProps) {
  return (
    <button
      ref={ref}
      type={type}
      className={cn(iconButtonVariants({ size, variant }), className)}
      {...props}
    >
      {variant === "ad" ? (
        <span className="flex size-5 items-center justify-center rounded-6 border border-border-default bg-bg-base p-[3px] font-fds text-xs font-medium text-text-icon-default">
          Ad
        </span>
      ) : (
        children
      )}
    </button>
  );
}
