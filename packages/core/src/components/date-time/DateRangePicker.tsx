import type { ReactNode } from "react";
import { cn } from "../../utils/cn";
import { useControllableState } from "../../utils/useControllableState";
import { FieldLayout } from "../_internal/FieldLayout";
import type { FieldOrientation } from "../_internal/FieldLayout";
import type { FieldSize } from "../_internal/fieldSize";
import { Checkbox } from "../checkbox/Checkbox";
import { DatePicker } from "./DatePicker";
import { normalizeDateValue } from "./values";
import type { DateRangeValue } from "./values";

export interface DateRangePreset {
  label: string;
  /** 누르면 적용되는 범위. 함수로 주면 누를 때마다 계산한다(`() => relativeDateRange(-6, 0)`). */
  value: DateRangeValue | (() => DateRangeValue);
}

export interface DateRangePickerProps {
  /** 선택된 범위 (제어 모드) */
  value?: DateRangeValue;
  /** 처음 범위 (비제어 모드) */
  defaultValue?: DateRangeValue;
  /** 시작일·종료일·"미정"·프리셋 중 무엇이든 바뀔 때 새 범위로 호출된다. */
  onChange?: (value: DateRangeValue) => void;
  /** 선택할 수 있는 가장 이른 날짜 `YYYY-MM-DD` (포함). 시작일·종료일 모두에 적용된다. */
  min?: string;
  /** 선택할 수 있는 가장 늦은 날짜 `YYYY-MM-DD` (포함). 시작일·종료일 모두에 적용된다. */
  max?: string;
  /** `true`를 반환한 날짜는 선택할 수 없다 (예: 주말, 휴무일). 시작일·종료일 모두에 적용된다. */
  isDateDisabled?: (date: Date) => boolean;
  /** 종료일을 비워 둘 수 있게 "종료일 미정" 체크박스를 보여 줄지 */
  allowUndecidedEnd?: boolean;
  /** "미정" 체크박스 문구. 기본 "종료일 미정" */
  undecidedLabel?: string;
  /** 입력창 아래에 놓이는 빠른 선택(오늘, 최근 7일 …). 범위가 `min`/`max`를 벗어나는 프리셋은 비활성화된다. */
  presets?: DateRangePreset[];
  startPlaceholder?: string;
  endPlaceholder?: string;
  /** 폼 제출용 이름. 시작일 입력창에 붙는다. */
  startName?: string;
  /** 폼 제출용 이름. 종료일 입력창에 붙는다. 미정이면 값이 비어 제출된다. */
  endName?: string;
  /** 입력창 크기. `md`는 높이 42px, `sm`은 36px. 기본 `md` */
  size?: FieldSize;
  /** 라벨. 생략하면 라벨 영역이 렌더링되지 않는다. */
  label?: ReactNode;
  /** 라벨 배치. vertical은 라벨이 위, horizontal은 라벨이 왼쪽에 놓인다. */
  orientation?: FieldOrientation;
  /** 가로 배치일 때 라벨 영역의 너비(px) */
  labelWidth?: number;
  /** 필수 표시(`*`). 라벨이 있을 때만 보인다. */
  required?: boolean;
  /** 입력창 아래 설명(도움말). 에러가 있으면 에러 메시지가 설명을 대신해 표시된다. */
  description?: ReactNode;
  /** 에러 메시지. 있으면 두 입력창이 에러 스타일이 되고 메시지가 아래에 표시된다. */
  error?: ReactNode;
  disabled?: boolean;
  /** 라벨·입력창·보조 문구를 모두 감싸는 컨테이너의 클래스 */
  containerClassName?: string;
}

const laterOf = (a: string | undefined, b: string | null) => (a && b ? (a > b ? a : b) : (a ?? b));

/**
 * 시작일 ~ 종료일을 한 번에 고르는 필드. `DatePicker` 두 개를 묶어서 **종료일이 시작일보다 이른 범위는 만들어지지 않게** 한다.
 * - 종료일 달력은 시작일 이전을 막고(`min` = 시작일), 비어 있으면 시작일이 있는 달로 열린다.
 * - 시작일을 종료일보다 **뒤로** 고르면 종료일을 비운다(없던 날짜를 만들어 내지 않고, 다음에 종료일을 다시 고르게 한다).
 *   그래서 종료일을 먼저 바꾸지 않고도 기간을 통째로 뒤로 옮길 수 있다.
 */
export function DateRangePicker({
  value,
  defaultValue,
  onChange,
  min,
  max,
  isDateDisabled,
  allowUndecidedEnd = false,
  undecidedLabel = "종료일 미정",
  presets,
  startPlaceholder = "시작일",
  endPlaceholder = "종료일",
  startName,
  endName,
  size,
  label,
  orientation,
  labelWidth,
  required,
  description,
  error,
  disabled,
  containerClassName,
}: DateRangePickerProps) {
  const [current, update] = useControllableState<DateRangeValue>(
    value,
    defaultValue ?? { start: null, end: null },
    onChange,
  );
  const start = normalizeDateValue(current.start);
  const undecided = allowUndecidedEnd && Boolean(current.endUndecided);
  const end = undecided ? null : normalizeDateValue(current.end);
  const invalid = Boolean(error);

  const presetRange = (preset: DateRangePreset) =>
    typeof preset.value === "function" ? preset.value() : preset.value;
  // 선택 가능 범위(min/max)를 벗어나는 프리셋은 누를 수 없게 한다
  const isPresetAllowed = (range: DateRangeValue) =>
    !(
      (min && range.start && range.start < min) ||
      (max && range.end && range.end > max) ||
      (min && range.end && range.end < min) ||
      (max && range.start && range.start > max)
    );
  const isPresetActive = (range: DateRangeValue) =>
    normalizeDateValue(range.start) === start &&
    (range.endUndecided ? undecided : !undecided && normalizeDateValue(range.end) === end);

  return (
    <FieldLayout
      label={label}
      orientation={orientation}
      labelWidth={labelWidth}
      size={size}
      required={required}
      description={description}
      error={error}
      labelMode="group"
      containerClassName={containerClassName}
    >
      {(field) => (
        <div
          id={field.id}
          role="group"
          aria-labelledby={field.labelId}
          aria-describedby={field.describedBy}
          className="flex flex-col gap-2"
        >
          <div className="flex items-center gap-2">
            <div className="min-w-0 flex-1">
              <DatePicker
                aria-label="시작일"
                size={size}
                name={startName}
                placeholder={startPlaceholder}
                value={start}
                onChange={(next) =>
                  update({
                    start: next,
                    // 새 시작일이 종료일보다 뒤면 종료일을 비운다
                    end: end && next > end ? null : current.end,
                    endUndecided: undecided,
                  })
                }
                min={min}
                max={max}
                isDateDisabled={isDateDisabled}
                disabled={disabled}
                invalid={invalid}
              />
            </div>
            <span aria-hidden="true" className="shrink-0 font-fds text-sm text-text-tertiary">
              ~
            </span>
            <div className="min-w-0 flex-1">
              <DatePicker
                aria-label="종료일"
                size={size}
                name={endName}
                placeholder={undecided ? "미정" : endPlaceholder}
                value={end}
                onChange={(next) => update({ start: current.start, end: next })}
                // 종료일은 시작일보다 이를 수 없고, 달력은 시작일이 있는 달에서 열린다
                min={laterOf(min, start) ?? undefined}
                initialMonth={start?.slice(0, 7)}
                max={max}
                isDateDisabled={isDateDisabled}
                disabled={disabled || undecided}
                invalid={invalid}
              />
            </div>
          </div>
          {(allowUndecidedEnd || (presets && presets.length > 0)) && (
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              {presets && presets.length > 0 && (
                <div role="group" aria-label="기간 빠른 선택" className="flex flex-wrap gap-1.5">
                  {presets.map((preset) => {
                    const range = presetRange(preset);
                    const active = isPresetActive(range);
                    return (
                      <button
                        key={preset.label}
                        type="button"
                        aria-pressed={active}
                        disabled={disabled || !isPresetAllowed(range)}
                        onClick={() =>
                          update({
                            start: range.start,
                            end: range.end,
                            endUndecided: allowUndecidedEnd && range.endUndecided,
                          })
                        }
                        className={cn(
                          "cursor-pointer rounded-full border px-3 py-1 font-fds text-caption-1 transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-brand-primary disabled:cursor-not-allowed disabled:opacity-50",
                          active
                            ? "border-brand-primary bg-bg-blue-tint text-brand-primary"
                            : "border-line-2 bg-bg-surface text-text-tertiary hover:border-line-1 hover:text-brand-primary",
                        )}
                      >
                        {preset.label}
                      </button>
                    );
                  })}
                </div>
              )}
              {allowUndecidedEnd && (
                <Checkbox
                  label={undecidedLabel}
                  checked={undecided}
                  disabled={disabled}
                  onChange={(checked) =>
                    update(
                      checked
                        ? { start: current.start, end: null, endUndecided: true }
                        : { start: current.start, end: null, endUndecided: false },
                    )
                  }
                />
              )}
            </div>
          )}
        </div>
      )}
    </FieldLayout>
  );
}
