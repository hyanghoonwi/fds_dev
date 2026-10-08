import { useId, useState } from "react";
import { PickerTriggerInput } from "../_internal/PickerTriggerInput";
import type { PickerInputProps } from "../_internal/PickerTriggerInput";
import { Button } from "../button/Button";
import { ClockIcon } from "../icon/ClockIcon";
import { Popover } from "../popover/Popover";
import { TimePanel } from "../time-panel/TimePanel";

export interface TimePickerProps extends PickerInputProps {
  /** 확정된 시간 (24시간제 "HH:mm"). 넘기면 제어 컴포넌트로 동작한다. 비우려면 `null`. */
  value?: string | null;
  /** 비제어 모드의 초기값 ("HH:mm") */
  defaultValue?: string | null;
  /** 팝오버에서 "확인"을 눌렀을 때 "HH:mm" 문자열로 호출된다. Esc/바깥 클릭으로 닫으면 호출되지 않는다. */
  onChange?: (value: string) => void;
  /** 분 목록의 간격. 60의 약수(1, 5, 10, 15, 30)를 권장한다. */
  minuteStep?: number;
}

const TIME_PATTERN = /^([01]\d|2[0-3]):([0-5]\d)$/;
const normalize = (value: string | null | undefined) =>
  value && TIME_PATTERN.test(value) ? value : null;

// `Input` + `Popover` + `TimePanel`을 미리 조합해 두고, 고르는 중인 값(draft)과 "확인" 버튼을 얹은 편의 컴포넌트다.
// 시/분을 눌러도 팝오버는 열린 채 draft만 바뀌고, "확인"을 눌러야 입력창과 onChange에 반영된다.
export function TimePicker({
  value,
  defaultValue = null,
  onChange,
  minuteStep = 1,
  placeholder = "시간 선택",
  id,
  ...inputProps
}: TimePickerProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const [open, setOpen] = useState(false);
  const [innerValue, setInnerValue] = useState<string | null>(defaultValue);
  // 팝오버 안에서 고르고 있는 값. "확인"을 눌러야 확정되고, 그 전에는 입력창/onChange에 영향이 없다.
  const [draft, setDraft] = useState<string | null>(null);

  const controlled = value !== undefined;
  const current = normalize(controlled ? value : innerValue);

  // 열릴 때마다 draft를 현재 값으로 되돌린다. Esc/바깥 클릭/트리거 재클릭으로 닫으면 draft는 그대로 버려진다.
  const handleOpenChange = (next: boolean) => {
    if (next) {
      setDraft(current);
    }
    setOpen(next);
  };

  return (
    <Popover
      open={open}
      onOpenChange={handleOpenChange}
      label="시간 선택"
      trigger={({ open: isOpen, toggle, anchorRef, popupId }) => (
        <PickerTriggerInput
          {...inputProps}
          id={inputId}
          placeholder={placeholder}
          displayValue={current ?? ""}
          icon={<ClockIcon />}
          triggerLabel="시간 선택 열기"
          open={isOpen}
          toggle={toggle}
          anchorRef={anchorRef}
          popupId={popupId}
        />
      )}
    >
      {({ close }) => (
        <div>
          <TimePanel autoFocus value={draft} onChange={setDraft} minuteStep={minuteStep} />
          <div className="-mx-3 mt-3 flex justify-end border-t border-border-line px-3 pt-3">
            <Button
              variant="primary"
              disabled={!draft}
              onClick={() => {
                if (!draft) {
                  return;
                }
                if (!controlled) {
                  setInnerValue(draft);
                }
                onChange?.(draft);
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
  );
}
