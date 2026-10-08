import { useId } from "react";
import type { ReactNode } from "react";
import { cn } from "../../utils/cn";

export type FieldOrientation = "vertical" | "horizontal";

/**
 * 라벨을 어떻게 컨트롤과 묶는지.
 * - `for`: `<label htmlFor>`. 컨트롤이 요소 하나일 때(Input, Textarea, Select).
 * - `group`: `<span id>`. 컨트롤이 묶음일 때(CheckboxGroup, RadioGroup). 묶음에 `aria-labelledby`를 건다.
 */
export type FieldLabelMode = "for" | "group";

/**
 * 가로 배치에서 라벨의 세로 위치를 어디에 맞출지.
 * - `field`: 높이 42px 입력 박스의 첫 줄(Input, Textarea, Select)
 * - `first-row`: 첫 번째 옵션 줄(CheckboxGroup, RadioGroup)
 */
export type FieldLabelAlign = "field" | "first-row";

/** 컨트롤에 넘겨 주는 접근성 연결 값 */
export interface FieldA11y {
  /** 컨트롤 id. `<label htmlFor>`가 가리킨다. */
  id: string;
  /** 라벨 요소 id. `group` 모드이고 라벨이 있을 때만 값이 있다(`aria-labelledby`용). */
  labelId: string | undefined;
  /** 에러/설명 요소 id 목록. `aria-describedby`에 합쳐 넣는다. */
  describedBy: string | undefined;
  /** 에러가 있는지. `aria-invalid`와 에러 스타일에 쓴다. */
  invalid: boolean;
}

export interface FieldLayoutProps {
  /** 라벨. 생략하면 라벨 영역이 렌더링되지 않는다. */
  label?: ReactNode;
  /** 라벨 배치. vertical은 라벨이 위, horizontal은 왼쪽 */
  orientation?: FieldOrientation;
  /** 가로 배치일 때 라벨 영역 너비(px) */
  labelWidth?: number;
  /** 필수 표시(`*`). 라벨이 있을 때만 보인다. */
  required?: boolean;
  /** 컨트롤 아래 설명. 에러가 있으면 에러가 대신 표시된다. */
  description?: ReactNode;
  /** 에러 메시지. 있으면 `role="alert"`로 표시되고 `invalid`가 켜진다. */
  error?: ReactNode;
  /** 컨트롤 id. 생략하면 자동 생성한다. */
  id?: string;
  labelMode?: FieldLabelMode;
  labelAlign?: FieldLabelAlign;
  /** 라벨·컨트롤·보조 문구를 모두 감싸는 컨테이너의 클래스 */
  containerClassName?: string;
  /** 설명/에러 아래에 붙는 요소(예: Textarea 글자수). 위치가 고정되어 있어 토글돼도 컨트롤이 다시 만들어지지 않는다. */
  footer?: ReactNode;
  children: (a11y: FieldA11y) => ReactNode;
}

/**
 * Input·Select·Textarea·CheckboxGroup·RadioGroup이 함께 쓰는 필드 레이아웃(라벨 + 컨트롤 + 설명/에러).
 * 컨트롤의 트리 위치를 고정해, 에러가 입력 중에 나타나거나 사라져도 포커스를 잃지 않는다.
 * 트리가 달라지는 건 vertical ↔ horizontal을 바꿀 때뿐이다.
 */
export function FieldLayout({
  label,
  orientation = "vertical",
  labelWidth = 80,
  required,
  description,
  error,
  id,
  labelMode = "for",
  labelAlign = "field",
  containerClassName,
  footer,
  children,
}: FieldLayoutProps) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  const labelId = `${fieldId}-label`;
  const errorId = `${fieldId}-error`;
  const descriptionId = `${fieldId}-description`;

  const hasError = Boolean(error);
  const showDescription = Boolean(description) && !hasError;
  const horizontal = orientation === "horizontal";

  const labelProps = {
    style: horizontal ? { width: labelWidth } : undefined,
    className: cn(
      "font-fds text-label-1-normal text-text-secondary",
      // 가로 배치: 라벨 줄(20px)의 중심을 입력 박스(42px) 첫 줄의 중심에 맞춘다. 묶음은 첫 옵션 줄(20px)과 위쪽을 맞춘다.
      horizontal && cn("shrink-0", labelAlign === "field" && "pt-[11px]"),
    ),
  };
  const labelContent = (
    <>
      {label}
      {required && (
        <span aria-hidden="true" className="ml-0.5 text-brand-error">
          *
        </span>
      )}
    </>
  );
  const labelElement =
    label &&
    (labelMode === "group" ? (
      <span id={labelId} {...labelProps}>
        {labelContent}
      </span>
    ) : (
      <label htmlFor={fieldId} {...labelProps}>
        {labelContent}
      </label>
    ));

  const control = children({
    id: fieldId,
    labelId: labelMode === "group" && label ? labelId : undefined,
    describedBy:
      [hasError && errorId, showDescription && descriptionId].filter(Boolean).join(" ") ||
      undefined,
    invalid: hasError,
  });

  const errorElement = hasError && (
    <p id={errorId} role="alert" className="m-0 font-fds text-caption-2 text-brand-error">
      {error}
    </p>
  );

  const descriptionElement = showDescription && (
    <p id={descriptionId} className="m-0 font-fds text-caption-2 text-text-caption">
      {description}
    </p>
  );

  if (horizontal) {
    return (
      <div className={cn("flex w-full items-start gap-3", containerClassName)}>
        {labelElement}
        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
          {control}
          {errorElement || descriptionElement}
          {footer}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex w-full flex-col gap-1.5", containerClassName)}>
      {labelElement}
      {control}
      {errorElement || descriptionElement}
      {footer}
    </div>
  );
}
