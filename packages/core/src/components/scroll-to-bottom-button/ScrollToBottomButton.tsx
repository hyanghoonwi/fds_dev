import type React from "react";
import { cn } from "../../utils/cn";
import { ArrowDownIcon } from "../icon/ArrowDownIcon";

export type ScrollToBottomButtonProps = React.ComponentProps<"button">;

// 테마와 무관하게 항상 다크 네이비 배경 — Figma 408:3728: bg deepblue-500, 화살표 grey-50, hover/pressed deepblue-400
export function ScrollToBottomButton({ className, ...props }: ScrollToBottomButtonProps) {
  return (
    <button
      type="button"
      aria-label="맨 아래로 이동"
      className={cn(
        "flex size-8 cursor-pointer items-center justify-center rounded-full border-none bg-foundation-deepblue-500 text-foundation-grey-50 transition-colors hover:bg-foundation-deepblue-400 active:bg-foundation-deepblue-400",
        className,
      )}
      {...props}
    >
      <ArrowDownIcon size={32} />
    </button>
  );
}
