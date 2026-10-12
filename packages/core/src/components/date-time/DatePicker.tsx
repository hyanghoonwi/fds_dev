import { useControllableState } from "../../utils/useControllableState";
import { PickerField } from "./_internal/PickerField";
import type { PickerInputProps } from "./_internal/PickerTriggerInput";
import { Calendar } from "./Calendar";
import { CalendarIcon } from "../icon/CalendarIcon";
import { normalizeDateValue } from "./values";

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
  /** 선택된 날짜가 없을 때 달력이 처음 보여 줄 달 `YYYY-MM`. 기본은 이번 달 */
  initialMonth?: string;
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
  initialMonth,
  placeholder = "날짜 선택",
  ...inputProps
}: DatePickerProps) {
  const [raw, setValue] = useControllableState<string | null>(
    value,
    defaultValue,
    (next) => next && onChange?.(next),
  );
  // 형식이 잘못된 값은 선택 안 함으로 보고, 입력창에는 정규화된 문자열만 표시한다
  const selected = normalizeDateValue(raw);

  return (
    <PickerField
      {...inputProps}
      placeholder={placeholder}
      displayValue={selected ?? ""}
      icon={<CalendarIcon />}
      triggerLabel="달력 열기"
      popupLabel="날짜 선택"
    >
      {({ close }) => (
        <Calendar
          autoFocus
          value={selected}
          onChange={setValue}
          // 이미 선택된 날짜를 다시 눌러도 팝업을 닫고 입력창으로 포커스를 돌려준다
          onSelect={close}
          min={min}
          max={max}
          isDateDisabled={isDateDisabled}
          initialMonth={initialMonth}
        />
      )}
    </PickerField>
  );
}
