import React from "react";
import { cn } from "../../utils/cn";

export interface BadgeProps extends Omit<React.ComponentProps<"span">, "children"> {
  children: React.ReactNode;
}

export function Badge({ className, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center whitespace-nowrap rounded-4 bg-bg-base px-1 py-0.5 font-fds text-[11px] font-semibold text-text-primary",
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
