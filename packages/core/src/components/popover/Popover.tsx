import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import type { CSSProperties, KeyboardEvent, ReactNode, RefCallback } from "react";
import { cn } from "../../utils/cn";

export type PopoverPlacement = "bottom-start" | "bottom-end" | "top-start" | "top-end";

/** `trigger`를 함수로 넘기면 받는 값 */
export interface PopoverTriggerState {
  /** 열림 여부 */
  open: boolean;
  /** 열려 있으면 닫고, 닫혀 있으면 연다. */
  toggle: () => void;
  setOpen: (open: boolean) => void;
  /**
   * 팝업을 붙일 기준 요소(anchor)를 등록하는 ref. Input이라면 `fieldRef`에, 버튼이라면 `ref`에 넘긴다.
   * 등록하지 않으면 Popover 컨테이너 전체가 기준이 된다.
   */
  anchorRef: RefCallback<HTMLElement>;
  /** 팝업 요소의 id. 트리거의 `aria-controls`에 쓴다. */
  popupId: string;
}

/** `children`을 함수로 넘기면 받는 값 */
export interface PopoverApi {
  close: () => void;
}

export interface PopoverProps {
  /** 팝업을 여는 트리거. 열림 상태가 필요하면 함수로 넘긴다. */
  trigger: ReactNode | ((state: PopoverTriggerState) => ReactNode);
  /** 팝업 안에 보여줄 내용. 닫기 함수가 필요하면 함수로 넘긴다. */
  children: ReactNode | ((api: PopoverApi) => ReactNode);
  /** 열림 여부 (제어 모드) */
  open?: boolean;
  /** 처음 열려 있을지 (비제어 모드) */
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** 팝업의 접근성 이름 */
  label: string;
  /**
   * 팝업의 ARIA 역할. 기본은 `dialog`이고, 선택 목록(Select)은 `listbox`, 메뉴는 `menu`로 지정한다.
   * 포커스를 팝업 안으로 옮기지 않는 combobox 패턴에서는 `listbox`를 쓴다.
   */
  role?: "dialog" | "listbox" | "menu";
  /** 팝업 내용을 불러오는 중인지. 켜면 팝업에 `aria-busy`가 붙는다. */
  busy?: boolean;
  /** 기준 요소에 대한 팝업 위치. 기본은 아래쪽 왼쪽 정렬 */
  placement?: PopoverPlacement;
  /** 기준 요소와 팝업 사이 간격(px). 기본 6 */
  offset?: number;
  /** 팝업 패널의 클래스 */
  className?: string;
  /** 트리거를 감싸는 컨테이너의 클래스. 기본은 `relative w-full` */
  containerClassName?: string;
}

const FOCUSABLE = "input, button, select, textarea, a[href], [tabindex]:not([tabindex='-1'])";

/**
 * 기준 요소(anchor) 가까이에 뜨는 범용 오버레이. 날짜·시간 같은 도메인은 모른다.
 * `document.body` 포털을 쓰지 않고 컨테이너 안(DOM)에 그린다 — Modal과 같은 이유로, 다크 모드
 * `data-theme` 스코프가 DOM 위치에 걸려 있어도 토큰이 그대로 내려오게 하려는 것이다.
 */
export function Popover({
  trigger,
  children,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  label,
  role = "dialog",
  busy,
  placement = "bottom-start",
  offset = 6,
  className,
  containerClassName,
}: PopoverProps) {
  const [innerOpen, setInnerOpen] = useState(defaultOpen);
  const controlled = openProp !== undefined;
  const open = controlled ? openProp : innerOpen;

  const rootRef = useRef<HTMLDivElement>(null);
  const anchorElement = useRef<HTMLElement | null>(null);
  const popupId = useId();
  const [position, setPosition] = useState<CSSProperties | null>(null);

  const setOpen = useCallback(
    (next: boolean) => {
      if (!controlled) {
        setInnerOpen(next);
      }
      onOpenChange?.(next);
    },
    [controlled, onOpenChange],
  );
  const toggle = () => setOpen(!open);
  const close = () => setOpen(false);

  const anchorRef = useCallback<RefCallback<HTMLElement>>((node) => {
    anchorElement.current = node;
  }, []);

  // 컨테이너(relative) 기준으로 팝업 좌표를 계산한다.
  // 라벨·에러 메시지 높이, 가로 배치 라벨 너비가 달라져도 기준 요소의 실제 위치를 따라간다.
  const measure = useCallback(() => {
    const root = rootRef.current;
    if (!root) {
      return;
    }
    const anchor = anchorElement.current ?? root;
    let top = 0;
    let left = 0;
    if (anchor === root) {
      // 컨테이너 자신이 기준이면 좌상단이 원점이다
    } else if (anchor.offsetParent === root) {
      top = anchor.offsetTop;
      left = anchor.offsetLeft;
    } else {
      // offsetParent가 컨테이너가 아니면(중간에 position 요소가 끼어 있는 경우) 화면 좌표 차이로 계산한다
      const rootRect = root.getBoundingClientRect();
      const anchorRect = anchor.getBoundingClientRect();
      top = anchorRect.top - rootRect.top;
      left = anchorRect.left - rootRect.left;
    }
    const height = anchor.offsetHeight;
    const width = anchor.offsetWidth;

    const next: CSSProperties = {};
    if (placement.startsWith("bottom")) {
      next.top = top + height + offset;
    } else {
      next.bottom = root.offsetHeight - top + offset;
    }
    if (placement.endsWith("start")) {
      next.left = left;
    } else {
      next.right = root.offsetWidth - (left + width);
    }
    setPosition((prev) =>
      prev &&
      prev.top === next.top &&
      prev.bottom === next.bottom &&
      prev.left === next.left &&
      prev.right === next.right
        ? prev
        : next,
    );
  }, [placement, offset]);

  useLayoutEffect(() => {
    if (!open) {
      setPosition(null);
      return;
    }
    measure();
    window.addEventListener("resize", measure);
    // 에러 메시지가 생기는 등 크기가 바뀌면 다시 계산한다
    let observer: ResizeObserver | undefined;
    if (typeof ResizeObserver !== "undefined") {
      observer = new ResizeObserver(measure);
      if (rootRef.current) {
        observer.observe(rootRef.current);
      }
      if (anchorElement.current) {
        observer.observe(anchorElement.current);
      }
    }
    return () => {
      window.removeEventListener("resize", measure);
      observer?.disconnect();
    };
  }, [open, measure]);

  // 바깥을 누르면 닫는다
  useEffect(() => {
    if (!open) {
      return;
    }
    const handleMouseDown = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleMouseDown);
    return () => document.removeEventListener("mousedown", handleMouseDown);
  }, [open, setOpen]);

  // Esc: 팝업을 닫고 기준 요소로 포커스를 돌려준다. 바깥 Modal이 같이 닫히지 않게 전파를 막는다.
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "Escape" || !open) {
      return;
    }
    event.stopPropagation();
    setOpen(false);
    const anchor = anchorElement.current ?? rootRef.current;
    const target = anchor?.matches(FOCUSABLE)
      ? anchor
      : anchor?.querySelector<HTMLElement>(FOCUSABLE);
    (target ?? anchor)?.focus();
  };

  const state: PopoverTriggerState = { open, toggle, setOpen, anchorRef, popupId };

  return (
    <div
      ref={rootRef}
      className={cn("relative w-full", containerClassName)}
      onKeyDown={handleKeyDown}
    >
      {typeof trigger === "function" ? trigger(state) : trigger}
      {open && position && (
        <div
          id={popupId}
          role={role}
          aria-label={label}
          aria-busy={busy || undefined}
          style={position}
          className={cn(
            "absolute z-50 rounded-12 border border-border-line bg-bg-surface p-3 font-fds shadow-[0_4px_12px_rgba(0,0,0,0.08)]",
            className,
          )}
        >
          {typeof children === "function" ? children({ close }) : children}
        </div>
      )}
    </div>
  );
}
