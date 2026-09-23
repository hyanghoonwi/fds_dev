import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/utils/cn";
import { FormField } from "@/componets/form-field/FormField";

// 1. 인풋 필드(테두리 컨테이너) 스타일 및 Variant 정의
const inputFieldVariants = cva(
  "flex items-center rounded-md border bg-white transition-colors focus-within:outline-none focus-within:ring-2 focus-within:ring-black has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-50",
  {
    variants: {
      size: {
        sm: "h-8",
        md: "h-10",
        lg: "h-12",
      },
      invalid: {
        true: "border-red-500 focus-within:ring-red-500",
        false: "border-gray-300",
      },
    },
    defaultVariants: {
      size: "md",
      invalid: false,
    },
  },
);

const inputTextVariants = cva(
  "w-full min-w-0 bg-transparent text-gray-900 placeholder:text-gray-400 focus:outline-none disabled:cursor-not-allowed",
  {
    variants: {
      size: {
        sm: "text-xs",
        md: "text-sm",
        lg: "text-base",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

const EyeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path
      d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7Z"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path
      d="M3 3l18 18M10.6 10.6a3 3 0 0 0 4.24 4.24M9.9 4.24A11 11 0 0 1 12 4c7 0 11 8 11 8a13.2 13.2 0 0 1-3.4 4.3M6.1 6.1C3.6 7.8 2 10 2 10s4 7 11 7c1.5 0 2.9-.3 4.1-.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// 2. Props 타입 정의
interface InputOwnProps extends VariantProps<typeof inputFieldVariants> {
  /** 인풋 위(혹은 옆)에 표시할 라벨 */
  label?: React.ReactNode;
  /** 평상시 보여줄 보조 설명 */
  helperText?: React.ReactNode;
  /** 있으면 invalid 스타일로 전환되고 helperText 대신 표시됨 */
  errorText?: React.ReactNode;
  /** 라벨과 인풋의 배치 방향 */
  orientation?: "vertical" | "horizontal";
  /** 인풋 왼쪽에 붙는 아이콘 등 부속 요소 */
  leftAddon?: React.ReactNode;
  /** 인풋 오른쪽에 붙는 아이콘 등 부속 요소 */
  rightAddon?: React.ReactNode;
  /** 값 뒤에 붙는 단위 텍스트 (예: kg, %, 원) */
  unit?: React.ReactNode;
}

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size" | keyof InputOwnProps>,
    InputOwnProps {}

// 3. Input 컴포넌트 구현 (ref 전달을 위해 forwardRef 사용)
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      size,
      label,
      helperText,
      errorText,
      orientation = "vertical",
      leftAddon,
      rightAddon,
      unit,
      id,
      disabled,
      type = "text",
      ...props
    },
    ref,
  ) => {
    const generatedId = React.useId();
    const inputId = id ?? generatedId;
    const descriptionId = `${inputId}-description`;
    const invalid = Boolean(errorText);
    const hasDescription = Boolean(errorText ?? helperText);

    // password는 보기/숨기기 토글을 오른쪽 슬롯에 자동으로 붙여준다.
    const isPassword = type === "password";
    const [showPassword, setShowPassword] = React.useState(false);
    const resolvedType = isPassword && showPassword ? "text" : type;

    const passwordToggle = isPassword && (
      <button
        type="button"
        onClick={() => setShowPassword((prev) => !prev)}
        aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
        aria-pressed={showPassword}
        className="inline-flex items-center text-gray-500 hover:text-gray-700 focus-visible:outline-none"
      >
        {showPassword ? <EyeOffIcon /> : <EyeIcon />}
      </button>
    );

    return (
      <FormField
        label={label}
        htmlFor={inputId}
        helperText={helperText}
        errorText={errorText}
        orientation={orientation}
        descriptionId={descriptionId}
      >
        <div className={cn(inputFieldVariants({ size, invalid, className }))}>
          {leftAddon && (
            <span className="inline-flex items-center pl-3 text-gray-500">{leftAddon}</span>
          )}
          <input
            id={inputId}
            ref={ref}
            type={resolvedType}
            disabled={disabled}
            aria-invalid={invalid}
            aria-describedby={hasDescription ? descriptionId : undefined}
            className={cn(
              inputTextVariants({ size }),
              leftAddon ? "pl-2" : "pl-3",
              rightAddon || unit || passwordToggle ? "pr-2" : "pr-3",
            )}
            {...props}
          />
          {(unit || rightAddon || passwordToggle) && (
            <span className="inline-flex items-center gap-1.5 pr-3 text-gray-500">
              {unit && <span className="select-none text-sm">{unit}</span>}
              {rightAddon}
              {passwordToggle}
            </span>
          )}
        </div>
      </FormField>
    );
  },
);

Input.displayName = "Input";
