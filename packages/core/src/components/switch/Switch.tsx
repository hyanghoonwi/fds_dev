import type { ComponentProps } from "react";
import { cn } from "../../utils/cn";

export interface SwitchProps extends Omit<
  ComponentProps<"button">,
  "onChange" | "role" | "children"
> {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export function Switch({ checked, onChange, className, ref, ...props }: SwitchProps) {
  return (
    <button
      ref={ref}
      type="button"
      role="switch"
      aria-checked={checked}
      className={cn(
        "relative h-[30px] w-[50px] shrink-0 cursor-pointer rounded-full border-none p-0 transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-50",
        checked ? "bg-brand-primary" : "bg-switch-track-off",
        className,
      )}
      onClick={() => onChange(!checked)}
      {...props}
    >
      <span
        className={cn(
          "absolute top-[3px] left-[3px] size-6 rounded-full bg-white transition-transform duration-150",
          checked && "translate-x-5",
        )}
      />
    </button>
  );
}
