import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/utils/cn";

const alertVariants = cva("flex gap-3 rounded-md border p-4 text-sm", {
  variants: {
    variant: {
      info: "border-blue-200 bg-blue-50 text-blue-900",
      success: "border-green-200 bg-green-50 text-green-900",
      warning: "border-amber-200 bg-amber-50 text-amber-900",
      error: "border-red-200 bg-red-50 text-red-900",
    },
  },
  defaultVariants: {
    variant: "info",
  },
});

const iconClass = "mt-0.5 h-4 w-4 shrink-0";

const icons: Record<NonNullable<VariantProps<typeof alertVariants>["variant"]>, React.ReactNode> = {
  info: (
    <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 16v-4M12 8h.01" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  success: (
    <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="9" />
      <path d="m8 12 3 3 5-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  warning: (
    <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 3 2 20h20L12 3Z" strokeLinejoin="round" />
      <path d="M12 10v4M12 17h.01" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  error: (
    <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="9" />
      <path d="m9.5 9.5 5 5m0-5-5 5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
};

export interface AlertProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title">,
    VariantProps<typeof alertVariants> {
  title: React.ReactNode;
  description?: React.ReactNode;
}

export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant = "info", title, description, ...props }, ref) => (
    <div ref={ref} role="alert" className={cn(alertVariants({ variant, className }))} {...props}>
      {icons[variant ?? "info"]}
      <div className="flex flex-col gap-0.5">
        <p className="font-medium">{title}</p>
        {description && <p className="text-sm opacity-80">{description}</p>}
      </div>
    </div>
  ),
);

Alert.displayName = "Alert";
