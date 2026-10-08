import React from "react";
import { cn } from "../../utils/cn";

export interface ProgressBarProps extends Omit<
  React.ComponentProps<"div">,
  "onChange" | "children"
> {
  /** 0 ~ 100 */
  value: number;
  onChange?: (value: number) => void;
}

export function ProgressBar({ value, onChange, className, ref, ...props }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));
  const isInteractive = Boolean(onChange);

  const updateFromClientX = (track: HTMLDivElement, clientX: number) => {
    const rect = track.getBoundingClientRect();
    const ratio = (clientX - rect.left) / rect.width;
    onChange?.(Math.min(100, Math.max(0, ratio * 100)));
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!onChange) {
      return;
    }
    event.currentTarget.setPointerCapture(event.pointerId);
    updateFromClientX(event.currentTarget, event.clientX);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!onChange || event.buttons !== 1) {
      return;
    }
    updateFromClientX(event.currentTarget, event.clientX);
  };

  return (
    <div
      {...props}
      ref={ref}
      className={cn(
        "group relative h-1.5 w-full touch-none rounded-full bg-border-default",
        isInteractive && "cursor-pointer",
        className,
      )}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
    >
      <div
        className="absolute top-0 left-0 h-1.5 rounded-full bg-brand-primary"
        style={{ width: `${clamped}%` }}
      />
      {/* 썸: 기본 10px → hover/pressed 16px. 왼쪽 끝은 고정하고 세로 중심만 유지한다 (Figma 784:3018 / 784:3025) */}
      <div
        className={cn(
          "absolute top-[-2px] size-2.5 rounded-full bg-brand-primary transition-[width,height,top]",
          isInteractive &&
            "group-hover:top-[-5px] group-hover:size-4 group-active:top-[-5px] group-active:size-4",
        )}
        style={{ left: `calc(${clamped}% - 10px)` }}
      />
    </div>
  );
}
