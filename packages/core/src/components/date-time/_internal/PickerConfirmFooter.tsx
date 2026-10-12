import { Button } from "../../button/Button";

interface PickerConfirmFooterProps {
  /** 값이 다 골라지지 않아 확정할 수 없을 때 */
  disabled: boolean;
  onConfirm: () => void;
}

// TimePicker / DateTimePicker 팝업 아래의 "확인" 줄. 팝업의 가장자리까지 닿는 구분선이 있다.
// 밖으로 export하지 않는 내부 컴포넌트다.
export function PickerConfirmFooter({ disabled, onConfirm }: PickerConfirmFooterProps) {
  return (
    <div className="-mx-3 mt-3 flex justify-end border-t border-border-line px-3 pt-3">
      <Button variant="primary" disabled={disabled} onClick={onConfirm}>
        확인
      </Button>
    </div>
  );
}
