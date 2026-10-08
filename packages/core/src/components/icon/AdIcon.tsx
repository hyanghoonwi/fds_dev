import type { ComponentProps } from "react";
import { cn } from "../../utils/cn";

export type AdIconProps = ComponentProps<"span">;

// children은 "Ad" 뒤에 이어 붙는다(AdCrossIcon의 X 오버레이용).
// 다른 아이콘과 달리 벡터가 아니라 "Ad" 텍스트가 박힌 20x20 배지다 (Figma 39:459).
export function AdIcon({ className, children, ...props }: AdIconProps) {
  return (
    <span
      className={cn(
        "box-border inline-flex size-5 items-center justify-center rounded-6 border border-border-default bg-bg-base p-[3px] font-fds text-xs font-medium whitespace-nowrap text-foundation-grey-700",
        className,
      )}
      {...props}
    >
      Ad
      {children}
    </span>
  );
}
