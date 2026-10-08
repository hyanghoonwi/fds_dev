import { useEffect, useRef, useState } from "react";
import type { KeyboardEvent, Ref } from "react";
import { cn } from "../../utils/cn";

export interface TimePanelProps {
  /** 선택된 시간 (24시간제 "HH:mm"). 형식이 잘못된 문자열은 선택 안 함으로 본다. */
  value?: string | null;
  /**
   * 시 또는 분을 고를 때마다 바로 "HH:mm"으로 호출된다.
   * 값이 없을 때 시를 고르면 "HH:00", 분을 고르면 "00:mm"이 된다.
   */
  onChange?: (value: string) => void;
  /** 분 목록의 간격. 60의 약수(1, 5, 10, 15, 30)를 권장한다. */
  minuteStep?: number;
  /** 마운트될 때 시 목록의 선택 항목(없으면 00)에 포커스를 준다 */
  autoFocus?: boolean;
  className?: string;
  ref?: Ref<HTMLDivElement>;
}

interface Time {
  hour: number;
  minute: number;
}

const TIME_PATTERN = /^([01]\d|2[0-3]):([0-5]\d)$/;

function parseTime(value: string | null | undefined): Time | null {
  const match = value ? TIME_PATTERN.exec(value) : null;
  return match ? { hour: Number(match[1]), minute: Number(match[2]) } : null;
}

const pad = (n: number) => String(n).padStart(2, "0");

const HOURS = Array.from({ length: 24 }, (_, i) => i);

// 시간을 고르는 "패널"이다. 확인 버튼·팝업·열고 닫는 동작이 없어서 화면에 바로 놓거나,
// TimePicker의 팝업, Popover, Modal 안 등 어디에든 넣을 수 있다. 값은 `value`로만 제어한다.
export function TimePanel({
  value,
  onChange,
  minuteStep = 1,
  autoFocus = false,
  className,
  ref,
}: TimePanelProps) {
  const itemRefs = useRef<[(HTMLButtonElement | null)[], (HTMLButtonElement | null)[]]>([[], []]);
  const current = parseTime(value);

  const step = Math.max(1, Math.floor(minuteStep) || 1);
  const minutes = Array.from({ length: Math.ceil(60 / step) }, (_, i) => i * step);
  const columns = [HOURS, minutes] as const;
  const selected = [current?.hour ?? null, current?.minute ?? null] as const;

  const selectedIndex = (col: 0 | 1) => {
    const index = columns[col].indexOf(selected[col] ?? -1);
    return index >= 0 ? index : 0;
  };

  const [active, setActive] = useState<{ col: 0 | 1; index: number }>({
    col: 0,
    index: selectedIndex(0),
  });

  useEffect(() => {
    // 선택된 시/분이 목록 가운데 근처에 보이도록 스크롤 (목록은 relative라 offsetTop이 목록 기준이다)
    ([0, 1] as const).forEach((col) => {
      const item = itemRefs.current[col][selectedIndex(col)];
      const list = item?.parentElement;
      if (item && list && selected[col] !== null) {
        list.scrollTop = item.offsetTop - list.clientHeight / 2 + item.offsetHeight / 2;
      }
    });
    if (autoFocus) {
      itemRefs.current[0][selectedIndex(0)]?.focus({ preventScroll: true });
    }
  }, []);

  const moveFocus = (col: 0 | 1, index: number) => {
    const next = Math.min(Math.max(index, 0), columns[col].length - 1); // 순환 없이 처음/끝에서 멈춘다
    setActive({ col, index: next });
    itemRefs.current[col][next]?.focus();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>, col: 0 | 1, index: number) => {
    const keys: Record<string, () => void> = {
      ArrowUp: () => moveFocus(col, index - 1),
      ArrowDown: () => moveFocus(col, index + 1),
      Home: () => moveFocus(col, 0),
      End: () => moveFocus(col, columns[col].length - 1),
      ArrowLeft: () => col === 1 && moveFocus(0, selectedIndex(0)),
      ArrowRight: () => col === 0 && moveFocus(1, selectedIndex(1)),
    };
    const handler = keys[event.key];
    if (handler) {
      event.preventDefault(); // 방향키로 페이지가 스크롤되지 않게
      handler();
    }
    // Enter/Space는 버튼 기본 동작(click)으로 항목이 선택된다
  };

  // 시를 고르면 비어 있는 분은 00, 분을 먼저 고르면 비어 있는 시는 00으로 채운다
  const select = (col: 0 | 1, item: number) => {
    const hour = col === 0 ? item : (current?.hour ?? 0);
    const minute = col === 1 ? item : (current?.minute ?? 0);
    onChange?.(`${pad(hour)}:${pad(minute)}`);
  };

  return (
    <div ref={ref} className={cn("flex gap-2 font-fds", className)}>
      {([0, 1] as const).map((col) => (
        <div key={col} className="flex w-16 flex-col gap-1.5">
          <span className="text-center text-caption-1 text-text-caption">
            {col === 0 ? "시" : "분"}
          </span>
          <div
            role="listbox"
            aria-label={col === 0 ? "시" : "분"}
            // 스크롤되는 영역은 브라우저가 Tab 포커스 대상으로 만들 수 있어, 항목의 로빙 포커스만 Tab 순서에 두도록 제외한다
            tabIndex={-1}
            className="relative flex max-h-56 flex-col gap-0.5 overflow-y-auto [scrollbar-width:thin]"
          >
            {columns[col].map((item, index) => {
              const isSelected = selected[col] === item;
              return (
                <button
                  key={item}
                  ref={(el) => {
                    itemRefs.current[col][index] = el;
                  }}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  tabIndex={active.col === col && active.index === index ? 0 : -1}
                  onFocus={() => setActive({ col, index })}
                  onKeyDown={(event) => handleKeyDown(event, col, index)}
                  onClick={() => select(col, item)}
                  className={cn(
                    "h-8 w-full shrink-0 cursor-pointer rounded-8 font-fds text-sm tabular-nums",
                    "focus-visible:-outline-offset-2 focus-visible:outline-2 focus-visible:outline-brand-primary",
                    isSelected
                      ? "bg-bg-blue-tint font-semibold text-brand-primary"
                      : "text-text-primary hover:bg-bg-page",
                  )}
                >
                  {pad(item)}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
