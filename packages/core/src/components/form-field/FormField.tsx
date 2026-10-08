import type { ReactNode } from "react";
import { FieldLayout } from "../_internal/FieldLayout";
import type { FieldLabelAlign, FieldLabelMode, FieldOrientation } from "../_internal/FieldLayout";

export type FormFieldOrientation = FieldOrientation;

/** `children`을 함수로 넘기면 받는, 컨트롤에 붙여 줄 접근성 속성 */
export interface FormFieldControlProps {
  /** 컨트롤의 id. `<label htmlFor>`가 가리킨다. 컨트롤 요소에 그대로 붙인다. */
  id: string;
  /** 설명/에러 요소를 가리킨다. 컨트롤의 `aria-describedby`에 붙인다. */
  "aria-describedby"?: string;
  /** 에러가 있을 때만 `true`. 컨트롤의 `aria-invalid`에 붙인다. */
  "aria-invalid"?: true;
  /** `labelMode="group"`이고 라벨이 있을 때만 값이 있다. 묶음 요소의 `aria-labelledby`에 붙인다. */
  "aria-labelledby"?: string;
}

export interface FormFieldProps {
  /** 라벨. 생략하면 라벨 영역이 렌더링되지 않는다. */
  label?: ReactNode;
  /** 라벨 배치. vertical은 라벨이 위, horizontal은 라벨이 왼쪽에 놓인다. */
  orientation?: FormFieldOrientation;
  /** 가로 배치일 때 라벨 영역의 너비(px) */
  labelWidth?: number;
  /** 필수 표시(`*`). 라벨이 있을 때만 보인다. */
  required?: boolean;
  /** 컨트롤 아래 설명(도움말). 에러가 있으면 에러 메시지가 설명을 대신해 표시된다. */
  description?: ReactNode;
  /** 에러 메시지. 있으면 `role="alert"`로 표시된다. */
  error?: ReactNode;
  /**
   * 자식 컨트롤이 이미 가진 id. 주면 라벨의 `htmlFor`가 이 id를 가리킨다.
   * 생략하면 id를 자동으로 만들어 `children` 함수로 넘겨 준다.
   */
  htmlFor?: string;
  /**
   * 라벨을 컨트롤과 묶는 방식.
   * `for`(기본)는 `<label htmlFor>`로 요소 하나에 연결하고, `group`은 라벨을 `aria-labelledby`로 묶음에 연결한다.
   */
  labelMode?: FieldLabelMode;
  /** 가로 배치에서 라벨의 세로 위치. `field`(기본)는 높이 42px 입력 박스 첫 줄, `first-row`는 묶음의 첫 옵션 줄에 맞춘다. */
  labelAlign?: FieldLabelAlign;
  /** 라벨·컨트롤·보조 문구를 모두 감싸는 컨테이너의 클래스 */
  containerClassName?: string;
  /** 컨트롤. 접근성 속성(`id`, `aria-describedby`, `aria-invalid`)이 필요하면 함수로 넘겨 받는다. */
  children: ReactNode | ((control: FormFieldControlProps) => ReactNode);
}

/**
 * FDS에 없는 컨트롤(파일 선택, 색상 선택, 서드파티 위젯 등)에 Input과 같은 라벨·설명·에러 레이아웃을 입히는 래퍼.
 * Input, Select, Textarea, CheckboxGroup, RadioGroup은 이미 같은 props를 내장하고 있어 감쌀 필요가 없다.
 *
 * ```tsx
 * <FormField label="대표 색상" required error={error}>
 *   {(control) => <input type="color" {...control} />}
 * </FormField>
 * ```
 */
export function FormField({ htmlFor, children, ...layout }: FormFieldProps) {
  return (
    <FieldLayout {...layout} id={htmlFor}>
      {(field) =>
        typeof children === "function"
          ? children({
              id: field.id,
              "aria-describedby": field.describedBy,
              "aria-invalid": field.invalid ? true : undefined,
              "aria-labelledby": field.labelId,
            })
          : children
      }
    </FieldLayout>
  );
}
