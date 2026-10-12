import { useRef } from "react";
import type { ReactNode, Ref } from "react";
import { Popover } from "../../popover/Popover";
import { PickerTriggerInput } from "./PickerTriggerInput";
import type { PickerInputProps } from "./PickerTriggerInput";

interface PickerFieldProps extends PickerInputProps {
  /** 입력창에 보여줄 문자열 (예: "2026-10-06", "14:30") */
  displayValue: string;
  /** 오른쪽 트리거 아이콘 */
  icon: ReactNode;
  /** 트리거 버튼의 접근성 이름 (예: "달력 열기") */
  triggerLabel: string;
  /** 팝업의 접근성 이름 (예: "날짜 선택") */
  popupLabel: string;
  /** 팝업이 열릴 때 호출된다. 고르는 중인 값(draft)을 현재 값으로 되돌리는 데 쓴다. */
  onOpen?: () => void;
  /** 팝업 내용. `close`는 팝업을 닫고 입력창으로 포커스를 돌려준다. */
  children: (api: { close: () => void }) => ReactNode;
}

function assignRef<T>(ref: Ref<T> | undefined, node: T | null) {
  if (typeof ref === "function") {
    ref(node);
  } else if (ref) {
    ref.current = node;
  }
}

// DatePicker / TimePicker / DateTimePicker가 함께 쓰는 "읽기 전용 입력창 + 아이콘 버튼 + 아래에 뜨는 팝업" 한 벌.
// 열림 상태, 트리거 연결(aria), 닫을 때 포커스 복귀를 여기서 처리하므로 래퍼는 팝업 안에 무엇을 둘지만 정한다.
// 밖으로 export하지 않는 내부 컴포넌트다.
export function PickerField({
  displayValue,
  icon,
  triggerLabel,
  popupLabel,
  onOpen,
  children,
  ref,
  ...inputProps
}: PickerFieldProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  return (
    <Popover
      label={popupLabel}
      onOpenChange={(open) => open && onOpen?.()}
      trigger={({ open, toggle, anchorRef, popupId }) => (
        <PickerTriggerInput
          {...inputProps}
          ref={(node) => {
            inputRef.current = node;
            assignRef(ref, node);
          }}
          displayValue={displayValue}
          icon={icon}
          triggerLabel={triggerLabel}
          open={open}
          toggle={toggle}
          anchorRef={anchorRef}
          popupId={popupId}
        />
      )}
    >
      {({ close }) =>
        children({
          close: () => {
            close();
            inputRef.current?.focus();
          },
        })
      }
    </Popover>
  );
}
