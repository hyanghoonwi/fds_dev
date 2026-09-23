import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/utils/cn";

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-full px-2 py-0.5 text-xs font-medium",
  {
    variants: {
      variant: {
        default: "bg-gray-100 text-gray-700",
        primary: "bg-black text-white",
        success: "bg-green-100 text-green-700",
        warning: "bg-amber-100 text-amber-700",
        danger: "bg-red-100 text-red-700",
        neutral: "bg-gray-100 text-gray-500",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, "children">,
    VariantProps<typeof badgeVariants> {
  label: React.ReactNode;
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant, label, ...props }, ref) => (
    <span ref={ref} className={cn(badgeVariants({ variant, className }))} {...props}>
      {label}
    </span>
  ),
);

Badge.displayName = "Badge";
