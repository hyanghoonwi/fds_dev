import type { ComponentProps } from "react";
import { cn } from "../../utils/cn";
import { ChevronDownIcon } from "../icon/ChevronDownIcon";

export interface NewMessagePreviewProps extends Omit<ComponentProps<"div">, "children"> {
  nickname: string;
  message: string;
  /** 스트리머/매니저처럼 강조 대상인 발신자는 닉네임을 브랜드 컬러로 (Figma 47:1473), 일반 유저는 무채색 (47:1483) */
  isNicknameHighlighted?: boolean;
}

// 스크롤을 올린 상태에서 새 메시지가 도착하면 뜨는 미리보기 바
export function NewMessagePreview({
  nickname,
  message,
  isNicknameHighlighted,
  onClick,
  className,
  ref,
  ...props
}: NewMessagePreviewProps) {
  return (
    <div
      ref={ref}
      role="button"
      tabIndex={0}
      className={cn(
        "box-border flex cursor-pointer items-center justify-between gap-2 rounded-10 border border-border-light bg-bg-surface p-2.5 shadow-[0_1px_5px_rgba(0,0,0,0.2)]",
        className,
      )}
      onClick={onClick}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          event.currentTarget.click();
        }
      }}
      {...props}
    >
      <div className="flex min-w-0 flex-1 items-center gap-1">
        <strong
          className={cn(
            "shrink-0 font-fds text-sm font-semibold",
            isNicknameHighlighted ? "text-brand-primary" : "text-text-sub",
          )}
        >
          {nickname}
        </strong>
        <span className="min-w-0 flex-1 truncate font-fds text-sm font-normal text-text-primary">
          {message}
        </span>
      </div>
      <ChevronDownIcon size={16} className="shrink-0 text-text-icon-default" />
    </div>
  );
}
