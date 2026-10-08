import React, { useRef } from "react";
import { cn } from "../../utils/cn";
import { UnfoldMoreIcon } from "../icon/UnfoldMoreIcon";

export type ResizeHandleType = "bar" | "circle";

export interface ResizeHandleProps extends Omit<React.ComponentProps<"div">, "children"> {
  type?: ResizeHandleType;
  /** 드래그 중 이전 위치 대비 이동량(px). bar는 가로(clientX), circle은 세로(clientY) */
  onResize: (delta: number) => void;
}

export function ResizeHandle({
  type = "bar",
  onResize,
  className,
  ref,
  ...props
}: ResizeHandleProps) {
  const lastPosRef = useRef(0);
  const isCircle = type === "circle";

  const getPos = (event: React.PointerEvent<HTMLDivElement>) =>
    isCircle ? event.clientY : event.clientX;

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    lastPosRef.current = getPos(event);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.buttons !== 1) {
      return;
    }
    const pos = getPos(event);
    const delta = pos - lastPosRef.current;
    lastPosRef.current = pos;
    onResize(delta);
  };

  if (isCircle) {
    // Figma 784:3047 / 784:3053 — 12px 바 위에 24px 원형 그립
    return (
      <div
        {...props}
        ref={ref}
        className={cn(
          "group relative flex h-3 w-full cursor-row-resize touch-none items-center justify-center bg-bg-base",
          className,
        )}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
      >
        <div
          className={cn(
            "pointer-events-none absolute top-1/2 left-1/2 flex size-6 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-border-line bg-bg-surface text-text-timestamp shadow-[0_2px_2px_rgba(0,0,0,0.05)] transition-colors",
            "group-hover:border-line-1 group-hover:bg-bg-blue-tint group-hover:text-brand-primary",
            "group-active:border-line-1 group-active:bg-bg-blue-tint group-active:text-brand-primary",
          )}
        >
          <UnfoldMoreIcon size={16} />
        </div>
      </div>
    );
  }

  // Figma 784:3032 — 4×40 바, 기본 text-disabled / pressed brand-primary
  return (
    <div
      {...props}
      ref={ref}
      className={cn(
        "group flex h-full w-3 cursor-col-resize touch-none items-center justify-center rounded-4",
        className,
      )}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
    >
      <div className="pointer-events-none h-10 w-1 rounded-4 bg-text-disabled transition-colors group-active:bg-brand-primary" />
    </div>
  );
}
