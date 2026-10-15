import type { ComponentProps, ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../utils/cn";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-10 border font-fds font-semibold cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:pointer-events-none",
  {
    variants: {
      // 높이: sm 28 · md 36 · lg 44 · xl 52px
      size: {
        sm: "gap-1.5 rounded-8 px-2.5 py-[5px] text-xs leading-[1.334] tracking-[0.0252em] [&_svg]:size-4",
        md: "gap-2.5 px-3 py-2 text-[13px] leading-[1.385] tracking-[0.0194em]",
        lg: "gap-2.5 px-4 py-[11px] text-sm leading-[1.429] tracking-[0.0145em] [&_svg]:size-5",
        xl: "gap-3 px-5 py-[13px] text-base leading-normal tracking-[0.0057em] [&_svg]:size-6",
      },
      variant: {
        line: "border-line-2 bg-bg-surface text-text-tertiary hover:border-line-1 hover:bg-bg-blue-tint hover:text-brand-primary active:border-line-1 active:bg-bg-blue-tint active:text-brand-primary",
        primary: "border-transparent bg-brand-primary text-text-inverse",
        tint: "border-bg-blue-tint bg-bg-blue-tint text-brand-primary",
        // 차단처럼 되돌리기 어렵거나 부정적인 동작용
        danger: "border-transparent bg-brand-error text-text-inverse",
      },
    },
    defaultVariants: {
      size: "md",
      variant: "line",
    },
  },
);

export interface ButtonProps extends ComponentProps<"button">, VariantProps<typeof buttonVariants> {
  /** 텍스트 앞에 붙는 아이콘 슬롯 */
  icon?: ReactNode;
}

export function Button({
  className,
  size,
  variant,
  icon,
  children,
  type = "button",
  ref,
  ...props
}: ButtonProps) {
  return (
    <button
      ref={ref}
      type={type}
      className={cn(buttonVariants({ size, variant }), className)}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
}
