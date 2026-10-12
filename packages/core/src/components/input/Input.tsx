import type { ComponentProps, MouseEvent, ReactNode, Ref } from "react";
import { cn } from "../../utils/cn";
import { FieldLayout } from "../_internal/FieldLayout";
import type { FieldOrientation } from "../_internal/FieldLayout";
import { fieldTextClass, type FieldSize } from "../_internal/fieldSize";

export type InputOrientation = FieldOrientation;

export interface InputProps extends Omit<ComponentProps<"input">, "size"> {
  /** 크기. `md`는 높이 42px, `sm`은 36px(Button md와 같은 줄에 놓을 때 맞는 높이). 기본 `md` */
  size?: FieldSize;
  /** 입력 필드 라벨. 생략하면 라벨 영역이 렌더링되지 않는다. */
  label?: ReactNode;
  /** 라벨 배치. vertical은 라벨이 위, horizontal은 라벨이 왼쪽에 놓인다. */
  orientation?: InputOrientation;
  /** 에러 스타일만 켠다(에러 링 + `aria-invalid`). 문구는 표시하지 않는다. 문구까지 보여 주려면 `error`를 쓴다. */
  invalid?: boolean;
  /**
   * 입력 필드 아래에 표시하는 설명(도움말). 에러가 있으면 에러 메시지가 설명을 대신해 표시된다.
   */
  description?: ReactNode;
  /** 에러 메시지. 값이 있으면 입력 필드가 에러 스타일이 되고 메시지가 입력 필드 아래에 표시된다. */
  error?: ReactNode;
  /**
   * 입력값 왼쪽에 붙는 요소. 아이콘, 텍스트, 버튼 등을 자유롭게 넣을 수 있다.
   * 아이콘(svg)은 20px로 표시되고 색은 `text-icon-default`를 따른다.
   */
  leftAddon?: ReactNode;
  /** 입력값 오른쪽에 붙는 요소. 단위(`px`, `%`, `원`), 아이콘, 버튼 등을 자유롭게 넣을 수 있다. */
  rightAddon?: ReactNode;
  /** 가로 배치(`orientation="horizontal"`)일 때 라벨 영역의 너비(px). 라벨이 줄바꿈되면 늘린다. */
  labelWidth?: number;
  /** 라벨·에러를 포함한 전체 컨테이너의 클래스. `className`은 입력 필드에만 적용된다. */
  containerClassName?: string;
  /**
   * 필드 박스(배경·라운드를 가지고 addon과 `<input>`을 감싸는 영역)의 ref.
   * Popover 같은 오버레이를 입력창 바로 아래에 붙일 때 기준(anchor)으로 쓴다. (`ref`는 `<input>`에 연결된다.)
   */
  fieldRef?: Ref<HTMLDivElement>;
}

// Figma Text Field(408:3685) — SearchBar: bg-page, radius 12, padding 10, 14px/1.571
export function Input({
  label,
  orientation = "vertical",
  size = "md",
  description,
  error,
  invalid: invalidProp = false,
  leftAddon,
  rightAddon,
  labelWidth = 80,
  required,
  containerClassName,
  fieldRef,
  className,
  id,
  "aria-describedby": describedBy,
  ...props
}: InputProps) {
  // addon의 빈 영역(아이콘, 단위 텍스트 등)을 눌러도 입력 필드에 포커스가 가도록 한다.
  // 버튼·링크처럼 자체 동작이 있는 요소는 그대로 둔다.
  const focusInput = (event: MouseEvent<HTMLDivElement>) => {
    const input = event.currentTarget.querySelector("input");
    const target = event.target as HTMLElement;
    if (
      input &&
      target !== input &&
      !target.closest("button, a, select, textarea, [role='button']")
    ) {
      event.preventDefault();
      input.focus();
    }
  };

  // 배경·라운드·에러 링은 필드 박스가 가지고, <input>은 투명하게 그 안을 채운다
  return (
    <FieldLayout
      label={label}
      orientation={orientation}
      labelWidth={labelWidth}
      size={size}
      required={required}
      description={description}
      error={error}
      id={id}
      containerClassName={containerClassName}
    >
      {(field) => (
        <div
          ref={fieldRef}
          onMouseDown={focusInput}
          className={cn(
            "flex w-full items-center gap-2 rounded-12 bg-bg-input px-2.5 ring-inset focus-within:ring-1 focus-within:ring-brand-primary",
            (field.invalid || invalidProp) &&
              "ring-1 ring-brand-error focus-within:ring-brand-error",
            props.disabled && "cursor-not-allowed opacity-50",
          )}
        >
          {leftAddon && (
            <span className="flex shrink-0 items-center font-fds text-sm text-text-icon-default [&>svg]:size-5">
              {leftAddon}
            </span>
          )}
          <input
            id={field.id}
            required={required}
            aria-invalid={field.invalid || invalidProp || undefined}
            aria-describedby={
              [field.describedBy, describedBy].filter(Boolean).join(" ") || undefined
            }
            className={cn(
              "min-w-0 flex-1 bg-transparent font-fds text-text-primary caret-brand-primary outline-none",
              fieldTextClass[size],
              "placeholder:text-text-tertiary",
              "disabled:cursor-not-allowed",
              className,
            )}
            {...props}
          />
          {rightAddon && (
            <span className="flex shrink-0 items-center font-fds text-sm text-text-tertiary [&>svg]:size-5 [&>svg]:text-text-icon-default">
              {rightAddon}
            </span>
          )}
        </div>
      )}
    </FieldLayout>
  );
}
