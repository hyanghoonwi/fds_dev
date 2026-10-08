import type { ReactNode, RefCallback } from "react";
import { cn } from "../../utils/cn";
import { Input } from "../input/Input";
import type { InputProps } from "../input/Input";

// DatePicker / TimePicker가 공유하는 트리거: "읽기 전용 Input + 오른쪽 아이콘 버튼".
// 라이브러리 밖으로 export하지 않는 내부 컴포넌트다. Popover와는 props(open, toggle, anchorRef, popupId)로만 이어진다.
export type PickerInputProps = Omit<
  InputProps,
  | "value"
  | "defaultValue"
  | "onChange"
  | "readOnly"
  | "leftAddon"
  | "rightAddon"
  | "children"
  | "fieldRef"
  | "min"
  | "max"
>;

interface PickerTriggerInputProps extends PickerInputProps {
  /** 입력창에 보여줄 문자열 (예: "2026-10-06", "14:30") */
  displayValue: string;
  /** 오른쪽 트리거 아이콘 */
  icon: ReactNode;
  /** 트리거 버튼의 접근성 이름 (예: "달력 열기") */
  triggerLabel: string;
  open: boolean;
  toggle: () => void;
  anchorRef: RefCallback<HTMLElement>;
  popupId: string;
}

export function PickerTriggerInput({
  displayValue,
  icon,
  triggerLabel,
  open,
  toggle,
  anchorRef,
  popupId,
  className,
  ...inputProps
}: PickerTriggerInputProps) {
  const handleToggle = () => !inputProps.disabled && toggle();

  return (
    <Input
      {...inputProps}
      readOnly
      value={displayValue}
      fieldRef={anchorRef}
      onClick={handleToggle}
      aria-haspopup="dialog"
      aria-expanded={open}
      aria-controls={open ? popupId : undefined}
      className={cn("cursor-pointer", className)}
      rightAddon={
        <button
          type="button"
          aria-label={triggerLabel}
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-controls={open ? popupId : undefined}
          disabled={inputProps.disabled}
          onClick={handleToggle}
          className="flex cursor-pointer items-center text-text-icon-default disabled:cursor-not-allowed [&>svg]:size-5"
        >
          {icon}
        </button>
      }
    />
  );
}
