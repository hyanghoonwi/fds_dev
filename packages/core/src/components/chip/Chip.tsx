import type { ComponentProps, ReactNode } from "react";
import { cn } from "../../utils/cn";
import { CloseIcon } from "../icon/CloseIcon";

export interface ChipProps extends Omit<ComponentProps<"span">, "children"> {
  /** 칩에 보이는 문구 */
  label: ReactNode;
  /**
   * 주면 오른쪽에 삭제(×) 버튼이 생기고, 누르면 호출된다. 생략하면 보기만 하는 칩이다.
   * 칩을 실제로 지우는 일(목록에서 빼기)은 앱이 한다.
   */
  onRemove?: () => void;
  /** 삭제 버튼의 접근성 이름. 기본은 `label`이 문자열이면 "<label> 삭제", 아니면 "삭제" */
  removeLabel?: string;
  /** 삭제 버튼을 비활성화하고 흐리게 보인다. */
  disabled?: boolean;
}

/**
 * 선택한 값이나 태그를 작은 알약 모양으로 보여 주는 요소. `Select multiple`이 고른 값을 아래에 쌓을 때 쓰고,
 * 해시태그·필터 조건 같은 곳에도 그대로 쓸 수 있다.
 */
export function Chip({
  label,
  onRemove,
  removeLabel,
  disabled,
  className,
  ref,
  ...props
}: ChipProps) {
  const accessibleRemoveLabel =
    removeLabel ?? (typeof label === "string" ? `${label} 삭제` : "삭제");

  return (
    <span
      ref={ref}
      className={cn(
        "inline-flex max-w-full items-center gap-1 rounded-8 border border-line-2 bg-bg-surface py-0.5 font-fds text-caption-1 text-text-primary",
        onRemove ? "pr-1.5 pl-2" : "px-2",
        disabled && "opacity-50",
        className,
      )}
      {...props}
    >
      <span className="truncate">{label}</span>
      {onRemove && (
        <button
          type="button"
          disabled={disabled}
          aria-label={accessibleRemoveLabel}
          onClick={onRemove}
          className="flex shrink-0 cursor-pointer items-center rounded-full text-text-icon-default hover:text-text-primary focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-brand-primary disabled:cursor-not-allowed"
        >
          <CloseIcon aria-hidden="true" size={10} />
        </button>
      )}
    </span>
  );
}
