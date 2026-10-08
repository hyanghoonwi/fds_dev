import type { ComponentProps } from "react";
import { cn } from "../../utils/cn";

export interface ThumbnailProps extends ComponentProps<"div"> {
  src?: string;
  alt?: string;
}

// 이미지가 없으면(로딩 전/미제공) bg-base 박스만 자리를 차지한다 (Figma 408:4889)
export function Thumbnail({ src, alt = "", className, ref, ...props }: ThumbnailProps) {
  return (
    <div
      ref={ref}
      className={cn("h-[60px] w-[110px] shrink-0 overflow-hidden rounded-6 bg-bg-base", className)}
      {...props}
    >
      {src && <img className="size-full object-cover" src={src} alt={alt} />}
    </div>
  );
}
