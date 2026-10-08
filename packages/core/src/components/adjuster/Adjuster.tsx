import React from "react";
import { cn } from "../../utils/cn";
import { MinusIcon } from "../icon/MinusIcon";
import { PlusIcon } from "../icon/PlusIcon";

export type AdjusterType = "fontSize";

export interface AdjusterProps {
  type: AdjusterType;
  onDecrease: () => void;
  onIncrease: () => void;
  decreaseDisabled?: boolean;
  increaseDisabled?: boolean;
  className?: string;
  ref?: React.Ref<HTMLDivElement>;
}

function renderStepContent(type: AdjusterType, direction: "decrease" | "increase") {
  switch (type) {
    case "fontSize":
      return direction === "decrease" ? (
        <>
          <span className="text-xs font-normal">가</span>
          <MinusIcon />
        </>
      ) : (
        <>
          <span className="text-xs font-semibold">가</span>
          <PlusIcon />
        </>
      );
    default:
      return null;
  }
}

export function Adjuster({
  type,
  onDecrease,
  onIncrease,
  decreaseDisabled,
  increaseDisabled,
  className,
  ref,
}: AdjusterProps) {
  return (
    <div
      ref={ref}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-4 border border-border-line bg-bg-surface p-1 text-text-tertiary",
        className,
      )}
    >
      <button
        type="button"
        className="inline-flex items-center gap-1 border-none bg-transparent p-0 font-fds tracking-[2.52px] leading-[1.334] text-inherit cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
        onClick={onDecrease}
        disabled={decreaseDisabled}
        aria-label="감소"
      >
        {renderStepContent(type, "decrease")}
      </button>
      <span className="h-2.5 w-px bg-border-strong" />
      <button
        type="button"
        className="inline-flex items-center gap-1 border-none bg-transparent p-0 font-fds tracking-[2.52px] leading-[1.334] text-inherit cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
        onClick={onIncrease}
        disabled={increaseDisabled}
        aria-label="증가"
      >
        {renderStepContent(type, "increase")}
      </button>
    </div>
  );
}
