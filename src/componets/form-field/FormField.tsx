import type { ReactNode } from "react";
import { cn } from "@/utils/cn";

// 라벨/도움말/에러 메시지 배치를 캡슐화한 공용 레이아웃. Input, Select, Textarea 등
// 폼 컨트롤들이 반복 구현하지 않고 이 컴포넌트로 감싸서 재사용한다.
export interface FormFieldProps {
  /** 필드 라벨 */
  label?: ReactNode;
  /** label의 htmlFor. children 내부 컨트롤의 id와 맞춰줘야 함 */
  htmlFor?: string;
  /** 필수 입력 표시(*) */
  required?: boolean;
  /** 평상시 보여줄 보조 설명 */
  helperText?: ReactNode;
  /** 있으면 invalid 스타일로 전환되고 helperText 대신 표시됨 */
  errorText?: ReactNode;
  /** 라벨과 컨트롤의 배치 방향 */
  orientation?: "vertical" | "horizontal";
  /** 도움말/에러 문단의 id. 컨트롤의 aria-describedby와 연결할 때 사용 */
  descriptionId?: string;
  className?: string;
  children: ReactNode;
}

export function FormField({
  label,
  htmlFor,
  required,
  helperText,
  errorText,
  orientation = "vertical",
  descriptionId,
  className,
  children,
}: FormFieldProps) {
  const invalid = Boolean(errorText);
  const description = errorText ?? helperText;

  return (
    <div
      className={cn(
        "flex gap-1.5",
        orientation === "horizontal" ? "flex-row items-center" : "flex-col",
        className,
      )}
    >
      {label && (
        <label
          htmlFor={htmlFor}
          className={cn(
            "text-sm font-medium text-gray-900",
            orientation === "horizontal" && "w-32 shrink-0",
          )}
        >
          {label}
          {required && <span className="ml-0.5 text-red-500">*</span>}
        </label>
      )}
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        {children}
        {description && (
          <p
            id={descriptionId}
            className={cn("text-xs", invalid ? "text-red-500" : "text-gray-500")}
          >
            {description}
          </p>
        )}
      </div>
    </div>
  );
}
