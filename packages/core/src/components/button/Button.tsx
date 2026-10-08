import type { ComponentProps, ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../utils/cn";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2.5 rounded-10 border px-3 py-2 font-fds text-[13px] leading-[1.385] font-semibold tracking-[0.0194em] cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:pointer-events-none",
  {
    variants: {
      variant: {
        line: "border-line-2 bg-bg-surface text-text-tertiary hover:border-line-1 hover:bg-bg-blue-tint hover:text-brand-primary active:border-line-1 active:bg-bg-blue-tint active:text-brand-primary",
        primary: "border-transparent bg-brand-primary text-text-inverse",
        tint: "border-bg-blue-tint bg-bg-blue-tint text-brand-primary",
        // 차단처럼 되돌리기 어렵거나 부정적인 동작용
        danger: "border-transparent bg-brand-error text-text-inverse",
      },
    },
    defaultVariants: {
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
  variant,
  icon,
  children,
  type = "button",
  ref,
  ...props
}: ButtonProps) {
  return (
    <button ref={ref} type={type} className={cn(buttonVariants({ variant }), className)} {...props}>
      {icon}
      {children}
    </button>
  );
}
