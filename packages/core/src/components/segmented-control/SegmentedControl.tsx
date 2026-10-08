import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { cn } from "../../utils/cn";

export interface SegmentedControlItem {
  value: string;
  label: string;
  /** 활성 상태일 때 라벨 아래에 표시할 페이지 점 개수 (공지 여러 개 등) */
  dotsCount?: number;
  /** 점 중 강조할 인덱스 */
  activeDotIndex?: number;
}

export interface SegmentedControlProps extends Omit<
  React.ComponentProps<"div">,
  "onChange" | "onClick" | "children"
> {
  items: SegmentedControlItem[];
  value: string;
  onChange: (value: string) => void;
  /** 이미 활성인 탭을 다시 눌러도 호출된다 (onChange는 값 변경과 무관하게 항상 같이 호출됨) */
  onClick?: (value: string) => void;
}

export function SegmentedControl({
  items,
  value,
  onChange,
  onClick,
  className,
  ref,
  ...props
}: SegmentedControlProps) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [thumbStyle, setThumbStyle] = useState<{ left: number; width: number } | null>(null);

  useLayoutEffect(() => {
    const activeEl = itemRefs.current[value];
    if (activeEl) {
      setThumbStyle({ left: activeEl.offsetLeft, width: activeEl.offsetWidth });
    }
  }, [value, items]);

  // 각 item은 flex-1이라 컨테이너 너비가 바뀌면 같이 늘어나지만 thumb의 left/width는 px 고정이라,
  // 활성 탭이 바뀔 때만 재측정하면 리사이즈 후 어긋난다 — 컨테이너 크기 변화를 감지해 다시 잰다.
  useEffect(() => {
    const trackEl = trackRef.current;
    if (!trackEl) {
      return;
    }

    const updateThumb = () => {
      const activeEl = itemRefs.current[value];
      if (activeEl) {
        setThumbStyle({ left: activeEl.offsetLeft, width: activeEl.offsetWidth });
      }
    };

    const resizeObserver = new ResizeObserver(updateThumb);
    resizeObserver.observe(trackEl);
    return () => resizeObserver.disconnect();
  }, [value]);

  return (
    <div
      {...props}
      ref={(node) => {
        trackRef.current = node;
        if (typeof ref === "function") {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      }}
      className={cn(
        "relative flex w-full items-center justify-center rounded-12 bg-bg-base p-[3px]",
        className,
      )}
    >
      {thumbStyle && (
        // width에는 transition을 걸지 않는다 — 리사이징 중 매 프레임 width가 바뀌면 값이 "쫓아가기만" 해서 드래그를 놓아야 따라잡는다
        <div
          className="absolute top-[3px] bottom-[3px] left-0 rounded-8 bg-segment-active-bg shadow-[0_1px_1px_rgba(0,0,0,0.1)] transition-transform duration-250 ease-[cubic-bezier(0.4,0,0.2,1)]"
          style={{ transform: `translateX(${thumbStyle.left}px)`, width: thumbStyle.width }}
        />
      )}
      {items.map((item) => {
        const isActive = item.value === value;

        return (
          <button
            key={item.value}
            ref={(el) => {
              itemRefs.current[item.value] = el;
            }}
            type="button"
            className={cn(
              "relative z-10 flex min-h-8 min-w-px flex-1 flex-col items-center justify-center gap-0.5 rounded-10 px-2 py-[5px] font-fds text-body-medium-15 transition-colors duration-250 ease-[cubic-bezier(0.4,0,0.2,1)]",
              isActive
                ? "text-text-primary"
                : "text-text-tertiary hover:bg-border-light active:bg-border-light",
            )}
            onClick={() => {
              onClick?.(item.value);
              onChange(item.value);
            }}
          >
            <span>{item.label}</span>
            {isActive && !!item.dotsCount && (
              <span className="flex items-center gap-1">
                {Array.from({ length: item.dotsCount }).map((_, dotIndex) => (
                  <span
                    key={dotIndex}
                    className={cn(
                      "size-1 rounded-full",
                      dotIndex === item.activeDotIndex ? "bg-bg-overlay" : "bg-border-strong",
                    )}
                  />
                ))}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
