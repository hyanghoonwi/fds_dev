import { useState } from "react";
import { useControllableState } from "../../utils/useControllableState";
import { PickerConfirmFooter } from "./_internal/PickerConfirmFooter";
import { PickerField } from "./_internal/PickerField";
import type { PickerInputProps } from "./_internal/PickerTriggerInput";
import { ClockIcon } from "../icon/ClockIcon";
import { TimePanel } from "./TimePanel";
import { normalizeTimeValue } from "./values";

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

// `Input` + `Popover` + `TimePanel`을 미리 조합하고, 고르는 중인 값(draft)과 "확인" 버튼을 얹은 편의 컴포넌트다.
// 시/분을 눌러도 팝오버는 열린 채 draft만 바뀌고, "확인"을 눌러야 입력창과 onChange에 반영된다.
export function TimePicker({
  value,
  defaultValue = null,
  onChange,
  minuteStep = 1,
  placeholder = "시간 선택",
  ...inputProps
}: TimePickerProps) {
  const [raw, setValue] = useControllableState<string | null>(
    value,
    defaultValue,
    (next) => next && onChange?.(next),
  );
  const current = normalizeTimeValue(raw);
  // 팝오버 안에서 고르고 있는 값. "확인"을 눌러야 확정되고, 그 전에는 입력창/onChange에 영향이 없다.
  const [draft, setDraft] = useState<string | null>(null);

  return (
    <PickerField
      {...inputProps}
      placeholder={placeholder}
      displayValue={current ?? ""}
      icon={<ClockIcon />}
      triggerLabel="시간 선택 열기"
      popupLabel="시간 선택"
      // 열릴 때마다 draft를 현재 값으로 되돌린다. Esc/바깥 클릭/트리거 재클릭으로 닫으면 draft는 그대로 버려진다.
      onOpen={() => setDraft(current)}
    >
      {({ close }) => (
        <div>
          <TimePanel autoFocus value={draft} onChange={setDraft} minuteStep={minuteStep} />
          <PickerConfirmFooter
            disabled={!draft}
            onConfirm={() => {
              if (!draft) {
                return;
              }
              setValue(draft);
              close();
            }}
          />
        </div>
      )}
    </PickerField>
  );
}
