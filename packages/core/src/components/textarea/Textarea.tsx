import type React from "react";
import { useId, useLayoutEffect, useRef } from "react";
import { cn } from "../../utils/cn";

export interface TextareaProps extends Omit<
  React.ComponentProps<"textarea">,
  "value" | "onChange"
> {
  value: string;
  onChange: (value: string) => void;
  /** 자동 확장 최대 높이(px). 필드 박스 전체 높이 기준이며 글자수 표시 영역은 포함하지 않는다. Figma SearchBar max-height 86 */
  maxHeight?: number;
  /**
   * 입력창 아래 왼쪽에 글자수를 `현재/최대`로 표시한다.
   * 최대값은 `maxLength`를 쓰고, `maxLength`가 없으면 현재 글자수만 표시한다.
   */
  showCount?: boolean;
  /** 필드 박스·글자수를 감싸는 바깥 컨테이너의 클래스. `className`은 `<textarea>`에만 적용된다. */
  containerClassName?: string;
}

// 필드 박스의 위아래 패딩 합(p-2.5 × 2). maxHeight는 박스 기준이라 textarea 높이에서 이만큼 뺀다.
const FIELD_PADDING_Y = 20;

// Figma Text Field(408:3685)의 입력 영역 — 채팅 입력창처럼 내용에 맞춰 높이가 늘어난다.
export function Textarea({
  value,
  onChange,
  maxHeight = 86,
  showCount = false,
  maxLength,
  containerClassName,
  className,
  ref,
  "aria-describedby": describedBy,
  ...props
}: TextareaProps) {
  const innerRef = useRef<HTMLTextAreaElement>(null);
  const countId = useId();
  const textareaMaxHeight = Math.max(maxHeight - FIELD_PADDING_Y, 0);

  useLayoutEffect(() => {
    const el = innerRef.current;
    if (!el) {
      return;
    }
    el.style.height = "0px";
    el.style.height = `${Math.min(el.scrollHeight, textareaMaxHeight)}px`;
  }, [value, textareaMaxHeight]);

  // 글자수는 `maxLength`가 세는 방식(UTF-16 코드 유닛)과 같게 `value.length`로 센다.
  const count = value.length;
  const overLimit = maxLength !== undefined && count > maxLength;

  // 박스 안쪽 여백을 눌러도 입력창에 포커스가 가도록 한다
  const focusTextarea = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target !== innerRef.current) {
      event.preventDefault();
      innerRef.current?.focus();
    }
  };

  return (
    <div className={cn("flex w-full flex-col gap-1.5", containerClassName)}>
      <div
        onMouseDown={focusTextarea}
        className={cn(
          "flex w-full flex-col rounded-12 bg-bg-page p-2.5 ring-inset focus-within:ring-1 focus-within:ring-brand-primary",
          props.disabled && "cursor-not-allowed opacity-50",
        )}
      >
        <textarea
          ref={(node) => {
            innerRef.current = node;
            if (typeof ref === "function") {
              ref(node);
            } else if (ref) {
              ref.current = node;
            }
          }}
          className={cn(
            "box-border w-full resize-none overflow-auto bg-transparent font-fds text-sm leading-[1.571] tracking-[0.0145em] text-text-primary caret-brand-primary outline-none",
            "placeholder:text-text-tertiary",
            "disabled:cursor-not-allowed",
            className,
          )}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          maxLength={maxLength}
          aria-describedby={
            [showCount && countId, describedBy].filter(Boolean).join(" ") || undefined
          }
          rows={1}
          style={{ maxHeight: textareaMaxHeight }}
          {...props}
        />
      </div>
      {showCount && (
        <span
          id={countId}
          className={cn(
            "self-start font-fds text-caption-2 tabular-nums",
            overLimit ? "text-brand-error" : "text-text-caption",
          )}
        >
          {maxLength === undefined ? count : `${count}/${maxLength}`}
        </span>
      )}
    </div>
  );
}
