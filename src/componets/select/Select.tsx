import React from "react";
import * as RadixSelect from "@radix-ui/react-select";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/utils/cn";
import { FormField } from "@/componets/form-field/FormField";

const selectTriggerVariants = cva(
  "flex w-full items-center justify-between gap-2 rounded-md border bg-white text-left transition-colors focus:outline-none focus:ring-2 focus:ring-black disabled:cursor-not-allowed disabled:opacity-50 data-[placeholder]:text-gray-400",
  {
    variants: {
      size: {
        sm: "h-8 px-3 text-xs",
        md: "h-10 px-3 text-sm",
        lg: "h-12 px-4 text-base",
      },
      invalid: {
        true: "border-red-500 focus:ring-red-500",
        false: "border-gray-300",
      },
    },
    defaultVariants: {
      size: "md",
      invalid: false,
    },
  },
);

const ChevronDownIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 6 9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export interface SelectOption {
  value: string;
  label: React.ReactNode;
  disabled?: boolean;
}

interface SelectOwnProps extends VariantProps<typeof selectTriggerVariants> {
  /** 셀렉트 위(혹은 옆)에 표시할 라벨 */
  label?: React.ReactNode;
  /** 평상시 보여줄 보조 설명 */
  helperText?: React.ReactNode;
  /** 있으면 invalid 스타일로 전환되고 helperText 대신 표시됨 */
  errorText?: React.ReactNode;
  /** 라벨과 셀렉트의 배치 방향 */
  orientation?: "vertical" | "horizontal";
  options: SelectOption[];
  placeholder?: string;
  id?: string;
  className?: string;
}

export interface SelectProps
  extends SelectOwnProps,
    Omit<React.ComponentProps<typeof RadixSelect.Root>, "children"> {}

// 네이티브 <select>는 드롭다운 패널 스타일을 브라우저마다 다르게 렌더링해서
// 커스터마이징이 안 되기 때문에, 접근성이 검증된 Radix Select 위에 스타일만 입혔다.
export function Select({
  label,
  helperText,
  errorText,
  orientation = "vertical",
  options,
  placeholder = "선택하세요",
  size,
  className,
  id,
  disabled,
  ...rootProps
}: SelectProps) {
  const generatedId = React.useId();
  const selectId = id ?? generatedId;
  const descriptionId = `${selectId}-description`;
  const invalid = Boolean(errorText);
  const hasDescription = Boolean(errorText ?? helperText);

  return (
    <FormField
      label={label}
      htmlFor={selectId}
      helperText={helperText}
      errorText={errorText}
      orientation={orientation}
      descriptionId={descriptionId}
    >
      <RadixSelect.Root disabled={disabled} {...rootProps}>
        <RadixSelect.Trigger
          id={selectId}
          aria-invalid={invalid}
          aria-describedby={hasDescription ? descriptionId : undefined}
          className={cn(selectTriggerVariants({ size, invalid, className }))}
        >
          <RadixSelect.Value placeholder={placeholder} />
          <RadixSelect.Icon className="text-gray-500">
            <ChevronDownIcon />
          </RadixSelect.Icon>
        </RadixSelect.Trigger>
        <RadixSelect.Portal>
          <RadixSelect.Content
            position="popper"
            sideOffset={4}
            className="z-50 max-h-60 min-w-[var(--radix-select-trigger-width)] overflow-hidden rounded-md border border-gray-200 bg-white shadow-md"
          >
            <RadixSelect.Viewport className="p-1">
              {options.map((option) => (
                <RadixSelect.Item
                  key={option.value}
                  value={option.value}
                  disabled={option.disabled}
                  className={cn(
                    "relative flex cursor-pointer items-center rounded-sm py-1.5 pr-2 pl-7 text-sm text-gray-900 select-none",
                    "outline-none data-[highlighted]:bg-gray-100",
                    "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
                  )}
                >
                  <RadixSelect.ItemIndicator className="absolute left-2 inline-flex items-center">
                    <CheckIcon />
                  </RadixSelect.ItemIndicator>
                  <RadixSelect.ItemText>{option.label}</RadixSelect.ItemText>
                </RadixSelect.Item>
              ))}
            </RadixSelect.Viewport>
          </RadixSelect.Content>
        </RadixSelect.Portal>
      </RadixSelect.Root>
    </FormField>
  );
}
