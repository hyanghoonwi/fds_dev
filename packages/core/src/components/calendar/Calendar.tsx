import { useEffect, useId, useRef, useState } from "react";
import type { KeyboardEvent, Ref } from "react";
import { cn } from "../../utils/cn";
import { ChevronLeftIcon } from "../icon/ChevronLeftIcon";
import { ChevronRightIcon } from "../icon/ChevronRightIcon";
import {
  WEEKDAYS,
  addDays,
  addMonths,
  buildMonthGrid,
  describeDate,
  isSameDay,
  isSameMonth,
  startOfDay,
} from "./dateUtils";
import { formatDateValue, parseDateValue } from "./dateValue";

export interface CalendarProps {
  /** 선택된 날짜 `YYYY-MM-DD` (제어 모드). `null`은 "선택 안 함". 형식이 잘못된 문자열은 선택 안 함으로 본다. */
  value?: string | null;
  /** 초기 날짜 `YYYY-MM-DD` (비제어 모드) */
  defaultValue?: string | null;
  /** 날짜를 바꿨을 때 `YYYY-MM-DD`로 호출된다. 이미 선택된 날짜를 다시 누르면 호출되지 않는다. */
  onChange?: (value: string) => void;
  /**
   * 날짜 칸을 누르거나 Enter/Space로 고를 때마다 `YYYY-MM-DD`로 호출된다.
   * `onChange`와 달리 이미 선택된 날짜를 다시 골라도 호출되므로, 선택 후 팝업을 닫는 용도에 쓴다.
   */
  onSelect?: (value: string) => void;
  /** 선택할 수 있는 가장 이른 날짜 `YYYY-MM-DD` (포함) */
  min?: string;
  /** 선택할 수 있는 가장 늦은 날짜 `YYYY-MM-DD` (포함) */
  max?: string;
  /** `true`를 반환한 날짜는 선택할 수 없다 (예: 주말, 휴무일). 로컬 자정의 `Date`가 넘어온다. */
  isDateDisabled?: (date: Date) => boolean;
  /** 선택된 날짜가 없을 때 처음 보여줄 달 `YYYY-MM`. 기본은 이번 달 */
  initialMonth?: string;
  /** 마운트될 때 날짜 칸에 포커스를 준다 (선택된 날짜, 없으면 오늘, 그것도 막혀 있으면 처음 선택 가능한 날짜) */
  autoFocus?: boolean;
  className?: string;
  ref?: Ref<HTMLDivElement>;
}

/** `YYYY-MM` → 그 달에 보여줄 기준 날짜. 이번 달이면 오늘, 아니면 1일 */
function resolveInitialMonth(initialMonth: string | undefined, today: Date): Date | null {
  const match = initialMonth ? /^(\d{4})-(\d{2})$/.exec(initialMonth) : null;
  if (!match || Number(match[2]) < 1 || Number(match[2]) > 12) {
    return null;
  }
  const first = new Date(2000, 0, 1);
  first.setFullYear(Number(match[1]), Number(match[2]) - 1, 1);
  first.setHours(0, 0, 0, 0);
  return isSameMonth(first, today) ? today : first;
}

// 날짜를 고르는 "패널"이다. 테두리·그림자·열고 닫는 동작이 없어서 화면에 바로 놓거나,
// DatePicker의 팝업, Modal 안 등 어디에든 넣을 수 있다.
export function Calendar({
  value,
  defaultValue = null,
  onChange,
  onSelect,
  min,
  max,
  isDateDisabled,
  initialMonth,
  autoFocus = false,
  className,
  ref,
}: CalendarProps) {
  const [innerValue, setInnerValue] = useState<string | null>(defaultValue);
  const controlled = value !== undefined;
  const selected = parseDate(controlled ? value : innerValue);
  const selectedKey = selected ? formatDateValue(selected) : null;

  const today = startOfDay(new Date());
  const minDay = parseDate(min);
  const maxDay = parseDate(max);

  const clamp = (date: Date) => {
    if (minDay && date < minDay) {
      return minDay;
    }
    if (maxDay && date > maxDay) {
      return maxDay;
    }
    return date;
  };
  const isDisabled = (date: Date) =>
    Boolean((minDay && date < minDay) || (maxDay && date > maxDay) || isDateDisabled?.(date));

  // 포커스가 있는 날짜가 곧 화면에 보이는 달을 결정한다.
  const [focusDate, setFocusDate] = useState(() => {
    const base = clamp(selected ?? resolveInitialMonth(initialMonth, today) ?? today);
    if (selected || !isDisabled(base)) {
      return base;
    }
    // 오늘(또는 기준일)이 막혀 있으면 그 달에서 처음 선택 가능한 날짜를 찾는다
    const firstOfMonth = new Date(base.getFullYear(), base.getMonth(), 1);
    const candidates = buildMonthGrid(firstOfMonth).filter((day) => isSameMonth(day, base));
    return candidates.find((day) => !isDisabled(day)) ?? base;
  });
  const gridRef = useRef<HTMLDivElement>(null);
  const shouldFocus = useRef(autoFocus);
  const titleId = useId();

  useEffect(() => {
    if (!shouldFocus.current) {
      return;
    }
    shouldFocus.current = false;
    gridRef.current
      ?.querySelector<HTMLElement>(`[data-date="${formatDateValue(focusDate)}"]`)
      ?.focus();
  }, [focusDate]);

  // 값이 바깥에서 바뀌어 다른 달의 날짜가 되면 그 달을 보여준다
  useEffect(() => {
    if (selected && !isSameMonth(selected, focusDate)) {
      setFocusDate(selected);
    }
    // 보이는 달은 선택값이 바뀔 때만 따라간다 (달 이동 버튼으로 옮긴 달은 그대로 둔다)
  }, [selectedKey]);

  const moveFocus = (date: Date) => {
    shouldFocus.current = true;
    setFocusDate(clamp(date));
  };

  const select = (day: Date) => {
    // 다른 달의 날짜를 눌러도 그 달로 이동하고, 포커스는 눌렀던 날짜에 남긴다
    shouldFocus.current = true;
    setFocusDate(day);
    const next = formatDateValue(day);
    if (next !== selectedKey) {
      if (!controlled) {
        setInnerValue(next);
      }
      onChange?.(next);
    }
    onSelect?.(next);
  };

  const handleGridKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const startOfWeek = addDays(focusDate, -focusDate.getDay());
    const moves: Record<string, Date> = {
      ArrowLeft: addDays(focusDate, -1),
      ArrowRight: addDays(focusDate, 1),
      ArrowUp: addDays(focusDate, -7),
      ArrowDown: addDays(focusDate, 7),
      Home: startOfWeek,
      End: addDays(startOfWeek, 6),
      PageUp: addMonths(focusDate, -1),
      PageDown: addMonths(focusDate, 1),
    };
    const next = moves[event.key];
    if (next) {
      event.preventDefault();
      moveFocus(next);
    }
  };

  const firstOfView = new Date(focusDate.getFullYear(), focusDate.getMonth(), 1);
  const lastOfPrev = addDays(firstOfView, -1);
  const firstOfNext = new Date(focusDate.getFullYear(), focusDate.getMonth() + 1, 1);
  const prevDisabled = Boolean(minDay && lastOfPrev < minDay);
  const nextDisabled = Boolean(maxDay && firstOfNext > maxDay);
  const days = buildMonthGrid(focusDate);

  const navButton =
    "flex size-8 items-center justify-center rounded-full text-text-icon-default hover:bg-bg-blue-tint disabled:cursor-not-allowed disabled:text-text-disabled disabled:hover:bg-transparent";

  return (
    <div ref={ref} className={cn("w-64 font-fds", className)}>
      <div className="mb-2 flex items-center justify-between">
        <button
          type="button"
          aria-label="이전 달"
          disabled={prevDisabled}
          onClick={() => setFocusDate(clamp(addMonths(focusDate, -1)))}
          className={cn(navButton, "cursor-pointer")}
        >
          <ChevronLeftIcon size={20} />
        </button>
        <span id={titleId} aria-live="polite" className="text-sm font-semibold text-text-primary">
          {focusDate.getFullYear()}년 {focusDate.getMonth() + 1}월
        </span>
        <button
          type="button"
          aria-label="다음 달"
          disabled={nextDisabled}
          onClick={() => setFocusDate(clamp(addMonths(focusDate, 1)))}
          className={cn(navButton, "cursor-pointer")}
        >
          <ChevronRightIcon size={20} />
        </button>
      </div>

      <div ref={gridRef} role="grid" aria-labelledby={titleId} onKeyDown={handleGridKeyDown}>
        <div role="row" className="grid grid-cols-7">
          {WEEKDAYS.map((weekday) => (
            <div
              key={weekday}
              role="columnheader"
              className="flex h-8 items-center justify-center text-caption-1 text-text-tertiary"
            >
              {weekday}
            </div>
          ))}
        </div>
        {Array.from({ length: 6 }, (_, week) => (
          <div key={week} role="row" className="grid grid-cols-7">
            {days.slice(week * 7, week * 7 + 7).map((day) => {
              const isSelected = Boolean(selected && isSameDay(selected, day));
              const isToday = isSameDay(day, today);
              const disabled = isDisabled(day);
              const focused = isSameDay(day, focusDate);
              return (
                <div
                  key={day.getTime()}
                  role="gridcell"
                  aria-selected={isSelected}
                  className="flex justify-center"
                >
                  <button
                    type="button"
                    data-date={formatDateValue(day)}
                    tabIndex={focused ? 0 : -1}
                    aria-label={describeDate(day)}
                    aria-current={isToday ? "date" : undefined}
                    aria-disabled={disabled || undefined}
                    onClick={() => {
                      if (!disabled) {
                        select(day);
                      }
                    }}
                    className={cn(
                      "flex size-9 cursor-pointer items-center justify-center rounded-full text-sm text-text-primary hover:bg-bg-blue-tint",
                      "focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-brand-primary",
                      !isSameMonth(day, focusDate) && "text-text-muted",
                      isToday &&
                        "font-semibold text-brand-primary ring-1 ring-brand-primary ring-inset",
                      isSelected &&
                        "bg-brand-primary font-semibold text-text-inverse ring-0 hover:bg-brand-primary",
                      disabled &&
                        "cursor-not-allowed font-normal text-text-disabled ring-0 hover:bg-transparent",
                    )}
                  >
                    {day.getDate()}
                  </button>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

/** 값이 없거나 형식이 잘못된 문자열은 `null`로 본다 (던지지 않는다) */
function parseDate(value: string | null | undefined): Date | null {
  return value ? parseDateValue(value) : null;
}
