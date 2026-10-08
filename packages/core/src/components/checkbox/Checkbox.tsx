import { useEffect, useId, useRef, useState } from "react";
import type { ChangeEvent, ComponentProps, ReactNode } from "react";
import { cn } from "../../utils/cn";
import { CheckIcon } from "../icon/CheckIcon";
import { MinusIcon } from "../icon/MinusIcon";

export interface CheckboxProps extends Omit<
  ComponentProps<"input">,
  "type" | "checked" | "defaultChecked" | "onChange" | "className" | "children"
> {
  /** 체크 여부 (제어 모드) */
  checked?: boolean;
  /** 초기 체크 여부 (비제어 모드) */
  defaultChecked?: boolean;
  /**
   * 체크 상태가 바뀔 때 호출된다. 이벤트가 아니라 **boolean**을 받는다.
   * `indeterminate` 상태에서 누르면 항상 `true`로 호출된다(= "전체 선택"으로 동작).
   */
  onChange?: (checked: boolean) => void;
  /**
   * 일부만 선택된 상태(부분 선택). 표시는 `-`이고 브라우저에는 `indeterminate`로 전달된다.
   * 하위 항목 중 일부만 체크된 "전체 선택" 체크박스에 쓴다. 이 값은 앱이 계산해서 넘긴다.
   */
  indeterminate?: boolean;
  /** 체크박스 옆 텍스트. 라벨 줄 전체를 눌러도 토글된다. 생략하면 `aria-label`이 필요하다. */
  label?: ReactNode;
  /** 라벨 아래 보조 설명. `aria-describedby`로 연결된다. */
  description?: ReactNode;
  /** 에러 상태 (빨간 테두리 + `aria-invalid`) */
  invalid?: boolean;
  /** 바깥 `<label>` 요소의 클래스 */
  className?: string;
}

// 네이티브 <input type="checkbox">를 시각적으로만 숨기고(sr-only) 옆의 박스를 그린다.
// 폼 제출·포커스·Space 키·라벨 클릭은 모두 네이티브 동작을 그대로 쓰고, 표시는 :checked / :indeterminate로 바꾼다.
export function Checkbox({
  checked,
  defaultChecked,
  onChange,
  indeterminate = false,
  label,
  description,
  invalid = false,
  disabled,
  className,
  ref,
  "aria-describedby": describedBy,
  ...props
}: CheckboxProps) {
  const innerRef = useRef<HTMLInputElement>(null);
  const descriptionId = useId();

  // indeterminate는 HTML 속성이 아니라 DOM 프로퍼티라 매 렌더마다 맞춰 준다.
  // (브라우저는 클릭하면 이 값을 스스로 지우므로, 앱이 다시 계산해 넘기는 값이 기준이다.)
  useEffect(() => {
    if (innerRef.current) {
      innerRef.current.indeterminate = indeterminate;
    }
  });

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange?.(indeterminate ? true : event.target.checked);
  };

  return (
    <label
      className={cn(
        "inline-flex items-start gap-2 font-fds",
        disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer",
        className,
      )}
    >
      <input
        ref={(node) => {
          innerRef.current = node;
          if (typeof ref === "function") {
            ref(node);
          } else if (ref) {
            ref.current = node;
          }
        }}
        type="checkbox"
        className="peer sr-only"
        checked={checked}
        defaultChecked={defaultChecked}
        onChange={handleChange}
        disabled={disabled}
        aria-invalid={invalid || undefined}
        aria-describedby={
          [description && descriptionId, describedBy].filter(Boolean).join(" ") || undefined
        }
        {...props}
      />
      <span
        aria-hidden="true"
        className={cn(
          "relative inline-flex size-5 shrink-0 items-center justify-center rounded-6 border bg-bg-surface text-white transition-colors",
          invalid ? "border-brand-error" : "border-border-strong",
          // 체크 / 부분 선택: 파란 배경. 아이콘은 :checked / :indeterminate에 따라 하나만 보인다.
          "peer-checked:border-brand-primary peer-checked:bg-brand-primary",
          "peer-indeterminate:border-brand-primary peer-indeterminate:bg-brand-primary",
          "peer-checked:[&>.fds-check]:block peer-indeterminate:[&>.fds-check]:hidden",
          "peer-indeterminate:[&>.fds-minus]:block",
          // 키보드로 포커스했을 때만 링을 보여 준다
          "peer-focus-visible:ring-2 peer-focus-visible:ring-brand-primary/40 peer-focus-visible:ring-offset-1 peer-focus-visible:ring-offset-bg-surface",
        )}
      >
        <CheckIcon size={18} className="fds-check hidden" />
        <MinusIcon size={10} className="fds-minus hidden" />
      </span>
      {(label || description) && (
        <span className="flex min-w-0 flex-col">
          {label && <span className="text-sm leading-5 text-text-primary">{label}</span>}
          {description && (
            <span id={descriptionId} className="text-caption-2 text-text-caption">
              {description}
            </span>
          )}
        </span>
      )}
    </label>
  );
}

export interface CheckboxGroupOption {
  value: string;
  label: ReactNode;
  /** 라벨 아래 보조 설명 */
  description?: ReactNode;
  disabled?: boolean;
}

export interface CheckboxGroupProps extends Omit<
  ComponentProps<"div">,
  "onChange" | "defaultValue" | "role" | "children"
> {
  options: CheckboxGroupOption[];
  /** 선택된 값들 (제어 모드) */
  value?: string[];
  /** 초기 선택 값들 (비제어 모드) */
  defaultValue?: string[];
  /**
   * 선택이 바뀔 때 호출된다. 값은 클릭한 순서가 아니라 **`options` 순서**로 정렬되어 넘어온다.
   * `options`에 없는 값은 포함되지 않는다.
   */
  onChange?: (value: string[]) => void;
  /** 배치 방향. `horizontal`은 한 줄로 늘어놓고 넘치면 줄바꿈한다. */
  orientation?: "vertical" | "horizontal";
  /** 모든 체크박스에 붙는 `name`. 폼 제출 시 선택된 값마다 같은 이름으로 전달된다. */
  name?: string;
  disabled?: boolean;
  /** 에러 상태. 모든 체크박스에 전달된다. */
  invalid?: boolean;
}

/**
 * 같은 주제의 체크박스 묶음. 전체 선택은 포함하지 않는다 — 앱이 `indeterminate` 체크박스로 직접 조합한다.
 * 제목은 `aria-label` 또는 `aria-labelledby`로 연결한다.
 */
export function CheckboxGroup({
  options,
  value,
  defaultValue = [],
  onChange,
  orientation = "vertical",
  name,
  disabled,
  invalid,
  className,
  ref,
  ...props
}: CheckboxGroupProps) {
  const [innerValue, setInnerValue] = useState(defaultValue);
  const selected = value ?? innerValue;

  const handleToggle = (optionValue: string, checked: boolean) => {
    const next = options
      .filter((option) =>
        option.value === optionValue ? checked : selected.includes(option.value),
      )
      .map((option) => option.value);
    if (value === undefined) {
      setInnerValue(next);
    }
    onChange?.(next);
  };

  return (
    <div
      ref={ref}
      role="group"
      className={cn(
        "flex",
        orientation === "vertical" ? "flex-col gap-3" : "flex-wrap gap-x-5 gap-y-3",
        className,
      )}
      {...props}
    >
      {options.map((option) => (
        <Checkbox
          key={option.value}
          name={name}
          value={option.value}
          label={option.label}
          description={option.description}
          checked={selected.includes(option.value)}
          onChange={(checked) => handleToggle(option.value, checked)}
          disabled={disabled || option.disabled}
          invalid={invalid}
        />
      ))}
    </div>
  );
}
