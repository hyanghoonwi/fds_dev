import { useId, useState } from "react";
import { PickerTriggerInput } from "../_internal/PickerTriggerInput";
import type { PickerInputProps } from "../_internal/PickerTriggerInput";
import { Button } from "../button/Button";
import { Calendar } from "../calendar/Calendar";
import { CalendarIcon } from "../icon/CalendarIcon";
import { Popover } from "../popover/Popover";
import { TimePanel } from "../time-panel/TimePanel";
import { formatDateTimeValue, parseDateTimeValue } from "./dateTimeValue";

export interface DateTimePickerProps extends PickerInputProps {
  /** 확정된 날짜·시간 `YYYY-MM-DDTHH:mm` (로컬 시간, 제어 모드). 비우려면 `null`. 형식이 잘못된 문자열은 선택 안 함으로 본다. */
  value?: string | null;
  /** 초기 날짜·시간 `YYYY-MM-DDTHH:mm` (비제어 모드) */
  defaultValue?: string | null;
  /** 팝오버에서 "확인"을 눌렀을 때 `YYYY-MM-DDTHH:mm`으로 호출된다. Esc/바깥 클릭으로 닫으면 호출되지 않는다. */
  onChange?: (value: string) => void;
  /** 선택할 수 있는 가장 이른 **날짜** `YYYY-MM-DD` (포함). 시각(시·분) 제한은 지원하지 않는다. */
  min?: string;
  /** 선택할 수 있는 가장 늦은 **날짜** `YYYY-MM-DD` (포함). 시각(시·분) 제한은 지원하지 않는다. */
  max?: string;
  /** `true`를 반환한 날짜는 선택할 수 없다 (예: 주말, 휴무일). 로컬 자정의 `Date`가 넘어온다. */
  isDateDisabled?: (date: Date) => boolean;
  /** 분 목록의 간격. 60의 약수(1, 5, 10, 15, 30)를 권장한다. */
  minuteStep?: number;
}

interface Draft {
  date: string | null;
  time: string | null;
}

// `Input` + `Popover` + `Calendar` + `TimePanel`을 미리 조합하고, 고르는 중인 값(draft)과 "확인" 버튼을 얹은 편의 컴포넌트다.
// 날짜·시간을 눌러도 팝오버는 열린 채 draft만 바뀌고, 둘 다 고른 뒤 "확인"을 눌러야 입력창과 onChange에 반영된다.
// 입력창에는 `2026-10-15 09:30`(사람이 읽기 좋은 형태)이 보이고, `name`을 주면 숨은 input이 `2026-10-15T09:30`을 폼에 제출한다.
export function DateTimePicker({
  value,
  defaultValue = null,
  onChange,
  min,
  max,
  isDateDisabled,
  minuteStep = 1,
  placeholder = "날짜·시간 선택",
  name,
  id,
  ...inputProps
}: DateTimePickerProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const [open, setOpen] = useState(false);
  const [innerValue, setInnerValue] = useState<string | null>(defaultValue);
  // 팝오버 안에서 고르고 있는 값. "확인"을 눌러야 확정되고, 그 전에는 입력창/onChange에 영향이 없다.
  const [draft, setDraft] = useState<Draft>({ date: null, time: null });

  const controlled = value !== undefined;
  const raw = controlled ? value : innerValue;
  const current = raw ? parseDateTimeValue(raw) : null;
  const currentValue = current ? formatDateTimeValue(current.date, current.time) : "";

  // 열릴 때마다 draft를 현재 값으로 되돌린다. Esc/바깥 클릭/트리거 재클릭으로 닫으면 draft는 그대로 버려진다.
  const handleOpenChange = (next: boolean) => {
    if (next) {
      setDraft({ date: current?.date ?? null, time: current?.time ?? null });
    }
    setOpen(next);
  };

  return (
    <>
      <Popover
        open={open}
        onOpenChange={handleOpenChange}
        label="날짜와 시간 선택"
        trigger={({ open: isOpen, toggle, anchorRef, popupId }) => (
          <PickerTriggerInput
            {...inputProps}
            id={inputId}
            placeholder={placeholder}
            displayValue={current ? `${current.date} ${current.time}` : ""}
            icon={<CalendarIcon />}
            triggerLabel="날짜·시간 선택 열기"
            open={isOpen}
            toggle={toggle}
            anchorRef={anchorRef}
            popupId={popupId}
          />
        )}
      >
        {({ close }) => (
          <div>
            {/* 넓은 화면에서는 나란히, 좁은 화면(<560px)에서는 위아래로 쌓는다 */}
            <div className="flex flex-col items-center gap-3 min-[560px]:flex-row min-[560px]:items-stretch">
              <Calendar
                autoFocus
                value={draft.date}
                onChange={(date) => setDraft((prev) => ({ ...prev, date }))}
                initialMonth={current?.date.slice(0, 7)}
                min={min}
                max={max}
                isDateDisabled={isDateDisabled}
              />
              <div className="h-px w-full bg-border-line min-[560px]:h-auto min-[560px]:w-px min-[560px]:self-stretch" />
              <TimePanel
                value={draft.time}
                onChange={(time) => setDraft((prev) => ({ ...prev, time }))}
                minuteStep={minuteStep}
              />
            </div>
            <div className="-mx-3 mt-3 flex justify-end border-t border-border-line px-3 pt-3">
              <Button
                variant="primary"
                disabled={!draft.date || !draft.time}
                onClick={() => {
                  if (!draft.date || !draft.time) {
                    return;
                  }
                  const next = formatDateTimeValue(draft.date, draft.time);
                  if (!controlled) {
                    setInnerValue(next);
                  }
                  onChange?.(next);
                  close();
                  document.getElementById(inputId)?.focus();
                }}
              >
                확인
              </Button>
            </div>
          </div>
        )}
      </Popover>
      {name && <input type="hidden" name={name} value={currentValue} />}
    </>
  );
}
