import type { ComponentProps, ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../utils/cn";

// 색은 시맨틱 토큰만 쓴다 — 다크 모드는 [data-theme="dark"]에서 값만 바뀐다 (styles/colors.css).
const badgeVariants = cva("inline-flex items-center whitespace-nowrap font-fds font-semibold", {
  variants: {
    size: {
      sm: "rounded-4 px-[3px] py-0 text-[10px]",
      md: "rounded-4 px-1 py-0.5 text-[11px]",
      lg: "rounded-6 px-1.5 py-0.5 text-xs",
      xl: "rounded-6 px-2 py-1 text-[13px]",
    },
    variant: {
      // 대기·중립 (기본값)
      neutral: "bg-bg-base text-text-primary",
      // 진행·안내
      info: "bg-bg-blue-tint text-brand-primary",
      // 정상·완료·승인
      success: "bg-bg-success-tint text-brand-success",
      // 주의·지연·확정 필요
      warning: "bg-bg-warning-tint text-brand-warning",
      // 오류·거절·반려
      danger: "bg-bg-error-tint text-brand-error",
      // 특별·검증
      purple: "bg-bg-purple-tint text-brand-purple",
    },
  },
  defaultVariants: {
    size: "md",
    variant: "neutral",
  },
});

export type BadgeVariant = NonNullable<VariantProps<typeof badgeVariants>["variant"]>;

export interface BadgeProps
  extends Omit<ComponentProps<"span">, "children">, VariantProps<typeof badgeVariants> {
  children: ReactNode;
}

export function Badge({ className, size, variant, children, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ size, variant }), className)} {...props}>
      {children}
    </span>
  );
}
