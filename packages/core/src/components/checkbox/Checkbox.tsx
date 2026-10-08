import { useEffect, useId, useRef, useState } from "react";
import type { ChangeEvent, ComponentProps, ReactNode } from "react";
import { cn } from "../../utils/cn";
import { FieldLayout } from "../_internal/FieldLayout";
import type { FieldOrientation } from "../_internal/FieldLayout";
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
  /** 에러 상태 (빨간 테두리 + `aria-invalid`). 문구는 표시하지 않는다. */
  invalid?: boolean;
  /**
   * 에러 메시지. 있으면 에러 상태가 켜지고 메시지가 체크박스 아래(라벨 글자 아래쪽 맞춤)에 표시된다.
   * 있으면 `description`은 가려진다.
   */
  error?: ReactNode;
  /** 체크박스와 에러 메시지를 감싸는 바깥 요소의 클래스 */
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
  error,
  invalid: invalidProp = false,
  disabled,
  className,
  ref,
  "aria-describedby": describedBy,
  ...props
}: CheckboxProps) {
  const innerRef = useRef<HTMLInputElement>(null);
  const descriptionId = useId();
  const errorId = useId();
  const hasError = Boolean(error);
  const invalid = invalidProp || hasError;
  const showDescription = Boolean(description) && !hasError;

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

  // 바깥 래퍼를 항상 두어, 에러가 나타나고 사라져도 <input>이 다시 만들어지지 않게(포커스 유지) 한다.
  return (
    <div className={cn("inline-flex flex-col gap-1.5", className)}>
      <label
        className={cn(
          "flex items-start gap-2 font-fds",
          disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer",
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
            [hasError && errorId, showDescription && descriptionId, describedBy]
              .filter(Boolean)
              .join(" ") || undefined
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
        {(label || showDescription) && (
          <span className="flex min-w-0 flex-col">
            {label && <span className="text-sm leading-5 text-text-primary">{label}</span>}
            {showDescription && (
              <span id={descriptionId} className="text-caption-2 text-text-caption">
                {description}
              </span>
            )}
          </span>
        )}
      </label>
      {hasError && (
        <p id={errorId} role="alert" className="m-0 pl-7 font-fds text-caption-2 text-brand-error">
          {error}
        </p>
      )}
    </div>
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
  /** 옵션들의 배치 방향. `horizontal`은 한 줄로 늘어놓고 넘치면 줄바꿈한다. */
  direction?: "vertical" | "horizontal";
  /** 묶음의 제목. 생략하면 제목 영역이 렌더링되지 않는다. 묶음에 `aria-labelledby`로 연결된다. */
  label?: ReactNode;
  /** 제목 배치. vertical은 제목이 위, horizontal은 제목이 왼쪽(첫 옵션 줄과 맞춤)에 놓인다. */
  orientation?: FieldOrientation;
  /** 가로 배치(`orientation="horizontal"`)일 때 제목 영역의 너비(px) */
  labelWidth?: number;
  /** 필수 표시(`*`). 제목이 있을 때만 보인다. */
  required?: boolean;
  /** 옵션들 아래 설명(도움말). 에러가 있으면 에러 메시지가 설명을 대신해 표시된다. */
  description?: ReactNode;
  /** 에러 메시지. 있으면 모든 체크박스에 에러 상태가 전달되고 메시지가 옵션들 아래에 표시된다. */
  error?: ReactNode;
  /** 제목·옵션·보조 문구를 모두 감싸는 컨테이너의 클래스. `className`은 옵션들을 감싸는 그룹 요소에 적용된다. */
  containerClassName?: string;
  /** 모든 체크박스에 붙는 `name`. 폼 제출 시 선택된 값마다 같은 이름으로 전달된다. */
  name?: string;
  disabled?: boolean;
  /** 에러 상태. 모든 체크박스에 전달된다. */
  invalid?: boolean;
}

/**
 * 같은 주제의 체크박스 묶음. 전체 선택은 포함하지 않는다 — 앱이 `indeterminate` 체크박스로 직접 조합한다.
 * `label`을 주면 제목이 묶음과 `aria-labelledby`로 연결된다. 제목 없이 쓰면 `aria-label`을 준다.
 */
export function CheckboxGroup({
  options,
  value,
  defaultValue = [],
  onChange,
  direction = "vertical",
  label,
  orientation,
  labelWidth,
  required,
  description,
  error,
  containerClassName,
  name,
  disabled,
  invalid: invalidProp,
  id,
  className,
  ref,
  "aria-labelledby": labelledBy,
  "aria-describedby": describedBy,
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
    <FieldLayout
      label={label}
      orientation={orientation}
      labelWidth={labelWidth}
      required={required}
      description={description}
      error={error}
      id={id}
      labelMode="group"
      labelAlign="first-row"
      containerClassName={containerClassName}
    >
      {(field) => (
        <div
          ref={ref}
          id={field.id}
          role="group"
          aria-labelledby={[field.labelId, labelledBy].filter(Boolean).join(" ") || undefined}
          aria-describedby={[field.describedBy, describedBy].filter(Boolean).join(" ") || undefined}
          className={cn(
            "flex",
            direction === "vertical" ? "flex-col gap-3" : "flex-wrap gap-x-5 gap-y-3",
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
              invalid={invalidProp || field.invalid}
            />
          ))}
        </div>
      )}
    </FieldLayout>
  );
}
