import React from "react";
import { cn } from "@/utils/cn";

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "size"> {
  /** 체크박스 옆에 표시할 라벨 */
  label?: React.ReactNode;
  /** 일부만 선택된 상태(전체선택 체크박스 등). 네이티브 checked와 별개로 다룬다 */
  indeterminate?: boolean;
}

// indeterminate는 HTML attribute가 아니라 DOM 프로퍼티라서 JSX로 못 넘기고
// ref를 통해 직접 DOM에 세팅해야 한다.
export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, indeterminate = false, id, disabled, ...props }, forwardedRef) => {
    const generatedId = React.useId();
    const checkboxId = id ?? generatedId;
    const internalRef = React.useRef<HTMLInputElement>(null);

    React.useEffect(() => {
      if (internalRef.current) {
        internalRef.current.indeterminate = indeterminate;
      }
    }, [indeterminate]);

    const setRefs = (node: HTMLInputElement | null) => {
      internalRef.current = node;
      if (typeof forwardedRef === "function") forwardedRef(node);
      else if (forwardedRef) forwardedRef.current = node;
    };

    return (
      <label
        htmlFor={checkboxId}
        className={cn(
          "inline-flex items-center gap-2 text-sm text-gray-900",
          disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer",
        )}
      >
        <input
          id={checkboxId}
          ref={setRefs}
          type="checkbox"
          disabled={disabled}
          className={cn(
            "h-4 w-4 rounded border-gray-300 text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black disabled:cursor-not-allowed",
            className,
          )}
          {...props}
        />
        {label}
      </label>
    );
  },
);

Checkbox.displayName = "Checkbox";
