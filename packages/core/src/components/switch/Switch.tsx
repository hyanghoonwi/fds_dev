import type { ComponentProps } from "react";
import { cn } from "../../utils/cn";
import type { ComponentSize } from "../_internal/fieldSize";

// 트랙 크기(sm 40×24 · md 50×30 · lg 60×36 · xl 70×42px)와 썸 크기·이동 거리. 썸은 항상 가장자리에서 3px 떨어진다.
const switchSizes: Record<ComponentSize, { track: string; thumb: string; shift: string }> = {
  sm: { track: "h-6 w-10", thumb: "size-[18px]", shift: "translate-x-4" },
  md: { track: "h-[30px] w-[50px]", thumb: "size-6", shift: "translate-x-5" },
  lg: { track: "h-9 w-[60px]", thumb: "size-[30px]", shift: "translate-x-6" },
  xl: { track: "h-[42px] w-[70px]", thumb: "size-9", shift: "translate-x-7" },
};

export interface SwitchProps extends Omit<
  ComponentProps<"button">,
  "onChange" | "role" | "children"
> {
  /** 크기. 기본 `md` */
  size?: ComponentSize;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export function Switch({ checked, onChange, size = "md", className, ref, ...props }: SwitchProps) {
  return (
    <button
      ref={ref}
      type="button"
      role="switch"
      aria-checked={checked}
      className={cn(
        "relative shrink-0 cursor-pointer rounded-full border-none p-0 transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-50",
        switchSizes[size].track,
        checked ? "bg-brand-primary" : "bg-switch-track-off",
        className,
      )}
      onClick={() => onChange(!checked)}
      {...props}
    >
      <span
        className={cn(
          "absolute top-[3px] left-[3px] rounded-full bg-white transition-transform duration-150",
          switchSizes[size].thumb,
          checked && switchSizes[size].shift,
        )}
      />
    </button>
  );
}
