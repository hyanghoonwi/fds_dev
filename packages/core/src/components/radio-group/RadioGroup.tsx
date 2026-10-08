import { useId, useState } from "react";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "../../utils/cn";

export interface RadioOption {
  /** 선택값. 폼에는 이 값이 제출된다. */
  value: string;
  /** 옵션 라벨. 라벨이나 동그라미를 눌러도 선택된다. */
  label: ReactNode;
  /** 라벨 아래에 작게 표시하는 설명. 라디오 입력의 `aria-describedby`에 연결된다. */
  description?: ReactNode;
  /** 이 옵션만 선택할 수 없게 한다. */
  disabled?: boolean;
}

export type RadioGroupOrientation = "vertical" | "horizontal";

export interface RadioGroupProps extends Omit<
  ComponentProps<"div">,
  "defaultValue" | "onChange" | "children" | "role"
> {
  /** 선택지 목록 */
  options: RadioOption[];
  /** 선택된 값 (제어 모드). `null`은 "선택 안 함"이다. */
  value?: string | null;
  /** 처음 선택될 값 (비제어 모드) */
  defaultValue?: string | null;
  /** 선택이 바뀔 때만 호출된다. 이미 선택된 옵션을 다시 눌러도 호출되지 않는다. */
  onChange?: (value: string) => void;
  /**
   * 폼 제출 이름이자 같은 그룹으로 묶는 이름(방향키 이동). 생략하면 자동으로 만들어 쓴다.
   * 이름을 직접 주면 `FormData`에 그 이름으로 제출된다.
   */
  name?: string;
  /** 옵션 배치. vertical은 세로, horizontal은 한 줄(넘치면 줄바꿈)이다. */
  orientation?: RadioGroupOrientation;
  /** 그룹 전체를 비활성화한다. */
  disabled?: boolean;
  /** 에러 상태. 동그라미에 에러 색 테두리를 쓰고 그룹에 `aria-invalid`를 붙인다. */
  invalid?: boolean;
  /** 필수 여부. 라디오에 `required`, 그룹에 `aria-required`를 적용한다. */
  required?: boolean;
}

// 네이티브 radio를 숨겨 두고 그 위에 동그라미를 그린다. 같은 name의 radio끼리는 브라우저가
// 방향키 이동, Tab(선택된 항목 또는 첫 항목만 포커스), 폼 제출을 처리하므로 직접 구현하지 않는다.
export function RadioGroup({
  options,
  value,
  defaultValue = null,
  onChange,
  name,
  orientation = "vertical",
  disabled,
  invalid,
  required,
  className,
  ref,
  ...props
}: RadioGroupProps) {
  const generatedName = useId();
  const groupName = name ?? generatedName;
  const [innerValue, setInnerValue] = useState<string | null>(defaultValue);
  const selected = value !== undefined ? value : innerValue;

  const handleSelect = (next: string) => {
    if (value === undefined) {
      setInnerValue(next);
    }
    onChange?.(next);
  };

  return (
    <div
      ref={ref}
      role="radiogroup"
      aria-invalid={invalid || undefined}
      aria-required={required || undefined}
      aria-disabled={disabled || undefined}
      className={cn(
        "flex",
        orientation === "horizontal" ? "flex-row flex-wrap gap-x-5 gap-y-2" : "flex-col gap-2.5",
        className,
      )}
      {...props}
    >
      {options.map((option, index) => {
        const optionDisabled = disabled || option.disabled;
        const descriptionId = option.description ? `${groupName}-${index}-description` : undefined;

        return (
          <label
            key={option.value}
            className={cn(
              "flex items-start gap-2",
              optionDisabled ? "cursor-not-allowed opacity-50" : "cursor-pointer",
            )}
          >
            <input
              type="radio"
              name={groupName}
              value={option.value}
              checked={selected === option.value}
              disabled={optionDisabled}
              required={required}
              aria-describedby={descriptionId}
              onChange={() => handleSelect(option.value)}
              className="peer sr-only"
            />
            <span
              aria-hidden="true"
              className={cn(
                "flex size-5 shrink-0 items-center justify-center rounded-full border bg-bg-surface transition-colors",
                "peer-focus-visible:ring-2 peer-focus-visible:ring-brand-primary peer-focus-visible:ring-offset-1",
                invalid
                  ? "border-brand-error peer-checked:border-brand-error"
                  : "border-border-strong peer-checked:border-brand-primary",
                // 안쪽 점은 선택됐을 때만 커진다
                "peer-checked:[&>span]:scale-100",
              )}
            >
              <span
                className={cn(
                  "size-2.5 scale-0 rounded-full transition-transform",
                  invalid ? "bg-brand-error" : "bg-brand-primary",
                )}
              />
            </span>
            <span className="flex flex-col gap-0.5">
              <span className="font-fds text-sm leading-5 text-text-primary">{option.label}</span>
              {option.description && (
                <span id={descriptionId} className="font-fds text-caption-2 text-text-caption">
                  {option.description}
                </span>
              )}
            </span>
          </label>
        );
      })}
    </div>
  );
}
