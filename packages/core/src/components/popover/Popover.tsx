import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import type { CSSProperties, KeyboardEvent, ReactNode, RefCallback } from "react";
import { createPortal } from "react-dom";
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
  /** `role="listbox"`에서 여러 개를 고를 수 있는지(`aria-multiselectable`). */
  multiselectable?: boolean;
  /** 팝업 내용을 불러오는 중인지. 켜면 팝업에 `aria-busy`가 붙는다. */
  busy?: boolean;
  /** 기준 요소에 대한 팝업 위치. 기본은 아래쪽 왼쪽 정렬 */
  placement?: PopoverPlacement;
  /** 기준 요소와 팝업 사이 간격(px). 기본 6 */
  offset?: number;
  /** 팝업의 최소 너비를 기준 요소의 너비에 맞출지(선택 목록처럼 트리거와 폭을 맞출 때). 기본 `false` */
  matchAnchorWidth?: boolean;
  /** 팝업 패널의 클래스 */
  className?: string;
  /** 트리거를 감싸는 컨테이너의 클래스. 기본은 `w-full` */
  containerClassName?: string;
}

const FOCUSABLE = "input, button, select, textarea, a[href], [tabindex]:not([tabindex='-1'])";

// 화면 가장자리와 팝업 사이에 남겨 두는 여백(px)
const VIEWPORT_MARGIN = 8;

/**
 * 팝업을 그릴 곳. 기준 요소에서 가장 가까운 `[data-theme]` 조상이다 — 다크 모드는 `[data-theme="dark"]` 안에서만
 * 토큰 값이 바뀌므로, 팝업을 그 안에 넣어야 테마가 그대로 내려온다. 없거나 `<html>`이면 `document.body`다.
 */
function resolvePortalTarget(from: HTMLElement | null): HTMLElement {
  const themed = from?.closest<HTMLElement>("[data-theme]");
  return themed && themed !== document.documentElement ? themed : document.body;
}

/**
 * 기준 요소(anchor) 가까이에 뜨는 범용 오버레이. 날짜·시간 같은 도메인은 모른다.
 *
 * 팝업은 `position: fixed`로 **포털**에 그린다(`resolvePortalTarget`). 그래서 `overflow: hidden`인 조상(모달, 스크롤 표)에
 * 잘리지 않고, 화면 가장자리에서는 위/아래로 뒤집히거나 좌우로 밀려 화면 안에 머문다. 기준 요소가 움직이면
 * (스크롤, 리사이즈, 크기 변화) 따라간다. 이벤트는 React 트리를 따라 전파되므로 팝업 안의 키 입력은 그대로 이 컴포넌트가 받는다.
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
  multiselectable,
  placement = "bottom-start",
  offset = 6,
  matchAnchorWidth = false,
  className,
  containerClassName,
}: PopoverProps) {
  const [innerOpen, setInnerOpen] = useState(defaultOpen);
  const controlled = openProp !== undefined;
  const open = controlled ? openProp : innerOpen;

  const rootRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const anchorElement = useRef<HTMLElement | null>(null);
  const popupId = useId();
  const [container, setContainer] = useState<HTMLElement | null>(null);
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

  // 열릴 때 팝업을 그릴 곳을 정한다(레이아웃 effect라 첫 페인트 전에 끝난다)
  useLayoutEffect(() => {
    setContainer(open ? resolvePortalTarget(rootRef.current) : null);
  }, [open]);

  // 기준 요소의 화면 좌표로 팝업 위치를 계산한다. 아래(또는 위)가 모자라고 반대쪽이 더 넓으면 뒤집고,
  // 좌우는 화면 안으로 민다. 팝업 크기는 실제로 그려진 값을 쓴다.
  const measure = useCallback(() => {
    const popup = popupRef.current;
    const anchor = anchorElement.current ?? rootRef.current;
    if (!popup || !anchor) {
      return;
    }
    const rect = anchor.getBoundingClientRect();
    const viewportWidth = document.documentElement.clientWidth;
    const viewportHeight = document.documentElement.clientHeight;
    const width = Math.max(popup.offsetWidth, matchAnchorWidth ? rect.width : 0);
    const height = popup.offsetHeight;

    const spaceBelow = viewportHeight - rect.bottom - offset - VIEWPORT_MARGIN;
    const spaceAbove = rect.top - offset - VIEWPORT_MARGIN;
    const preferBottom = placement.startsWith("bottom");
    const placeBelow = preferBottom
      ? height <= spaceBelow || spaceBelow >= spaceAbove
      : height > spaceAbove && spaceBelow > spaceAbove;
    const top = placeBelow ? rect.bottom + offset : rect.top - offset - height;

    const alignedLeft = placement.endsWith("start") ? rect.left : rect.right - width;
    const left = Math.max(
      VIEWPORT_MARGIN,
      Math.min(alignedLeft, viewportWidth - width - VIEWPORT_MARGIN),
    );

    const next: CSSProperties = {
      top,
      left,
      minWidth: matchAnchorWidth ? rect.width : undefined,
    };
    setPosition((prev) =>
      prev && prev.top === next.top && prev.left === next.left && prev.minWidth === next.minWidth
        ? prev
        : next,
    );
  }, [placement, offset, matchAnchorWidth]);

  useLayoutEffect(() => {
    if (!open || !container) {
      setPosition(null);
      return;
    }
    measure();
    window.addEventListener("resize", measure);
    // 스크롤 컨테이너 어디서 스크롤해도 따라가도록 캡처 단계에서 듣는다
    window.addEventListener("scroll", measure, true);
    // 팝업 내용이나 기준 요소의 크기가 바뀌면(에러 문구가 생김, 목록이 걸러짐) 다시 계산한다
    let observer: ResizeObserver | undefined;
    if (typeof ResizeObserver !== "undefined") {
      observer = new ResizeObserver(measure);
      if (popupRef.current) {
        observer.observe(popupRef.current);
      }
      const anchor = anchorElement.current ?? rootRef.current;
      if (anchor) {
        observer.observe(anchor);
      }
    }
    return () => {
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", measure, true);
      observer?.disconnect();
    };
  }, [open, container, measure]);

  // 바깥을 누르면 닫는다. 팝업은 포털에 있어 DOM상으로는 컨테이너 밖이므로 둘 다 안쪽으로 본다.
  useEffect(() => {
    if (!open) {
      return;
    }
    const handleMouseDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (!rootRef.current?.contains(target) && !popupRef.current?.contains(target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleMouseDown);
    return () => document.removeEventListener("mousedown", handleMouseDown);
  }, [open, setOpen]);

  const focusAnchor = () => {
    const anchor = anchorElement.current ?? rootRef.current;
    const target = anchor?.matches(FOCUSABLE)
      ? anchor
      : anchor?.querySelector<HTMLElement>(FOCUSABLE);
    (target ?? anchor)?.focus();
  };

  // Esc: 팝업을 닫고 기준 요소로 포커스를 돌려준다. 바깥 Modal이 같이 닫히지 않게 전파를 막는다.
  // 팝업은 React 트리상 이 컴포넌트의 자식이므로 포털에 있어도 이 핸들러가 받는다.
  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (!open) {
      return;
    }
    if (event.key === "Escape") {
      event.stopPropagation();
      setOpen(false);
      focusAnchor();
      return;
    }
    // 팝업은 DOM 끝(포털)에 있어 Tab으로 이어지지 않는다. 팝업 안에서 Tab을 누르면 닫고 기준 요소로 돌아간다.
    // preventDefault를 하지 않으므로 브라우저는 옮겨진 포커스를 기준으로 다음 칸으로 이동한다.
    if (event.key === "Tab" && popupRef.current?.contains(event.target as Node)) {
      setOpen(false);
      focusAnchor();
    }
  };

  const state: PopoverTriggerState = { open, toggle, setOpen, anchorRef, popupId };

  return (
    <div ref={rootRef} className={cn("w-full", containerClassName)} onKeyDown={handleKeyDown}>
      {typeof trigger === "function" ? trigger(state) : trigger}
      {open &&
        container &&
        createPortal(
          <div
            ref={popupRef}
            id={popupId}
            role={role}
            aria-label={label}
            aria-busy={busy || undefined}
            aria-multiselectable={multiselectable || undefined}
            // 위치를 계산하기 전에는 투명하게 둔다. `visibility: hidden`은 쓰지 않는다 — 안의 Calendar 등이
            // 마운트될 때 `autoFocus`로 포커스를 받아야 하는데, 숨겨진 요소는 포커스할 수 없다.
            style={{ top: 0, left: 0, ...position, opacity: position ? undefined : 0 }}
            // Modal(z-1000) 위에 떠야 한다
            className={cn(
              "fixed z-[1100] rounded-12 border border-border-line bg-bg-surface p-3 font-fds shadow-[0_4px_12px_rgba(0,0,0,0.08)]",
              className,
            )}
          >
            {typeof children === "function" ? children({ close }) : children}
          </div>,
          container,
        )}
    </div>
  );
}
