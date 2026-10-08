import { useId, useState } from "react";
import { PickerTriggerInput } from "../_internal/PickerTriggerInput";
import type { PickerInputProps } from "../_internal/PickerTriggerInput";
import { Calendar } from "../calendar/Calendar";
import { formatDateValue, parseDateValue } from "../calendar/dateValue";
import { CalendarIcon } from "../icon/CalendarIcon";
import { Popover } from "../popover/Popover";

export interface DatePickerProps extends PickerInputProps {
  /** 선택된 날짜 `YYYY-MM-DD` (제어 모드). `null`은 "선택 안 함". */
  value?: string | null;
  /** 초기 날짜 `YYYY-MM-DD` (비제어 모드) */
  defaultValue?: string | null;
  /** 날짜를 바꿨을 때 `YYYY-MM-DD`로 호출된다. */
  onChange?: (value: string) => void;
  /** 선택할 수 있는 가장 이른 날짜 `YYYY-MM-DD` (포함) */
  min?: string;
  /** 선택할 수 있는 가장 늦은 날짜 `YYYY-MM-DD` (포함) */
  max?: string;
  /** `true`를 반환한 날짜는 선택할 수 없다 (예: 주말, 휴무일). 로컬 자정의 `Date`가 넘어온다. */
  isDateDisabled?: (date: Date) => boolean;
}

// `Input` + `Popover` + `Calendar`를 미리 조합해 둔 편의 컴포넌트다. 새로 만든 로직은 없다.
// 다른 트리거나 배치가 필요하면 같은 세 요소를 직접 조합하면 된다 (Popover 스토리 참고).
// 입력창에는 값 문자열(`2026-10-08`)이 그대로 들어가므로 `name`으로 폼에 제출하거나 `ref.current.value`로 읽을 수 있다.
export function DatePicker({
  value,
  defaultValue = null,
  onChange,
  min,
  max,
  isDateDisabled,
  placeholder = "날짜 선택",
  id,
  ...inputProps
}: DatePickerProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const [open, setOpen] = useState(false);
  const [innerValue, setInnerValue] = useState<string | null>(defaultValue);

  // 형식이 잘못된 값은 선택 안 함으로 보고, 입력창에는 정규화된 문자열만 표시한다
  const raw = value !== undefined ? value : innerValue;
  const parsed = raw ? parseDateValue(raw) : null;
  const selected = parsed ? formatDateValue(parsed) : null;

  const handleChange = (next: string) => {
    if (value === undefined) {
      setInnerValue(next);
    }
    onChange?.(next);
  };

  return (
    <Popover
      open={open}
      onOpenChange={setOpen}
      label="날짜 선택"
      trigger={({ open: isOpen, toggle, anchorRef, popupId }) => (
        <PickerTriggerInput
          {...inputProps}
          id={inputId}
          placeholder={placeholder}
          displayValue={selected ?? ""}
          icon={<CalendarIcon />}
          triggerLabel="달력 열기"
          open={isOpen}
          toggle={toggle}
          anchorRef={anchorRef}
          popupId={popupId}
        />
      )}
    >
      {({ close }) => (
        <Calendar
          autoFocus
          value={selected}
          onChange={handleChange}
          // 이미 선택된 날짜를 다시 눌러도 팝업을 닫고 입력창으로 포커스를 돌려준다
          onSelect={() => {
            close();
            document.getElementById(inputId)?.focus();
          }}
          min={min}
          max={max}
          isDateDisabled={isDateDisabled}
        />
      )}
    </Popover>
  );
}
